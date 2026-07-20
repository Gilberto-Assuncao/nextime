-- Sprint 3.8: extend the existing companies table and preserve every tenant relationship.
alter table public.companies add column if not exists registration_number text;
alter table public.companies add column if not exists vat_number text;
alter table public.companies add column if not exists phone text;
alter table public.companies add column if not exists email text;
alter table public.companies add column if not exists address_line_1 text;
alter table public.companies add column if not exists address_line_2 text;
alter table public.companies add column if not exists postal_code text;
alter table public.companies add column if not exists region text;
alter table public.companies add column if not exists logo_url text;

update public.companies
set vat_number = coalesce(vat_number, vat),
    country_code = coalesce(country_code, upper(country)),
    display_name = coalesce(display_name, name),
    legal_name = coalesce(legal_name, name)
where vat_number is null
   or country_code is null
   or display_name is null
   or legal_name is null;

alter table public.companies drop constraint if exists companies_management_status_check;
alter table public.companies add constraint companies_management_status_check
  check (status in ('active', 'inactive', 'suspended', 'archived')) not valid;
alter table public.companies add constraint companies_country_code_check
  check (country_code is null or country_code ~ '^[A-Z]{2}$') not valid;
alter table public.companies add constraint companies_currency_code_check
  check (currency ~ '^[A-Z]{3}$') not valid;
alter table public.companies add constraint companies_slug_format_check
  check (slug is null or slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$') not valid;

create index if not exists companies_status_index on public.companies(status);
create index if not exists company_memberships_company_status_index
  on public.company_memberships(company_id, status);

alter table public.company_settings add column if not exists date_format text not null default 'DD/MM/YYYY';
alter table public.company_settings add column if not exists time_format text not null default '24h';
alter table public.company_settings add column if not exists updated_at timestamptz not null default now();

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at before update on public.companies
for each row execute function private.set_updated_at();
drop trigger if exists company_settings_set_updated_at on public.company_settings;
create trigger company_settings_set_updated_at before update on public.company_settings
for each row execute function private.set_updated_at();

insert into public.roles(key, name, system) values
  ('owner', 'Owner', true),
  ('manager', 'Manager', true),
  ('supervisor', 'Supervisor', true),
  ('employee', 'Employee', true),
  ('contractor', 'Contractor', true)
on conflict(key) do nothing;

drop policy if exists companies_owner_admin_update on public.companies;
create policy companies_owner_admin_update on public.companies
for update to authenticated
using ((select private.has_company_role(id, array['owner','admin','administrator'])))
with check ((select private.has_company_role(id, array['owner','admin','administrator'])));

drop policy if exists company_settings_owner_admin_manage on public.company_settings;
drop policy if exists company_settings_tenant_insert on public.company_settings;
drop policy if exists company_settings_tenant_update on public.company_settings;
create policy company_settings_owner_admin_insert on public.company_settings
for insert to authenticated with check ((select private.has_company_role(company_id, array['owner','admin','administrator'])));
create policy company_settings_owner_admin_update on public.company_settings
for update to authenticated
using ((select private.has_company_role(company_id, array['owner','admin','administrator'])))
with check ((select private.has_company_role(company_id, array['owner','admin','administrator'])));

create or replace function public.create_company(
  legal_name_input text,
  display_name_input text,
  country_code_input text,
  default_language_input text,
  timezone_input text,
  currency_code_input text,
  registration_number_input text default null,
  vat_number_input text default null,
  email_input text default null,
  phone_input text default null,
  city_input text default null,
  website_input text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  company_id_created uuid;
  membership_id_created uuid;
  owner_role_id uuid;
  slug_base text;
  slug_value text;
begin
  if actor_id is null then raise exception 'Authentication required'; end if;
  if char_length(trim(legal_name_input)) not between 2 and 160
    or char_length(trim(display_name_input)) not between 2 and 160 then raise exception 'Invalid company name'; end if;
  if upper(country_code_input) !~ '^[A-Z]{2}$' or upper(currency_code_input) !~ '^[A-Z]{3}$' then raise exception 'Invalid localization code'; end if;
  if default_language_input not in ('en','fr','nl','de','pt') or char_length(trim(timezone_input)) < 3 then raise exception 'Invalid localization settings'; end if;
  if email_input is not null and email_input <> '' and email_input !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid company email'; end if;
  if website_input is not null and website_input <> '' and website_input !~* '^https?://' then raise exception 'Invalid company website'; end if;

  slug_base := trim(both '-' from lower(regexp_replace(display_name_input, '[^a-zA-Z0-9]+', '-', 'g')));
  if slug_base = '' then raise exception 'Invalid company name'; end if;
  slug_value := slug_base;
  if exists(select 1 from public.companies where slug = slug_value) then
    slug_value := slug_base || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  end if;

  insert into public.companies (
    name, legal_name, display_name, slug, registration_number, vat_number,
    vat, country_code, country, default_language, timezone, currency,
    phone, email, city, website, status
  ) values (
    display_name_input, legal_name_input, display_name_input, slug_value,
    nullif(registration_number_input, ''), nullif(vat_number_input, ''),
    nullif(vat_number_input, ''), upper(country_code_input), upper(country_code_input),
    default_language_input, timezone_input, upper(currency_code_input),
    nullif(phone_input, ''), nullif(email_input, ''), nullif(city_input, ''),
    nullif(website_input, ''), 'active'
  ) returning id into company_id_created;

  insert into public.company_memberships (
    company_id, user_id, status, starts_at, joined_at, job_title, function_name
  ) values (
    company_id_created, actor_id, 'active', now(), now(), 'Owner', 'owner'
  ) returning id into membership_id_created;

  select id into owner_role_id from public.roles where key = 'owner';
  if owner_role_id is null then raise exception 'Owner role is not configured'; end if;
  insert into public.membership_roles(membership_id, role_id)
  values (membership_id_created, owner_role_id);

  insert into public.company_settings(company_id) values(company_id_created)
  on conflict(company_id) do nothing;

  return company_id_created;
end;
$$;

revoke all on function public.create_company(text,text,text,text,text,text,text,text,text,text,text,text) from public;
grant execute on function public.create_company(text,text,text,text,text,text,text,text,text,text,text,text) to authenticated;
