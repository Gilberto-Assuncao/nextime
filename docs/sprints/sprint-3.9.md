# Sprint 3.9 — Teams

## Status initial

Em execução

## Context and objective

Sprint 3.9 builds the functional Teams module on the existing Design System, App Shell, authentication, active-company context, Company Management, Workforce, Team, and Team Membership foundation. All local work from earlier sprints was preserved.

## Scope and routes

The module provides overview, search/status filtering, responsive list, creation, details, editing, optional leadership, membership addition/removal, status, archival/reactivation, loading, empty, error, read-only, feedback, and confirmation states.

- `/dashboard/teams`
- `/dashboard/teams/new`
- `/dashboard/teams/[teamId]`
- `/dashboard/teams/[teamId]/edit`

## Models and rules

The existing Team table gains color, icon, and archive timestamp. Existing Team Membership gains removal timestamp while retaining `left_at`. One team belongs to one company; members and leader must be active memberships in that company; active duplicates are prohibited; a leader is also a team member; removing a leader requires reassignment or explicit clearing; archive preserves all history and blocks new links.

## Permissions and isolation

Owner, admin, administrator, and manager can manage Teams. Other authorized roles receive read-only access. Every query uses authenticated active-company context, every mutation repeats server authorization, and RLS/database triggers enforce the tenant boundary without trusting UI IDs.

## Components and validation

Teams Overview, responsive team cards, statistics, status badge, Team Form, details, members manager, add/remove dialogs, and Danger Zone reuse existing inputs, selects, checkboxes, buttons, cards, KPIs, modal, and confirmation components. Manual allow-list validation is used because the project has no schema-validation dependency; no package was installed.

## Tests, decisions, and limitations

Lint, build, TypeScript, route generation, protected-route redirect, console, keyboard, and responsive checks are required. Real authenticated persistence requires applying pending migrations and a controlled Supabase account. Complete team RBAC, audit activity, scheduling, projects, timesheets, GPS, notifications, and destructive deletion remain outside scope.

## Status final

Concluída com observações. Lint, build, TypeScript, geração de rotas, redirecionamento protegido, console, foco por teclado e ausência de overflow em 320 px passaram. Persistência autenticada, RLS e mutations exigem migrations aplicadas e uma conta Supabase controlada, indisponíveis neste ambiente.
