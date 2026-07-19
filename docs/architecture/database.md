# Database foundation

The initial PostgreSQL schema is defined in `supabase/migrations`. It mirrors the framework-independent contracts in `src/domain` and uses UUID primary keys, foreign keys, checks, tenant indexes, and explicit lifecycle enums.

Identity is split between Supabase `auth.users` and the application-owned `public.users`. Company membership is modeled through `company_memberships`; users are not owned by companies. Roles and permissions use join tables so authorization profiles remain data-driven.

Tenant-owned operational tables carry `company_id`: projects, chantiers, timesheets, entries, reports, audit logs, and company settings. New tenant-owned tables must follow this convention, index `company_id`, enable RLS, and define policies before API access is granted.

`supabase/seed.sql` contains development-only BELNEX ENERGY and GeoTech data, their relationship, one project and chantier, plus reusable role and permission catalogs. Auth identities, memberships, and timesheets should be added through local Auth tooling because `public.users` references `auth.users`.

Run migrations and seed through the Supabase CLI against a local project. Never run the seed in production.
