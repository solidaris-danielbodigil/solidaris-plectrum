// =============================================================================
// libs/ui/src/foundations/grid.stories.ts
// Foundations / Flex Grid — o-flex / o-flex__item flex grid docs.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';
import {
  BREAKPOINT_SUFFIXES,
  FLEX,
  summary,
} from './object-class-lists';

// Variant lists are validated against the stylesheet by
// object-class-lists.spec.ts — see .ai/rules/10-css-ssot.md.
const COLS          = FLEX['span'].values;
const FLEX_FLOW     = FLEX['flexFlow'].values;
const ALIGN_ITEMS   = FLEX['alignItems'].values;
const ALIGN_CONTENT = FLEX['alignContent'].values;
const JUSTIFY       = FLEX['justifyContent'].values;
const ALIGN_SELF    = FLEX['alignSelf'].values;
const BREAKPOINTS   = BREAKPOINT_SUFFIXES;

export default {
  title: 'Foundations/Flex Grid',
  tags: ['!dev'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: { layout: 'padded' },
  argTypes: {
    'o-flex':                { name: '.o-flex',                        description: 'Flex Grid initializer',                                                         table: { category: 'Flex Container', subcategory: 'Block',           defaultValue: { summary: 'row nowrap'    } } },
    'o-flex--y':             { name: '.o-flex--y',                     description: 'Flex Grid modifier for Vertical Axis',                                          table: { category: 'Flex Container', subcategory: 'Block-modifier',   defaultValue: { summary: 'column nowrap' } } },
    'flex-flow':             { name: '.o-flex--xxx',        options: FLEX_FLOW,     description: 'Sets the Direction and wrapping for the flex container',           table: { category: 'Flex Container', subcategory: 'Block-modifier',   type: { summary: summary(FLEX['flexFlow'])     }, defaultValue: { summary: 'row-nowrap'  } } },
    'align-items':           { name: '.o-flex--align-items-xxx',       options: ALIGN_ITEMS,   description: 'Controls the alignment of items on the Cross Axis',   table: { category: 'Flex Container', subcategory: 'Block-modifier',   type: { summary: summary(FLEX['alignItems'])   }, defaultValue: { summary: 'stretch'     } } },
    'align-content':         { name: '.o-flex--align-content-xxx',     options: ALIGN_CONTENT, description: "Aligns a flex container's lines when there is extra space in the cross-axis", table: { category: 'Flex Container', subcategory: 'Block-modifier', type: { summary: summary(FLEX['alignContent']) }, defaultValue: { summary: 'stretch' } } },
    'justify-content':       { name: '.o-flex--justify-content-xxx',   options: JUSTIFY,       description: 'Defines the alignment along the main axis',           table: { category: 'Flex Container', subcategory: 'Block-modifier',   type: { summary: summary(FLEX['justifyContent'])       }, defaultValue: { summary: 'flex-start'  } } },
    'o-flex__item':          { name: '.o-flex__item',                  description: 'Element to initialize Flex Items',                                             table: { category: 'Flex Items',     subcategory: 'Element',          defaultValue: { summary: 'flex: 1 1 100%' } } },
    'o-flex__item--xx':      { name: '.o-flex__item--xx',   options: COLS, description: 'Flex Items can span from 1 to 12 cells',                                   table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'o-flex__item--grow-xx': { name: '.o-flex__item--grow-xx', options: COLS, description: 'Flex Items can grow from 1 to 12 cells',                                table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'o-flex__item--shrink-xx':{ name: '.o-flex__item--shrink-xx', options: COLS, description: 'Flex Items can shrink from 1 to 12 cells',                           table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'o-flex__item--order-xx':{ name: '.o-flex__item--order-xx', options: COLS, description: 'Flex Items can be reordered from 1 to 12',                             table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'o-flex__item--offset-xx':{ name: '.o-flex__item--offset-xx', options: COLS, description: 'Flex Items can have offsets from 1 to 12',                           table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'align-self':            { name: '.o-flex__item--align-self-xxx',  options: ALIGN_SELF,    description: 'Controls the alignment of an individual flex item along the cross axis', table: { category: 'Flex Items', subcategory: 'Element-Modifier', type: { summary: summary(FLEX['alignSelf']) }, defaultValue: { summary: 'auto' } } },
    'suffixes':              { name: '@xxx',                            options: BREAKPOINTS,   description: 'Suffixes that add responsiveness to Flex containers and items classes',  table: { category: 'Responsive Suffixes', type: { summary: BREAKPOINT_SUFFIXES.join(' | ') }, defaultValue: { summary: '@xs' } } },
  },
} as Meta;

// ── Responsive Layout ─────────────────────────────────────────────────────────
export const ResponsiveLayout = {
  name: 'Responsive Layout',
  render: () => ({ template: `
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--4@md o-flex__item--2@lg"></div>
      <div class="o-flex__item o-flex__item--4@md o-flex__item--8@lg"></div>
      <div class="o-flex__item o-flex__item--4@md o-flex__item--2@lg"></div>
    </div>
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--3 o-flex__item--4@md o-flex__item--2@lg"></div>
      <div class="o-flex__item o-flex__item--6 o-flex__item--4@md o-flex__item--8@lg"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--4@md o-flex__item--2@lg"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--justify-content-flex-end o-flex--justify-content-center@lg">
      <div class="o-flex__item o-flex__item--3@md o-flex__item--5@lg"></div>
      <div class="o-flex__item o-flex__item--5 o-flex__item--3@md o-flex__item--5@lg"></div>
      <div class="o-flex__item o-flex__item--6 o-flex__item--6@md o-flex__item--2@lg"></div>
    </div>` }),
};

export const ResponsiveLayoutY = {
  name: 'Responsive Layout in Y Axis',
  render: () => ({ template: `
    <div class="o-flex o-flex--y">
      <div class="o-flex__item o-flex__item--4@md o-flex__item--2@lg"></div>
      <div class="o-flex__item o-flex__item--4@md o-flex__item--8@lg"></div>
      <div class="o-flex__item o-flex__item--4@md o-flex__item--2@lg"></div>
    </div>
    <div class="o-flex o-flex--y">
      <div class="o-flex__item o-flex__item--3 o-flex__item--4@md o-flex__item--2@lg"></div>
      <div class="o-flex__item o-flex__item--6 o-flex__item--2@md o-flex__item--8@lg"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--6@md o-flex__item--2@lg"></div>
    </div>` }),
};

export const AutoCols = {
  name: 'Auto Columns',
  render: () => ({ template: `
    <div class="o-flex">
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>
    <div class="o-flex">
      <div class="o-flex__item"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>` }),
};

export const AutoColsY = {
  name: 'Auto Columns in Y Axis',
  render: () => ({ template: `
    <div class="o-flex o-flex--y">
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>
    <div class="o-flex o-flex--y">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>` }),
};

export const NestedGrids = {
  name: 'Nested Grids',
  render: () => ({ template: `
    <div class="o-flex">
      <div class="o-flex__item">
        <div class="o-flex">
          <div class="o-flex__item">
            <div class="o-flex">
              <div class="o-flex__item"></div>
              <div class="o-flex__item"></div>
              <div class="o-flex__item"></div>
              <div class="o-flex__item"></div>
            </div>
            <div class="o-flex">
              <div class="o-flex__item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>` }),
};

export const FlexFlow = {
  name: 'Flex-Flow',
  render: () => ({ template: `
    <div class="o-flex">
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>
    <div class="o-flex o-flex--row-reverse">
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>
    <div class="o-flex o-flex--y">
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>
    <div class="o-flex o-flex--col-reverse">
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>` }),
};

export const FlexGrowShrink = {
  name: 'Flex-Shrink and Flex-Grow',
  render: () => ({ template: `
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--grow-12"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--shrink-6"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
      <div class="o-flex__item"></div>
    </div>` }),
};

export const Ordering = {
  name: 'Ordering',
  render: () => ({ template: `
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--2 o-flex__item--order-1 o-flex__item--order-2@lg"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--order-4 o-flex__item--order-3@lg"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--order-2 o-flex__item--order-5@lg"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--order-5 o-flex__item--order-6@lg"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--order-6 o-flex__item--order-4@lg"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--order-3 o-flex__item--order-1@lg"></div>
    </div>` }),
};

export const Offsets = {
  name: 'Offsets',
  render: () => ({ template: `
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--2"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--offset-1 o-flex__item--offset-2@lg"></div>
      <div class="o-flex__item o-flex__item--2"></div>
    </div>` }),
};

export const OffsetsY = {
  name: 'Offsets in Y Axis',
  render: () => ({ template: `
    <div class="o-flex o-flex--y">
      <div class="o-flex__item o-flex__item--2"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--offset-1"></div>
      <div class="o-flex__item o-flex__item--2"></div>
    </div>` }),
};

export const JustifyContent = {
  name: 'Justify-Content',
  render: () => ({ template: `
    <div class="o-flex o-flex--justify-content-flex-start">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--justify-content-center">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--justify-content-flex-end">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--6"></div>
    </div>
    <div class="o-flex o-flex--justify-content-space-between">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--justify-content-space-around">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--justify-content-space-evenly">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>` }),
};

export const AlignItems = {
  name: 'Align-Items',
  render: () => ({ template: `
    <div class="o-flex o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--align-items-center">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--align-items-flex-end">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--align-items-stretch">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--align-items-baseline">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--md o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>` }),
};

export const AlignContent = {
  name: 'Align-Content',
  render: () => ({ template: `
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-flex-start">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-center">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-space-between">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>` }),
};

export const AlignSelf = {
  name: 'Align-Self',
  render: () => ({ template: `
    <div class="o-flex o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-flex-start"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-center"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-flex-end"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-stretch"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>` }),
};
