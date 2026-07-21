# NEXTIME --- COMPANY MANAGEMENT

Version: 1.2 Status: Completed (Sprint 3.8); VAT autofill via VIES Planned Last Updated: 2026-07-21

Company Management extends the existing `public.companies` tenant root. It does not introduce another company table, membership model, Company Switcher, or active-company context.

## Company and membership

Company stores public operational identity, localization, address, contact, status, and logo reference. Company Membership links one permanent Profile to one tenant. The membership’s normalized roles determine management capabilities while RLS independently enforces access.

The active company remains a server-validated session preference. Company Management reads a URL company only after confirming that the authenticated session contains a valid membership. Unknown and unauthorized identifiers share the same not-found response and do not disclose tenant data.

## Creation

`public.create_company` is a security-definer database function available only to authenticated users. In one transaction it:

1. normalizes and reserves a unique non-sensitive slug;
2. creates the Company with active status;
3. creates one active Company Membership for `auth.uid()`;
4. assigns the system owner role;
5. creates default Company Settings.

If any step fails, PostgreSQL rolls back the complete operation. The frontend never supplies an owner user ID or company ID.

## Editing and settings

Profile and settings mutations revalidate authentication and require owner/admin membership before reaching RLS-protected updates. Mutable fields are allow-listed and normalized. IDs, ownership, creation timestamps, security data, and tenant identifiers cannot be edited through forms. Slugs remain stable when display names change.

Owner and admin can edit profile and operational settings. Manager, supervisor, and viewer receive read-only access when their membership authorizes viewing. Employee and contractor do not receive administrative controls.

## Status and archival

Supported states are active, inactive, suspended, and archived. Operational status changes require owner/admin; archive/reactivate requires owner. Archival updates status only: no Company, Membership, Workforce, Team, Project, or historical row is deleted. Archived companies are removed from the Company Switcher but remain visible to their authorized owner in Company Management for reactivation.

## Integrations

- **Company Switcher:** uses authenticated memberships and excludes archived companies.
- **Workforce:** member and team summaries query existing Company Membership, Team, and Team Membership tables by trusted company context.
- **Projects:** overview counts existing active projects; no project workflow is reimplemented.
- **Logo:** a safe placeholder and `logo_url` field are prepared. Upload remains disabled until bucket-specific authorization and validation policies are implemented.

Future branches must model an explicit hierarchy or relationship instead of duplicating tenants. Billing, payroll, GPS, geofencing, weather, accounting, and fiscal validation remain isolated future modules and must not weaken this tenant boundary.

## Planned: VAT-based company autofill (VIES) — decision pending, prepared for implementation

**Status: Planned, not implemented.** Registered 2026-07-21 after evaluating whether company creation could autofill from the Belgian BCE/KBO public register.

**Decision:** do not scrape `kbopub.economie.fgov.be` — it is a human-facing page, not an API, with no stability guarantee and likely against its terms of use. Use **VIES** (VAT Information Exchange System, European Commission) instead: the standard, free, official route EU B2B SaaS products use to validate a VAT number and retrieve the registered name/address. It also generalizes to any EU country, not just Belgium, consistent with the multi-country vision already registered in `01-product/PRODUCT_VISION.md`.

**Where it fits (when built):**
1. New field/step in the company creation form: user types a VAT number (e.g. `BE0123456789`).
2. A Server Action calls the VIES endpoint server-side (never from the browser — avoids CORS issues and keeps the call auditable). The exact current endpoint/request shape (VIES has moved from SOAP to a REST API over the years) must be re-confirmed against EU documentation at implementation time rather than assumed from this note; conceptually it takes `{ countryCode, vatNumber }` and returns `{ valid, name, address }` (or an equivalent request-date/consultation-number payload for the newer REST API).
3. On a valid response, prefill (not silently overwrite) `legal_name`/`display_name`, `vat_number`, and the address fields already present on `companies` (`address_line_1/2`, `postal_code`, `region`, `country_code`) — the user still confirms/submits through the existing `public.create_company` RPC, which keeps all current validation and tenant-creation guarantees unchanged.
4. `registration_number` (BCE/KBO) is a separate identifier from VAT and VIES does not return it — if BCE-specific data (NACE activities, legal situation) is wanted later, that is a distinct, larger integration (KBO Open Data bulk extract, not a live per-number lookup) and should not be conflated with the VIES VAT lookup.

**Not decided yet:** whether to fail the form if VIES is unreachable (degrade to manual entry, most likely) or block submission — that is a UX call for whoever implements this.
