# Solidaris styling policy

SSOT (in order):

1. PrimeNG component defaults
2. Plectrum theme (`providePlectrum()`)
3. `libs/styles` ITCSS (objects, then scoped components)

Figma is reference only — not SSOT for PrimeNG chrome.

## Layout — templates first (`o-flex` / `o-layout`)

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

Reference: `libs/styles/src/05-objects/_objects.flex-grid.scss`, `layout/_objects.layout.scss`

### Allowed exceptions in component SCSS

1. **PrimeNG / third-party internals** — `.p-card-body`, `.p-tree-node-content`, `.p-accordionheader`, etc. (no template hook)
2. **Component-token sizing** — fixed label columns, asymmetric tile padding, bar height when value is not on `--spacing-*` scale
3. **CSS grid** — no `o-grid` utility yet; document with a comment
4. **Scroll affordance** — `scroll-padding-*`, `scroll-margin-*` on owned scroll wrappers
5. **Typography resets** — `margin: 0` on headings inside components
6. **Visual chrome** — borders, backgrounds, shadows, radii (not layout)
7. **Absolute positioning / collapse animations** — overlay panels, discrete `display` reveals (`c-nav-shell`, `c-iconography__copy-hint`)
8. **Doc primitives** — `c-demo-cell` / `c-spacing-swatch` in Storybook inline markup; pair with `o-flex` / `o-layout` in the story template string

## Semantic border tokens (`_settings.colors-semantic.scss`)

Use shared roles in component SCSS — not feature-specific border aliases:

| Token | Role | Typical use |
|-------|------|-------------|
| `--sds-color-panel-border` | Flat panel chrome (#e7e7e7) | Section dividers, list shell, bordered accordion, flush card header rule |
| `--sds-color-card-border` | Elevated card outline (#d1d1d1) | `p-card` rings, selectable list rows |
| `--sds-color-content-border` | Subtle inset border | Nav shells, tiles, notes |
| `--sds-color-surface-border` | Light surface edge | Iconography cards, doc demos |

PrimeNG bridges: `--p-card-border-color: var(--sds-color-card-border)` or `panel-border` per context.

## DEFAULT PrimeNG (no scoped `--p-*` / `.p-*` overrides)

- button, stepper, tag, inputs
- drawer, modal/dialog, popover, menu

No `styleClass` on `p-drawer` / `p-dialog` roots.

## Custom classes — only when needed

- `c-form-field` (label layout)
- `c-drawer` — headless drawer shell (`__header`, `__toolbar`, `__content`, `__section`, `__section-title`); feature elements use the block prefix in the element name (e.g. `__affiliate-detail-name`, `__affiliate-detail-note`)
- `c-detail-list` — label/value description rows (`__label`, `__value`)
- `c-panel-chrome--border-bottom` — flat panel bottom rule (overview card, etc.)
- `c-accordion--bordered` (bordered stacked accordion)
- `c-timeline--content-only` (single-column timeline — hides empty opposite column)
- `c-list` tree variant (`.c-list--journey` / `.c-list--flat`)
- `p-card` surface wrappers (named panel chrome)

## BEMIT

Keep blocks flat; shallow modifiers only. No doubled-class specificity (`.c-foo.c-foo`).

When a shared block has feature-specific children, prefix the **element** name — do not create a nested block:

| Avoid | Prefer |
|-------|--------|
| `c-affiliate-detail-drawer__name` | `c-drawer__affiliate-detail-name` |
| `c-document-more-details-drawer__title` | `c-drawer__document-more-details-title` |

Standalone `libs/ui` components keep their own block (`c-affiliate-overview-card`, `c-list`). Shared layout primitives stay separate blocks (`c-detail-list`, `c-panel-chrome`).

## Specificity over PrimeNG

1. ITCSS layer order (unlayered components after `@layer primeng`)
2. `:is()` / `:where()` on scoped wrapper
3. `@layer components { … }`

## Overlays

No `styleClass` on `p-drawer` / `p-dialog` roots. Use `appendTo="body"` for drawers/dialogs inside flex or `overflow-hidden` layouts. Content-driven width: `[style]` with `--sds-size-drawer-min-width` / `--sds-size-drawer-max-width` from `_settings.drawer.scss` (`width: max-content`).

## Scroll affordance

Owned wrapper + `o-scroll-shadow` on our element — not doubled `.p-card-body` selectors.

## Global parity (allowed without approval)

- `.p-tag-icon` line-height for icon box alignment

## Navigation shell exceptions

`c-accordion--nav` and `c-accordion--chromeless` use transparent accordion bridges for nav/list chrome — not bordered panels. Use `c-accordion--bordered` where stacked bordered panels are required.
