-- Sprint 6.11 — Accept-invitation flow.
-- Team assignment was deferred at invite time (Sprint 6.3) because
-- validate_team_operational_membership requires the membership to already be
-- 'active' before joining a team. This stores the intended team on the
-- membership row itself so it can be applied once the invite is accepted.
alter table public.company_memberships add column if not exists pending_team_id uuid references public.teams(id) on delete set null;
