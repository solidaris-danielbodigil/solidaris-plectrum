# Rules — 04 PrimeNG First

---

## Table of Contents

1. [Check PrimeNG Before Building](#1-check-primeng-before-building)
2. [Wrapping and Restyling](#2-wrapping-and-restyling)
3. [What PrimeNG Owns](#3-what-primeng-owns)
4. [When Custom Is Justified](#4-when-custom-is-justified)
5. [Figma → PrimeNG: Default Styles Only](#5-figma--primeng-default-styles-only)

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
- Feedback (`p-message`, `p-tag`, `p-toast`)

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

---

## 5. Figma → PrimeNG: Default Styles Only

When a Figma link is provided and the inspected element maps to a PrimeNG component,
**use PrimeNG's default Plectrum theme styles** — do not add decorative overrides
unless the user explicitly asks for custom styling.

### Mapping workflow

1. **Identify the PrimeNG primitive** — e.g. Message → `p-message`, Button → `p-button`, Tag → `p-tag`.
2. **Use the component as-is** in the template with PrimeNG props (`severity`, `variant`, `size`, etc.).
3. **Layout only in templates** — spacing, width, overflow via `o-layout` / `o-flex` BEM mixes, not component SCSS.
4. **Do not add a BEM wrapper class** whose sole purpose is restyling a PrimeNG primitive.

### What is allowed

| Layer | Allowed | Example |
|---|---|---|
| Template | PrimeNG component + layout object classes | `<p-message severity="warn" class="o-layout--margin-block-end-2">` |
| Template | PrimeNG component + severity props only | `<p-tag severity="success" icon="bi bi-check-lg" value="Accepté" />` |
| `01-settings` | Global PrimeNG `--p-*` token bridges (theme-level) | `_settings.message.scss` |
| `06-components` | Structural constraints PrimeNG cannot express | `min-width: 0` on a wrapper |

### What to avoid

```scss
// ❌ Wrong — component-layer decorative override on a PrimeNG primitive
.c-my-feature__message.p-message-warn {
  --p-message-warn-background: var(--sds-color-warning-subtle);
  border-radius: 8px;
  padding: 12px;
}

// ❌ Wrong — BEM wrapper remapping Tag severity tokens
.c-my-feature__status-tag {
  --p-tag-success-background: var(--sds-color-success-subtle);
  --p-tag-success-color: var(--sds-color-green-700);
  --p-tag-font-size: var(--text-label-xs-size);
  --p-tag-icon-size: var(--text-label-xs-size);
}

// ❌ Wrong — BEM wrapper remapping outlined secondary Button tokens
.c-my-feature__nav-button {
  --p-button-label-font-weight: var(--font-weight-regular);
  --p-button-outlined-secondary-color: var(--sds-color-text);
  --p-button-outlined-secondary-border-color: var(--sds-color-surface-200);
  --p-button-outlined-secondary-background: var(--sds-color-content-bg);
  --p-button-outlined-secondary-hover-background: var(--sds-color-content-hover-bg);
  --p-disabled-opacity: 1;
  opacity: 1;
}

// ❌ Wrong — BEM chrome duplicating PrimeNG feedback styling
.c-my-feature__message {
  background: var(--sds-color-warning-subtle);
  color: var(--sds-color-warning);
}
```

```html
<!-- ✅ Correct — PrimeNG owns warn chrome; template owns layout -->
<p-message severity="warn" class="o-layout--margin-block-end-2">
  {{ message }}
</p-message>

<!-- ✅ Correct — PrimeNG owns tag chrome via severity; no decorative BEM class -->
<p-tag severity="success" icon="bi bi-check-lg" value="Accepté" />

<!-- ✅ Correct — PrimeNG owns outlined secondary chrome via props; layout on parent -->
<div class="o-flex o-layout--gap-1">
  <button pButton severity="secondary" size="small" [outlined]="true" icon="bi bi-skip-backward" />
</div>
```

### Applies to

- All agents (UX Researcher, UX Engineer, Frontend Dev, Solidaris coordinator)
- Skills workflow in `.ai/skills/03-component-workflow.md`
- Token bridges scoped to a single feature in `01-settings/_settings.{component}.scss`
  that remap `--p-message-*`, `--p-button-*`, `--p-tag-*`, etc. are **redundant**
  when Plectrum already provides the correct variant — remove them rather than adding more.
