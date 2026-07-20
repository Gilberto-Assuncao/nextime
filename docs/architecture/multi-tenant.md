# Multi-tenant architecture and RLS

Company Membership is the tenant boundary. One permanent Profile may hold multiple active memberships, while every tenant-owned record retains an explicit `company_id`.

## Active-company context

After server-side authentication, NEXTIME loads only active memberships belonging to `auth.uid()`. The active company is selected from those memberships and exposed to the App Shell through a minimal session DTO.

The Company Switcher calls a Server Action. Before changing context, the action revalidates the authenticated user and checks for an active membership in the requested company. Only then does it store the company identifier in the `nextime-active-company` cookie. The cookie is `HttpOnly`, `SameSite=Lax`, secure in production, scoped to `/`, and limited to 30 days.

The cookie is a preference, not an authorization grant. Every request rechecks that its value remains in the user’s active-company list; invalid or stale values fall back to the first valid membership. Data repositories must obtain `companyId` from `requireActiveCompany()` and never accept tenant identity directly from browser form data.

## Isolation model

- Application queries filter by the trusted active `companyId`.
- `private.is_company_member(company_id)` verifies active membership using `auth.uid()`.
- RLS remains enabled and protects every tenant table.
- Switching companies changes query context; it never broadens membership.
- Cross-company collaboration requires explicit future relationship policies and must not weaken tenant policies.

Sprint 3.7 adds only the policies required to discover the signed-in user’s role and settings. It does not implement complete RBAC. Service-role operations bypass RLS and must remain isolated, narrowly scoped, and server-only.

## Database onboarding

The authentication migration creates or updates the matching `public.users` Profile after an `auth.users` insert/update and initializes `user_settings`. It does not automatically create a company, billing account, invitation, or privileged role. Company onboarding and invitation workflows remain future business features.
