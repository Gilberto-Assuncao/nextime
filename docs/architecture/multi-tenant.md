# Multi-tenant, RLS, and storage

Company membership is the tenant boundary. `private.is_company_member(company_id)` evaluates active membership using `auth.uid()`. Tenant table policies call this function, and tenant columns are indexed. The private schema is not API-exposed.

All application repository calls require a `TenantContext`. This application-level filter improves clarity but does not replace database enforcement. Every tenant-owned query must include `company_id`, and every mutation must derive it from the trusted current membership rather than user-controlled form data.

RLS is enabled across the foundation schema. Initial policies cover personal identity, membership discovery, company visibility, tenant operational data, and personal notifications. Tables without an explicit policy are deny-by-default. Future permissions should be implemented with membership roles and permissions, then enforced through tested RLS functions. Service-role operations bypass RLS and must remain server-only and narrowly scoped.

Private storage buckets are provisioned for `avatars`, `company-logos`, `documents`, `reports`, `certificates`, `project-images`, and `site-photos`. Storage object operations must use the Storage API. Before uploads are enabled, add path conventions such as `<companyId>/<entityId>/<file>` and policies that validate the first folder against active membership; never update `storage` schema metadata directly.

Company relationships connect tenants without merging their data. Cross-company collaboration must use explicit relationship-aware grants or shared records in future migrations, never weaken the base company policy.
