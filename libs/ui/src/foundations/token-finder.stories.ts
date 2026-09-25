import type { Meta, StoryObj } from '@storybook/angular-vite';
import { assertTextVisible, expect, within } from '../storybook/story-tests';
import { TokenFinderComponent } from '../storybook/token-finder.component';

const meta: Meta<TokenFinderComponent> = {
  title: 'Start here/Figures/Find a Token',
  component: TokenFinderComponent,
  tags: ['!dev'],
  parameters: { layout: 'fullscreen', chromatic: { disableSnapshot: true } },
};

export default meta;
type Story = StoryObj<TokenFinderComponent>;

export const Finder: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'What are you styling?');
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox')).toBeVisible();
  },
};
