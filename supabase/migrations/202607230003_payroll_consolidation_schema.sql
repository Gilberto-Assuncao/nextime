-- Issue #3 / STRATON reports architecture, Etapa 2 (continued): payroll /
-- accounting consolidation module. Kept entirely separate from operational
-- reports on purpose — this table set is a structural scaffold only.
--
-- Explicitly NOT included, per the adopted spec's restrictions:
-- * no legal percentages, overtime/night/weekend multipliers, or any other
--   Belgian labor-law constant;
-- * no computed gross/net pay, no social-contribution math;
-- * no automatic classification of hours (e.g. "over 38h/week = overtime").
-- Everything sensitive here is a human-entered or human-reviewed field.
-- time_classifications is configurable per company specifically so no
-- classification names/rules are hardcoded into the schema.

create type public.payroll_period_status as enum (
  'open', 'in_review', 'issues_found', 'approved', 'closed', 'exported', 'reopened'
);

-- Company-defined catalog of time/event types (e.g. "Normal hour", "Night",
-- "Saturday", "Sunday", "Public holiday", "Vacation", "Sick leave"...).
-- Deliberately has no percentage/multiplier column.
create table public.time_classifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  active boolean not null default true,
  requires_approval boolean not null default false,
  appears_in_payroll_report boolean not null default true,
  allows_note boolean not null default true,
  display_order integer not null default 0,
  unique (company_id, code)
);

-- A payroll period a company is consolidating (e.g. a calendar month).
create table public.payroll_periods (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  status public.payroll_period_status not null default 'open',
  closed_by uuid references public.users(id) on delete set null,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (company_id, period_start, period_end),
  check (period_end >= period_start)
);

-- One row per worker per period. Hour totals are plain integers the company
-- fills in from approved timesheets/operational reports — no formula derives
-- them automatically. Fields like mileage/expenses/benefits/manual
-- adjustment are free-entry, reviewed by a human before export.
create table public.payroll_consolidations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  payroll_period_id uuid not null references public.payroll_periods(id) on delete cascade,
  worker_id uuid not null references public.users(id) on delete restrict,
  expected_minutes integer,
  registered_minutes integer,
  approved_minutes integer,
  mileage_km numeric,
  reimbursable_expenses numeric,
  benefits_amount numeric,
  manual_adjustment numeric,
  accounting_notes text,
  unique (payroll_period_id, worker_id)
);

-- Manual breakdown of a worker's period into the company's own
-- time_classifications catalog (e.g. 140 normal + 6 night + 4 sick), each
-- row entered/reviewed by a human, not computed.
create table public.payroll_consolidation_classifications (
  id uuid primary key default gen_random_uuid(),
  consolidation_id uuid not null references public.payroll_consolidations(id) on delete cascade,
  classification_id uuid not null references public.time_classifications(id) on delete restrict,
  company_id uuid not null references public.companies(id) on delete cascade,
  minutes integer not null,
  note text,
  unique (consolidation_id, classification_id),
  check (minutes >= 0)
);

-- Closing/reopening audit trail. A closed period must never change silently;
-- any reopening records who, when, why, and what the status transition was.
create table public.payroll_period_history (
  id uuid primary key default gen_random_uuid(),
  payroll_period_id uuid not null references public.payroll_periods(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  action text not null,
  previous_status public.payroll_period_status,
  new_status public.payroll_period_status,
  reason text,
  occurred_at timestamptz not null default now()
);

create index on public.time_classifications(company_id);
create index on public.payroll_periods(company_id, period_start);
create index on public.payroll_consolidations(payroll_period_id);
create index on public.payroll_consolidations(worker_id);
create index on public.payroll_consolidation_classifications(consolidation_id);
create index on public.payroll_period_history(payroll_period_id);

alter table public.time_classifications enable row level security;
alter table public.payroll_periods enable row level security;
alter table public.payroll_consolidations enable row level security;
alter table public.payroll_consolidation_classifications enable row level security;
alter table public.payroll_period_history enable row level security;

-- Read access: any active company member (accountant read-only access is a
-- documented future phase, once the company opts a real accountant user in).
do $$ declare table_name text; begin
  foreach table_name in array array[
    'time_classifications', 'payroll_periods', 'payroll_consolidations',
    'payroll_consolidation_classifications', 'payroll_period_history'
  ] loop
    execute format('create policy %I on public.%I for select to authenticated using ((select private.is_company_member(company_id)))', table_name || '_tenant_read', table_name);
  end loop;
end $$;

-- Write access: this is the sensitive accounting area, so — unlike the
-- generic tenant_insert/update policies used elsewhere — writes require an
-- administrative role, mirroring the roster migration's scoping pattern.
do $$ declare table_name text; begin
  foreach table_name in array array[
    'time_classifications', 'payroll_periods', 'payroll_consolidations',
    'payroll_consolidation_classifications'
  ] loop
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((select private.has_company_role(company_id, array[''owner'',''admin'',''administrator'',''hr'',''finance''])))',
      table_name || '_admin_insert', table_name
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using ((select private.has_company_role(company_id, array[''owner'',''admin'',''administrator'',''hr'',''finance'']))) with check ((select private.has_company_role(company_id, array[''owner'',''admin'',''administrator'',''hr'',''finance''])))',
      table_name || '_admin_update', table_name
    );
  end loop;
end $$;

-- payroll_period_history is append-only from the app's perspective: rows are
-- written by the server action that performs the close/reopen, never edited.
create policy payroll_period_history_admin_insert on public.payroll_period_history
  for insert to authenticated
  with check ((select private.has_company_role(company_id, array['owner','admin','administrator','hr','finance'])));

grant select, insert, update on table
  public.time_classifications, public.payroll_periods, public.payroll_consolidations,
  public.payroll_consolidation_classifications
  to authenticated;
grant select, insert on table public.payroll_period_history to authenticated;
