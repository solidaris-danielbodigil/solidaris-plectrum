# Rules — 09 Styling Policy

> Operational rules for `libs/styles` — when to use template utilities vs component SCSS.
> Layout object classes (`o-flex`, `o-layout`) are detailed in [08-object-classes.md](./08-object-classes.md).

---

## Table of Contents

1. [SSOT Order](#1-ssot-order)
2. [Layout — Templates First](#2-layout--templates-first)
3. [CSS Grid — Templates First](#3-css-grid--templates-first)
4. [Visual Chrome Utilities](#4-visual-chrome-utilities)
5. [Allowed Exceptions in Component SCSS](#5-allowed-exceptions-in-component-scss)
6. [Semantic Border Tokens](#6-semantic-border-tokens)
7. [DEFAULT PrimeNG](#7-default-primeng)
8. [Custom Classes Registry](#8-custom-classes-registry)
9. [BEMIT — Shared Blocks](#9-bemit--shared-blocks)
10. [Specificity over PrimeNG](#10-specificity-over-primeng)
11. [Overlays](#11-overlays)
12. [Scroll Affordance](#12-scroll-affordance)
13. [Global Parity](#13-global-parity)
14. [Navigation Shell Exceptions](#14-navigation-shell-exceptions)

---

## 1. SSOT Order

1. PrimeNG component defaults
2. Plectrum theme (`providePlectrum()`)
3. `libs/styles` ITCSS (objects, then scoped components)

Figma is reference only — not SSOT for PrimeNG chrome.

---

## 2. Layout — Templates First

**Rule:** flex, gap, padding, margin, overflow, and min-size on elements we own in Angular templates must use `o-flex` and `o-layout` classes — **not** `06-components/` SCSS.

| Property | Use |
|----------|-----|
| `display: flex` | `o-flex` |
| `flex-direction: column` | `o-flex--y` |
| `align-items` / `justify-content` | `o-flex--align-items-*` / `o-flex--justify-content-*` |
| `flex-grow` / `flex-shrink` | `o-flex__item--grow-*` / `o-flex__item--shrink-*` |
| `gap`, `padding`, `margin` | `o-layout--gap-*`, `o-layout--padding-*`, `o-layout--margin-*` (use `o-layout--margin-0` for heading resets) |
| `overflow` | `o-layout--overflow-*` |
| `min-width: 0` / `min-height: 0` | `o-layout--min-w-0` / `o-layout--min-h-0` |
| CSS grid layout | `o-grid` + `o-layout--gap-*` (see below) |

Reference: `libs/styles/src/05-objects/_objects.flex-grid.scss`, `layout/_objects.layout.scss`, `_objects.grid.scss`

---

## 3. CSS Grid — Templates First

**Rule:** `display: grid`, `grid-template-columns` / `rows`, `grid-auto-flow`, and container alignment on elements we own in Angular templates must use `o-grid` — **not** `06-components/` SCSS.

| Need | Use |
|------|-----|
| Equal columns (1–12) | `o-grid o-grid--cols-{n}` |
| Responsive reflow | `o-grid--auto-fit` / `o-grid--auto-fill` (+ optional `--pds-grid-min`) |
| Bespoke track list | `o-grid` + `style="--pds-grid-template-columns: …"` (Tier 2 escape hatch) |
| Gap | `o-layout--gap-*` on the same element (BEM mix) |
| Alignment | `o-grid--align-items-*`, `o-grid--justify-items-*`, `o-grid--justify-content-*`, etc. |

**Tier 3 exception:** named `grid-template-areas` or complex row templates stay in component SCSS — document with a comment.

Reference: `libs/styles/src/05-objects/_objects.grid.scss`

---

## 4. Visual Chrome Utilities

**Rule:** static borders, radii, and elevations on elements we own in templates should use utilities — not duplicate rules in component SCSS.

| Need | Use |
|------|-----|
| Panel / section divider | `u-border-{side}` + `style="--pds-border-color: var(--pds-color-panel-border)"` |
| Component-token width | add `--pds-border-width: var(--…)` override on the same element |
| Thick / dashed | `u-border-thick`, `u-border-dashed` (orthogonal modifiers) |
| Status border color | `u-border-{success\|warning\|danger\|info}` |
| Global radius stop | `u-radius-{stop}` / `u-radius-{side\|corner}-{stop}` |
| Static elevation | `u-shadow-{sm\|md\|xl\|overlay-*}` |

**Keep in component SCSS:** state-driven borders/shadows (hover, selected, expanded), PrimeNG-internal selectors, pulse/keyframe shadows, radii using `calc()` or component tokens.

Reference: `libs/styles/src/07-utilities/_utilities.{borders,radius,shadows}.scss`

---

## 5. Allowed Exceptions in Component SCSS

1. **PrimeNG / third-party internals** — `.p-card-body`, `.p-tree-node-content`, `.p-accordionheader`, etc. (no template hook)
2. **Component-token sizing** — fixed label columns, asymmetric tile padding, bar height when value is not on `--spacing-*` scale
3. **Tier 3 CSS grid** — named areas / complex row templates only; document with a comment
4. **Scroll affordance** — `scroll-padding-*`, `scroll-margin-*` on owned scroll wrappers
5. **Typography resets** — `margin: 0` on headings inside components
6. **State-driven visual chrome** — hover/selected/expanded borders, shadows, radii tied to component tokens
7. **Absolute positioning / collapse animations** — overlay panels, discrete `display` reveals (`c-nav-shell`, `c-iconography__copy-hint`)
8. **Doc primitives** — `c-demo-cell` / `c-spacing-swatch` in Storybook inline markup; pair with `o-flex` / `o-layout` / `o-grid` in the story template string

---

## 6. Semantic Border Tokens

Use shared roles in component SCSS — not feature-specific border aliases (`_settings.colors-semantic.scss`):

| Token | Role | Typical use |
|-------|------|-------------|
| `--pds-color-panel-border` | Flat panel chrome (#e7e7e7) | Section dividers, list shell, bordered accordion, flush card header rule |
| `--pds-color-card-border` | Elevated card outline (#d1d1d1) | `p-card` rings, selectable list rows |
| `--pds-color-content-border` | Subtle inset border | Nav shells, tiles, notes |
| `--pds-color-surface-border` | Light surface edge | Iconography cards, doc demos |

PrimeNG bridges: `--p-card-border-color: var(--pds-color-card-border)` or `panel-border` per context.

Drawer TS: `PDS_DRAWER_APPEND_TO`, `PDS_DRAWER_CONTENT_STYLE`, `PDS_PANEL_BORDER_BOTTOM_STYLE`, `DrawerPosition`, `DetailListRow`, and `normalizeAccordionPanelIds()` live in `libs/ui/src/lib/drawer/`.

---

## 7. DEFAULT PrimeNG

No scoped `--p-*` / `.p-*` overrides for:

- button, stepper, tag, inputs
- drawer, modal/dialog, popover, menu

No `styleClass` on `p-drawer` / `p-dialog` roots.

---

## 8. Custom Classes Registry

Only add BEM blocks when PrimeNG + object/utility classes are insufficient:

- `c-form-field` (label layout)
- `c-drawer` — headless drawer shell (`__header`, `__toolbar`, `__content`, `__section`, `__section-title`); feature elements use the block prefix in the element name (e.g. `__affiliate-detail-name`, `__affiliate-detail-note`)
- `c-detail-list` — label/value description rows (`__label`, `__value`)
- `c-accordion--bordered` (bordered stacked accordion)
- `c-timeline--content-only` (single-column timeline — hides empty opposite column)
- `c-list` tree variant (`.c-list--journey` / `.c-list--flat`)
- `p-card` surface wrappers (named panel chrome)

---

## 9. BEMIT — Shared Blocks

Keep blocks flat; shallow modifiers only. No doubled-class specificity (`.c-foo.c-foo`).

When a shared block has feature-specific children, prefix the **element** name — do not create a nested block:

| Avoid | Prefer |
|-------|--------|
| `c-affiliate-detail-drawer__name` | `c-drawer__affiliate-detail-name` |
| `c-document-more-details-drawer__title` | `c-drawer__document-more-details-title` |

Standalone `libs/ui` components keep their own block (`c-affiliate-overview-card`, `c-list`). Shared layout primitives stay separate blocks (`c-detail-list`). Flat panel dividers use `u-border-bottom` + `--pds-border-color` in templates.

---

## 10. Specificity over PrimeNG

1. ITCSS layer order (unlayered components after `@layer primeng`)
2. `:is()` / `:where()` on scoped wrapper
3. `@layer components { … }`

---

## 11. Overlays

No `styleClass` on `p-drawer` / `p-dialog` roots. Use `appendTo="body"` for drawers/dialogs inside flex or `overflow-hidden` layouts. Content-driven width: `[style]` with `--pds-size-drawer-min-width` / `--pds-size-drawer-max-width` from `_settings.drawer.scss` (`width: max-content`).

---

## 12. Scroll Affordance

Owned scroll wrapper + scroll-shadow object on our element — not doubled `.p-card-body` selectors.

| Axis | Class | Mixin | Overflow pair |
|---|---|---|---|
| Block (vertical) | `o-scroll-shadow` | `scroll-shadow()` | `o-layout--overflow-y-auto` + height constraint (`o-layout--min-h-0`) |
| Inline (horizontal) | `o-scroll-shadow--inline` | `scroll-shadow-inline()` | `o-layout--overflow-x-auto` + width constraint (`o-layout--min-w-0`) |

Storybook: **Foundations / Scroll Shadow**.

---

## 13. Global Parity

Allowed without approval:

- `.p-tag-icon` line-height for icon box alignment

---

## 14. Navigation Shell Exceptions

`c-accordion--nav` and `c-accordion--chromeless` use transparent accordion bridges for nav/list chrome — not bordered panels. Use `c-accordion--bordered` where stacked bordered panels are required.
