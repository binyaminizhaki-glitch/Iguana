# AGENTS Workflow Contract

This repository uses a blended delivery model:

- UI UX Pro Max for user-facing quality, accessibility, and conversion clarity.
- GSD for rapid, practical, production-safe delivery.
- Terminal-first verification for reproducibility.
- Agentic decomposition for complex tasks before coding.
- Memory loop updates to preserve continuity.

## Operating Rules

1. For non-trivial work, plan before editing.
- Break work into explicit steps.
- Sequence dependencies and parallelizable tasks.

2. Match rigor to task type.
- UI-facing changes: prioritize UX quality and accessibility first, then speed.
- Backend/reliability changes: prioritize correctness and speed first, while preserving safety.

3. Validate with commands, not assumptions.
- Baseline checks:
  - `npm run lint`
  - `npm run build`
  - `node tests.js`
- Use `npm run lint:api`, `npm run build:api`, and `npm run test:integration:persistence` when backend scope requires it.
- Use `npm run dev` and `npm run dev:api` for frontend/backend local runs; prefer route-level checks like `/health`, `/readiness`, and `/api/meta/backend-mode` when validating API behavior.

4. Keep scope tight.
- Reuse existing patterns in `src/` and `server/`.
- Follow existing API boundaries under `server/routes/` (auth, users, friends, status, events, chat, notifications, location, meta) instead of introducing new service layers.
- Avoid speculative abstractions unless required by immediate needs.

5. Protect secrets and auth posture.
- Do not log secret values.
- Treat `.env` values as sensitive and avoid persisting tokens in logs/tests.
- In production, require bearer-token auth and do not rely on `x-user-id` fallback; only use `ALLOW_DEV_AUTH_FALLBACK=true` for explicit local development flows.
- Do not relax auth or security controls for convenience.

6. Before closing meaningful tasks, propose a `MEMORY.md` update.
- Include: changes, reason, validation commands, and caveats.
