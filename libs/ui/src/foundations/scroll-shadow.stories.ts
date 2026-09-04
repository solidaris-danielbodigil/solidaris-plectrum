// =============================================================================
// libs/ui/src/foundations/scroll-shadow.stories.ts
// Foundations / Scroll Shadow — .o-scroll-shadow scroll-driven edge affordance.
// Pure CSS (scroll-timeline + keyframes), no JS. Chromium-only today.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';

export default {
  title: 'Foundations/Scroll Shadow',
  tags: ['!dev'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: { layout: 'padded' },
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
