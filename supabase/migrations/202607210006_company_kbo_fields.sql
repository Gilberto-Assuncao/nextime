-- Adds the company fields available from Belgian KBO/BCE public lookups
-- (street address, postal code, email, establishment unit number, and
-- activity start date) that companies.city/country alone can't hold.

alter table public.companies add column if not exists email text;
alter table public.companies add column if not exists street_address text;
alter table public.companies add column if not exists postal_code text;
alter table public.companies add column if not exists establishment_number text;
alter table public.companies add column if not exists activity_start_date date;
