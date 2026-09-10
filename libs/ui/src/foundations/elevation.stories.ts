// =============================================================================
// libs/ui/src/foundations/elevation.stories.ts
// Foundations / Elevation — u-shadow-* utility docs.
//
// The class list is enumerated from the compiled stylesheet at render time
// (.ai/rules/10-css-ssot.md).
// =============================================================================

import type { Meta, StoryObj } from '@storybook/angular-vite';
import { doDontStory } from '../docs/docs-figure-stories';
import { DocsTokenGalleryComponent } from '../storybook/docs-token-gallery.component';
import { assertTextVisible } from '../storybook/story-tests';
import {
  elevationCards,
  ElevationPlaygroundComponent,
  elevationStops,
} from './elevation-playground';

const meta: Meta = {
  title: 'Foundations/Elevation',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Resting elevation on a card, panel or drawer',
        detail:
          'Pick the stop by the role of the surface, not how strong the shadow looks. Token values live on Foundations / Shadows.',
      },
    ],
    donts: [
      {
        title: 'Composing box-shadow by hand',
        detail: 'The utility already maps to --pds-shadow-*. A custom stack will not match overlays.',
        alternative: 'u-shadow-{stop} in the template, or alias the stop on a component token.',
      },
      {
        title: 'Elevation as focus or status',
        detail: 'Those jobs belong to the focus ring and to semantic color, not to a shadow.',
        alternative: 'Foundations / Focus for the ring; a status token for meaning.',
      },
    ],
  }),
};

export const Playground: StoryObj = {
  name: 'Playground',
  tags: ['dev'],
  render: () => ({
    moduleMetadata: { imports: [ElevationPlaygroundComponent] },
    template: `<pds-elevation-playground />`,
  }),
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Level');
    await assertTextVisible(canvasElement, 'Result');
  },
};

export const Shadows: StoryObj = {
  name: 'Shadows',
  render: () => ({
    moduleMetadata: { imports: [DocsTokenGalleryComponent] },
    props: { source: () => elevationCards(elevationStops()) },
    template: `<pds-docs-token-gallery [source]="source" />`,
  }),
};
