# Token pipeline

`libs/plectrum/src/tokens.json` is the ingestion SSOT. Style Dictionary emits `--pds-*` (colors as hybrid `var(--p-*, <literal>)`).

| Script                 | npm                      | Notes                                                                                                                                                                                                                                                |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resolve-dtcg.mjs`     | `tokens:resolve`         | Flatten the DTCG sets, resolve `{alias}` chains. Understands the PrimeUI plugin's quoted segments (`{scale."1"}`)                                                                                                                                    |
| `audit-drift.mjs`      | `tokens:audit`           | Figma / v1 / SCSS + alias-map breaks. Blocking in CI. `--json` writes a summary                                                                                                                                                                      |
| `validate-preset.mjs`  | `tokens:validate-preset` | Every `{token.path}` in v1 must resolve. Gaps in `audit-allowlist.json` (code-owned) warn; anything else fails. `--json` writes a summary                                                                                                            |
| `check-prefix.mjs`     | `tokens:check-prefix`    | No new bare `--spacing-` / `--text-` / `--font-` / `--line-height-` decls                                                                                                                                                                            |
| `build.mjs`            | `tokens:build`           | Hybrid Style Dictionary → `*.generated.scss` + `tokens.generated.ts`. Shadows accept expanded leaves or composite objects                                                                                                                            |
| `report.mjs`           | `tokens:report`          | Markdown + JSON + TS summary of one sync: changed values vs `--base` (git HEAD locally, `main` in CI), check results, promotion status. Feeds the job summary, the promotion PR body and (`--ts`) the Storybook page Docs/Token pipeline/Sync status |
| `notify-figma.mjs`     | `tokens:notify-figma`    | Posts the report as a comment thread in the Plectrum UI Kit (`FIGMA_TOKEN` with `file_comments:write`). Dry-run default, `--post` in `tokens-sync.yml`. Comments are annotations, not design data                                                    |
| `lint-usage.mjs`       | `tokens:lint`            | `--p-*` decls, PrimeUI runtime imports, unknown `--pds-*`. `--strict` adds hex/px                                                                                                                                                                    |
| `pull-figma.mjs`       | `tokens:pull-figma`      | Variables API safety net (`FIGMA_TOKEN` with `file_variables:read`). **Enterprise only — parked** on the Organization plan                                                                                                                           |
| `propose-to-figma.mjs` | `tokens:propose`         | Code-only tokens → `proposed.dtcg.json`. Works on every plan; the file is what a designer (or a future plugin) applies in Figma                                                                                                                       |
| `apply-to-figma.mjs`   | `tokens:apply`           | Branch-only write, **dry-run default**, `--only` required. Aborts if `proposals/{app}` is missing. Never writes the main file. **Enterprise only — parked** (`file_variables:write`)                                                                 |

Foundations Phase 0: spacing and typography stay code-owned (`foundations-phase-0.md`).

Plugin staging: `libs/plectrum/sync/` + `PLUGIN_SETUP.md`. Figma writes never target the main file.

Repo → Figma is parked: the Variables REST API is Enterprise only and Solidaris is on the Organization plan. Options (custom Figma plugin vs Enterprise) and the interim by-hand procedure: `PLUGIN_SETUP.md` → "Repo → Figma", decision record `.ai/questions/2026-09-07-repo-to-figma-transport.md`.
