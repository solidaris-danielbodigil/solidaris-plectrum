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

**Always query both MCP servers before implementing any component.**

| Server | URL | Use for |
|---|---|---|
| Figma | `http://127.0.0.1:3845/mcp` | Inspect Plectrum UI Kit nodes — extract tokens, spacing, typography, states |
| PrimeNG | `https://primeng.org/mcp` | Query component API, props, slots, variants, examples |

Order of operations:
1. **PrimeNG MCP** — does an existing component cover the need?
2. **Figma MCP** — extract exact design specs from the Plectrum UI Kit
3. Only write custom code when both MCPs confirm no existing solution covers the requirement

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
- **Display / Heading font**: `Agenda` — token: `--sds-font-agenda`
- **Body / Label font**: `Open Sans` — token: `--sds-font-open-sans`
- Font style token pattern: `--sds-text-{category}-{size}-{property}`
  - e.g. `--sds-text-body-md-size`, `--sds-text-heading-lg-family`, `--sds-text-label-sm-weight`
- **Never** hardcode `font-size`, `font-family`, or `line-height` — always use `--sds-text-*` tokens

---

## 5. Design Tokens

- Tokens are provided by the Plectrum PrimeNG theme via `providePlectrum()`
- All Solidaris tokens use the `--sds-*` prefix (controlled by `$sds-prefix` in `01-settings/_settings.prefix.scss`)
- Always reference **semantic** tokens — never primitive tokens when a semantic one exists
- Token hierarchy: **primitive** → **semantic** → **component**

```
Primitive:  --sds-color-gray-600    ← raw value — never use in components
Semantic:   --sds-color-text-muted  ← design intent — use this in components
```

---

## 6. MCP Query Workflow

### Figma MCP — what to extract

When inspecting a Figma node:
- Background colours → map to `--sds-color-*`
- Text colours → map to `--sds-color-text-*`
- Spacing values → map to `--sds-space-*`
- Icon sizes → map to `--sds-size-*` or `--sds-globals-icon-size`
- Border radius → map to `--sds-radius-*`
- Font family, size, weight, line-height → map to `--sds-text-*-*`
- Transition/animation → map to `--sds-transition-*`
- Figma variable names (e.g. `surface/50`, `spacing-300`) → note them in token comments

### PrimeNG MCP — what to confirm

- Does a component exist for this use case?
- What are the available props and slots?
- What CSS variables does it expose (`--p-*`)?
- Are there variants that cover the Figma states?
