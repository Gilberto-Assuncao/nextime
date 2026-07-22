-- Sprint 6.10 — Configurable Work Schedule & Punctuality Reminders, first slice.
-- Background-job decision (made 2026-07-22): Vercel Cron calling a secured
-- API route, rather than pg_cron — keeps scheduling logic in the app layer,
-- consistent with how every other feature in this project works, at the
-- cost of requiring the app to be deployed on Vercel for the cron to fire.
--
-- Company-level schedule only in this slice (no per-user override yet, even
-- though company_settings/user_settings already model a similar "company
-- default, user can override" split elsewhere) — kept out to limit scope.

alter table public.company_settings add column if not exists expected_start_time time;
alter table public.company_settings add column if not exists expected_end_time time;
alter table public.company_settings add column if not exists grace_minutes integer not null default 15;
alter table public.company_settings add column if not exists punctuality_reminders_enabled boolean not null default false;
