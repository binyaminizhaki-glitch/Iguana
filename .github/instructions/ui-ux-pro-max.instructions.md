---
applyTo: "src/**,index.html"
description: "Use when building or modifying UI components, pages, visual styles, or user interaction flows in this repo."
---

# UI UX Pro Max Rules

Apply these standards to all frontend work.

## Visual Intent

- Build intentional interfaces, not default boilerplate.
- Maintain a coherent style direction across typography, spacing, color, and motion.
- Keep interactions obvious and predictable.

## Accessibility First

- Maintain visible keyboard focus states.
- Ensure text and UI contrast are readable for light-mode defaults.
- Use semantic HTML where possible and accessible labels for controls.
- Respect reduced-motion preferences when adding transitions or animation.

## Conversion-Oriented UX

- Keep primary CTA obvious and supported by clear context.
- Reduce friction in key user flows (onboarding, confirmation, completion).
- Preserve trust cues (clarity, consistency, error prevention, clear feedback).

## Motion and Feedback

- Use subtle, purposeful transitions.
- Avoid distracting or decorative motion that does not aid comprehension.
- Prefer concise feedback on user actions (loading, success, error).

## Anti-Patterns to Avoid

- Random style mixing without a clear visual system.
- Hidden interactions (clickable elements that do not look interactive).
- Overly dense layouts that reduce scanability.
- Accessibility regressions caused by purely visual refactors.

## Frontend Delivery Checklist

- Layout is responsive at mobile and desktop breakpoints.
- Interactive elements have hover/focus/active feedback.
- Form errors and validation feedback are clear.
- UI changes do not break existing onboarding or mascot flows.
