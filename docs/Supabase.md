# Supabase backend

Rokjam uses [Supabase](https://supabase.com) for production auth and Postgres-backed profile, sessions, and community data.

## Setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy **Project URL** and **anon public** key from Settings → API.
3. Create `.env` in the repo root (see `.env.example`).
4. Run the initial schema in the Supabase SQL editor: `supabase/migrations/001_initial_schema.sql`.
5. Run `supabase/migrations/002_username_availability.sql` (username taken checks under RLS).
6. Run `supabase/migrations/003_session_climb_attempts.sql` (climb attempts + public climb reads).
7. Run `supabase/migrations/004_session_owner_snapshot.sql` (owner display on public sessions).
8. In Authentication → Providers, enable **Email** (confirm email if you want verify-email flow in production).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key (safe in client) |
| `EXPO_PUBLIC_APP_MODE` | `prototype` (mock auth) or `production` (Supabase auth when env is set) |

## When Supabase is used

| Mode | Supabase env | Auth | Profile / sessions |
| --- | --- | --- | --- |
| `prototype` (default) | any | Mock | Mock |
| `production` | not set | Mock (fallback) | Mock |
| `production` | set | **Supabase** | **All adapters (auth, profile, sessions, community)** |

Run production + Supabase locally:

```bash
npm run web:production
```

With `.env` containing Supabase keys.

## Implemented (Phase 4)

### Auth

- `@supabase/supabase-js` client with AsyncStorage session persistence
- `signInWithPassword`, `signUpWithPassword`, `signOut`, `resetPasswordForEmail`
- Auth state synced to `useAuth()` in production mode

### Profile

- Load profile, locations, and difficulty levels on sign-in
- Persist username, avatar, tags, profile flags, locations, and levels to Postgres
- Live username availability check via `is_username_taken` RPC (requires migration `002`)

### Sessions

- Load sessions and climbs (with attempts) on sign-in
- Persist start/update/complete/delete session
- Persist add/update/remove climbs
- Snapshot `owner_username` / `owner_avatar` on public sessions (migration `004`)

### Community

- Load other users’ public completed sessions for the feed
- Persist follows to `follows` table
- Toggle follow/unfollow on usernames

## Next

1. TanStack Query for cache/refetch behind repository hooks
2. Phase 5 store polish (see [Migration.md](./Migration.md))

See [Migration.md](./Migration.md) for the full plan.
