-- Denormalized owner display on public sessions (Phase 4 — community adapter)
-- Run in Supabase SQL editor after 001_initial_schema.sql.

alter table public.sessions
  add column if not exists owner_username text not null default '',
  add column if not exists owner_avatar text not null default '';
