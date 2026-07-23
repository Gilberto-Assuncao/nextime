-- Issue #3 (Phase 1): let a company designate who holds the manager,
-- accountant, HR, and finance functions. 'manager' and 'accountant' already
-- exist in the role catalog; 'hr' and 'finance' are added here to complete
-- the quartet the issue asks for.
insert into public.roles(key, name, system) values
  ('hr', 'HR', true),
  ('finance', 'Finance', true)
on conflict(key) do nothing;

-- membership_roles previously had a read policy only (see
-- 202607190004_auth_multi_tenant_foundation.sql) — nothing could write to it
-- outside the SECURITY DEFINER create_company() function that seeds the
-- owner role. RLS policies alone aren't enough for PostgREST to reach the
-- table at all; it also needs the table-level grant (same pattern as
-- 202607200001_session_read_grants.sql's read grant on this table).
grant insert, delete on table public.membership_roles to authenticated;

-- Scope write access narrowly to just the four roster roles, so this doesn't
-- become a general "grant any role including owner" backdoor.
drop policy if exists membership_roles_roster_insert on public.membership_roles;
create policy membership_roles_roster_insert on public.membership_roles
for insert to authenticated
with check (
  (select private.has_company_role(
    (select company_id from public.company_memberships where id = membership_id),
    array['owner','admin','administrator']
  ))
  and role_id in (select id from public.roles where key in ('manager','accountant','hr','finance'))
);

drop policy if exists membership_roles_roster_delete on public.membership_roles;
create policy membership_roles_roster_delete on public.membership_roles
for delete to authenticated
using (
  (select private.has_company_role(
    (select company_id from public.company_memberships where id = membership_id),
    array['owner','admin','administrator']
  ))
  and role_id in (select id from public.roles where key in ('manager','accountant','hr','finance'))
);
