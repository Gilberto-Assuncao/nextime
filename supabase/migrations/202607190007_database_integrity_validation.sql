-- Sprint 3.9.1: forward-only integrity corrections found during database validation.

create or replace function private.prevent_tenant_key_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.company_id is distinct from old.company_id then
    raise exception 'company_id is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists company_memberships_protect_company_id on public.company_memberships;
create trigger company_memberships_protect_company_id
before update of company_id on public.company_memberships
for each row execute function private.prevent_tenant_key_change();

drop trigger if exists company_settings_protect_company_id on public.company_settings;
create trigger company_settings_protect_company_id
before update of company_id on public.company_settings
for each row execute function private.prevent_tenant_key_change();

drop trigger if exists employee_records_protect_company_id on public.employee_records;
create trigger employee_records_protect_company_id
before update of company_id on public.employee_records
for each row execute function private.prevent_tenant_key_change();

drop trigger if exists teams_protect_company_id on public.teams;
create trigger teams_protect_company_id
before update of company_id on public.teams
for each row execute function private.prevent_tenant_key_change();

drop trigger if exists team_memberships_protect_company_id on public.team_memberships;
create trigger team_memberships_protect_company_id
before update of company_id on public.team_memberships
for each row execute function private.prevent_tenant_key_change();

create or replace function private.validate_employee_record_company()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.company_memberships membership
    where membership.id = new.company_membership_id
      and membership.company_id = new.company_id
  ) then
    raise exception 'Employee membership must belong to the same company';
  end if;

  if new.manager_membership_id is not null and not exists (
    select 1
    from public.company_memberships manager
    where manager.id = new.manager_membership_id
      and manager.company_id = new.company_id
  ) then
    raise exception 'Employee manager must belong to the same company';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_employee_record_company on public.employee_records;
create trigger validate_employee_record_company
before insert or update of company_id, company_membership_id, manager_membership_id
on public.employee_records
for each row execute function private.validate_employee_record_company();

create or replace function private.prevent_team_membership_identity_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.team_id is distinct from old.team_id
    or new.company_membership_id is distinct from old.company_membership_id then
    raise exception 'Team membership identity is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists team_memberships_protect_identity on public.team_memberships;
create trigger team_memberships_protect_identity
before update of team_id, company_membership_id on public.team_memberships
for each row execute function private.prevent_team_membership_identity_change();

create unique index if not exists team_memberships_one_active_leader
on public.team_memberships(team_id)
where left_at is null and team_role = 'leader';

create or replace function private.assert_team_leader_link()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.leader_membership_id is not null and not exists (
    select 1
    from public.team_memberships link
    where link.team_id = new.id
      and link.company_id = new.company_id
      and link.company_membership_id = new.leader_membership_id
      and link.team_role = 'leader'
      and link.left_at is null
  ) then
    raise exception 'Team leader must have an active leader membership in the team';
  end if;
  return null;
end;
$$;

drop trigger if exists assert_team_leader_link on public.teams;
create constraint trigger assert_team_leader_link
after insert or update on public.teams
deferrable initially deferred
for each row execute function private.assert_team_leader_link();

create or replace function private.assert_team_membership_leader_link()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  team_leader_membership_id uuid;
begin
  select team.leader_membership_id
  into team_leader_membership_id
  from public.teams team
  where team.id = new.team_id;

  if new.left_at is null and new.team_role = 'leader'
    and team_leader_membership_id is distinct from new.company_membership_id then
    raise exception 'Active leader role must match the team leader';
  end if;

  if new.left_at is not null and team_leader_membership_id = new.company_membership_id then
    raise exception 'Team leader cannot leave before leadership is reassigned or cleared';
  end if;

  return null;
end;
$$;

drop trigger if exists assert_team_membership_leader_link on public.team_memberships;
create constraint trigger assert_team_membership_leader_link
after insert or update on public.team_memberships
deferrable initially deferred
for each row execute function private.assert_team_membership_leader_link();

revoke all on function private.prevent_tenant_key_change() from public;
revoke all on function private.validate_employee_record_company() from public;
revoke all on function private.prevent_team_membership_identity_change() from public;
revoke all on function private.assert_team_leader_link() from public;
revoke all on function private.assert_team_membership_leader_link() from public;
