# Rules — 04 PrimeNG First

---

## Table of Contents

1. [Check PrimeNG Before Building](#1-check-primeng-before-building)
2. [Wrapping and Restyling](#2-wrapping-and-restyling)
3. [What PrimeNG Owns](#3-what-primeng-owns)
4. [When Custom Is Justified](#4-when-custom-is-justified)

---

## 1. Check PrimeNG Before Building

**Always query the PrimeNG MCP server before writing any new component.**

```
MCP server: https://primeng.org/mcp
```

- If a PrimeNG component exists → use it, even if the API requires learning
- If PrimeNG covers 80% of the need → extend it, do not rebuild from scratch
- Only build custom when PrimeNG genuinely has no equivalent

---

## 2. Wrapping and Restyling

When PrimeNG needs visual customisation:

- Create a BEM wrapper class in `libs/styles/src/06-components/`
- Override PrimeNG's `--p-*` CSS variables via the wrapper — do not touch `.p-*` classes directly
- Never use `!important` except for exceptional, documented cases

```scss
// ✅ Correct — token bridge, scoped to wrapper
.c-form-field {
  --p-inputtext-border-color: var(--sds-color-field-border);
  --p-inputtext-focus-border-color: var(--sds-color-field-border-focus);
}

// ❌ Wrong — fighting PrimeNG internals
.p-inputtext {
  border-color: #da002f !important;
}
```

---

## 3. What PrimeNG Owns

Never reimplement these — PrimeNG owns them:

- Data tables (`p-table`)
- Dialogs and modals (`p-dialog`, `p-confirmdialog`)
- Dropdowns and selects (`p-select`, `p-multiselect`)
- Form inputs (`p-inputtext`, `p-inputnumber`, `p-datepicker`)
- Overlays (`p-popover`, `p-tooltip`)
- Navigation menus (`p-menubar`, `p-panelmenu`, `p-tabmenu`)
- Buttons (`p-button`, `p-splitbutton`)
- Feedback (`p-message`, `p-toast`)

---

## 4. When Custom Is Justified

A custom component is justified **only** when:

1. PrimeNG MCP confirms no equivalent exists
2. The Figma design is structurally incompatible with any PrimeNG component
3. The component is documented with the reason in its `.stories.ts` description

When building custom components:
- Use semantic HTML (`<nav>`, `<ul>`, `<button>`, `<article>`, `<section>`)
- Add ARIA roles and attributes
- Keep it generic — no app-specific logic inside `libs/ui`
