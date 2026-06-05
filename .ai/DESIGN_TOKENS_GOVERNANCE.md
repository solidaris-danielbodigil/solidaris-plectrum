# Plectrum / Solidaris — Design Tokens Governance

**Version 2.0** · Hybrid workflow for Figma, PrimeNG, SCSS, ITCSS, BEM and Storybook

> **Core principle:** Figma is the shared design reference. The repository is the controlled implementation layer. Storybook validates the result. No token change should reach production without review.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Core Principle](#2-core-principle)
3. [Source Responsibilities](#3-source-responsibilities)
4. [Recommended Workflow](#4-recommended-workflow)
5. [Token Layers](#5-token-layers)
6. [Naming Rules](#6-naming-rules)
7. [CSS Variable Strategy](#7-css-variable-strategy)
8. [PrimeNG / Plectrum Rules](#8-primeng--plectrum-rules)
9. [TypeScript Preset Rules](#9-typescript-preset-rules)
10. [SCSS, ITCSS and BEM Rules](#10-scss-itcss-and-bem-rules)
11. [Accessibility Rules](#11-accessibility-rules)
12. [Change Risk Levels](#12-change-risk-levels)
13. [Deprecation Rules](#13-deprecation-rules)
14. [Review Checklist](#14-review-checklist)
15. [Decision Rule](#15-decision-rule)
16. [Repository Structure (Living Reference)](#16-repository-structure-living-reference)
17. [Summary](#17-summary)
18. [Contract-Driven Development (CDD)](#18-contract-driven-development-cdd)
19. [AI Prompts](#19-ai-prompts)

---

## 1. Purpose

This document defines how design tokens are created, reviewed, implemented and maintained for the Plectrum design system used at Solidaris.

The goal is a safe, auditable bridge between designers working in Figma and the technical reality of PrimeNG, SCSS, ITCSS, BEM and a shared Angular component library.

- **Figma** remains the shared visual and design reference.
- **The repository** remains the implementation, validation and version-control layer.
- **PrimeNG** remains the vendor component system.
- **Plectrum/Solidaris** owns the design layer and governance decisions.
- **Storybook** is used for documentation, validation and team alignment.

---

## 2. Core Principle

| Layer | Role |
|---|---|
| **Figma** | Shared design reference |
| **Repository** | Controlled implementation |
| **Storybook** | Validation and documentation |
| **Review process** | Governance source of truth |

Figma should be easy for designers to understand and use. Code should be reliable, maintainable and reusable. The bridge between both must be reviewed and documented.

---

## 3. Source Responsibilities

### 3.1 Figma

- Token proposals and visual exploration
- Component variants and states
- Usage examples and design intent
- Visual validation of colors, typography, spacing, radius and elevation
- Shared understanding for designers who do not work directly in code

> Figma is the **design** source of truth. It must not automatically overwrite production tokens without review.

### 3.2 Repository

- CSS custom properties (`--sds-*`)
- SCSS `@use`, interpolation and token generation
- ITCSS organization and cascade control
- BEM naming for custom components and wrappers
- PrimeNG variable mappings (`--p-*`)
- Theme configuration (`providePlectrum()`)
- Accessibility checks
- Storybook documentation
- Pull requests and code review

> The repository is the **implementation** source of truth.

### 3.3 Storybook

- Token documentation
- Component state validation
- Visual review
- Regression checks
- Designer/developer handoff

Every meaningful token change must be visible and testable in Storybook.

---

## 4. Recommended Workflow

```
Figma proposal
  → token review
  → token export / sync
  → pull request
  → CSS / SCSS / PrimeNG mapping update
  → Storybook validation
  → merge
  → team communication
```

1. A designer proposes or updates a token in Figma.
2. The change is reviewed by the design-system owner or a technical reviewer.
3. The token is exported or synchronized into a reviewed settings file.
4. A pull request updates the implementation layer.
5. `--sds-*` custom properties and PrimeNG mappings are updated where needed.
6. Storybook is checked visually and functionally.
7. The change is merged and communicated.

---

## 5. Token Layers

### 5.1 Primitive Tokens

Raw values — describe **what** the value is, not how it is used. Never used directly in components.

```
--sds-color-green-500
--sds-color-gray-100
--sds-space-4
--sds-radius-md
--sds-font-size-md
```

### 5.2 Semantic Tokens

Describe design intent. These are what components should reference.

```
--sds-color-text-default
--sds-color-text-muted
--sds-color-surface-page
--sds-color-surface-default
--sds-color-brand
--sds-color-danger
--sds-color-border-focus
```

### 5.3 Component Tokens

Component-specific decisions. Should reference semantic tokens where possible.

```
--sds-text-body-md-size
--sds-text-heading-lg-family
--sds-space-form-x
--sds-space-form-y
--sds-focus-ring-color
```

---

## 6. Naming Rules

- Use lowercase names.
- Use stable, descriptive, intent-based names — not appearance-only names.
- Use `kebab-case` for CSS custom properties.
- Prefix all Solidaris/Plectrum tokens with `--sds-*`.
- Use dot notation in Figma; transform to `kebab-case` in CSS.
- Do not name tokens after a temporary screen, page or experiment.

**Good examples**
```
--sds-color-text-default
--sds-color-surface-page
--sds-color-action-primary-bg
--sds-space-form-x
--sds-radius-md
```

**Avoid**
```
--green-button
--nice-blue
--new-color
--color-for-dashboard-card
--rectangle-fill
```

---

## 7. CSS Variable Strategy

All Solidaris/Plectrum-owned variables use the `--sds-*` prefix. PrimeNG variables keep the `--p-*` prefix.

### Prefix configuration

The prefix is controlled by a single SCSS variable in `01-settings/_settings.prefix.scss`:

```scss
// libs/styles/src/01-settings/_settings.prefix.scss
$sds-prefix: 'sds' !default;
```

All settings files `@use 'settings.prefix' as *` and emit tokens via SCSS interpolation:

```scss
@use 'settings.prefix' as *;

:root {
  --#{$sds-prefix}-color-brand: var(--#{$sds-prefix}-color-primary-500);
}
```

To rename the prefix across the entire token system — change `$sds-prefix` in one place.

### Bridge pattern

```css
/* Solidaris primitive → Solidaris semantic → PrimeNG component */

:root {
  /* primitive */
  --sds-color-primary-500: #527191;

  /* semantic */
  --sds-color-brand: var(--sds-color-primary-500);

  /* PrimeNG mapping */
  --p-button-primary-background: var(--sds-color-brand);
}
```

**Prefer** mapping `--sds-*` to `--p-*`. **Avoid** overriding `.p-button` with hardcoded values or `!important`.

---

## 8. PrimeNG / Plectrum Rules

- Do not fight PrimeNG with unnecessary CSS overrides.
- Prefer token and CSS-variable mapping over hardcoded class overrides.
- Avoid `!important` except for exceptional, documented cases.
- Use the PrimeNG preset as an integration mechanism, not as the place where every design decision is manually authored.
- Keep the TypeScript preset small. Treat it as an adapter.

**Preferred**

```scss
.sds-form-field {
  --p-inputtext-border-color: var(--sds-color-border-default);
}

.sds-form-field--invalid {
  --p-inputtext-border-color: var(--sds-color-border-danger);
}
```

**Avoid**

```scss
.p-inputtext {
  border-color: #f1382b !important;
}
```

---

## 9. TypeScript Preset Rules

The PrimeNG TypeScript preset is an **adapter** — not the main design-token authoring layer.

- Use TypeScript to register the PrimeNG theme via `providePlectrum()`.
- Use TypeScript where PrimeNG requires runtime configuration.
- Avoid manually maintaining a large TS object of design decisions.
- Prefer SCSS/CSS for Solidaris visual design implementation.
- If a large preset file is generated, mark it as generated and do not manually edit it.

```
TS            = PrimeNG integration adapter
SCSS / CSS    = Solidaris visual design implementation
Figma         = shared design reference
```

---

## 10. SCSS, ITCSS and BEM Rules

### 10.1 ITCSS Layering

```
01-settings   design constants, SCSS variables, CSS custom properties
02-tools      mixins, functions, token generators — no CSS output
03-generic    reset, normalize, base box sizing
04-elements   native HTML element defaults
05-objects    layout patterns and structural objects     (prefix: o-)
06-components custom BEM components and PrimeNG wrappers (prefix: c-)
07-utilities  low-specificity utility classes            (prefix: u-)
```

Token definitions live in `01-settings`. PrimeNG mappings live in `06-components` or a dedicated theme layer.

### 10.2 BEM Rules

- Use BEM for all custom Plectrum components and wrappers.
- Use stable block names, clear elements and explicit modifiers.
- Do not mirror the full PrimeNG DOM with fragile selectors.
- Avoid deeply nested selectors.
- Keep specificity low.

```scss
.sds-card {}
.sds-card__header {}
.sds-card__body {}
.sds-card--highlighted {}

.sds-shell {}
.sds-shell__sidebar {}
.sds-shell__content {}
.sds-shell--collapsed {}
```

### 10.3 PrimeNG Selector Rules

- Prefer overriding PrimeNG variables instead of styling internal nested selectors.
- If a wrapper is needed, create a BEM block around the PrimeNG component.
- Avoid selectors that depend on unstable internal PrimeNG DOM.

---

## 11. Accessibility Rules

- Normal text must meet WCAG AA contrast (4.5:1).
- Interactive states must remain visible and distinguishable.
- Focus states must be clearly visible — `--sds-focus-ring-*` tokens must never be removed.
- Color must not be the only way to communicate state.
- Disabled states must remain recognizable.

Any change to the following token groups requires accessibility review:

```
--sds-color-text-*
--sds-color-surface-*
--sds-color-border-*
--sds-focus-ring-*
--sds-color-danger
--sds-color-success
--sds-color-warning
```

---

## 12. Change Risk Levels

| Risk | Examples | Required review |
|---|---|---|
| **Low** | Adding a new primitive token; adding documentation; adding unused aliases | Normal review |
| **Medium** | Changing semantic colors; spacing used by multiple components; component tokens; typography tokens | Design + technical review |
| **High** | Changing primary scale; global surfaces; text colors; focus rings; token naming structure; removing tokens; changing PrimeNG mappings across apps | Design review + technical review + Storybook validation + migration notes |

---

## 13. Deprecation Rules

Tokens must not be deleted immediately if used in production.

1. Mark the token as deprecated with a comment.
2. Provide a replacement token.
3. Update usages progressively.
4. Validate in Storybook.
5. Remove in a later release.

```scss
// DEPRECATED — use --sds-color-brand instead
// --sds-color-primary-default: var(--sds-color-primary-500);
```

---

## 14. Review Checklist

- [ ] Is the token name clear and intent-based?
- [ ] Is it primitive, semantic or component-level?
- [ ] Does it duplicate an existing token?
- [ ] Is the value accessible?
- [ ] Does it affect existing components?
- [ ] Has the PrimeNG `--p-*` mapping been updated if needed?
- [ ] Has Storybook been checked?
- [ ] Is the change documented?
- [ ] Is there a migration note if tokens are renamed or removed?
- [ ] Does the implementation respect ITCSS layer order?
- [ ] Does custom CSS follow BEM naming?
- [ ] Does the implementation avoid unnecessary specificity and `!important`?

---

## 15. Decision Rule

- **Figma** decides the visual intent.
- **The repository** decides the implementation.
- **Storybook** validates the result.
- **The design-system owner** resolves conflicts.
- No token should change in production only because it was changed visually in Figma.
- No token should change in code without checking the design impact in Figma or Storybook.

---

## 16. Repository Structure (Living Reference)

This section reflects the **actual current state** of `libs/styles/src/`. Keep it updated when files are added, renamed or removed.

### `01-settings/` — Design tokens (CSS custom properties)

Every file is named `_settings.{description}.scss`. All files `@use 'settings.prefix' as *`
and emit tokens as `--#{$sds-prefix}-*`. The barrel `_settings.core.scss` `@forward`s them all.

```
01-settings/
├── _settings.core.scss                   barrel — @forward all settings files
├── _settings.prefix.scss                 $sds-prefix: 'sds'  — single prefix config
│
├── _settings.colors-primitive.scss       --sds-color-{palette}-{shade}
│                                         Palettes: primary, red, orange, yellow, green,
│                                                   teal, blue, purple, gray, slate, stone,
│                                                   white, black, transparent-black/white
│
├── _settings.colors-semantic.scss        --sds-color-{role}
│                                         Groups: brand, success, warning, danger, info,
│                                                 surface, text, border, field, nav, emutnav
│
├── _settings.typography-primitive.scss   --sds-font-{family|size|weight}
│                                         --sds-line-height-*
│                                         --sds-letter-spacing-*
│
├── _settings.typography-semantic.scss    --sds-text-{display|heading|body|label}-{size}-{property}
│                                         e.g. --sds-text-body-md-size, --sds-text-heading-lg-family
│
├── _settings.spacing.scss                --sds-space-{scale}         (0 → 24, Figma: 12 stops)
│                                         --sds-space-form-{x|y}      (semantic form padding)
│                                         --sds-space-list-{x|y}
│                                         --sds-space-nav-{x|y}
│                                         --sds-space-overlay-{x|y}
│
├── _settings.radius.scss                 --sds-radius-{none|xs|sm|md|lg|xl|2xl|pill}
│                                         (Figma: 8 stops)
│
├── _settings.shadows.scss                --sds-shadow-overlay-{modal|select|popover|navigation}
│                                         --sds-shadow-form-field{|-dark}
│
├── _settings.transitions.scss            --sds-transition-duration{|-mask}
│
├── _settings.focus.scss                  --sds-focus-ring-{color|style|width|offset|shadow}
│
├── _settings.globals.scss                --sds-disabled-opacity, --sds-icon-size, --sds-anchor-gutter
│
├── _settings.grid.scss                   SCSS maps consumed by 05-objects
├── _settings.breakpoints.scss            SCSS maps consumed by 02-tools
│
└── _settings.{primeng-component}.scss    PrimeNG --p-* token bridge, scoped by BEM wrapper
                                          (e.g. _settings.accordion.scss, _settings.avatar.scss,
                                           _settings.card.scss, _settings.nav-shell.scss,
                                           _settings.sub-nav-shell.scss, _settings.top-nav.scss)
```

### `02-tools/` — Mixins and functions (no CSS output)

```
02-tools/
├── _tools.core.scss        barrel
├── _tools.mixins.scss
├── _tools.functions.scss
├── _tools.breakpoints.scss
├── _tools.flex.scss
├── _tools.spacing.scss
├── _tools.responsive-modifiers.scss
└── _tools.typography.scss
```

### `03-generic/` — Reset

```
03-generic/
├── _generic.core.scss      barrel
└── _generic.reset.scss
```

### `04-elements/` — Bare HTML element defaults

```
04-elements/
├── _elements.core.scss       barrel
├── _elements.typography.scss   Uses --sds-text-* and --sds-color-text-* tokens
└── _elements.links.scss
```

### `05-objects/` — Layout patterns (`o-` prefix)

```
05-objects/
├── _objects.core.scss        barrel
├── _objects.flex-grid.scss
└── layout/
    └── _objects.layout.scss
```

### `06-components/` — BEM components + PrimeNG wrappers (`c-` prefix)

```
06-components/
├── _components.core.scss       barrel — @forward all component files
├── _components.icon.scss
├── _components.nav-shell.scss
├── _components.sub-nav-shell.scss
├── _components.top-nav.scss
├── _components.toolbar.scss
├── _components.plectrum-avatar.scss
├── _components.empty-state.scss
├── _components.doc-demo-box.scss
└── _components.{name}.scss   ← one file per component
```

### `07-utilities/` — Single-purpose helpers (`u-` prefix)

```
07-utilities/
├── _utilities.core.scss      barrel
├── _utilities.utilities.scss
└── _utilities.typography.scss
```

### `08-trumps/` — Overrides

```
08-trumps/
├── _trumps.core.scss         barrel
└── _trumps.storybook.scss
```

### `main.scss` — Entry point

Each layer is loaded via its prefixed `*.core` barrel, in cascade order:

```scss
@use '01-settings/settings.core';
@use '02-tools/tools.core';
@use '03-generic/generic.core';
@use '04-elements/elements.core';
@use '05-objects/objects.core';
@use '06-components/components.core';
@use '07-utilities/utilities.core';
@use '08-trumps/trumps.core';
```

### Figma sources mapped to files

| Figma collection | Vars | Settings file(s) |
|---|---|---|
| Color — basic, transparent | 50 | `_settings.colors-primitive.scss` |
| Color — functional, brand, accent, background | 71 | `_settings.colors-semantic.scss` |
| Typography | 29 | `_settings.typography-primitive.scss` + `_settings.typography-semantic.scss` |
| Spacing | 12 | `_settings.spacing.scss` (scale section) |
| Radius | 8 | `_settings.radius.scss` |

### Token usage pattern in components

```scss
// 06-components/_components.form-field.scss
@use '../01-settings/settings.prefix' as *;

.sds-form-field {
  padding: var(--#{$sds-prefix}-space-form-y) var(--#{$sds-prefix}-space-form-x);
  border-radius: var(--#{$sds-prefix}-radius-md);
  background: var(--#{$sds-prefix}-color-field-bg);
  border: 1px solid var(--#{$sds-prefix}-color-field-border);

  // Map to PrimeNG
  --p-inputtext-border-color: var(--#{$sds-prefix}-color-field-border);
  --p-inputtext-focus-border-color: var(--#{$sds-prefix}-color-field-border-focus);

  &--invalid {
    --p-inputtext-border-color: var(--#{$sds-prefix}-color-field-border-invalid);
  }
}
```

---

## 17. Summary

| Layer | Role |
|---|---|
| **Figma** | Shared design reference — visual decisions and token proposals |
| **`$sds-prefix`** | Single SCSS variable controlling the `--sds-*` prefix |
| **`01-settings/`** | All CSS custom properties — split into primitive and semantic per category |
| **SCSS / CSS** | Solidaris visual design implementation |
| **ITCSS** | Cascade and architecture structure |
| **BEM** | Custom component naming strategy (`sds-` block prefix) |
| **PrimeNG TS preset** | Integration adapter only — `providePlectrum()` |
| **`--p-*` mappings** | Bridge from `--sds-*` to PrimeNG component tokens |
| **Storybook** | Documentation and validation layer |
| **Review process** | Governance source of truth |

---

## 18. Contract-Driven Development (CDD)

This governance document is complemented by a machine-readable contract system in `.ai/contracts/`. See `.ai/contracts/README.md` for full details.

| Artifact | Purpose |
|---|---|
| `.ai/contracts/schema/component.metadata.ts` | TypeScript interface for component metadata |
| `.ai/contracts/schema/token.contract.ts` | TypeScript interface for token governance |
| `.ai/contracts/index.json` | Codebase map for AI agent navigation |
| `.ai/contracts/protocols/query-protocol.md` | How agents navigate the system |
| `.ai/contracts/protocols/component-creation.md` | How to create components correctly |
| `.ai/contracts/protocols/token-audit.md` | How to validate token health |

Every component in `libs/ui` must have a colocated `.metadata.ts` file conforming to the schema. This is the machine-readable equivalent of this governance document — same rules, queryable format.

---

## 19. AI Prompts

The AI prompts for reviewing token changes, translating Figma decisions, and the Copilot rule prompt have been moved to a dedicated protocol file.

→ **See [`contracts/protocols/ai-prompts.md`](contracts/protocols/ai-prompts.md)**