import { componentWrapperDecorator, Meta } from '@storybook/angular';
/* eslint-disable max-lines */
const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const flexFlow = [
  'wrap',
  'nowrap',
  'wrap-reverse',
  'row',
  'row-reverse',
  'col',
  'col-reverse',
  'row-wrap',
  'row-nowrap',
  'col-wrap',
  'col-nowrap',
];
const alignItems = [
  'stretch',
  'center',
  'flex-start',
  'flex-end',
  'baseline',
  'inherit',
  'initial',
  'unset',
];
const alignContent = [
  'center',
  'flex-start',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
  'inherit',
  'initial',
  'unset',
];
const justifyContent = [
  'center',
  'flex-start',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
  'inherit',
  'initial',
  'unset',
];
const alignSelf = [
  'center',
  'flex-start',
  'flex-end',
  'baseline',
  'stretch',
  'inherit',
  'initial',
  'unset',
];
const breapoints = ['@xs', '@sm', '@md', '@lg', '@xl'];

export default {
  title: 'Foundations / Grid',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div class="sb-demo-wrapper">${story}</div>`,
    ),
  ],
  argTypes: {
    'o-flex': {
      name: '.o-flex',
      description: 'Flex Grid initializer',
      table: {
        category: 'Flex Container',
        subcategory: 'Block',
        defaultValue: {
          summary: 'row nowrap',
        },
      },
    },
    'o-flex--y': {
      name: '.o-flex--y',
      description: 'Flex Grid modifier for Vertical Axis',
      table: {
        category: 'Flex Container',
        subcategory: 'Block-modifier',
        defaultValue: {
          summary: 'column nowrap',
        },
      },
    },
    'flex-flow': {
      name: '.o-flex--xxx',
      options: flexFlow,
      description: 'Sets the Direction and wrapping for the flex container',
      table: {
        category: 'Flex Container',
        subcategory: 'Block-modifier',
        type: {
          summary: flexFlow.join(' | '),
        },
        defaultValue: {
          summary: 'row-nowrap',
        },
      },
    },
    'align-Items': {
      name: '.o-flex--align-items-xxx',
      options: alignItems,
      description: 'Controls the alignment of items on the Cross Axis',
      table: {
        category: 'Flex Container',
        subcategory: 'Block-modifier',
        type: {
          summary: alignItems.join(' | '),
        },
        defaultValue: {
          summary: 'stretch',
        },
      },
    },
    'align-content': {
      name: '.o-flex--align-content-xxx',
      options: alignContent,
      description:
        'Aligns a flex container’s lines within when there is extra space in the cross-axis',
      table: {
        category: 'Flex Container',
        subcategory: 'Block-modifier',
        type: {
          summary: alignContent.join(' | '),
        },
        defaultValue: {
          summary: 'strech',
        },
      },
    },
    'justify-content': {
      name: '.o-flex--justify-content-xxx',
      options: justifyContent,
      description: 'Defines the alignment along the main axis',
      table: {
        category: 'Flex Container',
        subcategory: 'Block-modifier',
        type: {
          summary: justifyContent.join(' | '),
        },
        defaultValue: {
          summary: 'flex-start',
        },
      },
    },
    'o-flex__item': {
      name: '.o-flex__item',
      description: 'Element to initialize Flex Items',
      table: {
        category: 'Flex items',
        subcategory: 'Element',
        defaultValue: {
          summary: 'flex: 1 1  100%',
        },
      },
    },
    'o-flex__item--xx': {
      name: '.o-flex__item--xx',
      options: cols,
      description: 'Flex Items can span from 1 to 12 cells',
      table: {
        category: 'Flex items',
        subcategory: 'Element-Modifier',
        type: {
          summary: '1 to 12',
        },
      },
    },
    'o-flex__item--grow-xx': {
      name: '.o-flex__item--grow-xx',
      options: cols,
      description: 'Flex Items can grow from 1 to 12 cells',
      table: {
        category: 'Flex items',
        subcategory: 'Element-Modifier',
        type: {
          summary: '1 to 12',
        },
      },
    },
    'o-flex__item--shrink-xx': {
      name: '.o-flex__item--shrink-xx',
      options: cols,
      description: 'Flex Items can shrink from 1 to 12 cells',
      table: {
        category: 'Flex items',
        subcategory: 'Element-Modifier',
        type: {
          summary: '1 to 12',
        },
      },
    },
    'o-flex__item--order-xx': {
      name: '.o-flex__item--order-xx',
      options: cols,
      description: 'Flex Items can be reordered from 1 to 12',
      table: {
        category: 'Flex items',
        subcategory: 'Element-Modifier',
        type: {
          summary: '1 to 12',
        },
      },
    },
    'o-flex__item--offset-xx': {
      name: '.o-flex__item--offset-xx',
      options: cols,
      description: 'Flex Items can have offsets from 1 to 12',
      table: {
        category: 'Flex items',
        subcategory: 'Element-Modifier',
        type: {
          summary: '1 to 12',
        },
      },
    },
    alignSelf: {
      name: '.o-flex__item--align-self-xxx',
      options: alignSelf,
      description:
        'Used to control the alignment of individual flex items along the cross axis',
      table: {
        category: 'Flex items',
        subcategory: 'Element-Modifier',
        type: {
          summary: alignSelf.join(' | '),
        },
        defaultValue: {
          summary: 'auto',
        },
      },
    },
    suffixes: {
      name: '@xxx',
      options: breapoints,
      description:
        'Suffixes that add responsiveness to Flex containers and items classes',
      table: {
        category: 'Responsive Suffixes',
        type: {
          summary: breapoints.join(' | '),
        },
        defaultValue: {
          summary: '@xs',
        },
      },
    },
  },
  tags: ['!dev', 'Foundations'],
} as Meta;

export const ResponsiveLayout = {
  render: () => ({
    template: `
    <div class="o-flex">
      <div class="o-flex__item
                  o-flex__item--2@md
                  o-flex__item--4@lg">
      </div>
      <div class="o-flex__item
                  o-flex__item--2@md
                  o-flex__item--4@lg">
      </div>
      <div class="o-flex__item
                  o-flex__item--8@md
                  o-flex__item--4@lg">
      </div>
    </div>
    <div class="o-flex">
      <div class="o-flex__item
                  o-flex__item--3
                  o-flex__item--4@md
                  o-flex__item--2@lg">

      </div>
      <div class="o-flex__item
                  o-flex__item--6
                  o-flex__item--2@md
                  o-flex__item--9@lg">

      </div>
      <div class="o-flex__item
                  o-flex__item--3
                  o-flex__item--6@md
                  o-flex__item--1@lg">

      </div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--justify-content-end o-flex--justify-content-center@lg">
      <div class="o-flex__item
                  o-flex__item--3@md
                  o-flex__item--5@lg">

      </div>
      <div class="o-flex__item
                  o-flex__item--5
                  o-flex__item--3@md
                  o-flex__item--5@lg">

      </div>
      <div class="o-flex__item
                  o-flex__item--6
                  o-flex__item--6@md
                  o-flex__item--5@lg">
      </div>
    </div>
    `,
  }),
};
export const ResponsiveLayoutY = {
  render: () => ({
    template: `
    <div class="o-flex o-flex--y">
      <div class="o-flex__item
                  o-flex__item--2@md
                  o-flex__item--4@lg">
      </div>
      <div class="o-flex__item
                  o-flex__item--2@md
                  o-flex__item--4@lg">
      </div>
      <div class="o-flex__item
                  o-flex__item--8@md
                  o-flex__item--4@lg">
      </div>
    </div>
    <div class="o-flex o-flex--y">
      <div class="o-flex__item
                  o-flex__item--3
                  o-flex__item--4@md
                  o-flex__item--2@lg">

      </div>
      <div class="o-flex__item
                  o-flex__item--6
                  o-flex__item--2@md
                  o-flex__item--9@lg">

      </div>
      <div class="o-flex__item
                  o-flex__item--3
                  o-flex__item--6@md
                  o-flex__item--1@lg">

      </div>
    </div>
    <div class="o-flex o-flex--y o-flex--wrap o-flex--justify-content-end o-flex--justify-content-center@lg">
      <div class="o-flex__item
                  o-flex__item--3@md
                  o-flex__item--5@lg">

      </div>
      <div class="o-flex__item
                  o-flex__item--5
                  o-flex__item--3@md
                  o-flex__item--5@lg">

      </div>
      <div class="o-flex__item
                  o-flex__item--6
                  o-flex__item--6@md
                  o-flex__item--5@lg">
      </div>
    </div>
    `,
  }),
};
export const AutoCols = {
  render: () => ({
    template: `
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
    </div>
    `,
  }),
};
export const AutoColsY = {
  render: () => ({
    template: `
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
    </div>
    <div class="o-flex o-flex--y">
        <div class="o-flex__item o-flex__item--6"></div>
        <div class="o-flex__item"></div>
        <div class="o-flex__item"></div>
        <div class="o-flex__item"></div>
    </div>
    `,
  }),
};
export const NestedGrids = {
  render: () => ({
    template: `
    <div class="o-flex">
        <div class="o-flex__item">
            <div class="o-flex">
                <div class="o-flex__item">
                    <div class="o-flex">
                        <div class="o-flex__item">
                            <div class="o-flex">
                                <div class="o-flex__item">
                                </div>
                            </div>
                        </div>
                        <div class="o-flex__item"></div>
                        <div class="o-flex__item"></div>
                        <div class="o-flex__item"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
  }),
};
export const FlexFlow = {
  render: () => ({
    template: `
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
    </div>
    `,
  }),
};
export const FlexGrowShrink = {
  render: () => ({
    template: `
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
  </div>
    `,
  }),
};
export const Offset = {
  render: () => ({
    template: `
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--2"></div>
      <div class="o-flex__item o-flex__item--2"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--offset-1 o-flex__item--offset-2@lg"></div>
    </div>
    `,
  }),
};
export const OffsetY = {
  render: () => ({
    template: `
    <div class="o-flex o-flex--y">
      <div class="o-flex__item o-flex__item--2"></div>
      <div class="o-flex__item o-flex__item--2"></div>
      <div class="o-flex__item o-flex__item--2 o-flex__item--offset-1 o-flex__item--offset-2@lg"></div>
    </div>
    `,
  }),
};
export const Order = {
  render: () => ({
    template: `
    <div class="o-flex">
      <div class="o-flex__item o-flex__item--order-1 o-flex__item--order-2@lg"></div>
      <div class="o-flex__item o-flex__item--order-4 o-flex__item--order-3@lg"></div>
      <div class="o-flex__item o-flex__item--order-2 o-flex__item--order-5@lg"></div>
      <div class="o-flex__item o-flex__item--order-5 o-flex__item--order-6@lg"></div>
      <div class="o-flex__item o-flex__item--order-6 o-flex__item--order-4@lg"></div>
      <div class="o-flex__item o-flex__item--order-3 o-flex__item--order-1@lg"></div>
    </div>
    `,
  }),
};
export const JustifyContent = {
  render: () => ({
    template: `
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
    <div class="o-flex o-flex--justify-content-space-around">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--justify-content-space-between">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--justify-content-space-evenly">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    `,
  }),
};
export const JustifyContentY = {
  render: () => ({
    template: `
    <div class="o-flex o-flex--y o-flex--justify-content-flex-start">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--justify-content-center">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--wrap o-flex--justify-content-flex-end">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--6"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--justify-content-space-around">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--justify-content-space-between">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--justify-content-space-evenly">
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    `,
  }),
};
export const AlignItems = {
  render: () => ({
    template: `
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
    </div>
    `,
  }),
};
export const AlignItemsY = {
  render: () => ({
    template: `
    <div class="o-flex o-flex--y o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--align-items-center">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--align-items-flex-end">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--align-items-stretch">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--align-items-baseline">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--md o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    `,
  }),
};
export const AlignContent = {
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-flex-start">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-center">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-flex-end">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-stretch">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-space-between">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-space-around">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--wrap o-flex--big o-flex--align-content-space-evenly">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    `,
  }),
};
export const AlignContentY = {
  render: () => ({
    template: `
    <div class="o-flex o-flex--y o-flex--wrap o-flex--big o-flex--align-content-flex-start">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--wrap o-flex--big o-flex--align-content-center">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--wrap o-flex--big o-flex--align-content-flex-end">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--wrap o-flex--big o-flex--align-content-stretch">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--wrap o-flex--big o-flex--align-content-space-between">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--wrap o-flex--big o-flex--align-content-space-around">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--wrap o-flex--big o-flex--align-content-space-evenly">
      <div class="o-flex__item o-flex__item--5"></div>
      <div class="o-flex__item o-flex__item--6"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--5"></div>
    </div>
    `,
  }),
};
export const AlignSelf = {
  render: () => ({
    template: `
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
      <div class="o-flex__item o-flex__item--3 o-flex__item--md o-flex__item--align-self-baseline"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-stretch"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    `,
  }),
};
export const AlignSelfY = {
  render: () => ({
    template: `
    <div class="o-flex o-flex--y o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-flex-start"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-center"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-flex-end"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--md o-flex__item--align-self-baseline"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    <div class="o-flex o-flex--y o-flex--align-items-flex-start">
      <div class="o-flex__item o-flex__item--big o-flex__item--3"></div>
      <div class="o-flex__item o-flex__item--3 o-flex__item--align-self-stretch"></div>
      <div class="o-flex__item o-flex__item--3"></div>
    </div>
    `,
  }),
};
