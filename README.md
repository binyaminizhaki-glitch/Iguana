npm install -D @playwright/test
npx playwright install<div align="center">
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

## Clerk + Supabase Setup

The full production schema + RLS policies now live in:
- `supabase/migrations/202603260001_initial.sql`
- `supabase/migrations/202603260002_rls.sql`
- `supabase/migrations/202603280001_location_foundation.sql`
- `supabase/migrations/202604070001_clerk_auth_text_ids.sql`

Authentication is handled by Clerk only. Supabase remains the database + RLS layer.

Required Clerk env vars:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_JWT_KEY`
- `CLERK_AUTHORIZED_PARTIES` (recommended, especially in production)

To run backend in Supabase mode, set these server env vars:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If they are missing, backend falls back to memory mode for development.

## Production Auth and RLS

- In production (`NODE_ENV=production`), backend requires `Authorization: Bearer <jwt>` from Clerk.
- `x-user-id` dev fallback is disabled in production.
- In development, fallback auth can be enabled explicitly with:
   - `ALLOW_DEV_AUTH_FALLBACK=true`

Every repository query runs with a user-scoped Supabase client when a Clerk bearer token is present, so RLS is enforced by Supabase on each query.

## Health and Readiness

- `GET /health` returns liveness and includes current database reachability status.
- `GET /readiness` returns `200` only when Supabase is reachable; otherwise returns `503`.

## Persistence Integration Test

Run an end-to-end restart persistence check against Supabase:

- `npm run test:integration:persistence`

Required env var:

- `TEST_SUPABASE_JWT` - access token for a real authenticated user.

## AI Workflow Standards

Repository-level workflow and coding behavior for agents is defined in:

- [.github/copilot-instructions.md](.github/copilot-instructions.md)
- [.github/instructions/ui-ux-pro-max.instructions.md](.github/instructions/ui-ux-pro-max.instructions.md)
- [.github/instructions/gsd-execution.instructions.md](.github/instructions/gsd-execution.instructions.md)
- [.github/instructions/terminal-first.instructions.md](.github/instructions/terminal-first.instructions.md)
- [.github/instructions/memory-loop.instructions.md](.github/instructions/memory-loop.instructions.md)
- [AGENTS.md](AGENTS.md)
- [MEMORY.md](MEMORY.md)

These files combine UI quality standards, pragmatic delivery, terminal-first verification, and memory continuity.
