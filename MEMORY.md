# MEMORY

Use this file to preserve concise, reusable project memory across tasks.

## Entry Format

```
## YYYY-MM-DD - Task Summary

- Changes: ...
- Reason: ...
- Validation: ...
- Notes: ...
```

## Notes

- Keep entries short and factual.
- Record command truths, environment behavior, and pitfalls.
- Never include secrets or credentials.

## 2026-04-07 - Clerk remote schema migration executed

- Changes: Ran the remote Supabase Clerk-ID migration against project `mnfljotgilonjowtbjbo`, adapting it to the actual schema by converting `profiles.id` and all user-reference columns from `uuid` to `text`, rebuilding relevant foreign keys, and recreating RLS policies against `auth.jwt()->>'sub'`.
- Reason: First Clerk sign-up was blocked because `profiles.id` was still `uuid`, causing Clerk-style IDs like `user_*` to fail on insert/upsert.
- Validation: Verified via Supabase SQL that `profiles.id` and related user-reference columns are now `text`; verified a live `insert ... on conflict` probe with a Clerk-style ID succeeds when required profile fields are supplied.
- Notes: This project does not contain `consent_events` or `guardian_links`, so the applied migration path had to skip those objects instead of using the raw migration file unchanged.

## 2026-04-12 - Clerk auth hardening, mascot assets, and visual test tooling pushed to main

- Changes: Prepared the current working tree for `main`, including Clerk-focused auth and frontend updates, mascot asset additions, visual test tooling/docs, repo workflow docs, and a local ignore cleanup to keep IDE/temp artifacts out of git.
- Reason: Ship the current updated app state without polluting the repository with machine-local files and transient test output.
- Validation: `npm run lint`; `npm run lint:api`; `npm run build`; `npm run build:api`; `node tests.js`.
- Notes: `npm run test:integration:persistence` is still gated on `TEST_SUPABASE_JWT` and failed in this session only because that token was not set.

## 2026-04-13 - Removed floating iguana overlay above CTA

- Changes: Removed the absolute-positioned `Mascot` overlay that floated above the main "אני בחוץ עכשיו" button in `src/App.tsx`.
- Reason: The user wanted the iguana above the button gone, with minimal scope and no broader project scan.
- Validation: Ran `get_errors` on `src/App.tsx`; the reported TypeScript/JSX issues are pre-existing project-wide typing noise, not caused by this UI change.
- Notes: Kept the main button face and the rest of the onboarding/outside layout unchanged.
