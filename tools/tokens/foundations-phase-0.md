# Foundations Phase 0 — spacing / typography generation

**Date:** 2026-09-02
**Figma file:** `jH0paYnBCco2Ye6ysNcWrr` (PLECTRUM · Foundations)

## Check

1. Desktop MCP `get_variable_defs` was invoked against the open Figma context.
   Nothing was selected / the Foundations file was not the active document, so
   the MCP could not list variables for that file key.
2. `libs/plectrum/src/tokens.json` (PrimeUI plugin DTCG dump of the UI Kit)
   was flattened via `resolve-dtcg.mjs`. **No** token paths exist for:
   - `font.*` / `text.*` type-scale roles (`Display/*`, `Heading/*`, `label/*`, `Body/*`)
   - an 8-point `spacing.*` scale
   Typography tokens in Foundations are **text styles**, not variables.
   Spacing is code-owned (8pt grid in `_settings.spacing.scss`).

## Decision

Keep **spacing** and **typography** **code-owned**:

- Still prefixed `--pds-*` (Wave 2).
- Do **not** emit `*.generated.scss` for those layers from the Figma API
  or from `tokens.json`.
- Values stay in the hand-authored settings files. A future DTCG excerpt
  can be checked in if Foundations promotes these to variables.

Generated Style Dictionary targets (Wave 3): colors-primitive, colors-semantic,
radius, shadows, transitions, focus.
