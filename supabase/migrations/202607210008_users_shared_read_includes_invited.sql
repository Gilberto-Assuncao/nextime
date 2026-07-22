-- Sprint 6.3 — inviting an employee creates their company_memberships row
-- with status 'invited', but users_shared_company_read (202607190003) only
-- let active colleagues see each other, not pending invites. That silently
-- dropped invited employees from the Employees list: the query embeds
-- public.users for each employee_records row, RLS returned no user row for
-- anyone still 'invited', and src/features/employees/data.ts treats a missing
-- user as "skip this record". Widening the target side to active OR invited
-- fixes this; the viewer side still must be an active member.

drop policy if exists users_shared_company_read on public.users;
create policy users_shared_company_read on public.users for select to authenticated using (
  exists(
    select 1 from public.company_memberships mine
    join public.company_memberships theirs on theirs.company_id = mine.company_id
    where mine.user_id = (select auth.uid()) and mine.status = 'active'
      and theirs.user_id = users.id and theirs.status in ('active', 'invited')
  )
);
