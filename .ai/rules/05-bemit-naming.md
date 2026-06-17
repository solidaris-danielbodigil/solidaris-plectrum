# Rules — 05 BEMIT Naming

---

## Table of Contents

1. [CSS Class Prefixes](#1-css-class-prefixes)
2. [BEM Structure](#2-bem-structure)
3. [Component File and Class Naming](#3-component-file-and-class-naming)
4. [Examples](#4-examples)

---

## 1. CSS Class Prefixes

| Type | Prefix | Example |
|---|---|---|
| Object (layout pattern) | `o-` | `o-container`, `o-grid`, `o-stack` |
| Component | `c-` | `c-card`, `c-nav-shell`, `c-button` |
| Utility | `u-` | `u-hidden`, `u-sr-only`, `u-visually-hidden` |
| JS hook | `js-` | `js-modal-trigger`, `js-toggle` |
| State | `is-` / `has-` | `is-active`, `is-disabled`, `has-error` |

---

## 2. BEM Structure

```
Block           .c-card
Element         .c-card__header
                .c-card__body
                .c-card__footer
Modifier        .c-card--featured
                .c-card--compact
State           .c-card.is-loading
                .c-card.has-error
```

Rules:
- Elements use `__` (double underscore)
- Modifiers use `--` (double hyphen)
- States use standalone `is-` / `has-` classes, not BEM modifiers
- Never nest BEM blocks inside each other in SCSS — compose them in HTML
- Keep specificity flat — one class level, no deep nesting

```scss
// ✅ Correct
.c-card { ... }
.c-card__header { ... }
.c-card--featured { ... }

// ❌ Wrong — too deeply nested
.c-card {
  .c-card__header {
    .c-card__title { ... }
  }
}
```

---

## 3. Component File and Class Naming

| Concern | Convention | Example |
|---|---|---|
| File name | `kebab-case` | `nav-shell.component.ts` |
| Class name | `PascalCase` | `NavShellComponent` |
| BEM block | `c-` + `kebab-case` | `c-nav-shell` |
| Selector | `pds-` + `kebab-case` | `pds-nav-shell` |

**Never use app-specific prefixes inside `libs/ui`.**

```
❌ iShareButton, iCRMCard, ishareNavShell
✅ c-button, c-card, c-nav-shell
```

---

## 4. Examples

### Button

```
File:      button.component.ts
Class:     ButtonComponent
Selector:  pds-button
BEM block: c-button

.c-button              default state
.c-button__icon        icon element
.c-button__label       label element
.c-button--primary     primary modifier
.c-button--secondary   secondary modifier
.c-button.is-loading   loading state
.c-button.is-disabled  disabled state
```

### Card

```
File:      card.component.ts
Class:     CardComponent
Selector:  pds-card
BEM block: c-card

.c-card                default
.c-card__header
.c-card__body
.c-card__footer
.c-card--featured      modifier
.c-card.has-error      state
```

### Nav Shell

```
File:      nav-shell.component.ts
Class:     NavShellComponent
Selector:  pds-nav-shell
BEM block: c-nav-shell

.c-nav-shell             collapsed (default)
.c-nav-shell--expanded   expanded state
.c-nav-shell__logo       logo container
.c-nav-shell__list       item list
.c-nav-shell__item       list item wrapper
.c-nav-shell__link       clickable row
.c-nav-shell__icon       icon slot
.c-nav-shell__label      text label
.c-nav-shell__footer     footer / avatar slot
```
