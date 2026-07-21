-- Fixes the Teams module failure ("Unable to load teams") discovered while
-- validating Sprint 5.2 (Workforce) in a real browser session.
--
-- Root cause: RLS policies filter rows, but PostgREST/Postgres also requires
-- the base GRANT before a role can reach a table at all — RLS alone is not
-- enough. Migration 202607190003_workforce_foundation.sql created RLS
-- policies for employee_records, teams, and team_memberships but never
-- granted the base table privileges, unlike 202607200001_session_read_grants.sql,
-- which fixed the same class of bug for users/companies/company_memberships/
-- membership_roles/roles. As a result every direct query against these three
-- tables has always failed with "permission denied for table ...", regardless
-- of RLS being correctly defined — this affected both the Teams module
-- (src/features/teams: read queries, and the direct insert/update calls in
-- addTeamMemberAction/removeTeamMemberAction/archiveTeamAction) and the
-- Workforce module just wired up in Sprint 5.2 (reads employee_records).
--
-- Grants below match each table's own RLS policy shape (read + insert + update
-- policies already exist for all three) rather than granting only SELECT.
--
-- Note: this same gap likely affects other tables added since the session-read-
-- grants fix (projects, sites, timesheets, timesheet_entries, reports,
-- notifications, audit_logs, certificates, company_relationships,
-- company_settings, localization_settings, permissions, professional_profiles,
-- role_permissions, user_settings) — out of scope here since nothing queries
-- them directly yet, but tracked as a known follow-up before Sprint 5.3+.

grant select, insert, update on table
  public.teams,
  public.team_memberships,
  public.employee_records
to authenticated;
