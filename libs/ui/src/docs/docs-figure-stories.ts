// =============================================================================
// libs/ui/src/docs/docs-figure-stories.ts
// Story factories for the PrimeNG-based docs figures. Each MDX page keeps its
// content in a sibling *.stories.ts (tagged !dev, so hidden from the sidebar)
// and embeds it with <Story of={…} />; Angular components cannot receive
// props from MDX directly.
// =============================================================================

import type { StoryObj } from '@storybook/angular';
import type { ComponentGovernance } from '@solidaris/contracts';
import { DocsCalloutComponent } from '../storybook/docs-callout.component';
import { DocsCardsComponent } from '../storybook/docs-cards.component';
import type { DocsCalloutTone, DocsCard, DocsStep } from '../storybook/docs-figures.types';
import { type DocsHeroAction, DocsHeroComponent } from '../storybook/docs-hero.component';
import { DocsStatusComponent } from '../storybook/docs-status.component';
import { DocsStepsComponent } from '../storybook/docs-steps.component';

export interface HeroContent {
  title: string;
  lead?: string;
  actions?: readonly DocsHeroAction[];
}

const DOCS_FIGURE_PARAMETERS = {
  chromatic: { disableSnapshot: true },
};

export function heroStory({ title, lead, actions = [] }: HeroContent): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsHeroComponent] },
      props: { title, lead, actions },
      template: `<pds-docs-hero [title]="title" [lead]="lead" [actions]="actions" />`,
    }),
  };
}

export function stepsStory(steps: readonly DocsStep[]): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsStepsComponent] },
      props: { steps },
      template: `<pds-docs-steps [steps]="steps" />`,
    }),
  };
}

export function cardsStory(cards: readonly DocsCard[], columns: 2 | 3 = 3): StoryObj {
  return {
    parameters: DOCS_FIGURE_PARAMETERS,
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
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsCalloutComponent] },
      props: { tone, title, text, items },
      template: `<pds-docs-callout [tone]="tone" [title]="title" [text]="text" [items]="items" />`,
    }),
  };
}

/**
 * Ownership badge for a component docs page. Pass `XMetadata.governance`;
 * CSS-only blocks without a .metadata.ts declare the object inline.
 * Tagged `!dev` so it never appears in the sidebar — it exists for the MDX page.
 */
export function statusStory({ status, owner, note }: ComponentGovernance): StoryObj {
  return {
    tags: ['!dev'],
    parameters: DOCS_FIGURE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsStatusComponent] },
      props: { status, owner, note },
      template: `<pds-docs-status [status]="status" [owner]="owner" [note]="note" />`,
    }),
  };
}
