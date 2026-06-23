// =============================================================================
// libs/ui/src/foundations/scroll-shadow.stories.ts
// Foundations / Scroll Shadow — .o-scroll-shadow scroll-driven edge affordance.
// Pure CSS (scroll-timeline + keyframes), no JS. Chromium-only today.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';

export default {
  title: 'Foundations/Scroll Shadow',
  tags: ['!autodocs'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Scroll-driven edge fades for scroll containers — a visual cue that more content exists beyond the visible area. **Pure CSS** via [\`scroll-timeline\`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline); no JavaScript.

### Block axis — \`.o-scroll-shadow\` (vertical)

Top/bottom fades on a **block-axis** scroller:

- **At the top** → only the **bottom** edge fades in.
- **Mid-scroll** → **both** edges show.
- **At the end** → only the **top** edge shows.

\`\`\`html
<div class="o-scroll-shadow o-layout--overflow-y-auto o-layout--min-h-0" style="max-height: 20rem">
  …tall content…
</div>
\`\`\`

### Inline axis — \`.o-scroll-shadow--inline\` (horizontal)

Start/end fades on an **inline-axis** scroller (left/right in LTR):

- **At the start** → only the **end** edge fades in.
- **Mid-scroll** → **both** edges show.
- **At the end** → only the **start** edge shows.

\`\`\`html
<div
  class="o-scroll-shadow--inline o-layout--overflow-x-auto o-layout--min-w-0"
  style="max-width: 20rem"
>
  <div class="o-flex o-flex--row o-layout--gap-1 o-layout--padding-2">
    …wide content…
  </div>
</div>
\`\`\`

### Mixins (containers you don't own)

\`\`\`scss
@use '../02-tools/tools.scroll-shadow' as *;

.c-my-panel__body {
  display: block;
  @include scroll-shadow;          // block / vertical
}

.c-my-toolbar__track {
  display: block;
  @include scroll-shadow-inline;   // inline / horizontal
}
\`\`\`

### Requirements

- The element must be the **scroll container**.
- Block axis: constrained **height** (\`max-height\`, flex \`min-h-0\`, etc.).
- Inline axis: constrained **width** (\`max-width\`, flex \`min-w-0\`, etc.).
- Block axis scrollers inside flex columns need \`display: block\` on the scroller (the object class sets this).

### Tuning

| Token | Default | Controls |
|---|---|---|
| \`--pds-size-scroll-shadow-height\` | \`--spacing-3\` | Fade depth (block size on vertical, inline size on horizontal) |
| \`--pds-color-scroll-shadow\` | \`--pds-color-transparent-white-80\` | Fade colour |

### Browser support

Scroll-driven animations are **Chromium-only** today. Elsewhere it degrades gracefully to **no shadow**.

Styles: \`libs/styles/src/05-objects/_objects.scroll-shadow.scss\` · Mixins: \`libs/styles/src/02-tools/_tools.scroll-shadow.scss\` · Tokens: \`libs/styles/src/01-settings/_settings.scroll-shadow.scss\`
        `,
      },
    },
  },
  argTypes: {
    'o-scroll-shadow': {
      name: '.o-scroll-shadow',
      description:
        'Block-axis scroll container with top/bottom scroll-driven edge fades. Requires a constrained height.',
      table: { category: 'Block' },
    },
    'o-scroll-shadow--inline': {
      name: '.o-scroll-shadow--inline',
      description:
        'Inline-axis scroll container with start/end scroll-driven edge fades. Requires a constrained width.',
      table: { category: 'Block' },
    },
  },
} as Meta;

// ── Vertical (block axis) ─────────────────────────────────────────────────────
export const Vertical = {
  name: 'Vertical (Block Axis)',
  parameters: {
    docs: {
      description: {
        story:
          'Scroll down: bottom fade at rest → both edges mid-scroll → top fade only at the end.',
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-scroll-shadow o-layout--overflow-y-auto" style="max-height: 14rem; border: 1px solid #ccc; border-radius: 0.5rem;">
      <div class="o-flex o-flex--col o-layout--gap-1 o-layout--padding-2">
        ${Array.from({ length: 14 }, (_, i) => `<div class="c-demo-cell o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="min-height: 3rem;">Row ${i + 1}</div>`).join('')}
      </div>
    </div>`,
  }),
};

/** @deprecated Use `Vertical` — kept for bookmark compatibility. */
export const Default = Vertical;

// ── Horizontal (inline axis) ──────────────────────────────────────────────────
export const Horizontal = {
  name: 'Horizontal (Inline Axis)',
  parameters: {
    docs: {
      description: {
        story:
          'Scroll sideways: end fade at rest → both edges mid-scroll → start fade only at the end.',
      },
    },
  },
  render: () => ({
    template: `
    <div
      class="o-scroll-shadow--inline o-layout--overflow-x-auto o-layout--min-w-0"
      style="max-width: 22rem; border: 1px solid #ccc; border-radius: 0.5rem;"
    >
      <div class="o-flex o-flex--row o-flex--nowrap o-layout--gap-1 o-layout--padding-2">
        ${Array.from({ length: 10 }, (_, i) => `<div class="c-demo-cell c-demo-cell--accent o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-2" style="min-width: 7rem; flex-shrink: 0;">Col ${i + 1}</div>`).join('')}
      </div>
    </div>`,
  }),
};

// ── In a flex column ────────────────────────────────────────────────────────
export const InFlexColumn = {
  name: 'In a Flex Column',
  parameters: {
    docs: {
      description: {
        story:
          'Fixed header + scrollable body with vertical edge fades + fixed footer. Body uses `o-layout--min-h-0` so it can shrink inside the flex column.',
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--col" style="height: 18rem; border: 1px solid #ccc; border-radius: 0.5rem; overflow: hidden;">
      <div class="c-demo-cell o-flex__item--shrink-0 o-layout--padding-2">Fixed header</div>
      <div class="o-scroll-shadow o-layout--overflow-y-auto o-flex__item--grow-1 o-layout--min-h-0">
        <div class="o-flex o-flex--col o-layout--gap-1 o-layout--padding-2">
          ${Array.from({ length: 12 }, (_, i) => `<div class="c-demo-cell c-demo-cell--accent o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="min-height: 3rem;">Scrollable row ${i + 1}</div>`).join('')}
        </div>
      </div>
      <div class="c-demo-cell o-flex__item--shrink-0 o-layout--padding-2">Fixed footer</div>
    </div>`,
  }),
};

// ── In a flex row ─────────────────────────────────────────────────────────────
export const InFlexRow = {
  name: 'In a Flex Row',
  parameters: {
    docs: {
      description: {
        story:
          'Fixed start cap + scrollable track with horizontal edge fades + fixed end cap. Track uses `o-layout--min-w-0` so it can shrink inside the flex row.',
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--row o-flex--align-items-stretch" style="width: 22rem; border: 1px solid #ccc; border-radius: 0.5rem; overflow: hidden;">
      <div class="c-demo-cell o-flex__item--shrink-0 o-layout--padding-2">Start</div>
      <div class="o-scroll-shadow--inline o-layout--overflow-x-auto o-flex__item--grow-1 o-layout--min-w-0">
        <div class="o-flex o-flex--row o-flex--nowrap o-layout--gap-1 o-layout--padding-2">
          ${Array.from({ length: 8 }, (_, i) => `<div class="c-demo-cell c-demo-cell--accent o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-2" style="min-width: 6rem; flex-shrink: 0;">Tab ${i + 1}</div>`).join('')}
        </div>
      </div>
      <div class="c-demo-cell o-flex__item--shrink-0 o-layout--padding-2">End</div>
    </div>`,
  }),
};
