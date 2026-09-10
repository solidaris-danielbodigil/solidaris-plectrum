import type { Meta, StoryObj } from '@storybook/angular';
import { doDontStory } from '../docs/docs-figure-stories';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Focus',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'focus' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Every interactive custom control',
        detail:
          'Buttons, rows, cards and list items share one ring so a p-button and a c-* row focus identically.',
      },
      {
        title: ':focus-visible with all four ring properties',
        detail:
          'Width, style, color and offset. Add border-radius so the ring follows the control’s shape.',
      },
    ],
    donts: [
      {
        title: 'outline: none with no replacement',
        detail: 'Keyboard users lose the only focus indicator.',
        alternative: 'The four --pds-focus-ring-* tokens on :focus-visible.',
      },
      {
        title: 'A box-shadow glow instead of the ring',
        detail: 'Elevation and focus then look the same, and the ring no longer matches PrimeNG.',
        alternative: 'Focus tokens for the ring; u-shadow-* / overlay tokens for elevation.',
      },
    ],
  }),
};

export const Ring: Story = {};
