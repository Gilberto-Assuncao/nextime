# Coding Standards

## Mandatory baseline

- Use TypeScript in strict mode for application code.
- Do not use `any`; model unknown input as `unknown` and narrow it.
- Do not add `@ts-ignore`, broad ESLint disables, or unsafe assertions to hide defects.
- Prefer `import type` for type-only dependencies.
- Keep names consistent, descriptive, and aligned with domain language.
- Comments explain non-obvious intent or constraints, never restate code.

## Structure and reuse

- Search before creating components, hooks, types, utilities, services, or repositories.
- Keep components and functions focused; split by responsibility, not arbitrary line counts.
- Prefer composition, typed props, and dependency injection over inheritance and global state.
- Do not duplicate components or business rules.
- Keep framework-independent logic outside React and Next.js components.
- Keep Server Components by default; add `"use client"` only for interaction or browser APIs.

## Data and errors

- Validate untrusted boundaries on the server.
- Never trust tenant, role, price, approval, or user identifiers supplied by the client.
- Use explicit result and status types; distinguish empty, loading, error, unauthorized, and not-found states.
- Use deterministic date, timezone, currency, and unit handling.
- Demonstration data must be labeled and must not resemble production secrets or personal records.

## Quality

Avoid premature abstractions and speculative dependencies. Optimize only after measurement, but prevent obvious unnecessary client bundles, repeated queries, unstable keys, uncontrolled rerenders, and page-level horizontal overflow.
