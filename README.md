<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e3a1fcde-38d7-4087-8501-560632455a19

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend API (Implementation Kickoff)

A backend service now exists under `server/` and can run independently from Vite.

1. Start backend API server:
   `npm run dev:api`
2. Health check:
   `GET http://localhost:4000/health`
3. Development auth:
   Add header `x-user-id` with one of the seeded ids: `u1`, `u2`, `u3`
4. Frontend API target (optional if default is used):
   set `VITE_API_BASE_URL=http://localhost:4000` in `.env.local`

Main API groups currently available:
- `/api/auth`
- `/api/users`
- `/api/friends`
- `/api/status`
- `/api/events`
- `/api/chat`
- `/api/notifications`
- `/api/meta` (includes backend mode: memory/supabase)

Database bootstrap SQL for local PostgreSQL is in `server/db/schema.sql`.

## Supabase (New Project) Setup

The full production schema + RLS policies now live in:
- `supabase/migrations/202603260001_initial.sql`
- `supabase/migrations/202603260002_rls.sql`

To run backend in Supabase mode, set these server env vars:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

If they are missing, backend falls back to memory mode for development.

## Production Auth and RLS

- In production (`NODE_ENV=production`), backend requires `Authorization: Bearer <jwt>`.
- `x-user-id` dev fallback is disabled in production.
- In development, fallback auth can be enabled explicitly with:
   - `ALLOW_DEV_AUTH_FALLBACK=true`

Every repository query runs with a user-scoped Supabase client when a bearer token is present, so RLS is enforced by Supabase on each query.

## Health and Readiness

- `GET /health` returns liveness and includes current database reachability status.
- `GET /readiness` returns `200` only when Supabase is reachable; otherwise returns `503`.

## Persistence Integration Test

Run an end-to-end restart persistence check against Supabase:

- `npm run test:integration:persistence`

Required env var:

- `TEST_SUPABASE_JWT` - access token for a real authenticated user.
