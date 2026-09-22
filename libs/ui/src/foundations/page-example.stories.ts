import type { Meta, StoryObj } from '@storybook/angular-vite';
import { DocsPageExampleComponent } from '../storybook/docs-page-example.component';
import { assertTextVisible } from '../storybook/story-tests';

const meta: Meta = {
  title: 'Foundations/Figures/Page example',
  tags: ['!dev'],
  parameters: { layout: 'padded', chromatic: { disableSnapshot: true } },
};

export default meta;

export const Wide: StoryObj = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Mes remboursements');
  },
  render: () => ({
    moduleMetadata: { imports: [DocsPageExampleComponent] },
    template: '<pds-docs-page-example />',
  }),
};

export const Narrow: StoryObj = {
  tags: ['!dev'],
  parameters: { viewport: { defaultViewport: 'xs' } },
  render: () => ({
    moduleMetadata: { imports: [DocsPageExampleComponent] },
    template: '<pds-docs-page-example />',
  }),
};
