-- Sprint 5.7 — schema foundation for Projects/Clients.
-- Adds the gaps identified in the Sprint 5 mock-data audit (lib/types/project.ts
-- models budget, priority, client contact, and per-project members; the schema
-- had none of them). No application code changes here by design — schema
-- first, wiring (5.8) in a separate step.

create type public.project_priority as enum ('low', 'medium', 'high', 'critical');

alter table public.projects add column if not exists priority public.project_priority not null default 'medium';
alter table public.projects add column if not exists budget_amount numeric(12,2);
alter table public.projects add column if not exists budget_spent numeric(12,2) not null default 0;
alter table public.projects add column if not exists budget_currency text not null default 'EUR' check (budget_currency ~ '^[A-Z]{3}$');
alter table public.projects add constraint projects_budget_spent_check check (budget_spent >= 0);

-- A "client" is just another public.companies row referenced by
-- projects.client_company_id (companies already has email/phone/address/
-- vat_number). The one missing piece is a named contact person at that
-- company — added here, generic to any company, not project-specific.
alter table public.companies add column if not exists contact_name text;

-- Per-project member assignment, mirroring the existing team_memberships
-- shape (company_membership_id + role + joined_at/left_at for history).
create table public.project_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  company_membership_id uuid not null references public.company_memberships(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (left_at is null or left_at >= joined_at)
);
create unique index project_memberships_one_active on public.project_memberships(project_id, company_membership_id) where left_at is null;
create index project_memberships_company_id_idx on public.project_memberships(company_id);

alter table public.project_memberships enable row level security;
create policy "project_memberships_tenant_read" on public.project_memberships for select to authenticated using ((select private.is_company_member(company_id)));
create policy "project_memberships_tenant_insert" on public.project_memberships for insert to authenticated with check ((select private.is_company_member(company_id)));
create policy "project_memberships_tenant_update" on public.project_memberships for update to authenticated using ((select private.is_company_member(company_id))) with check ((select private.is_company_member(company_id)));

grant select, insert, update on table public.project_memberships to authenticated;
