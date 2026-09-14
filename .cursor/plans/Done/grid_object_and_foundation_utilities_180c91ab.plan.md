---
name: Grid object and foundation utilities
overview: Add a token-driven minimal utility layer for radius, borders, and shadows (adapted from the reference foundations' good ideas, not their combinatorial complexity), introduce an o-grid CSS Grid object parallel to o-flex (reusing the already-defined-but-dead grid Sass maps), and document all of it in Storybook foundations.
todos:
  - id: settings-borders
    content: Add _settings.borders.scss (border-width tokens) and forward from settings.core
    status: completed
  - id: status-color-ssot
    content: Audit/de-duplicate status colors in 01-settings (add danger-emphasis, point error + form-*-invalid at canonical --sds-color-* tokens)
    status: completed
  - id: tools-mixins
    content: Add 02-tools _tools.radius.scss + _tools.borders.scss mixins; forward from tools.core
    status: completed
  - id: util-radius
    content: Add _utilities.radius.scss (u-radius-* all + per-side + per-corner) delegating to radius mixin
    status: completed
  - id: util-borders
    content: Add _utilities.borders.scss (sides via border mixin + orthogonal u-border-thick/dashed + status u-border-success/warning/danger/info)
    status: completed
  - id: accordion-refactor
    content: Refactor _components.accordion.scss to @include the radius/border mixins instead of raw border-*-radius writes
    status: completed
  - id: util-shadows
    content: Add _utilities.shadows.scss (u-shadow-* from shadow tokens)
    status: completed
  - id: util-barrel
    content: Forward radius/borders/shadows from _utilities.core.scss
    status: completed
  - id: grid-maps
    content: Add $grid-auto-flow + --sds-grid-min token (and curated place-* usage) to _settings.grid.scss
    status: completed
  - id: objects-grid
    content: Create _objects.grid.scss (o-grid cols-1-12 + auto-fit/auto-fill + custom-property escape hatch + o-grid__item, responsive) and forward from objects.core
    status: completed
  - id: grid-enforcement
    content: Update flex-grid header contract comments to route display:grid/grid-template-* to o-grid
    status: completed
  - id: story-grid
    content: Add o-grid.stories.ts (Foundations/Grid (CSS)); retitle existing grid story to Flex Grid
    status: completed
  - id: story-borders
    content: Add borders.stories.ts (Foundations/Borders) for u-radius/u-border
    status: completed
  - id: story-elevation
    content: Add elevation.stories.ts (Foundations/Elevation) for u-shadow
    status: completed
  - id: story-layout-link
    content: Cross-link o-grid from layout.stories.ts Display section
    status: completed
  - id: verify
    content: Compile SCSS + visually verify new foundation pages in Storybook
    status: completed
isProject: false
---

# Grid Object + Foundation Utilities Plan

## Part 1 — Borders / Shadows / Radius: token-driven `u-` utility layer

### Assessment of the reference (`libs/plectrum/src/borders`, `libs/plectrum/src/shadows`)

What the reference does well (worth adapting):

- Single Sass map as the source of truth, then a generator loop emits classes.
- One `border()` / `shadow()` mixin so callers do not repeat raw CSS.
- Foundations are documented and demoed in Storybook.

What to deliberately NOT copy:

- The **color matrix**: every `status` (input/button/tag/card/alert…) crossed with every direction and style. This is what produced hundreds of mostly-unused classes. We handle color/width/style via **overridable custom properties** instead, so the geometric axis stays small.
- `@extend %placeholder` based generation (specificity + output-order fragility).
- Getter-function indirection (`get-border-status`, `map-collect`, `map-deep-get`).
- Coupling to the old color system (`--color--generic--border__default`). Our SSOT is `--sds-*` in [`_settings.colors-semantic.scss`](libs/styles/src/01-settings/_settings.colors-semantic.scss).

What IS worth keeping from the reference (revised after the accordion review):

- **Per-corner radius** and **per-side border** control. The geometric axis is bounded (~9 targets) and genuinely needed. The reference's mistake was crossing it with the color status matrix, not the axis itself.

Decision (confirmed + revised): token-driven `u-` utilities in `07-utilities`, with directional/corner targets, but color/width/style supplied by overridable custom properties (no per-color class explosion).

### Note on state/position-driven cases (e.g. accordion)

[`_components.accordion.scss:52-112`](libs/styles/src/06-components/_components.accordion.scss) sets per-corner radii on PrimeNG-generated elements (`.p-accordionpanel` / `.p-accordionheader` / `.p-accordioncontent`) selected by `:first-child` / `:last-child` / `[aria-expanded]`. These targets and states cannot be reached by static template classes, so they **remain in component SCSS**. But the geometry logic is still shared: the component `@include`s the same `02-tools` radius/border mixins that generate the utilities (see 1c + 1h), passing its own component token. So there is one definition, consumed by both utilities and components — no duplicated raw `border-*-*-radius` writes.

### 1a. Border width tokens — new `_settings.borders.scss`

We already have semantic border COLORS (`--sds-color-panel-border`, `--sds-color-card-border`, `--sds-color-content-border`, `--sds-color-form-border*`). We are missing border WIDTH tokens (today `1px` is hardcoded inline everywhere).

Create [`libs/styles/src/01-settings/_settings.borders.scss`](libs/styles/src/01-settings/_settings.borders.scss):

```scss
@use 'settings.prefix' as *;

:root {
  --#{$sds-prefix}-border-width-none: 0;
  --#{$sds-prefix}-border-width-default: 1px;
  --#{$sds-prefix}-border-width-thick: 2px;
}
```

Forward it from [`_settings.core.scss`](libs/styles/src/01-settings/_settings.core.scss) right after `settings.radius`.

### 1b. Status color SSOT — audit and de-duplicate

The canonical status colors already exist once in [`_settings.colors-semantic.scss:33-44`](libs/styles/src/01-settings/_settings.colors-semantic.scss) (`--sds-color-success|warning|danger|info` + `-subtle`). The problem is **downstream duplication**: some feature tokens re-reference the primitive instead of the canonical status token. Fix so every status usage funnels through one source.

Changes in [`_settings.colors-semantic.scss`](libs/styles/src/01-settings/_settings.colors-semantic.scss):

```scss
// Add a darker emphasis variant ONCE (used by labels/placeholders that need red-600).
--#{$sds-prefix}-color-danger-emphasis: var(--#{$sds-prefix}-color-red-600);

// error is just an alias of danger — point it at the canonical token.
--#{$sds-prefix}-color-error: var(--#{$sds-prefix}-color-danger);

// Form invalid tokens: stop referencing red-500 / red-600 directly.
--#{$sds-prefix}-color-form-border-invalid: var(
  --#{$sds-prefix}-color-danger
); // was red-500
--#{$sds-prefix}-color-form-float-label-invalid: var(
  --#{$sds-prefix}-color-danger-emphasis
); // was red-600
--#{$sds-prefix}-color-form-invalid-placeholder: var(
  --#{$sds-prefix}-color-danger-emphasis
); // was red-600
```

Then grep for other primitive status references in `01-settings/_settings.*.scss` (e.g. `color-green-`, `color-orange-`, `color-red-`, `color-blue-` used for feedback) and repoint them at `--sds-color-{status}` / `-subtle` / `-emphasis`. Visuals are preserved because the emphasis token keeps the red-600 shade; only the indirection changes. This is the rule already stated at the top of the file ("never reference primitive tokens from components") applied to the settings layer itself.

### 1c. Shared mixins — new `02-tools/_tools.radius.scss` and `_tools.borders.scss`

This is the SSOT mechanism (confirmed: mixins, not `@extend`). The geometry is defined **once** as a parameterized mixin; both the generated `u-` utilities and component SCSS (e.g. the accordion targeting PrimeNG DOM) consume the same mixin.

`02-tools/_tools.radius.scss`:

```scss
@use 'sass:map';

// target -> logical radius properties (RTL-safe)
$radius-targets: (
  top: (
    border-start-start-radius,
    border-start-end-radius,
  ),
  bottom: (
    border-end-start-radius,
    border-end-end-radius,
  ),
  start: (
    border-start-start-radius,
    border-end-start-radius,
  ),
  end: (
    border-start-end-radius,
    border-end-end-radius,
  ),
  top-start: (
    border-start-start-radius,
  ),
  top-end: (
    border-start-end-radius,
  ),
  bottom-start: (
    border-end-start-radius,
  ),
  bottom-end: (
    border-end-end-radius,
  ),
);

/// $value: any CSS radius value, e.g. var(--sds-radius-md) or 0
/// $target: all | top | bottom | start | end | {corner}
@mixin radius($value, $target: all) {
  @if $target == all {
    border-radius: $value;
  } @else {
    @each $prop in map.get($radius-targets, $target) {
      #{$prop}: $value;
    }
  }
}
```

`02-tools/_tools.borders.scss`:

```scss
@use 'sass:map';
@use '../01-settings/settings.prefix' as *;

$border-sides: (
  all: border,
  top: border-block-start,
  bottom: border-block-end,
  inline-start: border-inline-start,
  inline-end: border-inline-end,
  block: border-block,
  inline: border-inline,
);

/// Custom-prop driven by default (utilities); pass explicit values from components.
@mixin border($side: all, $color: null, $width: null, $style: null) {
  $prop: map.get($border-sides, $side);
  $c: if(
    $color == null,
    var(
      --#{$sds-prefix}-border-color,
      var(--#{$sds-prefix}-color-content-border)
    ),
    $color
  );
  $w: if(
    $width == null,
    var(
      --#{$sds-prefix}-border-width,
      var(--#{$sds-prefix}-border-width-default)
    ),
    $width
  );
  $s: if($style == null, var(--#{$sds-prefix}-border-style, solid), $style);
  #{$prop}: $w $s $c;
}
```

Forward both from [`_tools.core.scss`](libs/styles/src/02-tools/_tools.core.scss).

### 1d. Radius utilities — new `_utilities.radius.scss`

Loops the radius stops x targets and delegates to the mixin (no duplicated property logic).

```scss
@use '../01-settings/settings.prefix' as *;
@use '../02-tools/tools.radius' as radius;

$radii: (none, xs, sm, md, lg, xl, 2xl, pill);
$targets: (
  all,
  top,
  bottom,
  start,
  end,
  top-start,
  top-end,
  bottom-start,
  bottom-end
);

@each $r in $radii {
  @each $t in $targets {
    @if $t == all {
      .u-radius-#{$r} {
        @include radius.radius(var(--#{$sds-prefix}-radius-#{$r}), all);
      }
    } @else {
      .u-radius-#{$t}-#{$r} {
        @include radius.radius(var(--#{$sds-prefix}-radius-#{$r}), $t);
      }
    }
  }
}
```

Examples: `u-radius-md` (all), `u-radius-top-lg`, `u-radius-bottom-end-none`. No responsive variants (keeps output bounded).

### 1e. Border utilities — new `_utilities.borders.scss`

Side classes delegate to the mixin; width/style/**status-color** are orthogonal modifiers that just set the custom properties. Status modifiers reuse the single status tokens from 1b — no per-color matrix.

```scss
@use '../01-settings/settings.prefix' as *;
@use '../02-tools/tools.borders' as border;

$sides: (all, top, bottom, inline-start, inline-end, block, inline);
$statuses: (success, warning, danger, info);

@each $side in $sides {
  .u-border-#{$side} {
    @include border.border($side);
  }
}

// Orthogonal modifiers — combine freely with any side class.
.u-border-thick {
  --#{$sds-prefix}-border-width: var(--#{$sds-prefix}-border-width-thick);
}
.u-border-dashed {
  --#{$sds-prefix}-border-style: dashed;
}

// Status colors reuse the canonical tokens (1b) — set the color custom property only.
@each $st in $statuses {
  .u-border-#{$st} {
    --#{$sds-prefix}-border-color: var(--#{$sds-prefix}-color-#{$st});
  }
}
```

Usage:

```html
<header
  class="c-drawer__header u-border-bottom"
  style="--sds-border-color: var(--sds-color-panel-border);"
></header>

<!-- composed: thick dashed danger top border -->
<div class="u-border-top u-border-thick u-border-dashed u-border-danger"></div>
```

(Default color `content-border`, default width/style `1px solid`.) Existing inline rules can migrate opportunistically — not a forced sweep.

### 1f. Shadow utilities — new `_utilities.shadows.scss`

Flat map over existing `--sds-shadow-*` tokens in [`_settings.shadows.scss`](libs/styles/src/01-settings/_settings.shadows.scss). (Elevation only. Status/focus rings are a separate concern handled by `_settings.focus.scss` — out of scope here.)

```scss
@use '../01-settings/settings.prefix' as *;
$shadows: (
  sm,
  md,
  xl,
  overlay-modal,
  overlay-select,
  overlay-popover,
  overlay-navigation
);

.u-shadow-none {
  box-shadow: none;
}
@each $s in $shadows {
  .u-shadow-#{$s} {
    box-shadow: var(--#{$sds-prefix}-shadow-#{$s});
  }
}
```

### 1g. Wire barrels

Add to [`_tools.core.scss`](libs/styles/src/02-tools/_tools.core.scss):

```scss
@forward 'tools.radius';
@forward 'tools.borders';
```

Add to [`_utilities.core.scss`](libs/styles/src/07-utilities/_utilities.core.scss):

```scss
@forward 'utilities.radius';
@forward 'utilities.borders';
@forward 'utilities.shadows';
```

Add `@forward "settings.borders";` to [`_settings.core.scss`](libs/styles/src/01-settings/_settings.core.scss) after `settings.radius` (per 1a).

### 1h. Refactor accordion to consume the mixin (proof of SSOT)

[`_components.accordion.scss:32-112`](libs/styles/src/06-components/_components.accordion.scss) currently hand-writes ~60 lines of `border-*-*-radius` and a `border-block-end` against PrimeNG DOM (`:first-child` / `:last-child` / `[aria-expanded]`). It cannot use template classes, but it CAN `@include` the same mixins, removing the duplicated raw geometry:

```scss
@use '../02-tools/tools.radius' as radius;
@use '../02-tools/tools.borders' as border;

// before:
//   border-start-start-radius: var(--sds-radius-accordion-bordered-header);
//   border-start-end-radius:   var(--sds-radius-accordion-bordered-header);
// after:
@include radius.radius(
  var(--#{$sds-prefix}-radius-accordion-bordered-header),
  top
);

// before:
//   border-end-start-radius: var(--sds-radius-none);
//   border-end-end-radius:   var(--sds-radius-none);
// after:
@include radius.radius(0, bottom);

// before: border-block-end: 1px solid var(--sds-color-panel-border);
// after:
@include border.border(bottom, var(--#{$sds-prefix}-color-panel-border));
```

This is the concrete answer to "can we extend the utility in CSS?": yes — via the shared mixin, with the component's own token, and no `@extend` fragility.

---

## Part 2 — `o-grid` CSS Grid object

Today only `o-flex` (flex grid) and `o-layout--grid` (bare `display:grid`) exist. Meanwhile [`_settings.grid.scss`](libs/styles/src/01-settings/_settings.grid.scss) already defines `$justify-items`, `$place-items`, `$place-content`, `$justify-self`, `$place-self`, `$align-self`, `$align-items`, `$align-content`, `$justify-content` — most are **dead code today** and exist precisely for a grid object. We reuse them with the existing [`responsive-modifiers`](libs/styles/src/02-tools/_tools.responsive-modifiers.scss) mixin.

### Design philosophy — bounded utilities + escape hatch (NOT 12-cols-only)

CSS Grid's strength is custom track definitions, not fixed 12-column layouts. So `o-grid` is built in three tiers so it does not box callers into equal columns:

- **Tier 1 — bounded utility classes** for the common cases: equal columns `--cols-{1-12}` and responsive auto grids `--auto-fit` / `--auto-fill` (driven by a `--sds-grid-min` custom property). These cover ~90% of real usage.
- **Tier 2 — custom-property escape hatch**: `.o-grid` reads `grid-template-columns: var(--sds-grid-template-columns, none)` (and `...-rows`). Any arbitrary track list (`200px 1fr 2fr`, `auto 1fr auto`) is set via the custom property while still getting all alignment modifiers + `o-layout--gap-*`. No class explosion.
- **Tier 3 — case-by-case in component SCSS** for the genuinely bespoke (named `grid-template-areas`, complex row templates): the component sets `--sds-grid-template-columns` / writes `grid-template` directly, exactly like the accordion owns its radii. Document this as the intended path for named-area layouts.

### 2a. Add grid maps + tokens to `_settings.grid.scss`

```scss
$grid-auto-flow: (
  row: row,
  col: column,
  row-dense: row dense,
  col-dense: column dense,
);
```

Add a default min-track token for the auto-fit/fill responsive grids (Tier 1):

```scss
:root {
  --#{$sds-prefix}-grid-min: 16rem; // default min column width for auto-fit/auto-fill
}
```

(`$grid-cols: 12` already exists and is reused.)

### 2b. New `_objects.grid.scss`

```scss
@use 'sass:map';
@use '../01-settings/settings.grid' as grid;
@use '../01-settings/settings.breakpoints' as bp-settings;
@use '../02-tools/tools.breakpoints' as bp;
@use '../02-tools/tools.responsive-modifiers' as rm;

.o-grid {
  display: grid;

  // Tier 2 — escape hatch: arbitrary track lists via custom property.
  // Default `none` = no template unless a --cols-* class or the custom prop is set.
  grid-template-columns: var(--#{$sds-prefix}-grid-template-columns, none);
  grid-template-rows: var(--#{$sds-prefix}-grid-template-rows, none);

  // Tier 1a — equal columns 1..12 (+ responsive)
  @for $i from 1 through grid.$grid-cols {
    &--cols-#{$i} {
      grid-template-columns: repeat(#{$i}, minmax(0, 1fr));
    }
  }
  // ...responsive @each breakpoint loop (mirror flex-grid pattern)

  // Tier 1b — responsive auto grids (reflow without breakpoints).
  // Column count derives from container width and --sds-grid-min.
  &--auto-fit {
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(var(--#{$sds-prefix}-grid-min), 100%), 1fr)
    );
  }
  &--auto-fill {
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(var(--#{$sds-prefix}-grid-min), 100%), 1fr)
    );
  }

  // auto-flow shorthand
  @include rm.responsive-shorthand-modifiers(
    grid.$grid-auto-flow,
    grid-auto-flow
  );

  // container alignment (reuse existing maps)
  @include rm.responsive-modifiers(
    'justify-items',
    grid.$justify-items,
    justify-items
  );
  @include rm.responsive-modifiers(
    'align-items',
    grid.$align-items,
    align-items
  );
  @include rm.responsive-modifiers(
    'place-items',
    grid.$place-items,
    place-items
  );
  @include rm.responsive-modifiers(
    'justify-content',
    grid.$justify-content,
    justify-content
  );
  @include rm.responsive-modifiers(
    'align-content',
    grid.$align-content,
    align-content
  );
  @include rm.responsive-modifiers(
    'place-content',
    grid.$place-content,
    place-content
  );
}

.o-grid__item {
  @for $i from 1 through grid.$grid-cols {
    &--col-span-#{$i} {
      grid-column: span #{$i};
    }
    &--row-span-#{$i} {
      grid-row: span #{$i};
    }
    &--col-start-#{$i} {
      grid-column-start: #{$i};
    }
  }
  // ...responsive variants for col-span/row-span

  // item alignment (reuse existing maps)
  @include rm.responsive-modifiers(
    'justify-self',
    grid.$justify-self,
    justify-self
  );
  @include rm.responsive-modifiers('align-self', grid.$align-self, align-self);
  @include rm.responsive-modifiers('place-self', grid.$place-self, place-self);
}
```

Gap is intentionally NOT redefined here — reuse `o-layout--gap-*` as a BEM mix (same contract as `o-flex`). Document this.

Usage across the three tiers:

```html
<!-- Tier 1a: equal columns -->
<div class="o-grid o-grid--cols-3 o-layout--gap-3">…</div>

<!-- Tier 1b: responsive auto grid (cards reflow; override min per instance) -->
<ul
  class="o-grid o-grid--auto-fit o-layout--gap-2"
  style="--sds-grid-min: 12rem;"
>
  …
</ul>

<!-- Tier 2: arbitrary track list, still gets alignment + gap -->
<div
  class="o-grid o-grid--align-items-center o-layout--gap-4"
  style="--sds-grid-template-columns: auto 1fr auto;"
>
  …
</div>
```

```scss
// Tier 3: bespoke named-area layout in component SCSS (owns its template)
.c-page-shell {
  @extend .o-grid; // or just compose the class in template
  --#{$sds-prefix}-grid-template-columns: 16rem 1fr;
  grid-template-areas: 'sidebar main';
}
```

### 2c. Wire objects barrel

Add `@forward 'objects.grid';` to [`_objects.core.scss`](libs/styles/src/05-objects/_objects.core.scss).

### 2d. Enforcement note

Update the header contract comment in [`_objects.flex-grid.scss`](libs/styles/src/05-objects/_objects.flex-grid.scss) (and the new grid file) so `display: grid` + `grid-template-*` are routed to `o-grid`, mirroring the existing flex forbiddance list.

---

## Part 3 — Storybook foundations docs

Foundations live in [`libs/ui/src/foundations/`](libs/ui/src/foundations/) (the `*.stories.ts` pattern with `.sb-demo-wrapper` / `.c-demo-cell`). The `libs/ui/.storybook/temp_guidelines/*` are old reference stories — leave untouched.

### 3a. CSS Grid story — new `o-grid.stories.ts`

- `title: 'Foundations/Grid (CSS)'`, mirroring the structure of [`grid.stories.ts`](libs/ui/src/foundations/grid.stories.ts).
- Stories: Template Columns (`--cols-*`), Auto Grid (`--auto-fit` / `--auto-fill` with a `--sds-grid-min` slider/example), Custom Template (escape hatch via `--sds-grid-template-columns`), Column/Row Span, Auto-flow, Justify/Align/Place Items, Justify/Align/Place Content, Item self-alignment, Responsive (`--cols-2 --cols-4@md`), Gap via `o-layout--gap-*`.
- Briefly document the three-tier model (bounded utilities / custom-property escape hatch / case-by-case named areas) so consumers know custom grids are first-class, not a workaround.
- Retitle existing [`grid.stories.ts`](libs/ui/src/foundations/grid.stories.ts) component doc from `Foundations/Grid` to `Foundations/Flex Grid` to disambiguate (and add a one-line cross-link to the CSS grid page). File rename to `flex-grid.stories.ts` optional.

### 3b. Borders & Radius story — new `borders.stories.ts`

- `title: 'Foundations/Borders'`.
- Radius: demo the `u-radius-{stop}` swatches plus the per-side (`u-radius-top-*`) and per-corner (`u-radius-bottom-end-*`) targets on a sample box.
- Borders: demo each `u-border-*` side, the orthogonal `u-border-thick` / `u-border-dashed` modifiers (shown composed), the status modifiers `u-border-success|warning|danger|info`, and the `--sds-border-color` override (panel vs card vs content border) including default-color behavior.

### 3c. Elevation (Shadows) story — new `elevation.stories.ts`

- `title: 'Foundations/Elevation'`.
- Demo each `u-shadow-*` on a card-like cell; table mapping class -> token -> use case (matches the existing layout-story doc style).

### 3d. Cross-link in `layout.stories.ts`

In the Display section of [`layout.stories.ts`](libs/ui/src/foundations/layout.stories.ts), note that `o-layout--grid` only sets `display: grid`; for a full column system use the `o-grid` object (link Foundations/Grid (CSS)).

---

## Verification

- `npx nx build styles` (or the SCSS compile target) must pass — watch for Sass map key collisions in the grid maps (e.g. `place-*` maps contain underscore keys like `end_start`, which produce class names like `o-grid--place-items-end_start`; confirm that is acceptable or filter to a curated subset).
- Run Storybook (`npm run start` is already running per terminal 1) and visually verify the new foundation pages render and all utilities resolve to real tokens (no `var()` fallback gaps).
- After the status-color de-dup (1b) and accordion refactor (1h), confirm no visual diff: form invalid states still red (danger), accordion radii/borders unchanged. Re-run affected component tests (accordion, form-field, affiliate-\* drawers).
- Grep for primitive status references (`color-red-`, `color-green-`, `color-orange-`) left in `01-settings` to ensure the audit was complete.
- Grep for the most common inline `border-block-end: 1px solid var(--sds-color-panel-border)` / `border: 1px solid` patterns and migrate a couple (drawer header, detail-list, card) as proof-of-use of the new mixin/utilities — not a mandatory full sweep.

## Decisions / defaults taken

- SSOT mechanism is **mixins** (`02-tools/_tools.radius.scss`, `_tools.borders.scss`), not `@extend` placeholders — parameterized, no output-order/specificity surprises. Utilities and components both consume them.
- Border utility color/width/style via overridable custom properties (default `content-border` / `1px` / `solid`); status colors exposed as 4 orthogonal modifier classes that reuse the canonical `--sds-color-{status}` tokens — no per-color matrix.
- Status colors are de-duplicated to a single source: `error` aliases `danger`; a new `danger-emphasis` (red-600) covers darker label/placeholder usages; `form-*-invalid` repoint at canonical tokens. Visuals preserved.
- `o-grid` is NOT 12-cols-only: three tiers — bounded utilities (`--cols-{1-12}`, `--auto-fit`/`--auto-fill`), a custom-property escape hatch (`--sds-grid-template-columns/-rows`) for arbitrary tracks, and case-by-case component SCSS for named areas. Default auto-grid min track is `--sds-grid-min: 16rem` (overridable per instance).
- Grid gap reuses `o-layout--gap-*` rather than duplicating gap classes on `o-grid`.
- `place-*` maps: will expose a **curated** subset (center, start, end, stretch, space-between) rather than the full underscore-keyed list, to keep class names clean. Flag during implementation if you want the full set.
