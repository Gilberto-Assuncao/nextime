-- Sprint 6.3 — the admin (service_role) Supabase client was added in
-- src/infrastructure/supabase/admin.ts but never actually usable: service_role
-- has BYPASSRLS (confirmed via pg_roles), but bypassing RLS does not grant
-- table access — Postgres still enforces the base GRANT first, the same
-- lesson already hit twice for `authenticated` (see 202607210002/0003).
-- service_role had ZERO select/insert/update/delete grants on every table in
-- `public` (only the default TRUNCATE/REFERENCES/TRIGGER), so any admin-client
-- write (e.g. the employee invite flow) failed with "permission denied".
--
-- Fixed broadly rather than table-by-table: service_role is meant to be the
-- trusted, privileged client for the whole schema, so grant it full access to
-- every current table plus a default privilege so future tables are covered
-- automatically instead of re-discovering this gap on the next feature.

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all functions in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on functions to service_role;
