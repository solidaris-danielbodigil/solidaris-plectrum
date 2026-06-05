# Rules — 06 Accessibility

---

## Table of Contents

1. [Semantic HTML](#1-semantic-html)
2. [ARIA](#2-aria)
3. [Colour Contrast](#3-colour-contrast)
4. [Focus States](#4-focus-states)
5. [Keyboard Navigation](#5-keyboard-navigation)
6. [Tokens That Require Accessibility Review](#6-tokens-that-require-accessibility-review)

---

## 1. Semantic HTML

Always prefer the correct semantic element over a generic `<div>` or `<span>`.

| Use case | Element |
|---|---|
| Navigation | `<nav>` |
| Navigation list | `<ul>` + `<li>` |
| Page sections | `<main>`, `<section>`, `<article>`, `<aside>` |
| Headings | `<h1>`–`<h6>` (in correct hierarchy) |
| Buttons (action) | `<button>` |
| Links (navigation) | `<a href>` |
| Forms | `<form>`, `<label>`, `<input>`, `<fieldset>`, `<legend>` |

---

## 2. ARIA

- Add `aria-label` or `aria-labelledby` to all landmark regions
- Add `aria-current="page"` to the active navigation item
- Add `aria-expanded` to toggleable containers (nav, accordion, dropdown)
- Add `aria-hidden="true"` to decorative icons
- Use `role` only when there is no semantic HTML equivalent

```html
<!-- ✅ Nav shell example -->
<nav aria-label="Hoofdnavigatie">
  <ul role="list">
    <li>
      <a href="/zorgkas" aria-current="page">
        <span class="c-nav-shell__icon" aria-hidden="true">...</span>
        <span class="c-nav-shell__label">Zorgkas</span>
      </a>
    </li>
  </ul>
</nav>
```

---

## 3. Colour Contrast

All text must meet **WCAG 2.1 AA**:

- Normal text: minimum **4.5:1** contrast ratio
- Large text (18px+ regular or 14px+ bold): minimum **3:1**
- UI components and graphical objects: minimum **3:1**

Color must **never** be the only way to communicate state (also use an icon, label, or border).

---

## 4. Focus States

- Focus states must always be visible
- Never remove `outline` without replacing it with an equally visible focus indicator
- Use `--sds-focus-ring-*` tokens — never hardcode focus ring styles
- Test keyboard focus for every interactive component

```scss
// ✅ Correct
.c-nav-shell__link:focus-visible {
  outline: var(--sds-focus-ring-width) var(--sds-focus-ring-style) var(--sds-focus-ring-color);
  outline-offset: var(--sds-focus-ring-offset);
}
```

---

## 5. Keyboard Navigation

All interactive components must be fully operable by keyboard:

- `Tab` / `Shift+Tab` — move between interactive elements
- `Enter` / `Space` — activate buttons and links
- `Arrow keys` — navigate within composite widgets (menus, tabs, lists)
- `Escape` — close overlays, dropdowns, dialogs

---

## 6. Tokens That Require Accessibility Review

Any change to these token groups requires an accessibility review before merge:

```
--sds-color-text-*
--sds-color-surface-*
--sds-color-border-*
--sds-focus-ring-*
--sds-color-danger
--sds-color-success
--sds-color-warning
```
