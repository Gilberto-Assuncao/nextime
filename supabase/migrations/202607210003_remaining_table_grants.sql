-- Completes the grants audit started in 202607210002_teams_workforce_read_grants.sql.
-- Same root cause: RLS policies filter rows, but Postgres also requires the base
-- GRANT before `authenticated` can reach a table through PostgREST at all.
--
-- Tables below fall into two groups:
--
-- 1. Already have real read/write RLS policies (verified against pg_policies),
--    so the grant alone makes them fully usable:
--    projects, sites, timesheets, timesheet_entries, reports, audit_logs,
--    company_settings (select/insert/update); notifications (select only,
--    matches its single "read own" policy); user_settings (select/update,
--    matches its two policies, no insert policy exists — rows are created by
--    the on_auth_user_created trigger).
--
-- 2. permissions and role_permissions are plain reference catalogs (no
--    company_id, not tenant-scoped) — same shape as `roles`, which already has
--    a `roles_read_authenticated` policy. They were missing the equivalent
--    policy by oversight; added here to match the established pattern.
--
-- NOT fixed here — flagged for a dedicated decision, not a blind grant:
-- certificates, company_relationships, localization_settings, and
-- professional_profiles have RLS enabled but ZERO policies defined, so they
-- deny all access regardless of any grant. Granting SELECT below is safe
-- (RLS still blocks every row with no policy) and removes half of the
-- two-part gate for whenever real policies are designed, but these four
-- tables will keep returning empty results / permission errors until someone
-- decides who should actually be allowed to read/write them (e.g. should a
-- teammate see your certificates? should localization_settings be user- or
-- company-scoped read?) — that is a business/security decision, not something
-- to invent inside a grants-cleanup migration.

grant select, insert, update on table
  public.projects,
  public.sites,
  public.timesheets,
  public.timesheet_entries,
  public.reports,
  public.audit_logs,
  public.company_settings
to authenticated;

grant select on table
  public.notifications,
  public.permissions,
  public.role_permissions
to authenticated;

grant select, update on table
  public.user_settings
to authenticated;

create policy "permissions_read_authenticated" on public.permissions for select to authenticated using (true);
create policy "role_permissions_read_authenticated" on public.role_permissions for select to authenticated using (true);

-- Known gap, grant only (see note above) — no policies exist yet:
grant select on table
  public.certificates,
  public.company_relationships,
  public.localization_settings,
  public.professional_profiles
to authenticated;
