# Testing Standards

Validation is proportional to risk and covers the changed behavior, not only compilation.

## Mandatory checks

Every Sprint runs available equivalents of:

1. `npm run lint`
2. dedicated typecheck script, when present
3. existing unit, integration, and end-to-end tests
4. `npm run build`
5. `git diff --check`
6. `git status`

Do not report a check as passed when it was skipped, unavailable, or failed for an unrelated reason.

## Manual validation

UI work validates keyboard navigation, focus, empty/loading/error states, 320px mobile, tablet, desktop, touch targets, contrast, overflow, console errors, and preserved existing behavior. Reuse an existing development server rather than starting duplicates.

## Security and data validation

Authentication changes test signed-out, expired, and unauthorized states. Multi-tenant changes test cross-company denial. Database work tests migrations from a clean database, constraints, indexes, RLS policies, seeds, and rollback strategy. File work tests type, size, ownership, and storage policies.

## Regression and evidence

Add automated regression coverage for stable business rules and previously observed defects. Reports state commands, outcomes, environment limitations, and any manual checks performed.
