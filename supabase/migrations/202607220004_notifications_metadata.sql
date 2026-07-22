-- The punctuality-reminder cron (Sprint 6.10) needs a structured way to
-- dedupe "already notified this user today" without fragile title matching.
-- notifications never had a metadata column at all (checked via \d — only
-- id/company_id/user_id/type/title/message/action_url/read_at/created_at
-- existed), so the insert was failing silently until this was added.
alter table public.notifications add column if not exists metadata jsonb not null default '{}';
