import type { Meta, StoryObj } from '@storybook/angular';
import { TokenFinderComponent } from '../storybook/token-finder.component';

const meta: Meta<TokenFinderComponent> = {
  title: 'Foundations/Token finder',
  component: TokenFinderComponent,
  tags: ['!dev'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenFinderComponent>;

export const Finder: Story = {
  tags: ['dev'],
};
