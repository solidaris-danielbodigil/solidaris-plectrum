import type { Meta, StoryObj } from '@storybook/angular-vite';
import type { AnatomyPart } from '@solidaris/contracts';
import { DocsAnatomyComponent } from '../storybook/docs-anatomy.component';
import { DocsPageExampleComponent } from '../storybook/docs-page-example.component';
import { assertTextVisible } from '../storybook/story-tests';

type PageExampleConcern = 'type' | 'color' | 'spacing' | 'layout';

const meta: Meta = {
  title: 'Foundations/Figures/Page example',
  tags: ['!dev'],
  parameters: { layout: 'padded', chromatic: { disableSnapshot: true } },
};

export default meta;

const PARTS: Record<PageExampleConcern, readonly AnatomyPart[]> = {
  type: [
    { part: '.c-docs-page-example__title', role: 'Page title — display' },
    { part: '.c-docs-page-example__section-title', role: 'Section — heading' },
    {
      part: '.c-docs-page-example__card-title',
      role: 'Card title — heading sm',
    },
    { part: '.c-docs-page-example__body', role: 'Body' },
  ],
  color: [
    { part: '.c-docs-page-example__sheet', role: 'Page surface' },
    { part: '.c-docs-page-example__card', role: 'Card surface' },
    { part: '.c-docs-page-example__body', role: 'Text on the content surface' },
  ],
  spacing: [
    {
      part: '.c-docs-page-example__card-body',
      role: 'Inside the card — gap-2',
    },
    { part: '.c-docs-page-example__section', role: 'Between blocks — gap-4' },
    { part: '.c-docs-page-example__sheet', role: 'Page padding' },
  ],
  layout: [
    { part: '.c-docs-page-example__sheet', role: 'Page padding, grows at md' },
    {
      part: '.c-docs-page-example__section',
      role: 'Column of section title and card',
    },
    { part: '.c-docs-page-example__card-body', role: 'Column inside the card' },
  ],
};

function anatomyStory(concern: PageExampleConcern): StoryObj {
  return {
    tags: ['!dev'],
    render: () => ({
      moduleMetadata: {
        imports: [DocsPageExampleComponent, DocsAnatomyComponent],
      },
      props: { parts: PARTS[concern] },
      template: `<pds-docs-anatomy [parts]="parts" bemBlock="c-docs-page-example"><pds-docs-page-example /></pds-docs-anatomy>`,
    }),
  };
}

export const TypeAnatomy: StoryObj = {
  ...anatomyStory('type'),
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Mes remboursements');
    await assertTextVisible(canvasElement, 'Page title — display');
  },
};

export const ColorAnatomy: StoryObj = anatomyStory('color');

export const SpacingAnatomy: StoryObj = anatomyStory('spacing');

export const LayoutAnatomy: StoryObj = anatomyStory('layout');
