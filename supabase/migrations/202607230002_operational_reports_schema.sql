-- Issue #3 / STRATON reports architecture, Etapa 2: base data model for
-- operational reports (worker -> supervisor -> company). This is deliberately
-- separate from payroll/accounting consolidation (see the next migration) —
-- the two flows must never share tables, per the adopted spec.
--
-- Design notes:
-- * report_templates/report_template_fields let a company configure segment-
--   specific fields (construction, cleaning, maintenance, ...) without schema
--   changes per segment — values are stored typed (text/number/boolean/json)
--   rather than one untyped JSON blob, so we keep some validation.
-- * operational_reports intentionally does NOT replace timesheets/timesheet_
--   entries. Timesheets are the payroll-relevant hours record; an operational
--   report carries field-activity context (what was done, where, for whom)
--   and may reference a site/project, but is its own object with its own
--   approval lifecycle.
-- * No legal/payroll calculations here — this migration only adds structure.

create type public.report_segment as enum (
  'construction', 'cleaning', 'maintenance', 'security', 'landscaping',
  'technical_assistance', 'facilities', 'general_services', 'custom'
);

create type public.report_field_type as enum (
  'text', 'number', 'date', 'select', 'multiselect', 'checklist', 'photo', 'signature', 'boolean'
);

create type public.operational_report_status as enum (
  'draft', 'submitted', 'under_review', 'approved', 'rejected', 'changes_requested'
);

-- One template per segment (or a custom one) a company can enable.
create table public.report_templates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  segment public.report_segment not null default 'general_services',
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Configurable fields belonging to a template. `options` holds choice lists
-- for select/multiselect/checklist as a JSON array of {value,label}.
create table public.report_template_fields (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.report_templates(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  key text not null,
  label text not null,
  field_type public.report_field_type not null,
  required boolean not null default false,
  options jsonb not null default '[]',
  display_order integer not null default 0,
  active boolean not null default true,
  unique (template_id, key)
);

-- The operational report itself: header fields common to every segment.
create table public.operational_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  template_id uuid references public.report_templates(id) on delete set null,
  worker_id uuid not null references public.users(id) on delete restrict,
  team_id uuid references public.teams(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  site_id uuid references public.sites(id) on delete set null,
  client_company_id uuid references public.companies(id) on delete set null,
  report_date date not null,
  starts_at timestamptz,
  ends_at timestamptz,
  break_minutes integer not null default 0,
  activity text,
  notes text,
  status public.operational_report_status not null default 'draft',
  created_by uuid not null references public.users(id) on delete restrict,
  submitted_at timestamptz,
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at),
  check (break_minutes >= 0)
);

-- Answers to a template's configurable fields. Typed columns (rather than a
-- single JSON blob) so numeric/boolean values stay queryable and validated;
-- value_json covers multiselect/checklist answers. photo/signature fields
-- store a Supabase Storage path (site-photos bucket) in value_text.
create table public.operational_report_values (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.operational_reports(id) on delete cascade,
  field_id uuid not null references public.report_template_fields(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  value_text text,
  value_number numeric,
  value_boolean boolean,
  value_json jsonb,
  unique (report_id, field_id)
);

-- Approval/edit trail, independent of audit_logs (which is generic and
-- cross-entity) so the report's own history can be queried and rendered
-- cheaply without filtering a shared table.
create table public.operational_report_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.operational_reports(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  action text not null,
  note text,
  occurred_at timestamptz not null default now()
);

create index on public.report_templates(company_id);
create index on public.report_template_fields(template_id);
create index on public.operational_reports(company_id, worker_id);
create index on public.operational_reports(company_id, status);
create index on public.operational_reports(site_id);
create index on public.operational_report_values(report_id);
create index on public.operational_report_history(report_id);

-- RLS: same tenant-membership baseline as the rest of the schema. Finer
-- rules (worker can only touch their own draft, only a supervisor/admin can
-- approve) belong in Etapa 3's application code + dedicated policies, same
-- division of labor already used for timesheets and roster.
alter table public.report_templates enable row level security;
alter table public.report_template_fields enable row level security;
alter table public.operational_reports enable row level security;
alter table public.operational_report_values enable row level security;
alter table public.operational_report_history enable row level security;

do $$ declare table_name text; begin
  foreach table_name in array array[
    'report_templates', 'report_template_fields', 'operational_reports',
    'operational_report_values', 'operational_report_history'
  ] loop
    execute format('create policy %I on public.%I for select to authenticated using ((select private.is_company_member(company_id)))', table_name || '_tenant_read', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select private.is_company_member(company_id)))', table_name || '_tenant_insert', table_name);
    execute format('create policy %I on public.%I for update to authenticated using ((select private.is_company_member(company_id))) with check ((select private.is_company_member(company_id)))', table_name || '_tenant_update', table_name);
  end loop;
end $$;

-- RLS alone doesn't grant PostgREST access to these tables — see
-- 202607200001_session_read_grants.sql for why the table-level GRANT below
-- is required in addition to the policies above.
grant select, insert, update on table
  public.report_templates, public.report_template_fields, public.operational_reports,
  public.operational_report_values, public.operational_report_history
  to authenticated;
