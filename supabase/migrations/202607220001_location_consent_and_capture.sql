-- Sprint 6.9 — Live Operations Map, first slice.
-- Consent decision (made 2026-07-22): explicit per-employee opt-in, stored
-- with a timestamp for GDPR auditability. Without consent, clock-in/out
-- keeps working exactly as before, just without a captured location.

alter table public.user_settings add column if not exists location_consent boolean not null default false;
alter table public.user_settings add column if not exists location_consent_at timestamptz;

-- Captured once, at the moment a timer session is stopped and the entry is
-- created (there is no persisted "currently running" session in this schema
-- — timesheet_entries only exist once starts_at/ends_at are both known — so
-- this models "where the last completed session started", not true
-- real-time presence. Documented as a known limitation in
-- WEATHER_INTELLIGENCE-adjacent docs/06-roadmap notes for Live Operations Map.
alter table public.timesheet_entries add column if not exists start_latitude numeric(9,6);
alter table public.timesheet_entries add column if not exists start_longitude numeric(9,6);
