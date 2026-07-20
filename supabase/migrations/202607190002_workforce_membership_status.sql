-- Enum values are isolated so PostgreSQL commits them before later migrations use them.
alter type public.membership_status add value if not exists 'inactive';
alter type public.membership_status add value if not exists 'left';
alter type public.membership_status add value if not exists 'rejected';
