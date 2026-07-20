-- RLS policies filter these tables, while grants allow authenticated requests
-- to reach those policies through PostgREST.
grant select on table
  public.users,
  public.companies,
  public.company_memberships,
  public.membership_roles,
  public.roles
to authenticated;
