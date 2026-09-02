## Plan: CSS-First Token Consumption Surface

Amendment to [plan-bidirectionalFigmaRepoTokenPipeline.prompt.md](.github/prompts/plan-bidirectionalFigmaRepoTokenPipeline.prompt.md) — replaces its Phase 2 steps 7–8, adds a prefix migration and a Storybook phase. The preset TS stays a build artifact nobody hand-edits; `var(--pds-*)` plus `o-*`/`c-*`/`u-*` remain the only surface a dev touches. ITCSS and BEMIT are untouched because the preset emits **custom properties only** — it owns no class names outside `.p-*`.

**Steps**

**Phase 0 — Confirm the second Figma source** *(blocks Phase B; parallel with Phase A)*
1. Export variables from Figma file `jH0paYnBCco2Ye6ysNcWrr` (PLECTRUM · Foundations). Confirm the Display/Heading/label/Body type scale and the 8pt spacing scale exist as **variables**, not text styles — text styles can't be exported through the variables API, and if that's what they are, foundations stay code-owned with Figma as reference. This single answer decides Phase B's scope.

**Phase A — Prefix migration** *(blocks Phase B)*
2. Rename the 121 unprefixed declarations across [_settings.spacing.scss](libs/styles/src/01-settings/_settings.spacing.scss), [_settings.typography-primitive.scss](libs/styles/src/01-settings/_settings.typography-primitive.scss), [_settings.typography-semantic.scss](libs/styles/src/01-settings/_settings.typography-semantic.scss), [_settings.grid.scss](libs/styles/src/01-settings/_settings.grid.scss) to `--#{$pds-prefix}-*`.
3. Add `01-settings/_settings.legacy-aliases.scss` re-declaring the bare names as `var(--pds-*)`, forwarded **last** in [_settings.core.scss](libs/styles/src/01-settings/_settings.core.scss), marked deprecated with a removal target. *Depends on 2.*
4. Repoint consumers: the `$spacing-scale` map, `$layout-spacing` in [_tools.spacing.scss](libs/styles/src/02-tools/_tools.spacing.scss), the objects layer, `04-elements`, all `06-components`, apps and libs/ui. **Object class names like `o-layout--gap-2` do not change — zero template churn.** *Depends on 2.*
5. CI grep guard rejecting new bare `--spacing-`/`--text-`/`--font-`/`--line-height-` declarations outside the legacy file. *Depends on 3.*

**Phase B — Hybrid emitter** *(depends on Phases 0 + A)*
6. `tools/tokens/alias-map.json` — explicit, reviewed `--pds-color-*` → `--p-*` map. Absent = literal.
7. Style Dictionary formatter emitting two shapes: mapped becomes `--pds-color-brand: var(--p-primary-600, <literal>)`, unmapped becomes a plain literal. The fallback literal is **generated from tokens.json**, never hand-typed — that's what makes aliasing safe before Angular bootstraps and drift-free at the same time. *Depends on 6.*
8. Emit `*.generated.scss` for colors-primitive, colors-semantic, radius, shadows, transitions, focus (plus spacing/typography if step 1 says yes). Prefix, borders, globals, grid maps, breakpoints, the ~20 feature settings files and all 6 PrimeNG bridges stay hand-authored. *Depends on 7.*
9. `npm run tokens:build && git diff --exit-code` in CI. *Depends on 8.*

**Phase C — Storybook** *(depends on Phase B step 8)*
10. Third SD target: `libs/ui/src/storybook/tokens.generated.ts` — `{ name, cssVar, category, group, figmaRef, primeNgVar? }`.
11. `libs/ui/src/storybook/token-table.component.ts` — standalone component that takes a category, reads the manifest for metadata, and resolves each value **live** via `getComputedStyle(document.documentElement)`. Renders a visible warning when a mapped `--p-*` resolves empty, which doubles as an alias-regression detector. *Depends on 10.*
12. Foundation stories in [libs/ui/src/foundations](libs/ui/src/foundations) for colors, typography, spacing, radius, shadows, transitions, focus. These must be **stories, not raw MDX blocks** — `--p-*` only exists inside a bootstrapped Angular context. *Depends on 11.*
13. Component Docs pages render a "Tokens consumed" table by joining each `.metadata.ts` `tokens.consumed` array against the manifest — the contract already exists, nothing new to author. *Depends on 10.*
14. Fix `resolvePresetVersion()` in [preset-storage.ts](libs/plectrum/src/lib/preset-storage.ts) defaulting to v0.6 while [TOKENS_REFERENCE.md](libs/plectrum/TOKENS_REFERENCE.md) claims v1, and correct the Storybook config path in [copilot-instructions.md](.github/copilot-instructions.md) (`storybook/.storybook/main.ts` → `libs/ui/.storybook/main.ts`). *Parallel with 10–13.*

**Phase D — Guardrails** *(parallel with Phase C)*
15. Extend the parent plan's drift auditor: fail if an alias-map entry targets a `--p-*` the resolved preset never emits.
16. Lint rules — no `--p-*` declarations outside `01-settings/_settings.{component}.scss`; no `$dt`/`dt`/`usePreset`/`updatePreset` imports from `@primeuix/themes` in apps or libs/ui. This is what makes "CSS is the API" enforceable rather than cultural.
17. Strip the dead `@apply`/Tailwind guidance from `.ai/rules/` and `.github/copilot-instructions.md` — Tailwind isn't installed, so that guidance is actively misleading agents.

**Relevant files**
- [libs/plectrum/src/lib/index.ts](libs/plectrum/src/lib/index.ts) — the *only* place the preset is consumed; the proof that TS never leaks to devs
- [libs/plectrum/src/tokens.json](libs/plectrum/src/tokens.json) — PrimeNG tree only; no Plectrum type/spacing scale
- [_settings.core.scss](libs/styles/src/01-settings/_settings.core.scss) — `@forward` order; generated files slot in, legacy aliases go last
- [_settings.accordion.scss](libs/styles/src/01-settings/_settings.accordion.scss) — the bridge pattern to preserve verbatim (45 of the 74 `--p-*` overrides)
- [_tools.spacing.scss](libs/styles/src/02-tools/_tools.spacing.scss), [_objects.layout.scss](libs/styles/src/05-objects/layout/_objects.layout.scss) — consume the scale maps; class names unaffected
- [libs/ui/.storybook/main.ts](libs/ui/.storybook/main.ts), [libs/ui/.storybook/preview.ts](libs/ui/.storybook/preview.ts) — glob and the `providePlectrum` decorator
- [libs/ui/src/foundations/iconography.stories.ts](libs/ui/src/foundations/iconography.stories.ts) — the quality bar and structure to match for new foundation pages

**Verification**
1. Stub `providePlectrum()` out of one story — the token table must still render every value from generated fallbacks. This is the test that proves hybrid aliasing is pre-bootstrap safe.
2. Break one `alias-map.json` entry deliberately; step 15 must exit non-zero and name that token.
3. Computed-style snapshot of `c-nav-shell` and `c-affiliate-overview-card` before/after Phases A and B — byte-identical or design-approved.
4. Post-Phase-A grep: zero `var(--spacing-`, `var(--text-`, `var(--font-` outside the legacy alias file.
5. Toggle the Storybook v0.6↔v1 selector — aliased colour swatches change, foundation swatches don't. Confirms the hybrid boundary is where you think it is.
6. `npm run tokens:build && git diff --exit-code`, then `npm run build-storybook`, `npm run build`, `npm test`; a11y addon clean on new pages.

**Decisions**
- Hybrid: colours alias `var(--p-*)` with generated literal fallbacks; foundations and component tokens generated/authored standalone.
- Prefix migration lands **before** generation, legacy aliases survive one release.
- Storybook takes metadata from the generated manifest, values from live computed styles.
- `libs/ui/.storybook/temp_guidelines/` (39 files) untouched — out of scope.
- Excluded: dark mode, v0.6 retirement, PrimeUI mapping rebuild, Nx.

**Further Considerations**
1. **Dark mode is the hidden cost of the hybrid.** v1 authors only `colorScheme.light`, so nothing switches today — but the moment a dark branch lands, aliased colours will switch and generated literals plus unmapped tokens will not. Recommend confirming dark mode stays out of scope, or moving to fully-generated colours with a `.dark` block emitted alongside.
2. **`alias-map.json` needs an ownership rule.** Option A: manual, reviewed on change. Option B: CI warns when a `--pds-color-*` resolves to the same tokens.json node as an unmapped `--p-*` (auto-suggests entries). Recommend B — it keeps the map honest without making it a chore.
3. **Phase 0 may split the SSOT story.** If the Foundations file turns out to be text styles rather than variables, spacing and typography can't be Figma-SSOT via the API at all. Options: promote them to Figma variables (designer work, one-off), or accept code-ownership for the foundations layer and document Figma as reference-only there. Recommend raising it with the designer during Phase 0 rather than after.
