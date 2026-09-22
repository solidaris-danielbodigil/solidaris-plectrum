import type { Meta, StoryObj } from '@storybook/angular-vite';
import { DocsCatalogueComponent } from '../storybook/docs-catalogue.component';

const meta: Meta = {
  title: 'Start here/Figures/Catalogue',
  tags: ['!dev'],
  parameters: { layout: 'padded', chromatic: { disableSnapshot: true } },
};

export default meta;

export const Index: StoryObj = {
  render: () => ({
    moduleMetadata: { imports: [DocsCatalogueComponent] },
    template: '<pds-docs-catalogue />',
  }),
};
