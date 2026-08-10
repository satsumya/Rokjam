# Supabase backend

Rokjam uses [Supabase](https://supabase.com) for production auth and (incrementally) Postgres-backed profile, sessions, and community data.

## Setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy **Project URL** and **anon public** key from Settings → API.
3. Create `.env` in the repo root (see `.env.example`).
4. Run the initial schema in the Supabase SQL editor: `supabase/migrations/001_initial_schema.sql`.
5. In Authentication → Providers, enable **Email** (confirm email if you want verify-email flow in production).

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
| `production` | set | **Supabase** | Mock (until Phase 4 adapters land) |

Run production + Supabase locally:

```bash
npm run web:production
```

With `.env` containing Supabase keys.

## Implemented (Phase 4 — auth slice)

- `@supabase/supabase-js` client with AsyncStorage session persistence
- `signInWithPassword`, `signUpWithPassword`, `signOut`, `resetPasswordForEmail`
- Auth state synced to `useAuth()` in production mode

## Next (Phase 4 continued)

1. **Profile** — `profiles`, `locations`, `levels` tables + `ProfileRepository` adapter
2. **Sessions** — `sessions`, `climbs`, `attempts` + `SessionRepository` adapter
3. **Community** — public sessions feed + follows
4. TanStack Query for cache/refetch behind repository hooks

See [Migration.md](./Migration.md) for the full plan.
