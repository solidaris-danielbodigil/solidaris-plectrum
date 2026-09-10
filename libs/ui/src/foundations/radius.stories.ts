import type { Meta, StoryObj } from '@storybook/angular';
import { doDontStory } from '../docs/docs-figure-stories';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Radius',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'radius' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'A named stop for the surface',
        detail:
          'md for inputs and small cards, lg / xl for panels, pill for tags and badges.',
      },
      {
        title: 'u-radius-* for static chrome, a component token for SCSS',
        detail:
          'Point --pds-radius-card at a stop in 01-settings. Per-edge targets exist when only one corner changes.',
      },
    ],
    donts: [
      {
        title: 'A literal border-radius in 06-components',
        detail:
          'Older sheets used different px values than Figma. A hardcoded radius is drift.',
        alternative: 'u-radius-{stop} or var(--pds-radius-{stop}).',
      },
    ],
  }),
};

export const Stops: Story = {};
