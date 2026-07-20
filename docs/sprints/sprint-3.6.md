# Sprint 3.6 — Workforce Management Foundation

## Status initial

Em execução.

## Context

Sprint 3.5.2 was already committed and synchronized by the project owner. Sprint 3.6 builds on the current App Shell, Design System, domain contracts, Supabase foundation, and existing employee UI without recreating or removing them. Local Development Handbook documentation present at start was preserved.

## Objective

Create the technical and visual foundation for permanent profiles, company relationships, employment records, teams, and team memberships while preparing future time, cost, profitability, payroll, permissions, and company-network capabilities.

## Scope and entities

Profile, Company, Company Membership, Employee Record, Team, Team Membership, initial Company Roles, Membership Status, Employment Type, Employment Status, Team Status, and Team Role. The feature includes a demonstration `/dashboard/workforce` overview with stats, responsive members, filters, search, visual actions, teams, and a non-persistent Add Member form.

## Architecture

The existing `public.users`, `companies`, `company_memberships`, `roles`, and `membership_roles` structures are extended. New `employee_records`, `teams`, and `team_memberships` tables remain tenant-scoped. TypeScript contracts live in `src/domain/workforce.ts`; feature view types, demonstration data, and components live in `src/features/workforce`.

## Planned and delivered files

- Incremental migrations under `supabase/migrations`.
- `src/domain/workforce.ts` and domain barrel update.
- `src/features/workforce` types, data, components, and barrel.
- `app/dashboard/workforce/page.tsx`.
- App Shell navigation update.
- Sprint, roadmap, index, and workforce architecture documentation.

## Restrictions

No real employee data, salaries, tax, social legislation, payroll, banking, medical data, billing, finance calculations, destructive deletion, real invitations, email, uploads, public API, complete RBAC, authentication replacement, proxy change, App Shell recreation, commit, or push.

## Acceptance criteria

The existing database is reused without duplicate identity/company tables; workforce types are explicit; incremental RLS-protected tables exist; Workforce route uses the App Shell; demonstration members, stats, filters, actions, teams, and member form render accessibly and responsively; lint, TypeScript, build, existing behavior, and documentation validate.

## Validation

Run `npm run lint`, `npm run build`, available tests/typecheck, `git diff --check`, responsive browser validation at 320px and desktop, console inspection, and `git status`. Review migrations without applying them to a production database.

## Technical decisions

- Treat existing `public.users` as Profile identity rather than creating a duplicate profile/auth system.
- Keep membership roles normalized through existing role tables.
- Split membership enum additions into a separate migration so PostgreSQL commits new enum values before later use.
- Preserve membership and team history through dates and partial unique indexes.
- Add `company_id` to new workforce tables for clear tenant indexing and RLS.
- Keep all interface data explicitly demonstrative and non-persistent.

## Final status

Concluída com observações. A interface, a tipagem e as migrations foram implementadas e validadas por lint, build, revisão estática e testes responsivos no navegador. As migrations não foram aplicadas a uma instância Supabase nesta Sprint, pois não há banco local conectado neste ambiente.
