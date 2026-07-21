# Sprint 3.8 — Company Management

## Status initial

Em execução

## Context

Sprint 3.8 builds on the official Design System, App Shell, Workforce Foundation, Supabase authentication, active-company session, Company Switcher, memberships, roles, and RLS. All uncommitted work from Sprints 3.6 and 3.7 was preserved.

## Objective and scope

Deliver the first functional company-management experience: authorized overview, company list, transactional creation, profile editing, localization settings, operational status, Workforce summaries, safe archive/reactivation, empty/loading/error states, and responsive accessible UI.

## Routes

- `/dashboard/company`: active-company overview.
- `/dashboard/company/settings`: stable redirect to active-company settings.
- `/dashboard/companies`: authorized company list.
- `/dashboard/companies/new`: company creation.
- `/dashboard/companies/[companyId]`: authorized company detail and management.

All routes reuse the existing protected dashboard layout and App Shell.

## Data model and permissions

The existing Company table is extended with registration, VAT, contact, address, region, and logo-reference fields. Company Settings gains date/time formats and an update timestamp. No identity, Company, Membership, or active-context table is duplicated.

Owner can edit, archive, and reactivate. Admin can edit profile and operational settings. Other roles receive read-only behavior. Server Actions revalidate membership roles, and RLS repeats update restrictions at the database boundary.

## Multi-tenancy and validation

URL access is allowed only for companies in the authenticated membership set. Queries use the trusted company identifier. Forms allow-list fields and validate names, email, URL, phone structure, country, language, timezone, currency, VAT, registration number, status, and localization formats without claiming official fiscal validation.

## Components

Company Overview, list, profile form, settings form, status badge, form feedback, submit state, member/team summaries, empty state, loading skeleton, error boundary, not-found state, and Danger Zone. Existing Input, Select, Button, Card, KPI, Entity Card, Modal, and Confirmation Dialog are reused.

## Files and migration

Feature code lives in `src/features/companies`, routes in `app/dashboard`, and the incremental database change in `202607190005_company_management.sql`. The migration does not delete or recreate tables and is not applied automatically to a remote database.

## Restrictions and decisions

No billing, payroll, accounting, payments, fiscal verification, upload, complete RBAC, branch hierarchy, team CRUD, GPS, weather, geofencing, destructive deletion, commit, or push. Company creation uses one transactional database function so no company can be left without an owner.

## Acceptance and tests

Acceptance requires lint, build, TypeScript, whitespace verification, route generation, responsive checks at 320px/mobile/tablet/desktop, accessible labels/focus/status/confirmation, and no console errors. Real persistence requires applying migrations to a controlled Supabase environment with valid credentials.

## Status final

Concluída com observações. Lint, build, TypeScript, geração de rotas, redirecionamento de rota protegida, foco por teclado, console e ausência de overflow em 320 px foram validados. A persistência autenticada e a interface Company completa exigem aplicar as migrations pendentes e uma conta Supabase controlada, indisponíveis neste ambiente.
