create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.email, '')
  )
  on conflict (id) do update
  set email = excluded.email,
      updated_at = now();

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute procedure public.handle_new_auth_user();

drop policy if exists "roles_read_authenticated" on public.roles;
create policy "roles_read_authenticated"
  on public.roles for select to authenticated
  using (true);

drop policy if exists "membership_roles_read_own" on public.membership_roles;
create policy "membership_roles_read_own"
  on public.membership_roles for select to authenticated
  using (
    exists (
      select 1 from public.company_memberships membership
      where membership.id = membership_roles.membership_id
        and membership.user_id = (select auth.uid())
        and membership.status = 'active'
    )
  );

drop policy if exists "user_settings_read_own" on public.user_settings;
create policy "user_settings_read_own"
  on public.user_settings for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own"
  on public.user_settings for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (
      default_company_id is null
      or (select private.is_company_member(default_company_id))
    )
  );

revoke all on function public.handle_new_auth_user() from public;
