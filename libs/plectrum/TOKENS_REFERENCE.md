# Plectrum `tokens.json` — lookup reference

## Purpose

[`src/tokens.json`](src/tokens.json) is the **Figma DTCG export** (~33k lines) of the Plectrum UI Kit. It is a **read-only debugging reference** — not imported at runtime and not mirrored into preset or SCSS.

Use it when you need to answer: *“What value does Figma assign to this semantic role?”*

## Token sets (7 top-level keys)

| Figma set | Role | Code location |
|-----------|------|---------------|
| `Primitive/Mode 1` | Raw palette (rose, blue, neutral, borderRadius, …) | `Plectrum_v1/ts/base.ts` → `primitive` |
| `Semantic Common/Mode 1` | Cross-component semantics (surface scale, primary, text, focus ring, …) | `Plectrum_v1/ts/base.ts` → `semantic` + `semantic.colorScheme.light` |
| `Semantic Color Scheme/Light` | Light-scheme color overrides | `base.ts` → `colorScheme.light` |
| `Component Common/Mode 1` | Shared component tokens (button severities, list options, …) | Component `*.ts` files + PrimeNG built-ins |
| `Component Color Scheme/Light` | Per-component light overrides | Individual `Plectrum_v1/ts/*.ts` |
| `App/Mode 1` | App-specific extensions | `Plectrum_v1/ts/extend.ts` (partial) |
| `Custom/Mode 1` | Solidaris custom (plectrum.*, basic.solidaris, functional.link) | `Plectrum_v1/ts/extend.ts` |

`$metadata` lists set order for Style Dictionary / Figma export tooling.

## Lookup workflow

1. **Identify the role** — e.g. drawer shadow, panel border `#e7e7e7`, `surface.0`.
2. **Search `tokens.json`** — grep for the path fragment (`"drawer"`, `"panel-border"`, `"surface"`).
3. **Follow `{token.path}` chains** — `$value` may reference another token; resolve until you hit a hex/number.
4. **Map to code** — primitives → `base.ts` `primitive`; semantics → `base.ts` `semantic` / `colorScheme`; app custom → `extend.ts`.
5. **PDS primitives** — [`libs/styles/src/01-settings/_settings.colors-primitive.scss`](../styles/src/01-settings/_settings.colors-primitive.scss) is **independent** (hardcoded). Compare when auditing drift; do not auto-sync.

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

| Layer | Responsibility |
|-------|----------------|
| **PrimeNG preset** (`Plectrum_v1/ts`) | Emits `--p-*` CSS variables for PrimeNG components |
| **PDS SCSS** (`libs/styles`) | BEMIT components, overrides, semantic aliases (`--PDS-color-*`) |

Apps consume both. A token can be correct in PDS but missing in the preset (or vice versa).

## Audit script

```bash
node libs/plectrum/scripts/audit-preset-refs.mjs
```

Read-only scan of unresolved `{token.path}` references in `Plectrum_v1/ts/*.ts`. Output feeds [`PLECTRUM_V1_GAP_REPORT.md`](PLECTRUM_V1_GAP_REPORT.md).

## Version toggle (runtime)

| Key | Values | Default |
|-----|--------|---------|
| `solidaris-plectrum-preset` (localStorage) | `v1` \| `v0.6` | `v1` |

Set via top-nav avatar menu or Storybook toolbar; requires full reload (PrimeNG preset is bootstrap-bound).
