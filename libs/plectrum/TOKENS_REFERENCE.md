# Plectrum `tokens.json` — lookup reference

## Purpose

[`src/tokens.json`](src/tokens.json) is the **ingestion SSOT** (Figma DTCG dump). Style Dictionary (`npm run tokens:build`) emits `--pds-*` CSS variables (colors as hybrid `var(--p-*, <literal>)`). The PrimeNG preset is still plugin-produced TypeScript and is **validated**, not regenerated.

Use it when you need to answer: _“What value does Figma assign to this semantic role?”_

## Token sets (7 top-level keys)

| Figma set                      | Role                                                                    | Code location                                                        |
| ------------------------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Primitive/Mode 1`             | Raw palette (rose, blue, neutral, borderRadius, …)                      | `Plectrum_v1/ts/base.ts` → `primitive`                               |
| `Semantic Common/Mode 1`       | Cross-component semantics (surface scale, primary, text, focus ring, …) | `Plectrum_v1/ts/base.ts` → `semantic` + `semantic.colorScheme.light` |
| `Semantic Color Scheme/Light`  | Light-scheme color overrides                                            | `base.ts` → `colorScheme.light`                                      |
| `Component Common/Mode 1`      | Shared component tokens (button severities, list options, …)            | Component `*.ts` files + PrimeNG built-ins                           |
| `Component Color Scheme/Light` | Per-component light overrides                                           | Individual `Plectrum_v1/ts/*.ts`                                     |
| `App/Mode 1`                   | App-specific extensions                                                 | `Plectrum_v1/ts/extend.ts` (partial)                                 |
| `Custom/Mode 1`                | Solidaris custom (plectrum.\*, basic.solidaris, functional.link)        | `Plectrum_v1/ts/extend.ts`                                           |

`$metadata` lists set order for Style Dictionary / Figma export tooling.

## Lookup workflow

1. **Identify the role** — e.g. drawer shadow, panel border `#e7e7e7`, `surface.0`.
2. **Search `tokens.json`** — grep for the path fragment (`"drawer"`, `"panel-border"`, `"surface"`).
3. **Follow `{token.path}` chains** — `$value` may reference another token; resolve until you hit a hex/number.
4. **Map to code** — primitives → `base.ts` `primitive`; semantics → `base.ts` `semantic` / `colorScheme`; app custom → `extend.ts`.
5. **PDS CSS** — `npm run tokens:build` emits `*.generated.scss` (`--pds-*`, colors as `var(--p-*, <literal>)`). Hand-authored extras stay in the non-generated counterparts. Runtime preset default is **v1**.

### Example: `surface.0` (white)

```json
// Semantic Color Scheme/Light → surface → 0
"$value": "{extremes.white}"
```

Figma aliases `extremes.white` → `#ffffff`. In v1 preset, define `primitive.extremes.white` or hardcode `#ffffff` on `colorScheme.light.surface.0` (see gap report).

### Example: drawer border

Figma `Component Color Scheme/Light → drawer` → `border.color` → typically `#e7e7e7`.

PDS exposes this as `--PDS-color-surface-border-drawer` / `--PDS-color-panel-border` in `_settings.colors-primitive.scss` and `_settings.colors-semantic.scss`.

## PrimeNG preset vs PDS

| Layer                                 | Responsibility                                                  |
| ------------------------------------- | --------------------------------------------------------------- |
| **PrimeNG preset** (`Plectrum_v1/ts`) | Emits `--p-*` CSS variables for PrimeNG components              |
| **PDS SCSS** (`libs/styles`)          | BEMIT components, overrides, semantic aliases (`--pds-color-*`) |

Apps consume both. A token can be correct in PDS but missing in the preset (or vice versa).

## Audit scripts

```bash
npm run tokens:audit
npm run tokens:validate-preset
```

`tokens:audit` is the three-way Figma / v1 preset / SCSS detector (blocking in CI).
`tokens:validate-preset` checks every `{token.path}` in `Plectrum_v1/ts` against `tokens.json`.
The older `libs/plectrum/scripts/audit-preset-refs.mjs` scan still exists for gap-report notes.

## Version toggle (runtime)

| Key                                        | Values         | Default                                                    |
| ------------------------------------------ | -------------- | ---------------------------------------------------------- |
| `solidaris-plectrum-preset` (localStorage) | `v0.6` \| `v1` | **`v1`** (`resolvePresetVersion()` in `preset-storage.ts`) |

Set via top-nav avatar menu or Storybook toolbar; requires full reload (PrimeNG preset is bootstrap-bound).
