// Figures for Docs/Component status (component-status.mdx). Hidden from the sidebar.
// `Index` renders the committed .ai/contracts/index.json; `Sample` renders a
// fixture that covers every status badge, including the ones the live index
// does not currently contain.
import type { Meta, StoryObj } from '@storybook/angular';
import contracts from '../../../../.ai/contracts/index.json';
import type { ContractsIndex } from '../storybook/docs-component-index.component';
import {
  expect,
  userEvent,
  waitFor,
  waitForText,
  within,
} from '../storybook/story-tests';
import { componentIndexStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Docs/Component status/Figures',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

const SAMPLE: ContractsIndex = {
  meta: { generated: '2026-09-08T07:57:18.624Z' },
  components: {
    FormField: {
      path: 'libs/ui/src/lib/form-field/form-field.component.ts',
      category: 'molecules',
      status: 'core',
      owner: 'design-system',
      metadata: true,
      bemBlock: 'c-form-field',
      primeNg: 'Message',
      usedBy: ['Toolbar'],
    },
    Toolbar: {
      path: 'libs/ui/src/lib/toolbar/toolbar.component.ts',
      category: 'molecules',
      status: 'core',
      owner: 'design-system',
      metadata: true,
      bemBlock: 'c-toolbar',
      primeNg: 'Card',
      usedBy: [],
    },
    SearchFilters: {
      path: 'libs/ui/src/lib/search-filters/search-filters.component.ts',
      category: 'molecules',
      status: 'candidate',
      owner: 'ishare',
      metadata: true,
      bemBlock: 'c-search-filters',
      primeNg: 'Card',
      usedBy: [],
    },
    DelayPredictionCard: {
      path: 'libs/ui/src/lib/delay-prediction-card/delay-prediction-card.component.ts',
      category: 'molecules',
      status: 'app',
      owner: 'ishare',
      metadata: true,
      bemBlock: 'c-delay-prediction-card',
      primeNg: 'Button',
      usedBy: [],
    },
    LegacyBanner: {
      path: 'libs/ui/src/lib/legacy-banner/legacy-banner.component.ts',
      category: 'organisms',
      status: 'deprecated',
      owner: 'design-system',
      metadata: true,
      bemBlock: 'c-legacy-banner',
      primeNg: null,
      usedBy: [],
    },
    Scratch: {
      path: 'libs/ui/src/lib/scratch/scratch.component.ts',
      category: 'atoms',
      metadata: false,
      bemBlock: null,
      primeNg: null,
      usedBy: [],
    },
  },
  summary: { totalComponents: 6, componentsWithMetadata: 5 },
};

export const Index: StoryObj = {
  ...componentIndexStory(contracts),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const total = Object.keys(contracts.components).length;
    await expect(canvas.getByRole('table')).toBeVisible();
    await expect(
      canvas.getByText(`${total} / ${total} components`),
    ).toBeVisible();
    // Component names link to their docs page once Storybook's index.json is read.
    await waitFor(() =>
      expect(
        canvas
          .getAllByRole('link')
          .filter((link) => link.getAttribute('href')?.includes('?path=/docs/'))
          .length,
      ).toBeGreaterThan(1),
    );
    const search = canvas.getByRole('searchbox', { name: 'Search components' });
    await userEvent.type(search, 'no-such-component');
    await waitForText(canvasElement, /No component matches/);
  },
};

export const Sample: StoryObj = {
  ...componentIndexStory(SAMPLE),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = within(canvas.getByRole('table'));
    await expect(table.getByText('Undeclared')).toBeVisible();
    await expect(table.getByText('Deprecated')).toBeVisible();
    await expect(
      canvas.getByText('5 of 6 components carry a .metadata.ts.'),
    ).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Candidate' }));
    await waitForText(canvasElement, '1 / 6 components');
    await expect(canvas.getAllByRole('row')).toHaveLength(2); // header + SearchFilters
    await expect(canvas.getByText('c-search-filters')).toBeVisible();
  },
};
