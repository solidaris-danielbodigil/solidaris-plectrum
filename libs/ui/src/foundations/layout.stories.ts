// =============================================================================
// libs/ui/src/foundations/layout.stories.ts
// Foundations / Layout — o-layout utility class docs.
// Live demos are wrapped in .sb-demo-wrapper. Usage is not — that wrapper
// numbers every .o-flex__item and would paint the Do / Don't cards as cells.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular-vite';
import { doDontStory } from '../docs/docs-figure-stories';
import { LAYOUT, summary } from './object-class-lists';

const demoDecorators = [
  componentWrapperDecorator(
    (story) => `<div class="sb-demo-wrapper">${story}</div>`,
  ),
];

export default {
  title: 'Foundations/Layout',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
  argTypes: {
    'o-layout': {
      name: '.o-layout',
      description:
        'Layout object initializer — required on any element that uses an o-layout modifier',
      table: { category: 'Block' },
    },
    'o-layout--{helper}': {
      name: '.o-layout--{helper}',
      description: 'Dimensional structure helper.',
      table: {
        category: 'Dimensions',
        type: { summary: summary(LAYOUT['dimensions']) },
      },
    },
    'o-layout--overflow-{value}': {
      name: '.o-layout--overflow-{value}',
      description: 'Shorthand overflow. Supports @{bp}.',
      table: {
        category: 'Overflow',
        type: { summary: summary(LAYOUT['overflow']) },
      },
    },
    'o-layout--overflow-x-{value}': {
      name: '.o-layout--overflow-x-{value}',
      description: 'overflow-x. Supports @{bp}.',
      table: {
        category: 'Overflow',
        type: { summary: summary(LAYOUT['overflowX']) },
      },
    },
    'o-layout--overflow-y-{value}': {
      name: '.o-layout--overflow-y-{value}',
      description: 'overflow-y. Supports @{bp}.',
      table: {
        category: 'Overflow',
        type: { summary: summary(LAYOUT['overflowY']) },
      },
    },
    'o-layout--{display}': {
      name: '.o-layout--{display}',
      description: 'Display. Supports @{bp}.',
      table: {
        category: 'Display',
        type: { summary: summary(LAYOUT['display']) },
      },
    },
    'o-layout--{position}': {
      name: '.o-layout--{position}',
      description: 'Position. Supports @{bp}.',
      table: {
        category: 'Position',
        type: { summary: summary(LAYOUT['position']) },
      },
    },
    'o-layout--sticky-top': {
      name: '.o-layout--sticky-top',
      description:
        'Shorthand: position: sticky + top: 0. For sticky headers/toolbars.',
      table: { category: 'Position' },
    },
    'o-layout--gap-{scale}': {
      name: '.o-layout--gap-{scale}',
      description:
        'gap — requires Flex or Grid display. Scale: 0 0-25 0-5 0-75 1 1-5 2 3 4 5 6 7 auto. Supports @{bp}',
      table: { category: 'Spacing' },
    },
    'o-layout--padding-{scale}': {
      name: '.o-layout--padding-{scale}',
      description:
        'padding shorthand. Scale: 0 0-25 0-5 0-75 1 1-5 2 3 4 5 6 7 auto. Supports @{bp}',
      table: { category: 'Spacing' },
    },
    'o-layout--margin-{scale}': {
      name: '.o-layout--margin-{scale}',
      description:
        'margin shorthand. Scale: 0 0-25 0-5 0-75 1 1-5 2 3 4 5 6 7 auto. Supports @{bp}',
      table: { category: 'Spacing' },
    },
  },
} as Meta;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Spacing, overflow, min-size and display in the template',
        detail:
          'o-layout--gap-*, padding, overflow, min-h-0 / min-w-0, hidden@md. Mix onto the same node as o-flex.',
      },
      {
        title: 'A flex child that must scroll',
        detail:
          'o-layout--min-h-0 (or min-w-0) plus overflow-y-auto so the item can shrink below its content.',
      },
    ],
    donts: [
      {
        title: 'gap / padding / overflow written in 06-components',
        detail:
          'Those properties have object classes. A sheet copy will drift from the scale.',
        alternative:
          'The o-layout mix in the HTML. var(--pds-*) in SCSS only for a component token off the global scale.',
      },
    ],
  }),
};

// ── Dimensions ────────────────────────────────────────────────────────────────
export const Dimensions = {
  name: 'Dimensions',
  decorators: demoDecorators,
  render: () => ({
    template: `
    <div class="o-flex o-flex--col" style="height: 200px;">
      <div class="o-flex__item o-flex__item--shrink-0">Header (shrink-0)</div>
      <div class="o-flex__item o-layout o-layout--min-h-0 o-layout--overflow-y-auto">
        <div style="height: 400px;">Scrollable content (min-h-0 + overflow-y-auto)</div>
      </div>
      <div class="o-flex__item o-flex__item--shrink-0">Footer (shrink-0)</div>
    </div>`,
  }),
};

// ── Full Height ───────────────────────────────────────────────────────────────
export const FullHeight = {
  name: 'Full Height',
  decorators: demoDecorators,
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout o-layout--full-height" style="height: 300px">
      <div class="o-flex__item"></div>
      <div class="o-flex__item o-flex__item--8"></div>
      <div class="o-flex__item"></div>
    </div>`,
  }),
};

// ── Overflow ──────────────────────────────────────────────────────────────────
export const Overflow = {
  name: 'Overflow',
  decorators: demoDecorators,
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout o-layout--overflow-y-auto" style="height: 150px;">
      <div class="o-flex__item o-flex__item--big"></div>
      <div class="o-flex__item o-flex__item--big"></div>
      <div class="o-flex__item o-flex__item--big"></div>
    </div>`,
  }),
};

// ── Display ───────────────────────────────────────────────────────────────────
export const Display = {
  name: 'Display',
  decorators: demoDecorators,
  render: () => ({
    template: `
    <div class="o-flex o-flex--col">
      <div class="o-flex__item o-layout o-layout--block">block (always visible)</div>
      <div class="o-flex__item o-layout o-layout--hidden o-layout--block@md">hidden → block@md (resize viewport)</div>
      <div class="o-flex">
        <div class="o-flex__item o-layout o-layout--inline-block">inline-block</div>
        <div class="o-flex__item o-layout o-layout--inline-block">inline-block</div>
      </div>
    </div>`,
  }),
};

// ── Position ──────────────────────────────────────────────────────────────────
export const Position = {
  name: 'Position',
  decorators: demoDecorators,
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout o-layout--overflow-y-auto" style="height: 200px;">
      <div class="o-flex__item o-flex__item--shrink-0 o-layout o-layout--sticky-top">Sticky header (scroll me)</div>
      <div class="o-flex__item o-flex__item--big"></div>
      <div class="o-flex__item o-flex__item--big"></div>
      <div class="o-flex__item o-flex__item--big"></div>
    </div>`,
  }),
};

// ── Spacing ───────────────────────────────────────────────────────────────────
export const Spacing = {
  name: 'Spacing',
  decorators: demoDecorators,
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout o-layout--gap-2">
      <div class="o-flex__item o-flex__item--3">gap-2</div>
      <div class="o-flex__item">gap-2</div>
      <div class="o-flex__item o-flex__item--3">gap-2</div>
    </div>
    <div class="o-flex o-layout o-layout--padding-2">
      <div class="o-flex__item o-flex__item--4">padding-2</div>
      <div class="o-flex__item o-flex__item--4">padding-2</div>
      <div class="o-flex__item o-flex__item--4">padding-2</div>
    </div>
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--3">margin-top-2</div>
      <div class="o-flex__item o-flex__item--6">margin-top-2</div>
      <div class="o-flex__item o-flex__item--3">margin-top-2</div>
    </div>`,
  }),
};

// ── Responsive ────────────────────────────────────────────────────────────────
export const Responsive = {
  name: 'Responsive',
  decorators: demoDecorators,
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout o-layout--gap-1 o-layout--gap-2@sm o-layout--gap-4@lg">
      <div class="o-flex__item">gap-1 → gap-2@sm → gap-4@lg</div>
      <div class="o-flex__item">Resize me</div>
      <div class="o-flex__item">to see gap change</div>
    </div>
    <div class="o-flex">
      <div class="o-flex__item o-layout o-layout--hidden o-layout--block@md">
        I'm hidden below md, visible from md up
      </div>
    </div>`,
  }),
};
