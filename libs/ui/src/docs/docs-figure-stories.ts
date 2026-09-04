// =============================================================================
// libs/ui/src/docs/docs-figure-stories.ts
// Story factories for the PrimeNG-based docs figures. Each MDX page keeps its
// content in a sibling *.stories.ts (tagged !dev, so hidden from the sidebar)
// and embeds it with <Story of={…} />; Angular components cannot receive
// props from MDX directly.
// =============================================================================

import type { StoryObj } from '@storybook/angular';
import { DocsCalloutComponent } from '../storybook/docs-callout.component';
import { DocsCardsComponent } from '../storybook/docs-cards.component';
import type { DocsCalloutTone, DocsCard, DocsStep } from '../storybook/docs-figures.types';
import { DocsStepsComponent } from '../storybook/docs-steps.component';

export function stepsStory(steps: readonly DocsStep[]): StoryObj {
  return {
    render: () => ({
      moduleMetadata: { imports: [DocsStepsComponent] },
      props: { steps },
      template: `<pds-docs-steps [steps]="steps" />`,
    }),
  };
}

export function cardsStory(cards: readonly DocsCard[], columns: 2 | 3 = 3): StoryObj {
  return {
    render: () => ({
      moduleMetadata: { imports: [DocsCardsComponent] },
      props: { cards, columns },
      template: `<pds-docs-cards [cards]="cards" [columns]="columns" />`,
    }),
  };
}

export interface CalloutContent {
  tone?: DocsCalloutTone;
  title: string;
  text?: string;
  items?: readonly string[];
}

export function calloutStory({ tone = 'info', title, text, items }: CalloutContent): StoryObj {
  return {
    render: () => ({
      moduleMetadata: { imports: [DocsCalloutComponent] },
      props: { tone, title, text, items },
      template: `<pds-docs-callout [tone]="tone" [title]="title" [text]="text" [items]="items" />`,
    }),
  };
}
