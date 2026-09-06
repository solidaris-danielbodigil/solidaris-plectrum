# Core design-system team: who, where, and what is enforced

**Raised by:** component ownership audit (Storybook → Get started / Contribute, `governance` in `.metadata.ts`)
**Status:** open — blocks the enforcement half of the contribution model

## Context

The docs now say every change starts with a proposal to the core design-system team,
and every component carries `status` / `owner`. Two things the docs cannot decide:

## 1. Who is the core team, and where do proposals go?

- GitHub team handle (needed for `CODEOWNERS`, see below) and the people behind it
- Intake channel for proposals: GitHub issue template in this repo, a Teams channel, or both
- Once answered: name the channel on the Contribute page (Propose step) and in the Introduction cards

## 2. CODEOWNERS — turn rule 07 §3 into a required review

`.ai/rules/07-version-control.md` §3 requires a design-system review on pull requests
touching tokens or components under `libs/`. Nothing enforces it. Proposed
`.github/CODEOWNERS` once the team handle exists:

```
libs/ui/                              @solidaris/<design-system-team>
libs/styles/src/01-settings/          @solidaris/<design-system-team>
libs/plectrum/src/tokens.json         @solidaris/<design-system-team>
.ai/contracts/schema/                 @solidaris/<design-system-team>
```

Plus branch protection on `main`: require code-owner review.

## 3. PrimeNG restyles — confirm the revert

The audit decided the stock-PrimeNG restyles (no component of their own) go back to
stock. Before deleting the SCSS, the iSHARE team should confirm the on-screen impact:
default-size multiple autocomplete in the documents toolbar (`_components.autocomplete.scss`),
stock Bootstrap-icon alignment in `p-tag` (`_settings.tag.scss`), stock card-title spacing
(`_components.card.scss`), stock tab padding on the affiliate category tabs
(`_settings.tabs.scss`). The inventory stays on Docs / PrimeNG customizations.

## Decision needed from

Design-system owner.
