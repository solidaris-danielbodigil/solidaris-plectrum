# Skills — 01 Design System Integration

---

## Table of Contents

1. [MCP Servers](#1-mcp-servers)
2. [Plectrum Design System](#2-plectrum-design-system)
3. [Figma UI Kit](#3-figma-ui-kit)
4. [Typography](#4-typography)
5. [Design Tokens](#5-design-tokens)
6. [MCP Query Workflow](#6-mcp-query-workflow)

---

## 1. MCP Servers

**Always query PrimeNG and Figma before implementing any component.** Query Storybook MCP when the catalogue is running.

| Server | URL | Use for |
|---|---|---|
| Figma | `http://127.0.0.1:3845/mcp` | Inspect Plectrum UI Kit nodes — extract tokens, spacing, typography, states |
| PrimeNG | `https://primeng.org/mcp` | Query component API, props, slots, variants, examples |
| Storybook | `http://localhost:6006/mcp` | Live catalogue — `docs-list`, `docs-show`, `stories-preview`. Needs `npm run storybook`. |

Order of operations:
1. **PrimeNG MCP** — does an existing component cover the need?
2. **Figma MCP** — extract exact design specs from the Plectrum UI Kit
3. **Storybook MCP** (when `npm run storybook` is up) — `docs-list` / `docs-show` before inventing a sibling
4. Only write custom code when none of the three cover the requirement. Offline fallback: `.ai/contracts/index.json`.

Storybook MCP does not scaffold (`pds:component` does) and does not run play / a11y tests (`test-run` needs `@storybook/addon-vitest`, which is not installed — use `npm run test-storybook`). Tools and decide-trees: `.ai/contracts/protocols/query-protocol.md`.

---

## 2. Plectrum Design System

| Topic | URL |
|---|---|
| Design system overview | https://plectrum.solidaris.be/5cba76f64/p/8028d1-plectrum-design-system |
| PrimeNG setup | https://plectrum.solidaris.be/5cba76f64/p/944759-installation/b/764648 |
| Tailwind setup | https://plectrum.solidaris.be/5cba76f64/p/944759-installation/b/069866 |
| Fonts | https://plectrum.solidaris.be/5cba76f64/p/944759-installation/b/414795 |
| Icons | https://plectrum.solidaris.be/5cba76f64/p/944759-installation/b/391c00 |
| Design tokens | https://plectrum.solidaris.be/5cba76f64/p/944759-installation/b/8143b5 |
| Plectrum theme | https://plectrum.solidaris.be/5cba76f64/p/7529b0-plectrum-theme |

---

## 3. Figma UI Kit

- **Main UI Kit**: https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=6961-92390
- This is the **SSOT for all visual decisions**
- Always inspect the Figma node via Figma MCP before implementing — do not guess at spacing or colour values
- Custom components file: `https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-·-Custom-components`

---

## 4. Typography

- **Base font size**: `1rem = 14px` (Plectrum base — not the browser default of 16px)
- **Display / Heading font**: `Agenda` — token: `--pds-font-agenda`
- **Body / Label font**: `Open Sans` — token: `--pds-font-open-sans`
- Font style token pattern: `--pds-text-{category}-{size}-{property}`
  - e.g. `--pds-text-body-md-size`, `--pds-text-heading-lg-family`, `--pds-text-label-sm-weight`
- **Never** hardcode `font-size`, `font-family`, or `line-height` — always use `--pds-text-*` tokens

---

## 5. Design Tokens

- Tokens are provided by the Plectrum PrimeNG theme via `providePlectrum()`
- All Solidaris tokens use the `--pds-*` prefix (controlled by `$pds-prefix` in `01-settings/_settings.prefix.scss`)
- Always reference **semantic** tokens — never primitive tokens when a semantic one exists
- Token hierarchy: **primitive** → **semantic** → **component**

```
Primitive:  --pds-color-gray-600    ← raw value — never use in components
Semantic:   --pds-color-text-muted  ← design intent — use this in components
```

---

## 6. MCP Query Workflow

### Figma MCP — what to extract

When inspecting a Figma node:
- Background colours → map to `--pds-color-*`
- Text colours → map to `--pds-color-text-*`
- Spacing values → map to `--pds-space-*`
- Icon sizes → map to `--pds-size-*` or `--pds-globals-icon-size`
- Border radius → map to `--pds-radius-*`
- Font family, size, weight, line-height → map to `--pds-text-*-*`
- Transition/animation → map to `--pds-transition-*`
- Figma variable names (e.g. `surface/50`, `spacing-300`) → note them in token comments

### PrimeNG MCP — what to confirm

- Does a component exist for this use case?
- What are the available props and slots?
- What CSS variables does it expose (`--p-*`)?
- Are there variants that cover the Figma states?

### Storybook MCP — what to confirm

Needs `npm run storybook`. When it is down, use `.ai/contracts/index.json`.

- `docs-list` — is this already a published page in the catalogue?
- `docs-show` / `docs-show-story` — props, Controls, and canvases for a sibling before writing CSF
- `get-storybook-story-instructions` — Storybook's own authoring rules, then apply `.ai/rules/03-storybook.md`
- `stories-find-by-component` / `stories-preview` — existing and new states
- Do **not** call `test-run`. Do **not** add a Control missing from `.metadata.ts` `props`.
