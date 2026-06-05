# Skills — 02 SCSS Architecture

---

## Table of Contents

1. [ITCSS Layer Map](#1-itcss-layer-map)
2. [Token Prefix System](#2-token-prefix-system)
3. [Adding New Tokens](#3-adding-new-tokens)
4. [Writing Component SCSS](#4-writing-component-scss)
5. [Tailwind @apply Usage](#5-tailwind-apply-usage)
6. [PrimeNG Token Bridge](#6-primeng-token-bridge)

---

## 1. ITCSS Layer Map

### File naming convention

Every SCSS file is named `_{layer-folder}.{description}.scss`.
The barrel (index) for each layer is always `_{layer-folder}.core.scss`.

```
_settings.core.scss          ← barrel
_settings.colors-primitive.scss
_settings.spacing.scss
_components.core.scss        ← barrel
_components.nav-shell.scss
_components.toolbar.scss
```

### Full tree

```
libs/styles/src/
│
├── 01-settings/                         ← CSS custom properties — ALL design tokens live here
│   ├── _settings.core.scss              barrel — @forward all settings files
│   ├── _settings.prefix.scss            $sds-prefix: 'sds'
│   ├── _settings.colors-primitive.scss  --color-{palette}-{shade}
│   ├── _settings.colors-semantic.scss   --color-{role}
│   ├── _settings.typography-primitive.scss  --font-family-*, --font-size-*, --line-height-*
│   ├── _settings.typography-semantic.scss   --text-{category}-{size}-{property}
│   ├── _settings.spacing.scss           --spacing-*
│   ├── _settings.radius.scss            --sds-radius-*   (sds-prefixed, via $sds-prefix)
│   ├── _settings.shadows.scss           --sds-shadow-*
│   ├── _settings.transitions.scss       --sds-transition-*
│   ├── _settings.focus.scss             --sds-focus-ring-*
│   ├── _settings.globals.scss           --sds-disabled-opacity, --sds-icon-size
│   ├── _settings.grid.scss              SCSS maps consumed by 05-objects
│   ├── _settings.breakpoints.scss       SCSS maps consumed by 02-tools
│   └── _settings.{primeng-component}.scss  PrimeNG token bridge (e.g. _settings.accordion.scss)
│
├── 02-tools/                            ← Mixins and functions — no CSS output
│   ├── _tools.core.scss                 barrel
│   ├── _tools.mixins.scss
│   ├── _tools.functions.scss
│   ├── _tools.breakpoints.scss
│   ├── _tools.flex.scss
│   └── _tools.spacing.scss
│
├── 03-generic/                          ← Reset / normalize
│   ├── _generic.core.scss               barrel
│   └── _generic.reset.scss
│
├── 04-elements/                         ← Bare HTML element defaults
│   ├── _elements.core.scss              barrel
│   ├── _elements.typography.scss
│   └── _elements.links.scss
│
├── 05-objects/                          ← Layout patterns  (prefix: o-)
│   ├── _objects.core.scss               barrel
│   ├── _objects.flex-grid.scss
│   └── layout/
│       └── _objects.layout.scss
│
├── 06-components/                       ← BEM components + PrimeNG wrappers  (prefix: c-)
│   ├── _components.core.scss            barrel — @forward all component files
│   ├── _components.icon.scss
│   ├── _components.nav-shell.scss
│   ├── _components.toolbar.scss
│   ├── _components.doc-demo-box.scss
│   └── _components.{name}.scss         ← one file per component
│
├── 07-utilities/                        ← Single-purpose helpers  (prefix: u-)
│   ├── _utilities.core.scss             barrel
│   └── _utilities.utilities.scss
│
├── 08-trumps/                           ← Storybook / override styles
│   ├── _trumps.core.scss                barrel
│   └── _trumps.storybook.scss
│
└── main.scss                            ← ITCSS entry point
```

---

## 2. Token Prefix System

The prefix is controlled by a single SCSS variable — change it once to rename all tokens:

```scss
// libs/styles/src/01-settings/_settings.prefix.scss
$sds-prefix: 'sds' !default;
```

All settings files use it like this:

```scss
@use 'settings.prefix' as *;

:root {
  --#{$sds-prefix}-color-brand: var(--color-primary-500);
}
```

Component SCSS files use it the same way:

```scss
@use '../01-settings/settings.prefix' as *;

.c-nav-shell {
  background-color: var(--#{$sds-prefix}-color-nav-shell-bg);
}
```

---

## 3. Adding New Tokens

When Figma specifies a value that has no `--sds-*` equivalent:

1. Identify the correct `01-settings` file (see layer map above)
2. Add the token with a comment citing the Figma variable name and node ID
3. Use `--#{$sds-prefix}-` interpolation
4. Reference it in the component SCSS

```scss
// In 01-settings/_settings.colors-semantic.scss:
@use 'settings.prefix' as *;

:root {
  // Figma: surface/50, Custom components node 1:1433
  --#{$sds-prefix}-color-nav-shell-bg: #f6f6f6;
}
```

---

## 4. Writing Component SCSS

Template for a new component SCSS file:

```scss
@use '../01-settings/settings.prefix' as *;

// =============================================================================
// 06-components/_components.{name}.scss
// {Component description}
//
// Design ref:   Figma node {id}
// Token source: libs/styles/src/01-settings/
//   _settings.colors-semantic.scss → --color-* / --sds-color-*
//   _settings.spacing.scss         → --spacing-*
//   _settings.radius.scss          → --sds-radius-*
// =============================================================================

.c-my-component {
  gap: var(--#{$sds-prefix}-space-4);               // spacing via token
  background: var(--color-surface-default);          // colour via token
  border-radius: var(--#{$sds-prefix}-radius-md);   // radius via token

  &__element { ... }
  &--modifier { ... }
  &.is-active { ... }
}
```

---

## 5. Tailwind `@apply` Usage

Tailwind v4 is configured via PostCSS. `@apply` is available in all SCSS files.

**Priority order for layout properties:**
1. **`o-flex` / `o-layout` classes in the HTML template** — always first choice when an equivalent class exists
2. **`@apply` in SCSS** — only for properties that have no `o-*` class AND no `--sds-*` token
3. **`var(--sds-*)` in SCSS** — for component-specific spacing/sizing tokens

- ✅ Use `@apply` for: `list-none`, `no-underline`, `cursor-pointer`, `truncate`, `block`, `inline-block`, `fixed`, `absolute`, `relative`
- ❌ Do not use `@apply` for: `flex`, `items-center`, `justify-center`, `shrink-0`, `w-full`, `overflow-*`, `gap-*` — use `o-flex` / `o-layout` template classes instead
- ❌ Do not use `@apply` for spacing values that have `--sds-space-*` tokens — use `var()` instead
- ❌ Never put Tailwind classes in Angular HTML templates

---

## 6. PrimeNG Token Bridge

PrimeNG `--p-*` variable overrides **must** live in `01-settings/`, not in `06-components/`.
All custom properties are tokens — `01-settings/` is the SSOT for all CSS custom properties.

### File naming

Create a dedicated file per PrimeNG component being bridged:

```
libs/styles/src/01-settings/_settings.{primeng-component}.scss
```

Examples: `_settings.accordion.scss`, `_settings.inputtext.scss`, `_settings.datatable.scss`.

### Structure

```scss
// 01-settings/_settings.accordion.scss
@use 'settings.prefix' as *;

// PrimeNG Accordion token bridge — {context description}
// Maps --p-accordion-* to Solidaris design tokens
.c-sub-nav-shell__accordion {
  --p-accordion-panel-border-width: 0;
  --p-accordion-panel-border-color: transparent;
  --p-accordion-header-background: transparent;
  --p-accordion-header-hover-background: transparent;
  --p-accordion-header-color: var(--color-sub-nav-shell-section-text);
  --p-accordion-header-padding: var(--#{$sds-prefix}-space-sub-nav-shell-section-header-py) var(--#{$sds-prefix}-space-sub-nav-shell-section-header-px);
  --p-accordion-content-background: transparent;
  --p-accordion-content-padding: 0;
  --p-accordion-content-border-width: 0;
}
```

### In `06-components/`

The component SCSS file references the BEM wrapper class but does **NOT** redeclare
`--p-*` variables. It may contain PrimeNG internal selectors that require structural
overrides (like removing padding from generated containers):

```scss
// 06-components/_components.sub-nav-shell.scss

// Accordion panel structural spacing (not a token — layout concern)
.c-sub-nav-shell__accordion .p-accordionpanel {
  padding: var(--#{$sds-prefix}-space-sub-nav-shell-section-py) var(--#{$sds-prefix}-space-sub-nav-shell-section-px);
}
```

### Multiple contexts for the same PrimeNG component

If multiple BEM components override the same PrimeNG component (e.g. Accordion is used
in both `c-sub-nav-shell` and `c-faq-list`), all bridges coexist in the same
`_settings.accordion.scss` file, scoped by their respective BEM wrapper classes.

Never override `.p-*` selectors directly — always bridge via `--p-*` variables.
