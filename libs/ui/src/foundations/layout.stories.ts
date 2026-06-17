// =============================================================================
// libs/ui/src/foundations/layout.stories.ts
// Foundations / Layout — o-layout utility class docs.
// Each export is a self-contained live demo wrapped in .sb-demo-wrapper.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';

export default {
  title: 'Foundations/Layout',
  tags: ['!autodocs'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The layout object \`.o-layout\` provides utility modifier classes for **spacing**, **overflow**, **dimensions**, **display**, and **position**.

Apply these classes as **BEM mixes** directly in HTML templates alongside \`.o-flex\` — never write raw spacing values in component SCSS.

All modifiers support **responsive variants** via the \`@{breakpoint}\` suffix:
\`o-layout--hidden@md\`, \`o-layout--gap-4@lg\`, \`o-layout--overflow-y-auto@sm\`

Breakpoints: \`sm\` (48rem) · \`md\` (62rem) · \`lg\` (75rem) · \`xl\` (87.5rem)

| Category | Modifier pattern | Purpose |
|---|---|---|
| Dimensions | \`o-layout--full-height\`, \`--full-width\`, \`--full-dvh\`, \`--min-h-0\`, \`--min-w-0\` | Structural size helpers |
| Overflow | \`o-layout--overflow[-x\|-y]-{value}\` | Controls overflow (responsive) |
| Display | \`o-layout--{block\|inline-block\|hidden\|grid\|...}\` | Sets display (responsive) |
| Position | \`o-layout--{relative\|absolute\|fixed\|sticky\|static}\` | Sets position (responsive) |
| Sticky | \`o-layout--sticky-top\` | Shorthand for \`position: sticky; top: 0\` |
| Spacing | \`o-layout--{property}-{scale}\` | Gap / padding / margin from spacing scale (responsive) |

Styles: \`libs/styles/src/05-objects/layout/_objects.layout.scss\`
Rule: \`.ai/rules/08-object-classes.md\`
        `,
      },
    },
  },
  argTypes: {
    'o-layout': {
      name: '.o-layout',
      description: 'Layout object initializer — required on any element that uses an o-layout modifier',
      table: { category: 'Block' },
    },
    'o-layout--full-height': {
      name: '.o-layout--full-height',
      description: 'Sets height: 100% — must be added to all ancestors up to a container with a height',
      table: { category: 'Dimensions' },
    },
    'o-layout--full-width': {
      name: '.o-layout--full-width',
      description: 'Sets width: 100% — stretches to container width',
      table: { category: 'Dimensions' },
    },
    'o-layout--full-dvh': {
      name: '.o-layout--full-dvh',
      description: 'Sets height: 100dvh — full dynamic viewport height (mobile-aware)',
      table: { category: 'Dimensions' },
    },
    'o-layout--min-h-0': {
      name: '.o-layout--min-h-0',
      description: 'Sets min-height: 0 — enables flex children to scroll/shrink below content size',
      table: { category: 'Dimensions' },
    },
    'o-layout--min-w-0': {
      name: '.o-layout--min-w-0',
      description: 'Sets min-width: 0 — enables text truncation in flex children',
      table: { category: 'Dimensions' },
    },
    'o-layout--overflow-{value}': {
      name: '.o-layout--overflow-{value}',
      description: 'Shorthand overflow. Values: hidden auto overlay scroll visible unset initial inherit. Supports @{bp}',
      table: { category: 'Overflow' },
    },
    'o-layout--overflow-x-{value}': {
      name: '.o-layout--overflow-x-{value}',
      description: 'overflow-x. Values: hidden auto overlay scroll visible unset initial inherit. Supports @{bp}',
      table: { category: 'Overflow' },
    },
    'o-layout--overflow-y-{value}': {
      name: '.o-layout--overflow-y-{value}',
      description: 'overflow-y. Values: hidden auto overlay scroll visible unset initial inherit. Supports @{bp}',
      table: { category: 'Overflow' },
    },
    'o-layout--{display}': {
      name: '.o-layout--{display}',
      description: 'Display. Values: block inline-block inline hidden grid inline-flex contents. Supports @{bp}',
      table: { category: 'Display' },
    },
    'o-layout--{position}': {
      name: '.o-layout--{position}',
      description: 'Position. Values: relative absolute fixed sticky static. Supports @{bp}',
      table: { category: 'Position' },
    },
    'o-layout--sticky-top': {
      name: '.o-layout--sticky-top',
      description: 'Shorthand: position: sticky + top: 0. For sticky headers/toolbars.',
      table: { category: 'Position' },
    },
    'o-layout--gap-{scale}': {
      name: '.o-layout--gap-{scale}',
      description: 'gap — requires Flex or Grid display. Scale: 0 0-25 0-5 0-75 1 1-5 2 3 4 5 6 7 auto. Supports @{bp}',
      table: { category: 'Spacing' },
    },
    'o-layout--padding-{scale}': {
      name: '.o-layout--padding-{scale}',
      description: 'padding shorthand. Scale: 0 0-25 0-5 0-75 1 1-5 2 3 4 5 6 7 auto. Supports @{bp}',
      table: { category: 'Spacing' },
    },
    'o-layout--margin-{scale}': {
      name: '.o-layout--margin-{scale}',
      description: 'margin shorthand. Scale: 0 0-25 0-5 0-75 1 1-5 2 3 4 5 6 7 auto. Supports @{bp}',
      table: { category: 'Spacing' },
    },
  },
} as Meta;

// ── Dimensions ────────────────────────────────────────────────────────────────
export const Dimensions = {
  name: 'Dimensions',
  parameters: {
    docs: {
      description: {
        story: `
Dimensional helper classes for common structural sizing needs.

| Class | CSS | Use case |
|---|---|---|
| \`.o-layout--full-height\` | \`height: 100%\` | Fill parent height (add to all flex ancestors) |
| \`.o-layout--full-width\` | \`width: 100%\` | Stretch to container width |
| \`.o-layout--full-dvh\` | \`height: 100dvh\` | Full viewport height (mobile-safe) |
| \`.o-layout--min-h-0\` | \`min-height: 0\` | Enable scroll within flex children |
| \`.o-layout--min-w-0\` | \`min-width: 0\` | Enable text truncation within flex children |

\`\`\`html
<!-- Scrollable flex child -->
<div class="o-flex o-flex--col o-layout--full-dvh">
  <header class="o-flex__item--shrink-0">Header</header>
  <main class="o-layout--min-h-0 o-layout--overflow-y-auto">
    Scrollable content...
  </main>
</div>

<!-- Truncated text in flex row -->
<div class="o-flex o-flex--align-items-center">
  <span class="o-layout--min-w-0" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
    Very long text that truncates...
  </span>
</div>
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--col" style="height: 200px; border: 1px solid #ccc;">
      <div class="c-demo-cell o-flex__item--shrink-0">Header (shrink-0)</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--min-h-0 o-layout--overflow-y-auto" style="flex: 1 1 0;">
        <div style="height: 400px; padding: 1rem;">Scrollable content (min-h-0 + overflow-y-auto)</div>
      </div>
      <div class="c-demo-cell o-flex__item--shrink-0">Footer (shrink-0)</div>
    </div>`,
  }),
};

// ── Full Height ───────────────────────────────────────────────────────────────
export const FullHeight = {
  name: 'Full Height',
  parameters: {
    docs: {
      description: {
        story: `
\`.o-layout--full-height\` sets \`height: 100%\`.
In order to use a vertical grid with \`.o-flex--col\`, its ancestor needs to have a height set.
As fixing a container's height is not recommended, \`.o-layout--full-height\` will set it to a relative value: \`height: 100%\`.

> \`.o-layout--full-height\` needs to be added to **all** \`.o-flex__item\` ancestors until a container with a height is reached, or up to the \`html\` tag.

\`\`\`html
<html class="o-layout o-layout--full-height">
  <body class="o-layout o-layout--full-height">
    <main class="o-layout o-layout--full-height">
      <div class="o-flex o-flex--col o-layout o-layout--full-height">
        <div class="o-flex__item"></div>
      </div>
    </main>
  </body>
</html>
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout o-layout--full-height" style="height: 300px">
      <div class="o-flex__item c-demo-cell"></div>
      <div class="o-flex__item o-flex__item--8 c-demo-cell c-demo-cell--accent"></div>
      <div class="o-flex__item c-demo-cell"></div>
    </div>`,
  }),
};

// ── Overflow ──────────────────────────────────────────────────────────────────
export const Overflow = {
  name: 'Overflow',
  parameters: {
    docs: {
      description: {
        story: `
Overflow syntax: \`.o-layout--overflow-[axis?]-[value]\`

**Axes:** shorthand (\`overflow-{value}\`), \`overflow-x-{value}\`, \`overflow-y-{value}\`

**Values:** \`hidden\` \`auto\` \`overlay\` \`scroll\` \`visible\` \`unset\` \`initial\` \`inherit\`

**Responsive:** All overflow classes support \`@{breakpoint}\` variants.

\`\`\`html
<!-- Always hidden, auto at md -->
<div class="o-layout--overflow-hidden o-layout--overflow-auto@md">...</div>

<!-- Scroll only on y-axis -->
<div class="o-layout--overflow-x-hidden o-layout--overflow-y-auto">...</div>
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout o-layout--overflow-y-auto" style="height: 150px; border: 1px solid #ccc;">
      <div class="c-demo-cell o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="min-height: 80px;">Item 1</div>
      <div class="c-demo-cell c-demo-cell--accent o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="min-height: 80px;">Item 2</div>
      <div class="c-demo-cell o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="min-height: 80px;">Item 3</div>
    </div>`,
  }),
};

// ── Display ───────────────────────────────────────────────────────────────────
export const Display = {
  name: 'Display',
  parameters: {
    docs: {
      description: {
        story: `
Display classes control the \`display\` property with responsive support.

| Class | CSS |
|---|---|
| \`.o-layout--block\` | \`display: block\` |
| \`.o-layout--inline-block\` | \`display: inline-block\` |
| \`.o-layout--inline\` | \`display: inline\` |
| \`.o-layout--hidden\` | \`display: none\` |
| \`.o-layout--grid\` | \`display: grid\` |
| \`.o-layout--inline-flex\` | \`display: inline-flex\` |
| \`.o-layout--contents\` | \`display: contents\` |

> \`.o-layout--grid\` only sets \`display: grid\`. For a full column system (equal cols, auto-fit/fill, span, alignment), use the **\`.o-grid\`** object — see [Foundations/Grid (CSS)](?path=/story/foundations-grid-css--template-columns).

**Responsive:** All display classes support \`@{breakpoint}\` variants.

\`\`\`html
<!-- Hidden on mobile, visible as block from md up -->
<aside class="o-layout--hidden o-layout--block@md">Sidebar</aside>

<!-- Grid layout from lg up -->
<div class="o-layout--block o-layout--grid@lg">...</div>
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div style="border: 1px solid #ccc; padding: 1rem;">
      <div class="c-demo-cell o-layout--block">block (always visible)</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--hidden o-layout--block@md">hidden → block@md (resize viewport)</div>
      <div class="c-demo-cell o-layout--inline-block" style="margin-top: 0.5rem;">inline-block</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--inline-block" style="margin-top: 0.5rem;">inline-block</div>
    </div>`,
  }),
};

// ── Position ──────────────────────────────────────────────────────────────────
export const Position = {
  name: 'Position',
  parameters: {
    docs: {
      description: {
        story: `
Position classes set the \`position\` property with responsive support.

| Class | CSS |
|---|---|
| \`.o-layout--relative\` | \`position: relative\` |
| \`.o-layout--absolute\` | \`position: absolute\` |
| \`.o-layout--fixed\` | \`position: fixed\` |
| \`.o-layout--sticky\` | \`position: sticky\` |
| \`.o-layout--static\` | \`position: static\` |
| \`.o-layout--sticky-top\` | \`position: sticky; top: 0\` |

**Responsive:** All position classes support \`@{breakpoint}\` variants.

\`\`\`html
<!-- Sticky header within a scrollable container -->
<header class="o-layout--sticky-top">Sticks to top on scroll</header>

<!-- Relative container for absolute positioning -->
<div class="o-layout--relative">
  <span class="o-layout--absolute" style="top: 0; right: 0;">Badge</span>
</div>
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-layout--overflow-y-auto" style="height: 200px; border: 1px solid #ccc;">
      <div class="c-demo-cell c-demo-cell--accent o-layout--sticky-top">Sticky header (scroll me)</div>
      <div class="c-demo-cell o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="height: 100px;">Content 1</div>
      <div class="c-demo-cell c-demo-cell--accent o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="height: 100px;">Content 2</div>
      <div class="c-demo-cell o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="height: 100px;">Content 3</div>
    </div>`,
  }),
};

// ── Spacing ───────────────────────────────────────────────────────────────────
export const Spacing = {
  name: 'Spacing',
  parameters: {
    docs: {
      description: {
        story: `
Spacing classes apply gap, padding, or margin from the spacing scale.

\`\`\`html
<div class="o-layout o-layout--{property}-{scale}"></div>
\`\`\`

**Properties:** \`gap\` \`row-gap\` \`column-gap\` \`padding\` \`padding-top\` \`padding-right\` \`padding-bottom\` \`padding-left\` \`padding-inline\` \`padding-block\` \`margin\` \`margin-top\` \`margin-right\` \`margin-bottom\` \`margin-left\` \`margin-inline\` \`margin-block\`

**Scale:** \`0\` \`0-25\` \`0-5\` \`0-75\` \`1\` \`1-5\` \`2\` \`3\` \`4\` \`5\` \`6\` \`7\` \`auto\`

**Responsive:** All spacing classes support \`@{breakpoint}\` variants.

\`\`\`html
<!-- gap-2 on mobile, gap-4 from md up -->
<div class="o-flex o-layout--gap-2 o-layout--gap-4@md">...</div>

<!-- padding-2 on mobile, padding-4 from lg up -->
<div class="o-layout--padding-2 o-layout--padding-4@lg">...</div>
\`\`\`

Or reuse the variables in your \`.scss\`:

\`\`\`scss
padding: var(--sds-space-2) var(--sds-space-1-5) var(--sds-space-0) var(--sds-space-2);
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout o-layout--gap-2">
      <div class="o-flex__item o-flex__item--3 c-demo-cell">gap-2</div>
      <div class="o-flex__item c-demo-cell c-demo-cell--accent">gap-2</div>
      <div class="o-flex__item o-flex__item--3 c-demo-cell">gap-2</div>
    </div>
    <div class="o-flex o-layout o-layout--padding-2 o-layout--margin-top-2" style="border: 1px dashed #ccc;">
      <div class="o-flex__item o-flex__item--4 c-demo-cell">padding-2</div>
      <div class="o-flex__item o-flex__item--4 c-demo-cell c-demo-cell--accent">padding-2</div>
      <div class="o-flex__item o-flex__item--4 c-demo-cell">padding-2</div>
    </div>
    <div class="o-flex o-layout o-layout--margin-top-2">
      <div class="o-flex__item o-flex__item--3 c-demo-cell">margin-top-2</div>
      <div class="o-flex__item o-flex__item--6 c-demo-cell c-demo-cell--accent">margin-top-2</div>
      <div class="o-flex__item o-flex__item--3 c-demo-cell">margin-top-2</div>
    </div>`,
  }),
};

// ── Responsive ────────────────────────────────────────────────────────────────
export const Responsive = {
  name: 'Responsive',
  parameters: {
    docs: {
      description: {
        story: `
All layout modifiers support responsive variants using the \`@{breakpoint}\` suffix.

**Breakpoints:** \`sm\` (768px) · \`md\` (992px) · \`lg\` (1200px) · \`xl\` (1400px)

Pattern: \`.o-layout--{modifier}@{breakpoint}\`

The responsive class applies from that breakpoint **upward** (mobile-first, \`min-width\`).

\`\`\`html
<!-- Gap increases at each breakpoint -->
<div class="o-flex o-layout--gap-1 o-layout--gap-2@sm o-layout--gap-4@lg">...</div>

<!-- Hidden until md, then block -->
<aside class="o-layout--hidden o-layout--block@md">Sidebar</aside>

<!-- Overflow auto only on small screens -->
<div class="o-layout--overflow-y-auto o-layout--overflow-y-visible@lg">...</div>

<!-- Sticky only from md up -->
<header class="o-layout--static o-layout--sticky@md" style="top: 0;">Nav</header>
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">
      Resize the viewport to see responsive changes.
    </p>
    <div class="o-flex o-flex--wrap o-layout--gap-1 o-layout--gap-2@sm o-layout--gap-4@lg">
      <div class="c-demo-cell o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="flex: 1; min-width: 100px;">gap-1 → gap-2@sm → gap-4@lg</div>
      <div class="c-demo-cell c-demo-cell--accent o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="flex: 1; min-width: 100px;">Resize me</div>
      <div class="c-demo-cell o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="flex: 1; min-width: 100px;">to see gap change</div>
    </div>
    <div class="o-layout--hidden o-layout--block@md c-demo-cell c-demo-cell--accent" style="margin-top: 1rem;">
      I'm hidden below md, visible from md up
    </div>`,
  }),
};

