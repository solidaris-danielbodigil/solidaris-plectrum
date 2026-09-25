---
"@solidaris/ui": major
---

Move iSHARE-specific components out of the core entry point. Import `DelayPredictionCardComponent` and `TransactionsCicsModalComponent` from `@solidaris/ui/patterns/ishare` instead of `@solidaris/ui`.

Generate runtime exports from component governance and distribution metadata. Candidates remain local. Workspace metadata imports move to the generated Storybook registry or the colocated metadata source; they are not part of the Angular runtime API.
