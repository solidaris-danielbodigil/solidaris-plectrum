# Skills — 04 Token-First Checklist

When implementing a component, map every visual property to the correct `--sds-*` token
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
| Background | `--sds-color-surface-*` or `--sds-color-{component}-bg` | `--sds-color-nav-shell-bg` |
| Text | `--sds-color-text-*` | `--sds-color-text-default` |
| Border | `--sds-color-border-*` | `--sds-color-border-default` |
| Brand / primary | `--sds-color-brand` | `--sds-color-brand` |
| Interactive hover bg | `--sds-color-{component}-item-hover` | `--sds-color-nav-shell-item-hover` |
| Active / selected bg | `--sds-color-{component}-item-active` | `--sds-color-nav-shell-item-active` |
| Danger | `--sds-color-danger` | `--sds-color-danger` |
| Success | `--sds-color-success` | `--sds-color-success` |
| Focus ring | `--sds-focus-ring-color` | `--sds-focus-ring-color` |
| Icon colour | `currentcolor` or `--sds-color-text-*` | — |

---

## 2. Spacing Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Padding (generic) | `--sds-space-{scale}` | `--sds-space-4` |
| Padding (form field) | `--sds-space-form-{x\|y}` | `--sds-space-form-x` |
| Gap between items | `--sds-space-{component}-gap` | `--sds-space-nav-shell-item-gap` |
| Component padding | `--sds-space-{component}-*` | `--sds-space-nav-shell-item-p` |
| List padding | `--sds-space-list-{x\|y}` | `--sds-space-list-x` |

---

## 3. Typography Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Font family | `--sds-text-{cat}-{size}-family` | `--sds-text-label-sm-family` |
| Font size | `--sds-text-{cat}-{size}-size` | `--sds-text-body-md-size` |
| Font weight | `--sds-text-{cat}-{size}-weight` | `--sds-text-label-sm-weight` |
| Line height | `--sds-text-{cat}-{size}-line` | `--sds-text-label-sm-line` |

Categories: `display`, `heading`, `body`, `label`
Sizes: `2xl`, `xl`, `lg`, `md`, `sm`, `xs`

---

## 4. Structural Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Border radius | `--sds-radius-{size}` | `--sds-radius-lg` |
| Shadow | `--sds-shadow-*` | `--sds-shadow-overlay-navigation` |
| Icon size | `--sds-size-{component}-icon` or `--sds-globals-icon-size` | `--sds-size-nav-shell-icon` |
| Fixed structural width | `--sds-size-{component}-{descriptor}` | `--sds-size-nav-shell-footprint` |
| Fixed structural height | `--sds-space-{component}-header-h` | `--sds-space-nav-shell-header-h` |

---

## 5. Interaction Tokens

| Visual property | Token pattern | Example |
|---|---|---|
| Transition duration | `--sds-transition-duration` | `--sds-transition-duration` |
| Named transition | `--sds-transition-{component}` | `--sds-transition-nav-shell` |
| Label fade in | `--sds-transition-nav-label-in` | `--sds-transition-nav-label-in` |
| Focus ring width | `--sds-focus-ring-width` | `--sds-focus-ring-width` |
| Focus ring offset | `--sds-focus-ring-offset` | `--sds-focus-ring-offset` |
| Disabled opacity | `--sds-disabled-opacity` | `--sds-disabled-opacity` |

---

## 6. When a Token Is Missing

If a Figma value has no matching `--sds-*` token:

1. Note the Figma variable name (e.g. `surface/50`, `spacing-300`, `transparent/black/50`)
2. Identify the correct `01-settings` file (see `skills/02-scss-architecture.md §1`)
3. Add the token with a comment: Figma variable name + node ID
4. Reference it in component SCSS
5. Add it to `tokens.consumed` in the `.metadata.ts`

```scss
// libs/styles/src/01-settings/_settings.colors-semantic.scss

// Figma: surface/50 — Custom components node 1:1433
--#{$sds-prefix}-color-nav-shell-bg: #f6f6f6;
```
