# Architecture Principles

## Modular and feature-first delivery

Organize product behavior around coherent features while keeping shared domain, application, infrastructure, and design-system layers explicit. A feature may compose shared primitives, but shared layers must not import feature UI or route concerns.

## Dependency direction

Domain contracts are framework-independent. Application use cases depend on domain abstractions. Infrastructure implements repositories, external providers, Supabase access, and storage. UI consumes application-facing view models and invokes authorized use cases. Dependencies point inward; domain code never imports Next.js, React, or Supabase.

## Identity and companies

User and ProfessionalProfile represent NEXTIME identity. Company is independent. CompanyMembership represents the time-bounded link between them. CompanyRelationship connects organizations without merging their data. Never model a user as owned directly by one company.

## Multi-tenancy

Tenant-owned entities carry a trusted CompanyId. Queries and mutations require tenant context, database indexes, and RLS. Cross-company access requires an explicit relationship and policy; convenience never justifies weakening isolation.

## Data and presentation

Pages orchestrate data and view composition. Presentational components receive typed, minimal props and contain no persistence or authorization rules. Mock data remains clearly isolated and cannot simulate authentication or persistence.

## Scalability

Use stable identifiers, explicit ownership, asynchronous boundaries for expensive jobs, append-oriented audit records, provider-neutral adapters, pagination for growing collections, and indexed authorization columns. Scale architecture with measured needs, not distributed complexity by default.

See [Domain Architecture](../architecture/domain-architecture.md), [Project Structure](../architecture/project-structure.md), and [Multi-tenancy](../architecture/multi-tenant.md).
