# Rules — 08 Object Classes (o-flex / o-layout)

> ⛔ = hard stop — violations block merge

---

## Table of Contents

1. [Use o-flex for All Flex Layout](#1-use-o-flex-for-all-flex-layout-)
2. [Use o-layout for Spacing and Overflow](#2-use-o-layout-for-spacing-and-overflow-)
3. [What Stays in Component SCSS](#3-what-stays-in-component-scss)
4. [How to Mix BEM and Object Classes](#4-how-to-mix-bem-and-object-classes)
5. [Class Reference](#5-class-reference)

---

## 1. Use `o-flex` for All Flex Layout ⛔

Never write these CSS properties inside `06-components/` SCSS files:

```
display: flex
flex-flow: …
flex-direction: …
flex-wrap: …
align-items: …
align-content: …
justify-content: …
```

Instead, apply the generated `o-flex` modifier classes directly in the HTML template.

```html
<!-- ❌ Wrong — flex layout in component SCSS -->
<!-- _components.toolbar.scss -->
.c-toolbar__inner { display: flex; align-items: center; flex-wrap: wrap; }

<!-- ✅ Correct — flex layout via o-flex mix in template -->
<div class="c-toolbar__inner o-flex o-flex--align-items-center o-flex--wrap">
```

The SCSS file for that element then holds **only** what `o-flex` cannot express:
`gap`, `padding`, structural `flex` shorthands (`flex: 1 1 0`), `min-width: 0`, `flex-shrink`, `margin-left: auto`.

---

## 2. Use `o-layout` for Spacing and Overflow ⛔

Never write these CSS properties directly in `06-components/` SCSS files when the
value can be expressed as an `o-layout` modifier class:

```
overflow, overflow-x, overflow-y
gap, row-gap, column-gap
padding, padding-top, padding-right, padding-bottom, padding-left
padding-inline, padding-inline-start, padding-inline-end
padding-block, padding-block-start, padding-block-end
margin, margin-top, margin-right, margin-bottom, margin-left
margin-inline, margin-inline-start, margin-inline-end
margin-block, margin-block-start, margin-block-end
```

Apply the generated `o-layout` modifier classes in the HTML template instead.

```html
<!-- ❌ Wrong — gap in component SCSS with a raw value -->
.c-iconography { gap: 0.75rem; }

<!-- ✅ Correct — gap via o-layout mix in template -->
<ul class="c-iconography__grid o-layout--gap-3">

<!-- ✅ Also correct — gap via var(--pds-*) token, no o-layout available for it -->
.c-toolbar__inner { gap: var(--pds-space-4); }
```

**Exception:** spacing values that must reference a `var(--pds-*)` token (component-
specific sizing, form padding, etc.) stay in SCSS as `var()` calls.
`o-layout` spacing modifiers use the global `--spacing-*` scale; component-specific
tokens are still written in SCSS.

---

## 3. What Stays in Component SCSS

Only these categories belong in `06-components/` SCSS files:

| Category | Example | Why it stays |
|---|---|---|
| Token-referenced gap/padding | `gap: var(--pds-space-4)` | Component-specific spacing not on global scale |
| Structural flex constraints | `flex: 1 1 0; min-width: 0` | No single `o-flex` equivalent for combined shorthand |
| Trailing-edge push | `margin-left: auto` | No `o-layout` class for auto margin |
| Colour, border, radius, shadow (state-driven) | `border-color` on `:hover` / `.is-selected` | Tied to component tokens or interaction |
| Static border, radius, shadow | Template | `u-border-*`, `u-radius-*`, `u-shadow-*` per [09-styling-policy.md](./09-styling-policy.md) |
| Typography | `font-size: var(--pds-text-label-sm-size)` | Visual concern, not layout |
| Transition / animation | `transition: border-color 150ms` | Behaviour, not layout |
| Position / z-index | `position: sticky; top: 0; z-index: var(--pds-z-sticky)` | Stacking concern |
| Pseudo-class / state styles | `&:hover`, `&:focus-visible`, `&.is-active` | State concern |

**Moved OUT of component SCSS** (these now belong elsewhere):

| Was in component SCSS | Now goes to | How |
|---|---|---|
| `display: flex; flex-direction: column` | Template | `o-flex o-flex--col` |
| `align-items: center` | Template | `o-flex--align-items-center` |
| `flex-shrink: 0` | Template | `o-flex__item--shrink-0` |
| `flex-grow: 1` | Template | `o-flex__item--grow-1` |
| `width: 100%` | Template | `o-layout--full-width` (or `o-flex__item--12`) |
| `overflow: hidden` | Template | `o-layout--overflow-hidden` |
| `overflow-x: hidden; overflow-y: auto` | Template | `o-layout--overflow-x-hidden o-layout--overflow-y-auto` |
| `gap: var(--spacing-3)` (global scale) | Template | `o-layout--gap-3` |
| `display: grid` / `grid-template-columns` | Template | `o-grid` per [09-styling-policy.md](./09-styling-policy.md) |
| PrimeNG `--p-*` variable overrides | `01-settings/_settings.{component}.scss` | Token bridge file |

### Decision tree: SCSS or template?

```
1. Is there an o-flex / o-layout class for it?
   YES → use the class in the HTML template
   NO  → keep in SCSS

2. Does the value reference a component-specific --pds-* token?
   YES → keep in SCSS (e.g. gap: var(--pds-space-toolbar-gap))
   NO  → use the o-layout class (e.g. o-layout--gap-3)

3. Is it a --p-* PrimeNG override?
   YES → move to 01-settings/_settings.{primeng-component}.scss
   NO  → keep in 06-components if it's visual/colour/typography
```

---

## 4. How to Mix BEM and Object Classes

BEM classes and object classes coexist on the same element. The BEM class owns
**what** the element is; the object class owns **how** it is laid out.

```html
<!-- ✅ BEM + o-flex mix -->
<div class="c-toolbar__inner o-flex o-flex--align-items-center o-flex--wrap">

<!-- ✅ BEM + o-layout mix -->
<ul class="c-iconography__grid o-layout--gap-3">

<!-- ✅ BEM only — no layout class needed -->
<span class="c-iconography__name">house</span>
```

Never encode the object class in the BEM SCSS file via `@extend` or a mixin.
The mix must be visible in the template so the layout intent is readable at a glance.

---

## 5. Class Reference

### `o-flex` — `libs/styles/src/05-objects/_objects.flex-grid.scss`

| Class | CSS property set |
|---|---|
| `o-flex` | `display: flex` |
| `o-flex--align-items-{value}` | `align-items: {value}` |
| `o-flex--align-content-{value}` | `align-content: {value}` |
| `o-flex--justify-content-{value}` | `justify-content: {value}` |
| `o-flex--{flex-flow-key}` | `flex-flow: {value}` — e.g. `o-flex--wrap`, `o-flex--col`, `o-flex--row-nowrap` |
| `o-flex__item--{n}` | `flex: 0 0 {n/12 * 100%}` column width |
| `o-flex__item--grow-{n}` | `flex-grow: {n}` |
| `o-flex__item--shrink-{n}` | `flex-shrink: {n}` |
| `o-flex__item--order-{n}` | `order: {n}` |
| `o-flex__item--align-self-{value}` | `align-self: {value}` |
| `o-flex--align-items-{value}@{bp}` | Responsive variant — e.g. `o-flex--align-items-center@md` |

Available `flex-flow` keys: `wrap`, `nowrap`, `wrap-reverse`, `row`, `row-reverse`,
`col`, `col-reverse`, `row-wrap`, `row-nowrap`, `col-wrap`, `col-nowrap`.

### `o-layout` — `libs/styles/src/05-objects/layout/_objects.layout.scss`

| Class | CSS property set |
|---|---|
| `o-layout--full-height` | `height: 100%` |
| `o-layout--overflow-{key}` | `overflow: {value}` |
| `o-layout--overflow-x-{key}` | `overflow-x: {value}` |
| `o-layout--overflow-y-{key}` | `overflow-y: {value}` |
| `o-layout--gap-{scale}` | `gap: var(--spacing-{scale})` |
| `o-layout--padding-{scale}` | `padding: var(--spacing-{scale})` |
| `o-layout--padding-top-{scale}` | `padding-top: var(--spacing-{scale})` |
| `o-layout--margin-{scale}` | `margin: var(--spacing-{scale})` |
| … | All spacing keys × all `--spacing-*` scale stops |

Spacing scale: `0`, `0-25`, `0-5`, `1`, `1-5`, `2`, `3`, `4`, `5`, `6`, `7`, `auto`.
