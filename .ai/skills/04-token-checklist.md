# Skills — 04 Token-First Checklist

When implementing a component, map every visual property to the correct `--pds-*` token
before writing any SCSS. Use this as a pre-implementation scan.

---

## Table of Contents

1. [Colour Tokens](#1-colour-tokens)
2. [Spacing Tokens](#2-spacing-tokens)
3. [Typography Tokens](#3-typography-tokens)
4. [Structural Tokens](#4-structural-tokens)
5. [Interaction Tokens](#5-interaction-tokens)
6. [When a Token Is Missing](#6-when-a-token-is-missing)

---

## 1. Colour Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Background | `--pds-color-surface-*` or `--pds-color-{component}-bg` | `--pds-color-nav-shell-bg` |
| Text | `--pds-color-text-*` | `--pds-color-text-default` |
| Border | `--pds-color-border-*` | `--pds-color-border-default` |
| Brand / primary | `--pds-color-brand` | `--pds-color-brand` |
| Interactive hover bg | `--pds-color-{component}-item-hover` | `--pds-color-nav-shell-item-hover` |
| Active / selected bg | `--pds-color-{component}-item-active` | `--pds-color-nav-shell-item-active` |
| Danger | `--pds-color-danger` | `--pds-color-danger` |
| Success | `--pds-color-success` | `--pds-color-success` |
| Focus ring | `--pds-focus-ring-color` | `--pds-focus-ring-color` |
| Icon colour | `currentcolor` or `--pds-color-text-*` | — |

---

## 2. Spacing Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Padding (generic) | `--pds-space-{scale}` | `--pds-space-4` |
| Padding (form field) | `--pds-space-form-{x\|y}` | `--pds-space-form-x` |
| Gap between items | `--pds-space-{component}-gap` | `--pds-space-nav-shell-item-gap` |
| Component padding | `--pds-space-{component}-*` | `--pds-space-nav-shell-item-p` |
| List padding | `--pds-space-list-{x\|y}` | `--pds-space-list-x` |

---

## 3. Typography Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Font family | `--pds-text-{cat}-{size}-family` | `--pds-text-label-sm-family` |
| Font size | `--pds-text-{cat}-{size}-size` | `--pds-text-body-md-size` |
| Font weight | `--pds-text-{cat}-{size}-weight` | `--pds-text-label-sm-weight` |
| Line height | `--pds-text-{cat}-{size}-line` | `--pds-text-label-sm-line` |

Categories: `display`, `heading`, `body`, `label`
Sizes: `2xl`, `xl`, `lg`, `md`, `sm`, `xs`

---

## 4. Structural Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Border radius | `--pds-radius-{size}` | `--pds-radius-lg` |
| Shadow | `--pds-shadow-*` | `--pds-shadow-overlay-navigation` |
| Icon size | `--pds-size-{component}-icon` or `--pds-globals-icon-size` | `--pds-size-nav-shell-icon` |
| Fixed structural width | `--pds-size-{component}-{descriptor}` | `--pds-size-nav-shell-footprint` |
| Fixed structural height | `--pds-space-{component}-header-h` | `--pds-space-nav-shell-header-h` |

---

## 5. Interaction Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Transition duration | `--pds-transition-duration` | `--pds-transition-duration` |
| Named transition | `--pds-transition-{component}` | `--pds-transition-nav-shell` |
| Label fade in | `--pds-transition-nav-label-in` | `--pds-transition-nav-label-in` |
| Focus ring width | `--pds-focus-ring-width` | `--pds-focus-ring-width` |
| Focus ring offset | `--pds-focus-ring-offset` | `--pds-focus-ring-offset` |
| Disabled opacity | `--pds-disabled-opacity` | `--pds-disabled-opacity` |

---

## 6. When a Token Is Missing

If a Figma value has no matching `--pds-*` token:

1. Note the Figma variable name (e.g. `surface/50`, `spacing-300`, `transparent/black/50`)
2. Identify the correct `01-settings` file (see `skills/02-scss-architecture.md §1`)
3. Add the token with a comment: Figma variable name + node ID
4. Reference it in component SCSS
5. Add it to `tokens.consumed` in the `.metadata.ts`

```scss
// libs/styles/src/01-settings/_settings.colors-semantic.scss

// Figma: surface/50 — Custom components node 1:1433
--#{$pds-prefix}-color-nav-shell-bg: #f6f6f6;
```
