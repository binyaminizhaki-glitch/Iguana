---
applyTo: "**"
description: "Use when implementing, validating, or troubleshooting changes in this repository through reproducible command execution."
---

# Terminal-First Workflow

## Execution Baseline

- Use repository scripts as the source of truth.
- Prefer command-based verification over assumptions.
- Keep command choices aligned with task impact.

## Primary Validation Commands

- `npm run lint`
- `npm run build`
- `node tests.js`

Use additional checks as needed:

- `npm run lint:api`
- `npm run build:api`
- `npm run test:integration:persistence`

## API and Environment Guardrails

- Confirm environment assumptions before API validation (`API_PORT`, Supabase keys).
- Never log or expose secret values.
- If running in fallback memory mode, state that explicitly in outcome notes.

## Command Reporting

- Summarize what was executed and why.
- Call out any command that could not be run, with the reason.
- Prefer deterministic command sequences others can reproduce.
