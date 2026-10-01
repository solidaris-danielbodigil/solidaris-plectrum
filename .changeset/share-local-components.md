---
'@solidaris-danielbodigil/pds-devkit': minor
---

Make local components visible to Core. The evidence checklist of a new component gets a "Reuse potential (none / possible / likely) and why" line. The usage report now lists the team's local components with that estimate, and Find a component shows them under a new Local scope. Each toolkit release ships the other teams' local components (`@solidaris-danielbodigil/pds-devkit/local-components`): `plectrum scaffold` lists similar ones, and the agents check them before suggesting a new component.

There is no "rejected" proposal decision any more: teams own their components, so a proposal ends as approved-candidate, use-existing or app-specific. A submitted candidate that Core does not integrate is "kept-local" instead of "rejected".
