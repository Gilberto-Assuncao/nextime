# Company Management architecture

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
