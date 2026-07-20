-- Sprint 3.6: extend the existing identity and tenant model without duplicating it.
create type public.employment_type as enum ('employee','worker','contractor','freelancer','temporary','intern','apprentice','company_owner');
create type public.employment_status as enum ('active','inactive','leave','suspended','terminated','pending');
create type public.cost_visibility as enum ('restricted','finance','management');
create type public.team_status as enum ('active','inactive','archived');
create type public.team_role as enum ('leader','supervisor','member');

alter table public.users add column if not exists first_name text;
alter table public.users add column if not exists last_name text;
alter table public.users add column if not exists display_name text;
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists preferred_language text;
alter table public.users add column if not exists country_code text;
update public.users set display_name = coalesce(display_name, name), preferred_language = coalesce(preferred_language, language);

alter table public.companies add column if not exists legal_name text;
alter table public.companies add column if not exists display_name text;
alter table public.companies add column if not exists slug text;
alter table public.companies add column if not exists country_code text;
update public.companies set legal_name = coalesce(legal_name, name), display_name = coalesce(display_name, name), slug = coalesce(slug, lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')));
create unique index if not exists companies_slug_unique on public.companies(slug) where slug is not null;

alter table public.company_memberships add column if not exists joined_at timestamptz;
alter table public.company_memberships add column if not exists left_at timestamptz;
alter table public.company_memberships add column if not exists invited_at timestamptz;
alter table public.company_memberships add column if not exists invited_by uuid references public.users(id) on delete set null;
alter table public.company_memberships add column if not exists updated_at timestamptz not null default now();
update public.company_memberships set joined_at = coalesce(joined_at, starts_at) where status = 'active';
alter table public.company_memberships drop constraint if exists company_memberships_company_id_user_id_key;
create unique index if not exists company_memberships_one_current on public.company_memberships(company_id,user_id) where status in ('invited','active','suspended');

create table public.employee_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  company_membership_id uuid not null references public.company_memberships(id) on delete cascade,
  employee_code text,
  job_title text not null,
  employment_type public.employment_type not null,
  employment_status public.employment_status not null default 'pending',
  start_date date,
  end_date date,
  weekly_hours numeric(5,2) check (weekly_hours between 0 and 168),
  manager_membership_id uuid references public.company_memberships(id) on delete set null,
  cost_visibility public.cost_visibility not null default 'restricted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date),
  unique(company_membership_id)
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  status public.team_status not null default 'active',
  leader_membership_id uuid references public.company_memberships(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id,name)
);

create table public.team_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  company_membership_id uuid not null references public.company_memberships(id) on delete cascade,
  team_role public.team_role not null default 'member',
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check(left_at is null or left_at >= joined_at)
);
create unique index team_memberships_one_active on public.team_memberships(team_id,company_membership_id) where left_at is null;
create index employee_records_company on public.employee_records(company_id);
create index teams_company on public.teams(company_id);
create index team_memberships_company on public.team_memberships(company_id);

create or replace function private.has_company_role(target_company_id uuid, allowed_roles text[]) returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from public.company_memberships m join public.membership_roles mr on mr.membership_id=m.id join public.roles r on r.id=mr.role_id where m.company_id=target_company_id and m.user_id=(select auth.uid()) and m.status='active' and r.key=any(allowed_roles)) $$;
revoke all on function private.has_company_role(uuid,text[]) from public;
grant execute on function private.has_company_role(uuid,text[]) to authenticated;

create or replace function private.validate_team_membership_company() returns trigger language plpgsql set search_path='' as $$ begin if not exists(select 1 from public.teams t join public.company_memberships m on m.id=new.company_membership_id where t.id=new.team_id and t.company_id=new.company_id and m.company_id=new.company_id) then raise exception 'Team and membership must belong to the same company'; end if; return new; end $$;
create trigger validate_team_membership_company before insert or update on public.team_memberships for each row execute function private.validate_team_membership_company();

alter table public.employee_records enable row level security;
alter table public.teams enable row level security;
alter table public.team_memberships enable row level security;
create policy employee_records_member_read on public.employee_records for select to authenticated using ((select private.is_company_member(company_id)));
create policy employee_records_admin_insert on public.employee_records for insert to authenticated with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager'])));
create policy employee_records_admin_update on public.employee_records for update to authenticated using ((select private.has_company_role(company_id,array['owner','admin','administrator','manager']))) with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager'])));
create policy teams_member_read on public.teams for select to authenticated using ((select private.is_company_member(company_id)));
create policy teams_admin_insert on public.teams for insert to authenticated with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager'])));
create policy teams_admin_update on public.teams for update to authenticated using ((select private.has_company_role(company_id,array['owner','admin','administrator','manager']))) with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager'])));
create policy team_memberships_member_read on public.team_memberships for select to authenticated using ((select private.is_company_member(company_id)));
create policy team_memberships_admin_insert on public.team_memberships for insert to authenticated with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager','supervisor'])));
create policy team_memberships_admin_update on public.team_memberships for update to authenticated using ((select private.has_company_role(company_id,array['owner','admin','administrator','manager','supervisor']))) with check ((select private.has_company_role(company_id,array['owner','admin','administrator','manager','supervisor'])));
create policy users_shared_company_read on public.users for select to authenticated using (exists(select 1 from public.company_memberships mine join public.company_memberships theirs on theirs.company_id=mine.company_id where mine.user_id=(select auth.uid()) and mine.status='active' and theirs.user_id=users.id and theirs.status='active'));
create policy memberships_company_read on public.company_memberships for select to authenticated using ((select private.is_company_member(company_id)));

insert into public.roles(key,name,system) values ('admin','Admin',true),('viewer','Viewer',true) on conflict(key) do nothing;
