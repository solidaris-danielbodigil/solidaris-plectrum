import type { Meta, StoryObj } from '@storybook/angular';
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

export const Duration: Story = {};
