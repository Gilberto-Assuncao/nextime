-- Sprint 5.3 — schema foundation for Time Tracking.
-- Adds the missing task dimension and per-entry approval status identified in
-- the Sprint 5 mock-data audit (lib/mock/time.ts models both, the schema had
-- neither). No application code changes in this migration by design — schema
-- first, wiring (5.4) in a separate step.

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_company_id_idx on public.tasks(company_id);

-- Per-entry approval status, reusing the existing timesheet_status enum
-- (draft/submitted/approved/rejected) rather than inventing a parallel type.
-- The timesheet-level status (public.timesheets.status) still represents the
-- overall period submission; entry-level status allows a manager to approve
-- or reject individual entries within a submitted timesheet.
alter table public.timesheet_entries add column if not exists task_id uuid references public.tasks(id) on delete set null;
alter table public.timesheet_entries add column if not exists status public.timesheet_status not null default 'draft';

alter table public.tasks enable row level security;
create policy "tasks_tenant_read" on public.tasks for select to authenticated using ((select private.is_company_member(company_id)));
create policy "tasks_tenant_insert" on public.tasks for insert to authenticated with check ((select private.is_company_member(company_id)));
create policy "tasks_tenant_update" on public.tasks for update to authenticated using ((select private.is_company_member(company_id))) with check ((select private.is_company_member(company_id)));

-- Grant issued in the same migration as the policies this time (see the
-- 202607210002/202607210003 postmortem: a policy without a grant is just as
-- broken as a grant without a policy).
grant select, insert, update on table public.tasks to authenticated;
