import type { Meta, StoryObj } from '@storybook/angular';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Typography',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'typography' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Roles: Story = {
  args: { bundle: 'type-role' },
};

export const Primitives: Story = {
  args: { groups: ['family', 'size', 'weight', 'line-height', 'spacing'] },
};
