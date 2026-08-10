-- Username availability check (Phase 4 — profile adapter)
-- Run in Supabase SQL editor after 001_initial_schema.sql.

create or replace function public.is_username_taken(check_username text, exclude_id uuid default null)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where username is not null
      and lower(username) = lower(trim(check_username))
      and (exclude_id is null or id <> exclude_id)
  );
$$;

revoke all on function public.is_username_taken(text, uuid) from public;
grant execute on function public.is_username_taken(text, uuid) to authenticated;
