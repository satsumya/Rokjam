-- Session climb attempts (Phase 4 — sessions adapter)
-- Run in Supabase SQL editor after 001_initial_schema.sql.

alter table public.session_climbs
  add column if not exists attempts jsonb not null default '[]'::jsonb;

-- Allow reading climbs on public completed sessions (community feed)
create policy "Climbs on public sessions are readable"
  on public.session_climbs for select
  using (
    exists (
      select 1 from public.sessions s
      where s.id = session_id
        and s.is_public = true
        and s.status = 'completed'
    )
  );
