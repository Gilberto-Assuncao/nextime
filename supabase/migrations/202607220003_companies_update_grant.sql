-- The `companies_owner_admin_update` RLS policy (202607190005) has existed
-- since Sprint 3.8, but `authenticated` was only ever granted SELECT on
-- `public.companies` — never UPDATE. Editing a company profile or settings
-- would have failed with "permission denied for table companies" the first
-- time anyone tried it; discovered while testing Sprint 6.10 (Punctuality
-- Reminders), same root-cause class as 202607210002/0003/0007.

grant update on table public.companies to authenticated;
