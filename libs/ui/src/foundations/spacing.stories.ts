import type { Meta, StoryObj } from '@storybook/angular';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Spacing',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'spacing' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Scale: Story = {};
