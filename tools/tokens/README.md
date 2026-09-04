# Token pipeline

`libs/plectrum/src/tokens.json` is the ingestion SSOT. Style Dictionary emits `--pds-*` (colors as hybrid `var(--p-*, <literal>)`).

| Script | npm | Notes |
|---|---|---|
| `resolve-dtcg.mjs` | `tokens:resolve` | Flatten 7 DTCG sets, resolve `{alias}` chains |
| `audit-drift.mjs` | `tokens:audit` | Figma / v1 / SCSS + alias-map breaks. Blocking in CI |
| `validate-preset.mjs` | `tokens:validate-preset` | Every `{token.path}` in v1 must resolve. Non-blocking until tokens.json grows |
| `check-prefix.mjs` | `tokens:check-prefix` | No new bare `--spacing-` / `--text-` / `--font-` / `--line-height-` decls |
| `build.mjs` | `tokens:build` | Hybrid Style Dictionary → `*.generated.scss` + `tokens.generated.ts` |
| `lint-usage.mjs` | `tokens:lint` | `--p-*` decls, PrimeUI runtime imports, unknown `--pds-*`. `--strict` adds hex/px |
| `pull-figma.mjs` | `tokens:pull-figma` | Variables API safety net (`FIGMA_TOKEN`) |
| `propose-to-figma.mjs` | `tokens:propose` | Code-only tokens → `proposed.dtcg.json` |
| `apply-to-figma.mjs` | `tokens:apply` | Branch-only write, **dry-run default**, abort if `proposals/{app}` is missing |

Foundations Phase 0: spacing and typography stay code-owned (`foundations-phase-0.md`).

Plugin staging: `libs/plectrum/sync/` + `PLUGIN_SETUP.md`. Figma writes never target the main file.
