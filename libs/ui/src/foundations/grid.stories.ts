// =============================================================================
// libs/ui/src/foundations/grid.stories.ts
// Foundations / Grid — o-flex / o-flex__item flex grid docs.
// Each export is a self-contained live demo wrapped in .sb-demo-wrapper.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';

const COLS          = [1,2,3,4,5,6,7,8,9,10,11,12];
const FLEX_FLOW     = ['wrap','nowrap','wrap-reverse','row','row-reverse','col','col-reverse','row-wrap','row-nowrap','col-wrap','col-nowrap'];
const ALIGN_ITEMS   = ['stretch','center','flex-start','flex-end','baseline','inherit','initial','unset'];
const ALIGN_CONTENT = ['center','flex-start','flex-end','space-between','space-around','space-evenly','stretch','inherit','initial','unset'];
const JUSTIFY       = ['center','flex-start','flex-end','space-between','space-around','space-evenly','inherit','initial','unset'];
const ALIGN_SELF    = ['center','flex-start','flex-end','baseline','stretch','inherit','initial','unset'];
const BREAKPOINTS   = ['@xs','@sm','@md','@lg','@xl'];

export default {
  title: 'Foundations/Grid',
  tags: ['!autodocs'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A **12-cell mobile-first grid** based on Flex display.

- \`.o-flex\` — flex container (\`row nowrap\` by default)
- \`.o-flex__item\` — flex child / cell (\`flex: 1 1 100%\` by default)
- Column span: \`.o-flex__item--{1–12}\`
- Responsive suffixes: \`@sm\` \`@md\` \`@lg\` \`@xl\`

> **Note** — gap and spacing are forbidden on \`.o-flex\` / \`.o-flex__item\` directly.
> Use \`.o-layout--gap-{scale}\` as a BEM mix on the same element.

Styles: \`libs/styles/src/05-objects/_objects.flex-grid.scss\`
        `,
      },
    },
  },
  argTypes: {
    'o-flex':                { name: '.o-flex',                        description: 'Flex Grid initializer',                                                         table: { category: 'Flex Container', subcategory: 'Block',           defaultValue: { summary: 'row nowrap'    } } },
    'o-flex--y':             { name: '.o-flex--y',                     description: 'Flex Grid modifier for Vertical Axis',                                          table: { category: 'Flex Container', subcategory: 'Block-modifier',   defaultValue: { summary: 'column nowrap' } } },
    'flex-flow':             { name: '.o-flex--xxx',        options: FLEX_FLOW,     description: 'Sets the Direction and wrapping for the flex container',           table: { category: 'Flex Container', subcategory: 'Block-modifier',   type: { summary: FLEX_FLOW.join(' | ')     }, defaultValue: { summary: 'row-nowrap'  } } },
    'align-items':           { name: '.o-flex--align-items-xxx',       options: ALIGN_ITEMS,   description: 'Controls the alignment of items on the Cross Axis',   table: { category: 'Flex Container', subcategory: 'Block-modifier',   type: { summary: ALIGN_ITEMS.join(' | ')   }, defaultValue: { summary: 'stretch'     } } },
    'align-content':         { name: '.o-flex--align-content-xxx',     options: ALIGN_CONTENT, description: "Aligns a flex container's lines when there is extra space in the cross-axis", table: { category: 'Flex Container', subcategory: 'Block-modifier', type: { summary: ALIGN_CONTENT.join(' | ') }, defaultValue: { summary: 'stretch' } } },
    'justify-content':       { name: '.o-flex--justify-content-xxx',   options: JUSTIFY,       description: 'Defines the alignment along the main axis',           table: { category: 'Flex Container', subcategory: 'Block-modifier',   type: { summary: JUSTIFY.join(' | ')       }, defaultValue: { summary: 'flex-start'  } } },
    'o-flex__item':          { name: '.o-flex__item',                  description: 'Element to initialize Flex Items',                                             table: { category: 'Flex Items',     subcategory: 'Element',          defaultValue: { summary: 'flex: 1 1 100%' } } },
    'o-flex__item--xx':      { name: '.o-flex__item--xx',   options: COLS, description: 'Flex Items can span from 1 to 12 cells',                                   table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'o-flex__item--grow-xx': { name: '.o-flex__item--grow-xx', options: COLS, description: 'Flex Items can grow from 1 to 12 cells',                                table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'o-flex__item--shrink-xx':{ name: '.o-flex__item--shrink-xx', options: COLS, description: 'Flex Items can shrink from 1 to 12 cells',                           table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'o-flex__item--order-xx':{ name: '.o-flex__item--order-xx', options: COLS, description: 'Flex Items can be reordered from 1 to 12',                             table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'o-flex__item--offset-xx':{ name: '.o-flex__item--offset-xx', options: COLS, description: 'Flex Items can have offsets from 1 to 12',                           table: { category: 'Flex Items',     subcategory: 'Element-Modifier', type: { summary: '1 to 12' }               } },
    'align-self':            { name: '.o-flex__item--align-self-xxx',  options: ALIGN_SELF,    description: 'Controls the alignment of an individual flex item along the cross axis', table: { category: 'Flex Items', subcategory: 'Element-Modifier', type: { summary: ALIGN_SELF.join(' | ') }, defaultValue: { summary: 'auto' } } },
    'suffixes':              { name: '@xxx',                            options: BREAKPOINTS,   description: 'Suffixes that add responsiveness to Flex containers and items classes',  table: { category: 'Responsive Suffixes', type: { summary: BREAKPOINTS.join(' | ') }, defaultValue: { summary: '@xs' } } },
  },
} as Meta;

// ── Responsive Layout ─────────────────────────────────────────────────────────
export const ResponsiveLayout = {
  name: 'Responsive Layout',
  parameters: { docs: { description: { story: 'Mobile-first. Items respond to `@sm`, `@md`, `@lg`, `@xl` suffixes. `@xs` is the default — no suffix needed for the smallest breakpoint.' } } },
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
  parameters: { docs: { description: { story: 'Add `.o-flex--y` to `.o-flex` to set flex-direction to column. All breakpoint suffixes still apply.' } } },
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
  parameters: { docs: { description: { story: 'Use `.o-flex__item` without a column modifier. Items share space equally, or take the full width if the only child.' } } },
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
  parameters: { docs: { description: { story: 'Add `.o-flex--y` to `.o-flex` to set flex-direction to column.' } } },
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
  parameters: { docs: { description: { story: 'Grids can be nested infinitely. Each `.o-flex` restarts the 12-column context.' } } },
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
  parameters: { docs: { description: { story: 'Shorthand for `flex-direction` + `flex-wrap`. Default is `row nowrap`. Options: `.o-flex--wrap` `.o-flex--row-reverse` `.o-flex--y` `.o-flex--col-reverse` …' } } },
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
  parameters: { docs: { description: { story: 'To allow a flex-item to grow or shrink, add `.o-flex__item--grow-{1–12}` or `.o-flex__item--shrink-{1–12}`. Breakpoint suffixes also apply.' } } },
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
  parameters: { docs: { description: { story: 'To modify the order of a flex-item, add `.o-flex__item--order-{1–12}`. Breakpoint suffixes also apply.' } } },
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
  parameters: { docs: { description: { story: 'To modify the offset of a flex-item, add `.o-flex__item--offset-{1–12}`. Breakpoint suffixes also apply.' } } },
  render: () => ({ template: `
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--2"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--offset-1 o-flex__item--offset-2@lg"></div>
      <div class="o-flex__item o-flex__item--2"></div>
    </div>` }),
};

export const OffsetsY = {
  name: 'Offsets in Y Axis',
  parameters: { docs: { description: { story: 'Add `.o-flex--y` to `.o-flex` to set flex-direction to column.' } } },
  render: () => ({ template: `
    <div class="o-flex o-flex--y">
      <div class="o-flex__item o-flex__item--2"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--offset-1"></div>
      <div class="o-flex__item o-flex__item--2"></div>
    </div>` }),
};

export const JustifyContent = {
  name: 'Justify-Content',
  parameters: { docs: { description: { story: 'Defines alignment along the main axis. Options: `flex-start` `center` `flex-end` `space-between` `space-around` `space-evenly`.' } } },
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
  parameters: { docs: { description: { story: 'Controls the alignment of items on the Cross Axis. Items have a `--big` height modifier applied via the `.sb-demo-wrapper` trump styles.' } } },
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
  parameters: { docs: { description: { story: 'Aligns a flex container\'s lines when there is extra space in the cross-axis. Requires `.o-flex--wrap` and enough items to wrap onto multiple lines.' } } },
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
  parameters: { docs: { description: { story: 'Controls the alignment of an individual flex-item along the cross axis, overriding the container\'s `align-items` value.' } } },
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
