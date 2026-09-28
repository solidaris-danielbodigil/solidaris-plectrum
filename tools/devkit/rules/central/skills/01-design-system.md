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
| Figma | `http://127.0.0.1:3845/mcp` | Inspect Custom components candidates and PrimeNG 21 variables. Write each onto its own Figma **branch** via `use_figma` (never either main file) |
| PrimeNG | `https://primeng.org/mcp` | Query component API, props, slots, variants, examples |
| Storybook | `http://localhost:6006/mcp` | Live catalogue — `docs-list`, `docs-show`, `stories-preview`. Needs `npm run storybook`. |

Order of operations:
1. **PrimeNG MCP** — does an existing component cover the need?
2. **Figma MCP** — extract candidate specs from Custom components and variables from PrimeNG 21
3. **Storybook MCP** (when `npm run storybook` is up) — `docs-list` / `docs-show` before inventing a sibling
4. Only write custom code when none of the three cover the requirement. Offline fallback: `.ai/contracts/index.json`.

Storybook MCP does not scaffold (`pds:component` does). Its `test-run` uses the installed `@storybook/addon-vitest` runner for local feedback; the gate is `npm run test-storybook` (`process.json` → `capabilities.storybookMcp`). Tools and decide-trees: `.ai/contracts/protocols/query-protocol.md`.

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

- **PrimeNG 21 and all token variables**: https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-
- **Component candidates and design-origin proposals**: https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components
- Always inspect the Figma node via Figma MCP before implementing — do not guess at spacing or colour values
- Custom components file: `https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-·-Custom-components`
- **Writes** go to separate Figma branches: PrimeNG 21 for variables and Custom components for candidates, never either main file. Default: agent + Figma MCP. Fallback for tokens: Plectrum tokens plugin. A designer may start the component before code exists. Historical transport decision: `.ai/decisions/2026-09-12-repo-to-figma-agent-and-plugin.md`

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
- `test-run` is local feedback only; finish with `npm run test-storybook`. Do **not** add a Control missing from `.metadata.ts` `props`.

### Writing to Figma (repo → UI Kit)

Figma MCP `use_figma` is the same Plugin API as the Plectrum tokens plugin. Use it when an agent session is running.

1. `npm run tokens:propose` — `proposed.dtcg.json` is the catalog, not the write list.
2. Open (or ask a Full-seat designer to create) the branch `proposals/{app}`. Figma has no API for branch creation.
3. On a PrimeNG 21 token branch, upsert **selected** writable tokens only. Refuse both main file keys, never retype or delete, and bind `codeSyntax.WEB` to `var(--pds-…)`.
4. On a **separate Custom components branch**, build the component from reviewed Core code or inspect an existing design-team proposal. Bind published PrimeNG 21 variables; do not paint hex from a screenshot. A Storybook capture is a visual check only.
5. A designer may draw the component by hand instead. Merge and publish stay human.

When no agent is available, a designer runs the Plectrum tokens plugin (`tools/figma-plugin`) for tokens only.
