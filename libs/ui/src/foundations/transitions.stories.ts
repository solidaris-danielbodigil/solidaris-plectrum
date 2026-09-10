import type { Meta, StoryObj } from '@storybook/angular-vite';
import { doDontStory } from '../docs/docs-figure-stories';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Transitions',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'motion' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Any transition in 06-components',
        detail:
          '--pds-transition-duration for hover / focus / color; --pds-transition-duration-mask for scrims. Name the properties.',
      },
    ],
    donts: [
      {
        title: 'Literal 0.2s / 200ms values',
        detail: 'Motion length then drifts per component.',
        alternative: 'The duration tokens. Default easing is ease — do not invent a curve.',
      },
      {
        title: 'transition: all, or animating width / height / top',
        detail: 'Layout animation is janky and fights prefers-reduced-motion previews.',
        alternative: 'Transform and opacity, with the properties listed.',
      },
    ],
  }),
};

export const Duration: Story = {};
