## Plan: Bidirectional Figma ↔ Repo Token Pipeline (multi-repo design system)

Target topology is **one design-system repo** (plectrum + styles + ui + storybook) publishing versioned packages, consumed by **N independent app repos**. That splits the problem in two: keep the DS repo internally consistent with Figma, and keep N consumers on a contract they can't silently drift from.

Make `tokens.json` the one ingestion point that everything downstream is generated from or validated against, so the three-way drift you already have becomes structurally impossible. Figma→repo runs through the PrimeUI Theme Generator's own GitHub sync + a Style Dictionary build; repo→Figma writes into a **Figma branch** so approval happens in Figma's native branch review, never directly into the main file. The PrimeUI theme generator keeps producing the preset TS — we validate its output rather than rebuild its PrimeNG mapping.

Tokens Studio is ruled out. The plugin's built-in GitHub sync becomes the Figma→repo transport: it pushes both the tokens file and the generated `theme/` directory straight to a branch, which removes the manual copy-paste of ~80 preset files entirely. The Figma REST API is kept only as a drift safety net, not as the ingestion path.

Going multi-repo adds a fourth drift axis the current plan didn't cover: **version drift**, where app repos sit on different published versions. Phases 4 and 6 exist for that.

**Steps**

**Phase 0 — Drift detection** *(do first; unblocks and de-risks everything after)*
1. Add `tools/tokens/resolve-dtcg.mjs` — flattens tokens.json and resolves `{alias}` chains across the 7 sets.
2. Add `tools/tokens/audit-drift.mjs` — three-way diff Figma / preset / SCSS. Reads the preset by importing its real default export via tsx instead of regex-scanning, which is strictly more accurate than today's `audit-preset-refs.mjs`. *Depends on 1.*
3. Wire `tokens:audit` into [ci.yml](.github/workflows/ci.yml) as non-blocking first, then blocking. *Depends on 2.*

**Phase 1 — Figma → repo transport via the plugin's GitHub sync** *(parallel with Phase 2 authoring)*
4. Configure the plugin's GitHub Settings: fine-grained PAT (Contents read+write, this repo only), **Branch set to a dedicated `design-tokens/sync` branch — never `main`**, and Tokens File / Theme Directory pointed at a staging path rather than directly over `Plectrum_v1/ts/`.
5. Add `.github/workflows/tokens-sync.yml` — triggers on push to that branch: run the Phase 0 audit and Phase 3 preset validation, then open a PR promoting staging → `libs/plectrum/`. Review happens as a normal PR diff. *Depends on 4.*
6. Add `tools/tokens/pull-figma.mjs` — re-scoped from ingestion to **safety net**: a scheduled `GET /v1/files/{key}/variables/local` that flags variables changed in Figma but never pushed through the plugin. Lower priority than 4–5.

**Phase 2 — Generate the SCSS token layer**
7. Activate the already-installed Style Dictionary: `tools/tokens/sd.config.mjs` plus a custom formatter emitting `--#{$pds-prefix}-*` (SD emits plain CSS vars, so the interpolation wrapper must be custom).
8. Generate primitives + semantics as `*.generated.scss`; keep feature and PrimeNG-bridge files hand-authored. Add a `git diff --exit-code` regeneration check. *Depends on 7.*

**Phase 3 — Preset validation + v0.6 retirement** *(depends on Phase 0)*
9. Add `tools/tokens/validate-preset.mjs` — every `{token.path}` must resolve against tokens.json, replacing the hardcoded `KNOWN_BLOCKERS` / `V06_ONLY` lists. Catches the `{extremes.white}` / `{branding.800}` bug class in CI, and now also gates every plugin push.
10. Delete `Plectrum_v0.6/`, simplify `providePlectrum()` and the Storybook toggle, fix the `#487395` leak. **Gated on design sign-off** — this changes production visuals.

**Phase 4 — Make the libraries publishable** *(can run in parallel with Phases 0–3; blocks the repo split)*
11. Add `ng-package.json` + a `build` target for `libs/ui` (Angular Package Format), and a `package.json` per library declaring `peerDependencies` on Angular and PrimeNG. None of the three are buildable today — `libs/ui` has no build target and `libs/plectrum` / `libs/styles` aren't registered projects at all.
12. Ship `@solidaris/styles` as SCSS source: `files` must include `src/**/*.scss`, relative `@use '../01-settings/...'` must still resolve inside the tarball, and consumers need `stylePreprocessorOptions.includePaths` pointing into `node_modules`.
13. Keep publishing registry-agnostic via `publishConfig` + a templated `.npmrc`, so Azure Artifacts now / Nexus for Core / GitHub Packages after the migration is a config change rather than a code change. Add changesets for automated versioning on merge. *Depends on 11.*
14. Add a **consumer smoke test** to CI: `npm pack` all three, install the tarballs into a throwaway Angular app, and build it. This is the only check that reliably catches missing exports, SCSS left out of the tarball, and peer-dep breaks before an app repo hits them. *Depends on 11–12.*

**Phase 5 — repo → Figma proposals, delivered as a Figma branch** *(now multi-tenant)*
15. Add `propose-to-figma` — diff code-declared vs Figma tokens; emit `proposed.dtcg.json` + report for code-only tokens (`--pds-color-emutnav-*`, `--pds-color-surface-75`). Ship it as a CLI bin from a published package so app repos run the same code instead of copying scripts.
16. Add `apply-to-figma` — resolve the target branch key via `GET /v1/files/:key?branch_data=true` (returns `mainFileKey` + `branches[] {key,name,...}`), then `POST /v1/files/:branchKey/variables`, which is documented to accept a branch key. Each app targets **its own branch (`proposals/{app}`) and its own Figma collection**, so N repos never contend. Dry-run by default; real write only via manual dispatch + Environment approval. **Abort if the named branch is absent — never fall back to the main file key**, or the approval gate is silently bypassed. *Depends on 15.*
17. Add a `LIBRARY_PUBLISH` webhook receiver to re-trigger the Phase 1 safety-net pull after the designer merges and publishes. Figma emits a dedicated `LIBRARY_PUBLISH` event for variables, which closes the loop without polling.

**Phase 6 — Keep N consumers in sync** *(depends on Phase 4)*
18. Add a Renovate/Dependabot config template for app repos so DS package bumps arrive as automatic PRs instead of waiting to be noticed.
19. Ship a token-usage linter in the same CLI so app repos fail CI on hardcoded hex/px or unknown `--pds-*` names — the rule that's currently only enforced by convention.
20. Define the component promotion path: app-authored component → PR into the DS repo → published → app deletes its copy and imports from `@solidaris/ui`. Storybook in the DS repo then documents every shared component, so no cross-repo story aggregation is ever needed.

**Relevant files**
- [tokens.json](libs/plectrum/src/tokens.json) — becomes the live ingestion artifact instead of dead reference
- [audit-preset-refs.mjs](libs/plectrum/scripts/audit-preset-refs.mjs) — superseded by real alias resolution
- [preset-storage.ts](libs/plectrum/src/lib/preset-storage.ts), [index.ts](libs/plectrum/src/lib/index.ts) — v0.6 removal
- [_settings.core.scss](libs/styles/src/01-settings/_settings.core.scss) — `@forward` order for generated files
- [_settings.colors-primitive.scss](libs/styles/src/01-settings/_settings.colors-primitive.scss), [_settings.radius.scss](libs/styles/src/01-settings/_settings.radius.scss) — become generated
- [_settings.delay-prediction-card.scss](libs/styles/src/01-settings/_settings.delay-prediction-card.scss) — hardcoded `#487395` leak
- [ci.yml](.github/workflows/ci.yml), [package.json](package.json) — script + CI wiring
- [index.ts](tools/generators/sds-component/index.ts) — codegen style precedent to follow

**Verification**
1. `audit-drift.mjs` must **exit non-zero and name radius md/lg + the primary ramp before any fix** — proving the detector actually catches known drift rather than trivially passing.
2. `npm run tokens:build && git diff --exit-code` on generated SCSS.
3. Computed-style snapshot of a sample component before/after generation — identical, or differences explicitly design-approved.
4. `npm run build-storybook`, `npm run build`, `npm test` all still pass.
5. `apply-to-figma --dry-run` prints the payload and the resolved branch key with zero network writes.
6. Point the first real apply at a throwaway branch and confirm the main file's variables are untouched.
7. Consumer smoke test: install the packed tarballs into a scratch Angular app and build it — must succeed with no path aliases present, proving the packages stand alone.
8. Build Storybook against the packed tarballs, not source, and confirm it renders — this is what catches packaging bugs before an app repo does.

**Decisions**
- Topology: one DS repo (plectrum + styles + ui + storybook) + N app repos consuming published packages.
- Registry stays abstracted behind `.npmrc` + `publishConfig`: Azure Artifacts now, Nexus for Core/SolidarIT, GitHub Packages after the migration.
- Releases are automated on merge via changesets.
- **Storybook lives in the DS repo and runs in two modes**: source for local dev (fast HMR), packed tarballs in CI (documents the actually-released contract).
- **App-proposed custom tokens land in a per-app collection inside the same Figma UI Kit file**, not a separate file.
- App-authored components are promoted into the DS repo on approval and deleted from the app.
- Figma stays SSOT for primitives/semantics; component tokens are code-owned.
- repo→Figma never writes to the main file; it writes to a branch and approval happens in Figma's native branch review/merge flow.
- Preset TS remains plugin-produced and validated, not generated.
- Tokens Studio is not adopted. The PrimeUI theme generator stays the export tool, and its GitHub sync is the Figma→repo transport; the REST API is a drift safety net only.
- Out of scope: rebuilding the PrimeUI mapping, dark mode, Nx migration.

**Further Considerations**
1. **Same Figma file for app tokens is the load-bearing choice.** Figma variables can only alias **within a file**, and the API explicitly refuses to update remote variables — "you can only update variables in the file where they were originally created." A separate Figma file per app would mean app tokens could not alias core semantics (`ishare/card/bg` → `{surface.50}`) without a publish/subscribe hop, and could not be written the same way. Per-app *collections* in the shared file keep aliasing and promotion cheap while still isolating each app's namespace.
2. **The plugin sync will overwrite the theme directory — still the main risk.** The gap report shows preset files have been hand-fixed (`{extremes.white}`, `{branding.800}`). If the plugin rewrites `theme/` on every push, those fixes silently vanish. Decide between treating the preset as truly generated (fix upstream in Figma, keep local overrides confined to the existing `extend.ts` seam) or keeping a documented patch layer applied during promotion. The staging path is what makes either option safe.
3. **Confirm these plugin behaviours before building Phase 1** — they change the promotion step and can't be determined from the settings panel: does it commit directly or open a PR; does it overwrite the whole theme directory or merge; what file layout does it write under `theme/`; is the tokens file the same DTCG shape as today's `tokens.json`; and is the sync push-only or can it also pull.
4. **Prefix migration gets more expensive after the split, not less.** Typography and spacing currently emit *unprefixed* `--spacing-*` / `--text-*` consumed widely across `06-components`. Once N app repos depend on those names, renaming becomes a coordinated multi-repo migration. Strongly recommend doing the prefix migration — with legacy aliases for one release — **before** the repos are split.
5. **The PAT is a personal credential.** It lives in the designer's local plugin storage and commits land under their identity, so scope it fine-grained to the DS repo with Contents read+write, and rotate it on offboarding. Pointing Branch at `main` would push unreviewed generated code straight to production.
6. **Figma branch creation stays manual — there is no API for it.** Creating a branch is a UI action (Full seat, Organization/Enterprise). With per-app proposal branches, each app needs its branch created once before its pipeline can run.
7. **Publishing can't happen from a Figma branch.** Variables must be merged to main and published there before other files see them: CI writes to branch → designer reviews/merges → designer publishes → `LIBRARY_PUBLISH` → CI re-pulls. The publish step is unavoidably human.
8. **API constraints to design around.** `POST variables` is Tier 3 rate-limited, capped at a 4MB body, and atomic (any validation failure = 400, nothing persisted). Figma variable names cannot contain `.`, `{`, or `}` — dotted token paths must be mapped to Figma's `/` grouping on the way out. Collections cap at 5000 variables and 40 modes, which per-app collections stay well under.
9. **v0.6 retirement is a visual change, not a refactor.** Radius and the primary ramp genuinely differ, so apps will look different. Best done while still a monorepo — afterwards it becomes N coordinated upgrades. Worth confirming whether v1's values or the current v0.6 rendering is the intended design.
