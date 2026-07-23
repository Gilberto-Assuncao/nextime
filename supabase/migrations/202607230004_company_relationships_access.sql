-- company_relationships has existed since the original schema
-- (202607190001_saas_foundation.sql) but was never given RLS policies or a
-- table-level GRANT — it only picked up `enable row level security`, which
-- with zero policies means default-deny. No app code could reach it. This
-- migration makes it usable for the new Companies & Partners feature:
-- linking two tenant companies (client/contractor/subcontractor/partner) so
-- one can log hours for the other.
--
-- Partnership request flow: the source company creates a row with
-- status='pending'; only the target company's admins can move it to
-- 'active' or 'rejected'. Neither side can silently self-approve.

alter table public.company_relationships alter column status set default 'pending';

create policy company_relationships_read on public.company_relationships
  for select to authenticated
  using ((select private.is_company_member(source_company_id)) or (select private.is_company_member(target_company_id)));

create policy company_relationships_request on public.company_relationships
  for insert to authenticated
  with check (
    (select private.has_company_role(source_company_id, array['owner','admin','administrator']))
    and status = 'pending'
  );

create policy company_relationships_respond on public.company_relationships
  for update to authenticated
  using ((select private.has_company_role(target_company_id, array['owner','admin','administrator'])))
  with check ((select private.has_company_role(target_company_id, array['owner','admin','administrator'])));

grant select, insert, update on table public.company_relationships to authenticated;

-- Partnership requests need to search and display OTHER companies by name
-- first, before any membership relationship exists between them — but
-- `companies` itself is RLS-locked to members only. This view deliberately
-- runs as its owner rather than the caller (security_invoker = false, the
-- default) so it bypasses that RLS and exposes just id/name/vat — never the
-- full company row — to any authenticated user.
create view public.company_directory
  with (security_invoker = false) as
  select id, name, vat_number from public.companies where status <> 'archived';

grant select on table public.company_directory to authenticated;
