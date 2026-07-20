-- Sprint 3.9: extend the existing Team model without recreating it.
alter table public.teams add column if not exists color text;
alter table public.teams add column if not exists icon text;
alter table public.teams add column if not exists archived_at timestamptz;
alter table public.team_memberships add column if not exists removed_at timestamptz;

alter table public.teams drop constraint if exists teams_color_format_check;
alter table public.teams add constraint teams_color_format_check
  check (color is null or color ~ '^#[0-9A-Fa-f]{6}$') not valid;
alter table public.teams drop constraint if exists teams_archive_consistency_check;
alter table public.teams add constraint teams_archive_consistency_check
  check ((status = 'archived' and archived_at is not null) or status <> 'archived') not valid;

create index if not exists teams_company_status_updated_index on public.teams(company_id,status,updated_at desc);
create index if not exists team_memberships_team_active_index on public.team_memberships(team_id) where left_at is null;

drop trigger if exists teams_set_updated_at on public.teams;
create trigger teams_set_updated_at before update on public.teams for each row execute function private.set_updated_at();
drop trigger if exists team_memberships_set_updated_at on public.team_memberships;
create trigger team_memberships_set_updated_at before update on public.team_memberships for each row execute function private.set_updated_at();

create or replace function private.validate_team_leader_company()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.leader_membership_id is not null and not exists (
    select 1 from public.company_memberships membership
    where membership.id = new.leader_membership_id
      and membership.company_id = new.company_id
      and membership.status = 'active'
  ) then raise exception 'Team leader must be an active member of the same company'; end if;
  return new;
end;
$$;
drop trigger if exists validate_team_leader_company on public.teams;
create trigger validate_team_leader_company before insert or update of leader_membership_id,company_id
on public.teams for each row execute function private.validate_team_leader_company();

create or replace function private.validate_team_operational_membership()
returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists (
    select 1 from public.teams t
    join public.company_memberships m on m.id = new.company_membership_id
    where t.id = new.team_id and t.company_id = new.company_id
      and t.status <> 'archived' and m.company_id = new.company_id and m.status = 'active'
  ) then raise exception 'Team and active membership must belong to the same company'; end if;
  return new;
end;
$$;
drop trigger if exists validate_team_operational_membership on public.team_memberships;
create trigger validate_team_operational_membership before insert or update of team_id,company_membership_id,company_id
on public.team_memberships for each row execute function private.validate_team_operational_membership();

drop policy if exists teams_admin_manage on public.teams;
drop policy if exists teams_admin_insert on public.teams;
drop policy if exists teams_admin_update on public.teams;
create policy teams_admin_insert on public.teams for insert to authenticated with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager'])));
create policy teams_admin_update on public.teams for update to authenticated using ((select private.has_company_role(company_id,array['owner','admin','administrator','manager']))) with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager'])));
drop policy if exists team_memberships_admin_manage on public.team_memberships;
drop policy if exists team_memberships_admin_insert on public.team_memberships;
drop policy if exists team_memberships_admin_update on public.team_memberships;
create policy team_memberships_admin_insert on public.team_memberships for insert to authenticated with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager'])));
create policy team_memberships_admin_update on public.team_memberships for update to authenticated using ((select private.has_company_role(company_id,array['owner','admin','administrator','manager']))) with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager'])));

create or replace function public.create_team(
  company_id_input uuid, name_input text, description_input text,
  leader_membership_id_input uuid default null, status_input public.team_status default 'active',
  color_input text default null, icon_input text default null, member_ids_input uuid[] default '{}'
) returns uuid language plpgsql security definer set search_path = '' as $$
declare team_id_created uuid; member_id uuid; all_members uuid[] := coalesce(member_ids_input,'{}');
begin
  if not private.has_company_role(company_id_input,array['owner','admin','administrator','manager']) then raise exception 'Permission denied'; end if;
  if char_length(trim(name_input)) not between 2 and 100 or char_length(coalesce(description_input,'')) > 500 then raise exception 'Invalid team details'; end if;
  if color_input is not null and color_input <> '' and color_input !~ '^#[0-9A-Fa-f]{6}$' then raise exception 'Invalid team color'; end if;
  if leader_membership_id_input is not null and not (leader_membership_id_input = any(all_members)) then all_members := array_append(all_members,leader_membership_id_input); end if;
  if exists(select 1 from unnest(all_members) id group by id having count(*) > 1) then raise exception 'Duplicate team members'; end if;
  if exists(select 1 from unnest(all_members) id where not exists(select 1 from public.company_memberships m where m.id=id and m.company_id=company_id_input and m.status='active')) then raise exception 'Invalid company member'; end if;
  insert into public.teams(company_id,name,description,leader_membership_id,status,color,icon,archived_at)
  values(company_id_input,trim(name_input),nullif(trim(description_input),''),leader_membership_id_input,status_input,nullif(color_input,''),nullif(icon_input,''),case when status_input='archived' then now() else null end)
  returning id into team_id_created;
  foreach member_id in array all_members loop
    insert into public.team_memberships(company_id,team_id,company_membership_id,team_role)
    values(company_id_input,team_id_created,member_id,case when member_id=leader_membership_id_input then 'leader'::public.team_role else 'member'::public.team_role end);
  end loop;
  return team_id_created;
end; $$;
revoke all on function public.create_team(uuid,text,text,uuid,public.team_status,text,text,uuid[]) from public;
grant execute on function public.create_team(uuid,text,text,uuid,public.team_status,text,text,uuid[]) to authenticated;

create or replace function public.update_team(
  team_id_input uuid, name_input text, description_input text,
  leader_membership_id_input uuid, status_input public.team_status,
  color_input text, icon_input text
) returns void language plpgsql security definer set search_path = '' as $$
declare target_company_id uuid; updated_links integer;
begin
  select company_id into target_company_id from public.teams where id = team_id_input;
  if target_company_id is null or not private.has_company_role(target_company_id,array['owner','admin','administrator','manager']) then raise exception 'Permission denied'; end if;
  if char_length(trim(name_input)) not between 2 and 100 or char_length(coalesce(description_input,'')) > 500 then raise exception 'Invalid team details'; end if;
  if color_input is not null and color_input <> '' and color_input !~ '^#[0-9A-Fa-f]{6}$' then raise exception 'Invalid team color'; end if;
  if leader_membership_id_input is not null and not exists (
    select 1 from public.company_memberships membership
    where membership.id=leader_membership_id_input and membership.company_id=target_company_id and membership.status='active'
  ) then raise exception 'Invalid team leader'; end if;

  update public.teams set name=trim(name_input), description=nullif(trim(description_input),''),
    leader_membership_id=leader_membership_id_input, status=status_input,
    color=nullif(color_input,''), icon=nullif(icon_input,''),
    archived_at=case when status_input='archived' then coalesce(archived_at,now()) else null end
  where id=team_id_input and company_id=target_company_id;

  update public.team_memberships set team_role='member'
  where team_id=team_id_input and team_role='leader' and left_at is null;
  if leader_membership_id_input is not null then
    update public.team_memberships set team_role='leader'
    where team_id=team_id_input and company_membership_id=leader_membership_id_input and left_at is null;
    get diagnostics updated_links = row_count;
    if updated_links = 0 then
      insert into public.team_memberships(company_id,team_id,company_membership_id,team_role)
      values(target_company_id,team_id_input,leader_membership_id_input,'leader');
    end if;
  end if;
end; $$;
revoke all on function public.update_team(uuid,text,text,uuid,public.team_status,text,text) from public;
grant execute on function public.update_team(uuid,text,text,uuid,public.team_status,text,text) to authenticated;
