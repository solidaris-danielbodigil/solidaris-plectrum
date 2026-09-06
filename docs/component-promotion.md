# Promoting an app component into the design system

Every component carries `governance: { status, owner }` in its `.metadata.ts`
(`.ai/contracts/schema/component.metadata.ts`). Promotion is the move from
`candidate` (owned by an application team) to `core` (owned by `design-system`).
It is a core-team decision, taken when a proposal comes back with the
*system-level* answer — see Storybook → Get started / Contribute.

## Before promotion

1. **Propose first.** The application team asks the core team before building;
   the answer is *exists*, *system-level* or *app-specific*.
2. **Author in the application layer** while the API is still moving:
   `npm run pds:component -- --owner=<app>` scaffolds `status: 'candidate'`,
   the Storybook title is `Patterns/{App}/…`, feature tokens live in
   `01-settings/_settings.{feature}.scss` and alias semantic roles only.
3. Nothing under `Custom components/…` or `Shell/…` may carry another owner.

## The move (core team)

1. **Generic API and naming** — application vocabulary leaves the inputs, the
   BEM block and the docs copy.
2. **Tokens** — from the `proposals/{app}` Figma collection into Component or
   Semantic; from `_settings.{feature}.scss` into the shared settings files.
3. **Storybook** — title from `Patterns/{App}/…` to `Custom components/…` or
   `Shell/…`; `governance` becomes `status: 'core'`, `owner: 'design-system'`;
   `npm run generate-index` refreshes `.ai/contracts/index.json`.
4. **Pull request** with design-system review (`.ai/rules/07-version-control.md` §3)
   and a changeset. `@solidaris/ui` (and styles / plectrum if needed) publish on merge.
5. **In the application**, bump the DS packages (Renovate / Dependabot template in
   `tools/consumers/`), delete the local copy, import from `@solidaris/ui`.

Until step 3 the component belongs to the application team, whatever `libs/`
folder it sits in.

There is no cross-repo Storybook aggregation — Storybook stays in this repository
(`libs/ui/.storybook/main.ts`).
