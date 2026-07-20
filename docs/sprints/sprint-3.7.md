# Sprint 3.7 — Authentication & Multi-Tenant Foundation

## Status

Concluída localmente com lint, build e TypeScript aprovados. A migration foi revisada, mas não aplicada a uma instância Supabase por segurança.

## Objective

Complete the reusable authentication and multi-company foundation without creating a second identity system or implementing complete business rules.

## Delivered scope

- Supabase email/password login and registration.
- Google, Apple, and Microsoft/Azure OAuth initiation.
- PKCE authentication callback.
- Forgot-password request and password update route.
- Supabase sign-out and session-cookie cleanup.
- Next.js 16 Proxy redirects for public and protected route boundaries.
- Authoritative server-side session verification in the protected dashboard layout.
- Active-membership discovery and a minimal session DTO.
- Functional Company Switcher with membership validation and secure preference cookie.
- Incremental onboarding trigger and minimum RLS policies.
- Updated authentication and multi-tenant architecture documentation.

## Tenant guarantee

The active-company cookie never grants access. Its value is accepted only when the current authenticated user has an active membership. Application data access must use the trusted server context, and the database independently enforces membership through RLS.

## Explicitly deferred

Complete RBAC, invitations, company onboarding, billing, SSO administration, MFA screens, audit workflows, organization deletion, and production deployment configuration.

## Validation

Run lint, production build with TypeScript, whitespace checks, status inspection, and review of the public/protected routing behavior. Apply and test migrations only in a controlled Supabase environment; this Sprint does not mutate a remote database.
