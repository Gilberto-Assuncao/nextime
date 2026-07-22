-- Adds real RLS policies to the 4 tables that have had RLS enabled but ZERO
-- policies since the grants cleanup in 202607210003_remaining_table_grants.sql
-- (flagged there as "known gap, grant only ... a business/security decision,
-- not something to invent inside a grants-cleanup migration"). That migration
-- only ever granted SELECT to these four tables (verified against the
-- running database, not assumed) — the INSERT/UPDATE/DELETE grants each
-- policy below needs are added alongside it, same lesson as every other
-- grants-vs-RLS gap fixed this session.

grant insert, update, delete on table public.certificates to authenticated;
grant insert, update on table public.company_relationships to authenticated;
grant insert, update on table public.localization_settings to authenticated;
grant insert, update on table public.professional_profiles to authenticated;

-- certificates: personal to the user who earned them. No company scoping —
-- a certificate belongs to a person, not a tenant. Colleague/manager
-- visibility is a separate decision, deferred until a real use case needs it.
create policy "certificates_own_read" on public.certificates for select to authenticated using (user_id = (select auth.uid()));
create policy "certificates_own_insert" on public.certificates for insert to authenticated with check (user_id = (select auth.uid()));
create policy "certificates_own_update" on public.certificates for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "certificates_own_delete" on public.certificates for delete to authenticated using (user_id = (select auth.uid()));

-- company_relationships: readable by either side of the relationship (the
-- source company managing it, or the target/client company being referenced).
-- Writable only by managers of the source company — a client shouldn't be
-- able to declare itself someone's contractor.
create policy "company_relationships_member_read" on public.company_relationships for select to authenticated using (
  (select private.is_company_member(source_company_id)) or (select private.is_company_member(target_company_id))
);
create policy "company_relationships_source_manage" on public.company_relationships for insert to authenticated with check (
  (select private.has_company_role(source_company_id, array['owner','admin','administrator','manager']))
);
create policy "company_relationships_source_update" on public.company_relationships for update to authenticated using (
  (select private.has_company_role(source_company_id, array['owner','admin','administrator','manager']))
) with check (
  (select private.has_company_role(source_company_id, array['owner','admin','administrator','manager']))
);

-- localization_settings: the existing check(company_id is not null or
-- user_id is not null) already models "one row is either a personal
-- override or a company default" — policies mirror that split.
create policy "localization_settings_read" on public.localization_settings for select to authenticated using (
  (user_id = (select auth.uid())) or (company_id is not null and (select private.is_company_member(company_id)))
);
create policy "localization_settings_user_manage" on public.localization_settings for insert to authenticated with check (
  user_id = (select auth.uid()) and company_id is null
);
create policy "localization_settings_user_update" on public.localization_settings for update to authenticated using (
  user_id = (select auth.uid()) and company_id is null
) with check (
  user_id = (select auth.uid()) and company_id is null
);
create policy "localization_settings_company_manage" on public.localization_settings for insert to authenticated with check (
  company_id is not null and (select private.has_company_role(company_id, array['owner','admin','administrator']))
);
create policy "localization_settings_company_update" on public.localization_settings for update to authenticated using (
  company_id is not null and (select private.has_company_role(company_id, array['owner','admin','administrator']))
) with check (
  company_id is not null and (select private.has_company_role(company_id, array['owner','admin','administrator']))
);

-- professional_profiles: personal, like certificates — the user's own CV/bio.
create policy "professional_profiles_own_read" on public.professional_profiles for select to authenticated using (user_id = (select auth.uid()));
create policy "professional_profiles_own_insert" on public.professional_profiles for insert to authenticated with check (user_id = (select auth.uid()));
create policy "professional_profiles_own_update" on public.professional_profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
