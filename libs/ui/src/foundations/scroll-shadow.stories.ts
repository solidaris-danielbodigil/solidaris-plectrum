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

const blockCells = (count: number) =>
  Array.from({ length: count }, () => `<div class="o-flex__item"></div>`).join('');

const inlineCells = (count: number) =>
  Array.from(
    { length: count },
    () =>
      // min-width is a demo constraint so the inline axis overflows.
      `<div class="o-flex__item o-flex__item--shrink-0" style="min-width: 7rem;"></div>`,
  ).join('');

// ── Vertical (block axis) ─────────────────────────────────────────────────────
export const Vertical = {
  name: 'Vertical (Block Axis)',
  render: () => ({
    template: `
    <div class="o-scroll-shadow o-layout--overflow-y-auto" style="max-height: 14rem;">
      <div class="o-flex o-flex--col">
        ${blockCells(14)}
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
      style="max-width: 22rem;"
    >
      <div class="o-flex o-flex--nowrap">
        ${inlineCells(10)}
      </div>
    </div>`,
  }),
};

// ── In a flex column ────────────────────────────────────────────────────────
export const InFlexColumn = {
  name: 'In a Flex Column',
  render: () => ({
    template: `
    <div class="o-flex o-flex--col" style="height: 18rem;">
      <div class="o-flex__item o-flex__item--shrink-0">Fixed header</div>
      <div class="o-scroll-shadow o-layout--overflow-y-auto o-flex__item--grow-1 o-layout--min-h-0">
        <div class="o-flex o-flex--col">
          ${blockCells(12)}
        </div>
      </div>
      <div class="o-flex__item o-flex__item--shrink-0">Fixed footer</div>
    </div>`,
  }),
};

// ── In a flex row ─────────────────────────────────────────────────────────────
export const InFlexRow = {
  name: 'In a Flex Row',
  render: () => ({
    template: `
    <div class="o-flex o-flex--row o-flex--align-items-stretch" style="width: 22rem;">
      <div class="o-flex__item o-flex__item--shrink-0">Start</div>
      <div class="o-scroll-shadow--inline o-layout--overflow-x-auto o-flex__item--grow-1 o-layout--min-w-0">
        <div class="o-flex o-flex--nowrap">
          ${inlineCells(8)}
        </div>
      </div>
      <div class="o-flex__item o-flex__item--shrink-0">End</div>
    </div>`,
  }),
};
