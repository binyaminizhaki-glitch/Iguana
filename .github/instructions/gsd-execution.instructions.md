---
applyTo: "src/**,server/**,tests.js"
description: "Use when implementing features or fixes with a shipping-focused, low-overhead approach."
---

# GSD Execution Rules

## Delivery Philosophy

- Ship working, production-ready increments.
- Prefer straightforward solutions over speculative architecture.
- Avoid over-engineering for hypothetical future requirements.

## Scope Discipline

- Touch only files relevant to the requested outcome.
- Reuse existing patterns before creating new abstractions.
- Keep API and UI changes tightly coupled to verified user value.

## Implementation Style

- Make the smallest safe change that fully resolves the task.
- Keep code readable and maintainable; avoid cleverness that hides intent.
- Preserve existing behavior unless the task explicitly changes it.

## Done Criteria

- The requested behavior works end-to-end.
- Existing critical flows are not regressed.
- Required checks run successfully for changed areas.

## No-Fluff Review Pass

Before finalizing, verify:

- No unnecessary files were changed.
- No dead code or debug leftovers remain.
- Naming and structure follow local codebase conventions.
