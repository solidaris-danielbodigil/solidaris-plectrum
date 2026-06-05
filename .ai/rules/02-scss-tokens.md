# Rules — 02 SCSS & Design Tokens

> ⛔ = hard stop — violations block merge

---

## Table of Contents

1. [No Local SCSS Variables in Components](#1-no-local-scss-variables-in-components-)
2. [CSS Custom Properties Only](#2-css-custom-properties-only-)
3. [Token-First — Add to 01-settings Before Use](#3-token-first--add-to-01-settings-before-use-)
4. [ITCSS Layer Discipline](#4-itcss-layer-discipline)
5. [Use @apply for Layout and Spacing](#5-use-apply-for-layout-and-spacing-)
6. [Content-First Sizing](#6-content-first-sizing)
7. [PrimeNG Token Bridge — Declare in 01-settings](#7-primeng-token-bridge--declare-in-01-settings-)

---

## 1. No Local SCSS Variables in Components ⛔

All values **must** live in `libs/styles/src/01-settings/`.
If a token is missing, add it there **first**, then reference it.

```scss
// ❌ Wrong — local variable
$nav-bg: #f6f6f6;
.c-nav { background: $nav-bg; }

// ✅ Correct
// Step 1 — in 01-settings/_settings.colors-semantic.scss:
//   --sds-color-nav-shell-bg: #f6f6f6; // Figma: surface/50, node 1:1433
// Step 2 — in 06-components/_components.nav-shell.scss:
.c-nav { background: var(--sds-color-nav-shell-bg); }
```

---

## 2. CSS Custom Properties Only ⛔

Never hardcode hex, rgba, px, rem, or unitless values in `06-components` SCSS.
Every value must reference a `var(--sds-*)` token.

```scss
// ❌ Wrong
.c-item { padding: 10px; color: rgba(0,0,0,0.8); border-radius: 10px; }

// ✅ Correct
.c-item {
  padding: var(--sds-space-nav-shell-item-p);
  color: var(--sds-color-nav-shell-text);
  border-radius: var(--sds-radius-lg);
}
```

---

## 3. Token-First — Add to `01-settings` Before Use ⛔

If a Figma value has no existing `--sds-*` token:

1. Add the token to the correct `01-settings` file
2. Include a comment with the Figma variable name and node ID
3. Reference it in the component SCSS via `var(--sds-*)`
4. List it under `tokens.consumed` in the `.metadata.ts`

```scss
// In libs/styles/src/01-settings/_settings.colors-semantic.scss:

// First-level shell — Figma: surface/50, node 1:1433
--sds-color-nav-shell-bg: #f6f6f6;
```

**Token file map** (where to add new tokens):

| Token type | File |
|---|---|
| Colour (raw palette) | `_settings.colors-primitive.scss` |
| Colour (role/intent) | `_settings.colors-semantic.scss` |
| Spacing / sizing | `_settings.spacing.scss` |
| Border radius | `_settings.radius.scss` |
| Typography (raw) | `_settings.typography-primitive.scss` |
| Typography (roles) | `_settings.typography-semantic.scss` |
| Shadows | `_settings.shadows.scss` |
| Transitions | `_settings.transitions.scss` |
| Focus ring | `_settings.focus.scss` |
| Global (opacity, icon size) | `_settings.globals.scss` |
| PrimeNG token bridge | `_settings.{primeng-component}.scss` (e.g. `_settings.accordion.scss`) |

---

## 4. ITCSS Layer Discipline

| Layer | Folder | Prefix | Purpose |
|---|---|---|---|
| 01-settings | `01-settings/` | — | All CSS custom properties — design tokens only |
| 02-tools | `02-tools/` | — | Mixins, functions — no CSS output |
| 03-generic | `03-generic/` | — | Reset / normalize |
| 04-elements | `04-elements/` | — | Bare HTML element defaults |
| 05-objects | `05-objects/` | `o-` | Layout patterns — `@apply` OK |
| 06-components | `06-components/` | `c-` | BEM components + PrimeNG wrappers — `@apply` OK |
| 07-utilities | `07-utilities/` | `u-` | Single-purpose helpers |

Every SCSS change must land in the correct layer. Never write styles outside `libs/styles`.

---

## 5. Use `o-flex` / `o-layout` BEM mixes for Layout and Spacing ⛔

Layout and spacing on the global `--spacing-*` scale must be expressed as **object-class BEM mixes in HTML templates** — never as CSS properties in `06-components` SCSS files.

```html
<!-- ❌ Wrong — flex/gap in component SCSS -->
<!-- 06-components/_components.card.scss: .c-card { display: flex; gap: var(--spacing-2); } -->

<!-- ✅ Correct — BEM mix in template -->
<div class="c-card o-flex o-flex--col o-layout--gap-2">
```

**Exceptions** — the following may remain in `06-components` SCSS with a justification comment:

| Allowed in SCSS | Why |
|---|---|
| `flex: 1 1 0`, `flex-shrink: 0`, `flex-basis: 100%` | No `o-flex` equivalent — structural constraints |
| `min-width: 0`, `overflow: hidden` | Visual/containment concerns, not spacing |
| `gap` / `padding` referencing a **component token** `var(--sds-*)` | Component-specific spacing that doesn't map to global scale |

---

## 6. Content-First Sizing ⛔

Components must **never** have arbitrary fixed `width` or `height`.
Let content drive dimensions. Use `padding`, `gap`, and `flex`/`grid` instead.

Only two categories justify a fixed size, and both require a comment:

| Category | Example | Why it's justified |
|---|---|---|
| Icon / asset constraints | `.c-nav-shell__icon { width: 20px; height: 20px; }` | Icon fonts and SVGs must be constrained or they collapse to 0 |
| Reserved in-flow slot (overlay layouts) | `.c-nav-shell { width: var(--sds-size-nav-shell-footprint); }` | An absolutely-positioned panel can't size its in-flow slot, so the slot reserves the collapsed footprint (itself derived from icon + padding tokens) |

Everything else — container heights, item heights, expanded widths — must emerge from `padding` + `line-height` + `gap`.

```scss
// ❌ Wrong — arbitrary fixed sizes
.c-card { width: 320px; height: 200px; }
.c-nav-shell__logo { height: 52px; }      // ← forces a height that should come from padding
.c-nav-shell__link { min-height: 40px; }  // ← forces a height that should come from py + line-height

// ✅ Correct — content-driven
.c-card { @apply flex flex-col; min-width: 0; }
.c-nav-shell__logo { padding: var(--sds-space-nav-shell-item-px); } // height = padding + SVG height
.c-nav-shell__link { padding: var(--sds-space-nav-shell-item-py) var(--sds-space-nav-shell-item-px); }

// ✅ Acceptable — structurally required, with justification comment
.c-nav-shell__icon {
  // Fixed size required — icon fonts collapse to 0 without an explicit constraint
  width: var(--sds-size-nav-shell-icon);
  height: var(--sds-size-nav-shell-icon);
}
.c-nav-shell {
  // Reserved slot — the absolutely-positioned panel can't size its in-flow slot,
  // so reserve the collapsed footprint (derived from icon + padding tokens)
  width: var(--sds-size-nav-shell-footprint);
}
```

### Checklist before adding any `width` or `height`

- [ ] Can `padding` + `line-height` + `gap` produce the same result? → use those instead
- [ ] Is this an icon/SVG that would collapse without a constraint? → allowed, add comment
- [ ] Is this a structural dimension the entire layout depends on? → allowed, add comment, add token to `01-settings`
- [ ] Everything else → **block merge**

---

## 7. PrimeNG Token Bridge — Declare in `01-settings` ⛔

When overriding PrimeNG `--p-*` CSS variables to match the Plectrum design:

1. **Create a dedicated settings file** in `01-settings/` named `_settings.{primeng-component}.scss`
   (e.g. `_settings.accordion.scss`, `_settings.inputtext.scss`)
2. **Define all `--p-*` overrides as CSS custom properties** inside `:root` (or a scoped selector) in that file
3. **Reference `--sds-*` semantic tokens** as values — never hardcode
4. **In `06-components/`**, only apply the scoping selector (BEM wrapper class) that activates
   the bridge — do NOT declare `--p-*` variables inline in `06-components`

```scss
// ✅ Correct — 01-settings/_settings.accordion.scss
@use 'settings.prefix' as *;

// PrimeNG Accordion token bridge — sub-nav-shell context
// Maps --p-accordion-* to Solidaris design tokens
.c-sub-nav-shell__accordion {
  --p-accordion-panel-border-width: 0;
  --p-accordion-panel-border-color: transparent;
  --p-accordion-header-background: transparent;
  --p-accordion-header-hover-background: transparent;
  --p-accordion-header-active-background: transparent;
  --p-accordion-header-color: var(--color-sub-nav-shell-section-text);
  --p-accordion-header-hover-color: var(--color-sub-nav-shell-section-text);
  --p-accordion-header-active-color: var(--color-sub-nav-shell-section-text);
  --p-accordion-header-padding: var(--#{$sds-prefix}-space-sub-nav-shell-section-header-py) var(--#{$sds-prefix}-space-sub-nav-shell-section-header-px);
  --p-accordion-content-background: transparent;
  --p-accordion-content-padding: 0;
  --p-accordion-content-border-width: 0;
  --p-accordion-toggle-icon-color: var(--color-sub-nav-shell-section-text);
  --p-accordion-toggle-icon-hover-color: var(--color-sub-nav-shell-section-text);
  --p-accordion-toggle-icon-active-color: var(--color-sub-nav-shell-section-text);
}

// ❌ Wrong — --p-* variables declared inline in 06-components/
// _components.sub-nav-shell.scss
.c-sub-nav-shell__accordion {
  --p-accordion-header-background: transparent;  // ← belongs in 01-settings
}
```

**Why?** All custom properties are tokens. `01-settings/` is the SSOT for all CSS custom
properties. Keeping `--p-*` bridges there makes them auditable, discoverable, and
reusable across components that share the same PrimeNG component.
