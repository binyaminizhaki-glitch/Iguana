# AI Workflow Standards

This repository uses a blended operating model:

- UI UX Pro Max for user-facing quality, accessibility, and conversion-focused interface decisions.
- GSD for delivery velocity, clear done criteria, and pragmatic implementation.
- Terminal-first execution for consistency and reproducibility.
- Agentic decomposition for complex tasks before coding.
- Persistent memory updates in `MEMORY.md` to avoid repeating mistakes.

## Core Rules

1. Ship useful increments quickly.
- Prefer small, production-ready slices over large speculative rewrites.
- Reuse existing patterns in `src/` and `server/` before introducing new structure.

2. Design and UX quality are mandatory for user-facing work.
- Preserve clear visual hierarchy, readable typography, strong contrast, and obvious interactions.
- Keep keyboard access and focus visibility for all interactive elements.
- Honor reduced motion preferences when adding animation.

3. Plan before coding when complexity is non-trivial.
- For work touching multiple domains (API + UI + data), write an explicit step sequence first.
- Identify parallelizable steps and dependency order.

4. Use terminal-first verification.
- Standard checks:
  - `npm run lint`
  - `npm run build`
  - `node tests.js` (or project smoke equivalent)
- If API-specific changes are made, validate backend behavior using existing API scripts and routes.

5. Keep security and environment hygiene.
- Never print or persist secret values.
- Treat `.env` values as sensitive.
- Respect production auth behavior and do not weaken auth controls for convenience.

6. Always propose memory capture before closing meaningful tasks.
- Provide a concise suggested `MEMORY.md` entry with:
  - what changed,
  - why,
  - commands used for validation,
  - pitfalls or follow-up notes.

## Project-Specific Command Truth

Use commands already defined in `package.json`:

- `npm run dev` - frontend dev server
- `npm run dev:api` - backend API dev server
- `npm run lint` - TypeScript no-emit checks
- `npm run lint:api` - backend TypeScript no-emit checks
- `npm run build` - frontend production build
- `npm run build:api` - backend build to `dist-server/`
- `npm run test:integration:persistence` - persistence integration test

## Environment Baseline

Key variables from `.env.example`:

- `GEMINI_API_KEY`
- `APP_URL`
- `API_PORT`
- `VITE_API_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

When Supabase variables are absent, backend may run in memory mode. Validate behavior accordingly.

## Priority Model (Balanced)

- User-facing UI work: prioritize UI UX Pro Max quality first, then optimize for speed.
- Backend or reliability fixes: prioritize GSD speed first, while preserving correctness and safety.
- Cross-cutting features: balance both by delivering narrow, polished vertical slices.