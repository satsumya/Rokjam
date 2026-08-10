-- Rokjam initial Supabase schema (Phase 4)
-- Run in Supabase SQL editor after creating a project.

-- Extend auth.users with app profile
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar text,
  profile_complete boolean not null default false,
  profile_skipped boolean not null default false,
  strength_tags text[] not null default '{}',
  improvement_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile row on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Locations (profile setup) — sessions adapter will reference these next
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  nickname text,
  is_home boolean not null default false,
  level_sort text not null default 'easy-hard' check (level_sort in ('easy-hard', 'hard-easy')),
  created_at timestamptz not null default now()
);

alter table public.locations enable row level security;

create policy "Locations owned by user"
  on public.locations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.difficulty_levels (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  name text not null,
  color text not null,
  sort_order int not null default 0
);

alter table public.difficulty_levels enable row level security;

create policy "Levels owned via location"
  on public.difficulty_levels for all
  using (
    exists (
      select 1 from public.locations l
      where l.id = location_id and l.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.locations l
      where l.id = location_id and l.user_id = auth.uid()
    )
  );

-- Sessions + climbs — placeholder for SessionRepository adapter (columns align with app types)
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('active', 'completed')),
  session_date date not null,
  start_time text,
  end_time text,
  duration_minutes int,
  location_id uuid references public.locations (id) on delete set null,
  location_name text not null default '',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "Sessions owned by user"
  on public.sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public completed sessions are readable"
  on public.sessions for select
  using (is_public = true and status = 'completed');

create table if not exists public.session_climbs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  level_id uuid references public.difficulty_levels (id) on delete set null,
  level_name text,
  level_color text,
  name text,
  tags text[] not null default '{}',
  notes text,
  has_image boolean not null default false,
  has_video boolean not null default false,
  is_warm_up boolean not null default false,
  is_repeat boolean not null default false,
  is_project boolean not null default false,
  sort_order int not null default 0
);

alter table public.session_climbs enable row level security;

create policy "Climbs owned via session"
  on public.session_climbs for all
  using (
    exists (
      select 1 from public.sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

-- Follows (community) — placeholder
create table if not exists public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followed_username text not null,
  primary key (follower_id, followed_username)
);

alter table public.follows enable row level security;

create policy "Follows owned by follower"
  on public.follows for all
  using (auth.uid() = follower_id)
  with check (auth.uid() = follower_id);
