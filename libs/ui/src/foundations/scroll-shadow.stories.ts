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
\`.o-scroll-shadow\` adds a **scroll-driven edge fade** to any block-axis scroll container — a visual cue that more content exists above or below the visible area.

- **At the top** of the scroll → only the **bottom** edge fades in.
- **Mid-scroll** → **both** edges show.
- **At the end** → only the **top** edge shows.

The effect is **pure CSS** — a named [\`scroll-timeline\`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline) drives two \`@keyframes\` animations on sticky \`::before\` / \`::after\` pseudo-elements. **No JavaScript, no scroll listeners.**

\`\`\`html
<!-- Drop-in: apply to any element you own that should scroll -->
<div class="o-scroll-shadow" style="max-height: 20rem">
  …tall content…
</div>
\`\`\`

For scroll containers you **don't** own (e.g. PrimeNG's \`.p-card-body\`), apply the \`scroll-shadow()\` **tool mixin** to the internal selector instead of the class:

\`\`\`scss
@use '../02-tools/tools.scroll-shadow' as *;

.c-my-panel .p-card-body {
  display: block; // PrimeNG bodies are flex columns — sticky-bottom needs block
  @include scroll-shadow;
}
\`\`\`

### Requirements
- The element must be the **scroll container** (the object sets \`overflow: auto\`).
- It must establish a **block formatting context** — a plain block element already does; flex/grid scrollers must also set \`display: block\` for the sticky bottom edge to pin.
- The container needs a **constrained height** (\`max-height\`, flex \`min-height: 0\`, etc.) so it can actually scroll.

### Tuning
| Token | Default | Controls |
|---|---|---|
| \`--pds-size-scroll-shadow-height\` | \`--spacing-3\` | Depth of each edge fade |
| \`--pds-color-scroll-shadow\` | \`--pds-color-transparent-white-80\` | Fade colour |

### Browser support
Scroll-driven animations are **Chromium-only** today. Elsewhere it degrades gracefully to **no shadow** (the base \`opacity: 0\` simply stays) — content remains fully usable.

Styles: \`libs/styles/src/05-objects/_objects.scroll-shadow.scss\` · Mixin: \`libs/styles/src/02-tools/_tools.scroll-shadow.scss\` · Tokens: \`libs/styles/src/01-settings/_settings.scroll-shadow.scss\`
        `,
      },
    },
  },
  argTypes: {
    'o-scroll-shadow': {
      name: '.o-scroll-shadow',
      description:
        'Makes the element a block-axis scroll container with top/bottom scroll-driven edge fades. Requires a constrained height to scroll.',
      table: { category: 'Block' },
    },
  },
} as Meta;

// ── Default ─────────────────────────────────────────────────────────────────
export const Default = {
  name: 'Default',
  parameters: {
    docs: {
      description: {
        story: `
Scroll the box below. The bottom fade is visible at rest; scroll down and the top fade appears; reach the end and only the top fade remains.
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-scroll-shadow" style="max-height: 14rem; border: 1px solid #ccc; border-radius: 0.5rem;">
      <div class="o-flex o-flex--col o-layout--gap-1 o-layout--padding-2">
        ${Array.from({ length: 14 }, (_, i) => `<div class="c-demo-cell o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="min-height: 3rem;">Row ${i + 1}</div>`).join('')}
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
        story: `
A common layout: a fixed header, a scrollable body with the edge fades, and a fixed footer. The body uses \`o-layout--min-h-0\` so it can shrink and scroll within the flex column.
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--col" style="height: 18rem; border: 1px solid #ccc; border-radius: 0.5rem; overflow: hidden;">
      <div class="c-demo-cell o-flex__item--shrink-0 o-layout--padding-2">Fixed header</div>
      <div class="o-scroll-shadow o-flex__item--grow-1 o-layout--min-h-0">
        <div class="o-flex o-flex--col o-layout--gap-1 o-layout--padding-2">
          ${Array.from({ length: 12 }, (_, i) => `<div class="c-demo-cell c-demo-cell--accent o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-1" style="min-height: 3rem;">Scrollable row ${i + 1}</div>`).join('')}
        </div>
      </div>
      <div class="c-demo-cell o-flex__item--shrink-0 o-layout--padding-2">Fixed footer</div>
    </div>`,
  }),
};
