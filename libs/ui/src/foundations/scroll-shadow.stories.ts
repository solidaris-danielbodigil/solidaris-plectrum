// =============================================================================
// libs/ui/src/foundations/scroll-shadow.stories.ts
// Foundations / Scroll Shadow — .o-scroll-shadow scroll-driven edge affordance.
// Pure CSS (scroll-timeline + keyframes), no JS. Chromium-only today.
//
// Do not wrap this page in `.sb-demo-wrapper`: that trump restyles every
// `.o-flex` / `.o-flex__item` as a numbered grid cell and would paint the
// Do / Don't figure as a Flex Grid demo. Figures use PrimeNG Chip / Tag
// inside the real object classes.
// =============================================================================

import type { Meta } from '@storybook/angular-vite';
import { Chip } from 'primeng/chip';
import { Tag } from 'primeng/tag';
import { doDontStory } from '../docs/docs-figure-stories';

export default {
  title: 'Foundations/Scroll Shadow',
  tags: ['!dev'],
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

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Hint that more content is scrollable',
        detail:
          'A clipped panel, list or track gives no cue that anything sits past the edge. The fade is that cue.',
      },
      {
        title: 'Vertical clip — drawer body, flex-column main, long list',
        detail:
          'Mix o-scroll-shadow onto the scroll container with overflow-y and a height constraint (max-height or o-layout--min-h-0).',
      },
      {
        title: 'Horizontal clip — chips, tabs, toolbar track',
        detail:
          'Mix o-scroll-shadow--inline with overflow-x and a width constraint (max-width or o-layout--min-w-0).',
      },
      {
        title: 'Keyboard access on the scroller',
        detail:
          'Axe scrollable-region-focusable fails when overflow has no tab stop. Add tabindex="0" and an aria-label unless a child is already focusable.',
      },
    ],
    donts: [
      {
        title: 'An unconstrained box',
        detail: 'Without a capped height or width the element never scrolls, so the fade never appears.',
        alternative:
          'Constrain the scroller, then add the matching overflow class.',
      },
      {
        title: 'Fading a PrimeNG internal (.p-card-body, .p-datatable-wrapper)',
        detail: 'We do not own that node; doubled selectors break with the next PrimeNG release.',
        alternative: 'An owned wrapper on our element, then o-scroll-shadow on that wrapper.',
      },
      {
        title: 'A JS scroll listener or a handmade box-shadow fade',
        detail: 'The object is pure CSS (scroll-timeline). A second implementation will drift.',
        alternative: 'o-scroll-shadow / o-scroll-shadow--inline, or the mixin on a container you cannot class.',
      },
    ],
  }),
};

const CHIP_IMPORTS = [Chip, Tag];

const blockChips = (count: number) =>
  Array.from(
    { length: count },
    (_, index) => `<p-chip label="List item ${index + 1}" />`,
  ).join('');

const inlineChips = (count: number) =>
  Array.from(
    { length: count },
    (_, index) =>
      `<p-chip class="o-flex__item o-flex__item--shrink-0" label="Chip ${index + 1}" />`,
  ).join('');

/** Overflow containers with no focusable child need a tab stop (WCAG 2.1.1). */
const keyboardScroll = (label: string) =>
  `tabindex="0" aria-label="${label}"`;

/** Visual Do / Don't — real object classes on constrained PrimeNG chip stacks. */
export const UsageObjects = {
  tags: ['!dev'],
  render: () => ({
    moduleMetadata: { imports: CHIP_IMPORTS },
    template: `
    <div class="o-flex o-flex--row-wrap o-layout o-layout--gap-3">
      <section class="o-flex o-flex--y o-flex__item o-flex__item--grow-1 o-layout o-layout--gap-2 o-layout--min-w-0">
        <p-tag value="Do" severity="success" [rounded]="true" />
        <div
          class="o-scroll-shadow o-layout o-layout--overflow-y-auto o-layout--min-h-0"
          ${keyboardScroll('Liste défilante')}
          style="max-height: 12rem;"
        >
          <div class="o-flex o-flex--y o-layout o-layout--gap-1 o-layout--padding-2">
            ${blockChips(10)}
          </div>
        </div>
        <div
          class="o-scroll-shadow o-scroll-shadow--inline o-layout o-layout--overflow-x-auto o-layout--min-w-0"
          ${keyboardScroll('Piste défilante')}
          style="max-width: 18rem;"
        >
          <div class="o-flex o-flex--nowrap o-layout o-layout--gap-1 o-layout--padding-2">
            ${inlineChips(8)}
          </div>
        </div>
      </section>
      <section class="o-flex o-flex--y o-flex__item o-flex__item--grow-1 o-layout o-layout--gap-2 o-layout--min-w-0">
        <p-tag value="Don't" severity="danger" [rounded]="true" />
        <div class="o-layout">
          <div class="o-flex o-flex--y o-layout o-layout--gap-1 o-layout--padding-2">
            ${blockChips(6)}
          </div>
        </div>
      </section>
    </div>`,
  }),
};

// ── Vertical (block axis) ─────────────────────────────────────────────────────
export const Vertical = {
  name: 'Vertical (Block Axis)',
  render: () => ({
    moduleMetadata: { imports: CHIP_IMPORTS },
    template: `
    <div class="o-scroll-shadow o-layout o-layout--overflow-y-auto o-layout--min-h-0" ${keyboardScroll('Liste défilante')} style="max-height: 14rem;">
      <div class="o-flex o-flex--y o-layout o-layout--gap-1 o-layout--padding-2">
        ${blockChips(14)}
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
    moduleMetadata: { imports: CHIP_IMPORTS },
    template: `
    <div
      class="o-scroll-shadow o-scroll-shadow--inline o-layout o-layout--overflow-x-auto o-layout--min-w-0"
      ${keyboardScroll('Piste défilante')}
      style="max-width: 22rem;"
    >
      <div class="o-flex o-flex--nowrap o-layout o-layout--gap-1 o-layout--padding-2">
        ${inlineChips(10)}
      </div>
    </div>`,
  }),
};

// ── In a flex column ────────────────────────────────────────────────────────
export const InFlexColumn = {
  name: 'In a Flex Column',
  render: () => ({
    moduleMetadata: { imports: CHIP_IMPORTS },
    template: `
    <div class="o-flex o-flex--y" style="height: 18rem;">
      <p-tag class="o-flex__item o-flex__item--shrink-0" value="Fixed header" />
      <div class="o-scroll-shadow o-layout o-layout--overflow-y-auto o-flex__item o-flex__item--grow-1 o-layout--min-h-0" ${keyboardScroll('Corps défilant')}>
        <div class="o-flex o-flex--y o-layout o-layout--gap-1 o-layout--padding-2">
          ${blockChips(12)}
        </div>
      </div>
      <p-tag class="o-flex__item o-flex__item--shrink-0" value="Fixed footer" />
    </div>`,
  }),
};

// ── In a flex row ─────────────────────────────────────────────────────────────
export const InFlexRow = {
  name: 'In a Flex Row',
  render: () => ({
    moduleMetadata: { imports: CHIP_IMPORTS },
    template: `
    <div class="o-flex o-flex--align-items-stretch" style="width: 22rem;">
      <p-tag class="o-flex__item o-flex__item--shrink-0" value="Start" />
      <div class="o-scroll-shadow o-scroll-shadow--inline o-layout o-layout--overflow-x-auto o-flex__item o-flex__item--grow-1 o-layout--min-w-0" ${keyboardScroll('Piste défilante')}>
        <div class="o-flex o-flex--nowrap o-layout o-layout--gap-1 o-layout--padding-2">
          ${inlineChips(8)}
        </div>
      </div>
      <p-tag class="o-flex__item o-flex__item--shrink-0" value="End" />
    </div>`,
  }),
};
