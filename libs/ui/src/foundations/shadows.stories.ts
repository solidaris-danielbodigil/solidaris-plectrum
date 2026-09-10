import type { Meta, StoryObj } from '@storybook/angular';
import { doDontStory } from '../docs/docs-figure-stories';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Shadows',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'shadow' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Pick by the role of the surface',
        detail:
          'Select, popover, modal and navigation each have one overlay token. Resting cards use sm / md.',
      },
      {
        title: 'u-shadow-* in the template, a component token in SCSS',
        detail:
          'Demos and static chrome take the utility. Real components alias the stop in 01-settings.',
      },
    ],
    donts: [
      {
        title: 'Hand-composed box-shadow offsets in 06-components',
        detail: 'A one-off stack will not match overlays or theme switches.',
        alternative: 'var(--pds-shadow-*) or u-shadow-* for the matching role.',
      },
      {
        title: 'Elevation as a focus indicator',
        detail: 'A glow then means both “raised” and “focused”.',
        alternative: 'Focus ring tokens on :focus-visible.',
      },
    ],
  }),
};

export const Overlay: Story = {};
