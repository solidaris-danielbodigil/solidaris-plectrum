# Approved text and background colour pairs

**Raised by:** Foundations / Colors playground (C02)
**Status:** proposed — awaiting design sign-off

The Semantic Common page now shows a provisional table, measured in the browser from the live tokens (`pds-docs-recommended-pairs`). A pair appears only when it passes WCAG 2.1 AA for normal text. Sign off or replace that list. Do not treat a passing ratio as the design decision by itself.

## Context

The Colors Playground and Contrast story let consumers pair any semantic surface role with any semantic text role from the CSSOM. Contrast results are labelled by text size (AA normal, AA large, AAA normal). They are measurements, not a whole-component certification.

The design system does not currently publish which text/background combinations are **approved** for product UI. Inventing that list in Storybook would overstep design ownership.

## Question

Which semantic text and background token pairs are approved for:

- body / UI text on page, surface, content, form and overlay backgrounds
- inverse or on-primary text
- status text (success, danger, warning, info) on their subtle and solid surfaces

Until this is answered, Storybook keeps the CSSOM semantic lists and optional contrast exploration only. Do not present a pair as recommended solely because it passes a WCAG ratio.

## Once answered

Add the approved pairs to the Colors Playground (and Contrast, if useful) as the default / recommended set. Keep the current lists as an advanced exploration path.
