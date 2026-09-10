# Plectrum maintainer handoff pack — draft

Draft — 9 September 2026. Companion to `.cursor/plans/plectrum-storybook-audit-and-agent-plan.md` §5 (B04). Baseline: `main` @ `f152b62`, Angular 21.2.16, PrimeNG 21.1.9, Storybook 10.4.2, Node 24.13.0 locally.

Every runbook below states purpose, prerequisites, source-linked steps, expected outcome, failure/recovery, owner and verification date. **Owner** and **Verified** are left `unresolved` until the receiving team is named — they are filled during the rehearsal (B06), not guessed here. Commands are the ones in `package.json`; if a script is renamed, this page is stale and the script is right.

## 1. System map

| Part      | Path                                                                                           | Role                                                                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Apps      | `apps/ishare`, `apps/icrm`                                                                     | Consumers only. No shared logic.                                                                                                            |
| UI        | `libs/ui`                                                                                      | `@solidaris/ui` — Angular components, Storybook (`libs/ui/.storybook`), colocated `*.metadata.ts` contracts, `src/storybook/*` docs figures |
| Styles    | `libs/styles`                                                                                  | ITCSS SCSS `01-settings` → `08-trumps`; `*.generated.scss` come from `tokens:build`                                                         |
| Plectrum  | `libs/plectrum`                                                                                | `@solidaris/plectrum` — `providePlectrum()`, PrimeNG presets `Plectrum_v0.6` / `Plectrum_v1`, `src/tokens.json` (design-token SSOT)         |
| Tools     | `tools/tokens/*.mjs`, `tools/scripts/*`, `tools/generators/sds-component`, `tools/packaging/*` | Token pipeline, generated indexes, scaffold, pack + smoke                                                                                   |
| Contracts | `.ai/contracts/index.json` (generated), `.ai/contracts/schema/*.ts`, `.ai/rules/*.md`          | Machine-readable map and the rules agents and reviewers apply                                                                               |
| Upstream  | PrimeNG (`primeng/*`), Bootstrap Icons, Figma Plectrum UI Kit                                  | PrimeNG first; Figma is the visual SSOT                                                                                                     |

Source-of-truth map: visual decisions → Figma UI Kit; token values → `libs/plectrum/src/tokens.json` → `tokens:build` → `libs/styles/src/01-settings/*.generated.scss` + `libs/ui/src/storybook/tokens.generated.ts`; component contract → `{name}.metadata.ts` → `generate-index` → `index.json`; which tokens/classes exist → the compiled CSS (Storybook reads the CSSOM at runtime, `.ai/rules/10-css-ssot.md`).

Constraints: `1rem = 14px`; no `.p-*` overrides, only `--p-*` bridges scoped to a BEM wrapper; no styles outside `libs/styles`; no hand edits to any `*.generated.*`.

Owner: unresolved · Verified: unresolved

## 2. Local setup and contribution

Purpose: run the catalogue and change a component safely.

Prerequisites: Node `^20.19.0 || ^22.12.0 || ^24.0.0` (Angular 21 range; CI uses 20, Pages deploy uses 24), npm, Chrome (Karma). Optional: Cursor/VS Code with the repo agents (`.cursor/agents`, `.github/agents`).

Steps:

1. `npm install`
2. `npm run storybook` → http://localhost:6006 (runs `changelog:build` first)
3. Scaffold: `npm run pds:component -- --owner=<design-system|ishare|icrm>` — creates component (no colocated stylesheet), `.metadata.ts`, stories stub, `_components.{name}.scss` + `@forward`, regenerates `index.json`.
4. Implement per `.ai/contracts/protocols/component-creation.md`; every state has a story; tokens via `var(--pds-*)`.
5. Unit tests: `npx ng test ui --watch=false --browsers=ChromeHeadless`.
6. Story tests against the dev server: `npm run test-storybook` (play + a11y `error` level).
7. Add a changeset: `npm run changeset`.

Expected outcome: green local tests, Storybook shows the new page, `git diff` includes the regenerated `index.json`.

Failure/recovery: `index.json` diff in CI → run `npm run generate-index` and commit. Story a11y failure → fix the markup, never lower the a11y level. Windows file watcher stalls → restart `npm run storybook`.

Owner: unresolved · Verified: unresolved

## 3. Token change

Purpose: introduce, rename or retire a `--pds-*` token without breaking apps or Figma parity.

Two directions:

**Figma → code (designer-initiated).** The Figma plugin pushes to branch `design-tokens/sync` (`libs/plectrum/sync/tokens.json`). `.github/workflows/tokens-sync.yml` copies it to `libs/plectrum/src/tokens.json`, runs `tokens:build`, `tokens:audit` (blocking), `tokens:validate-preset` (advisory, gates theme promotion), writes `sync-report.generated.ts`, and opens/updates PR `tokens/promote-staging` → `main`. Review and merge the PR.

**Code → Figma (developer-initiated).** A component needs a value that is not a token: add it to the right `01-settings/_settings.{feature}.scss` aliasing a semantic role, list it in `tokens.consumed` of the component `.metadata.ts`, run `npm run tokens:lint`. Then `npm run tokens:propose` lists the new names for the designer to enter by hand in the Figma `proposals/{app}` collection. `tokens:apply` / `tokens:pull-figma` (Variables REST API) are **parked** — Enterprise-only; decision recorded in `.ai/questions/2026-09-07-repo-to-figma-transport.md`.

Validation before merge: `npm run tokens:audit && npm run tokens:check-prefix && npm run tokens:build && npm run tokens:lint`, then `git diff --exit-code -- libs/styles/src/01-settings/*.generated.scss libs/ui/src/storybook/tokens.generated.ts` must be clean (CI gate). Storybook → Foundations → Token contracts must show 0 broken.

Consumer impact: any renamed/removed token is a `minor` at least; a changeset is mandatory.

Recovery: revert the promotion PR; `tokens:build` is idempotent from `tokens.json`.

Access constraints: `FIGMA_TOKEN` secret and `FIGMA_FILE_KEY` / `FIGMA_SYNC_COMMENT_NODE_ID` variables enable the Figma comment step (non-blocking). Who owns them: unresolved.

Owner: unresolved · Verified: unresolved

## 4. Component change

Purpose: add or change a shared component.

1. Reuse decision — PrimeNG MCP first (`does it exist?`), Figma MCP for specs, custom only when neither covers it (`.ai/rules/04-primeng.md`).
2. Contract — `.metadata.ts` (`.ai/contracts/schema/component.metadata.ts`): usage, anti-patterns, `tokens.consumed`, a11y, props, `governance.status/owner`.
3. Styles — `libs/styles/src/06-components/_components.{name}.scss`; layout via `o-flex` / `o-layout` in the template.
4. Stories — one per state; docs figures are PrimeNG components (`.ai/rules/03-storybook.md`).
5. Tests — Karma spec + story play tests; a11y at `error`.
6. Docs — attached `.mdx` with purpose, example, API (from metadata), keyboard/a11y responsibilities, Figma link.
7. Promotion candidate → core: `docs/component-promotion.md`.
8. Compatibility review — public API change ⇒ changeset `minor`/`major`; regenerate `index.json`.

Owner: unresolved · Verified: unresolved

## 5. Release and upgrade

Purpose: version and publish `@solidaris/plectrum`, `@solidaris/ui`, styles.

Actual workflow: Changesets. `npm run changeset` on the feature branch. On merge to `main`, `.github/workflows/release.yml` (`changesets/action`) opens/updates the `chore(release): version packages` PR (`npm run changeset:version` = `changeset version` + `changelog:build`). Merging that PR runs `npm run release` (`changeset publish`) with `NPM_TOKEN`.

State today: no release has been published yet (What's new shows the pending changesets; `libs/*/package.json` at `0.1.0`). Whether `NPM_TOKEN` exists and where it points (npm registry vs internal) is **unresolved** — confirm before the first release. Until then consumers are served by packed tarballs: `npm run pack:libs` (→ `dist/packed/*.tgz`), smoke-tested by `npm run pack:smoke` and `npm run build-storybook:packed` in CI.

Consumer smoke after a release: install the new version in a throwaway app (the `pack:smoke` fixture in `tools/packaging` is the template), `providePlectrum()`, render one component, run the app tests.

Rollback: `npm deprecate` the bad version and publish a patch; never unpublish a version an app already pinned. Static Pages deploy: `deploy-ishare-pages.yml` redeploys from `main` — revert the offending commit.

Credentials: `NPM_TOKEN`, `GITHUB_TOKEN` (automatic), `FIGMA_TOKEN`, `CHROMATIC_PROJECT_TOKEN` (optional, gated by `vars.CHROMATIC_ENABLED`). Owner of each: unresolved. No secret values in documentation.

Owner: unresolved · Verified: unresolved

## 6. Quality gates and troubleshooting

What blocks (`.github/workflows/ci.yml`):

| Gate                                           | Command                                                    | Blocks                                  |
| ---------------------------------------------- | ---------------------------------------------------------- | --------------------------------------- |
| Token drift                                    | `npm run tokens:audit`                                     | yes                                     |
| Preset coverage                                | `npm run tokens:validate-preset`                           | no (`continue-on-error`)                |
| Bare token declarations                        | `npm run tokens:check-prefix`                              | yes                                     |
| Generated tokens committed                     | `npm run tokens:build` + `git diff --exit-code`            | yes                                     |
| Changelog feed committed                       | `npm run changelog:build` + `git diff --exit-code`         | yes                                     |
| Token usage lint                               | `npm run tokens:lint`                                      | yes                                     |
| Contracts index committed                      | `npm run generate-index` + `git diff --exit-code`          | yes                                     |
| Apps build                                     | `npm run build`                                            | yes                                     |
| Unit tests + coverage                          | `npm run test:coverage`                                    | yes                                     |
| Pack smoke                                     | `npm run pack:smoke`                                       | yes                                     |
| Story tests (smoke, play, a11y, coverage)      | `npm run build-storybook` then `npm run test-storybook:ci` | yes                                     |
| Cross-page navigation under the Pages sub-path | `npm run test-storybook:nav`                               | yes                                     |
| Storybook against packed tarballs              | `npm run build-storybook:packed`                           | yes                                     |
| Chromatic visual tests                         | `chromaui/action`                                          | only when `CHROMATIC_ENABLED == 'true'` |

`ng lint` has no target yet — there is no ESLint gate. Do not describe one.

Troubleshooting (maintainer):

- **Chunk-load error after navigating between Storybook pages on Pages** — a story rewrote the preview URL (an Angular Router with a real `Location`). Use `provideStoryRouter()` from `libs/ui/src/storybook/story-router.ts`; `npm run test-storybook:nav` reproduces the failure locally.
- **`--p-*` variables empty in a story** — `providePlectrum()` has not booted; the preview decorator in `libs/ui/.storybook/preview.ts` provides it — check the story does not override `applicationConfig` providers without it.
- **`git diff --exit-code` fails on generated files** — run the matching `tokens:build` / `changelog:build` / `generate-index` locally and commit.
- **Overlay clipped** — PrimeNG overlays need `appendTo="body"` inside scroll containers (see `pdsOverlayAppendTo()` in `libs/ui/src/storybook/storybook-preview-frame.ts`).
- **a11y `error` failure in test-storybook** — the violation is real; fix markup/labels, never the rule set.
- **Windows watcher stalls** — restart the dev server; not a code defect.

Accepted exceptions: recorded as `.ai/questions/*.md` with an owner; none are silent.

Owner: unresolved · Verified: unresolved

## 7. Open work

| Item                                         | State                                                         | Next action                                                  | Owner      |
| -------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| First npm release of `@solidaris/*`          | pending changesets, no publish yet                            | confirm `NPM_TOKEN` + registry, merge version PR             | unresolved |
| Code → Figma transport                       | parked (Enterprise API)                                       | designer hand-entry from `tokens:propose`; revisit plan tier | unresolved |
| Docs migration to the knowledge base         | ledger drafted (`docs/handoff/migration-ledger.md`)           | name destination + owners, then B07 cutover                  | unresolved |
| NL copy review                               | `.ai/questions/nl-copy-review.md`                             | native review of drafted NL strings                          | unresolved |
| Core-team intake / CODEOWNERS                | `.ai/questions/2026-09-06-core-team-intake-and-codeowners.md` | decide intake channel; add CODEOWNERS                        | unresolved |
| Profile drawer / card Figma parity           | `.ai/questions/profile-card-drawer-figma.md`                  | designer answer                                              | unresolved |
| Storybook R-findings not closed in this pass | see plan §2 table after B00–B05                               | per row                                                      | unresolved |

## 8. Support and ownership

Receiving teams, request channel, escalation route and backup maintainers: **unresolved — to be filled by the customer before cutover.** Do not invent people or response-time commitments. The proposal route consumers see today is Get started → Contribute (“request a change / report a problem”); whatever replaces it must be reachable from that page.

## Rehearsal record (B06)

To be run by a receiving maintainer, not narrated by the outgoing one:

- [ ] Clone, install, `npm run storybook` renders the catalogue.
- [ ] Scaffold a throwaway component with `pds:component`, run unit + story tests, discard.
- [ ] Follow one token change through `tokens:lint` / `tokens:build` diff gate without changing production.
- [ ] `npm run pack:libs && npm run pack:smoke` (release dry run).
- [ ] Locate the recovery procedure for a failed `tokens:audit` and for a broken Storybook build (this page §6).
- [ ] An application developer follows Get started → Use Plectrum in an app and renders one component; record every point that needed undocumented help.

Result, gaps found, date, participants: unresolved.
