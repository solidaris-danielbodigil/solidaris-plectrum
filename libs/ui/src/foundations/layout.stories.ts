// =============================================================================
// libs/ui/src/foundations/layout.stories.ts
// Foundations / Layout — o-layout utility class docs.
// Each export is a self-contained live demo wrapped in .sb-demo-wrapper.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';

export default {
  title: 'Foundations/Layout',
  tags: ['!dev'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: { layout: 'padded' },
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

