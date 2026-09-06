import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { statusStory } from '../../docs/docs-figure-stories';
import { expect, userEvent, waitFor, within } from '../../storybook/story-tests';
import { TopNavComponent } from './top-nav.component';
import { TopNavMetadata } from './top-nav.metadata';

const breadcrumbItems = [
  { label: 'Electronics', url: '#' },
  { label: 'Computer', url: '#' },
  { label: 'Accessories', url: '#' },
  { label: 'Keyboard' },
];

const meta: Meta<TopNavComponent> = {
  title: 'Shell/Navigation/TopNav',
  component: TopNavComponent,
  decorators: [moduleMetadata({ imports: [TopNavComponent] })],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    subNavExpanded: { control: 'boolean' },
    searchExpanded: { control: 'boolean' },
    searchQuery: { control: 'text' },
    avatarInitials: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<TopNavComponent>;

/** Ownership badge for the docs page — hidden from the sidebar. */
export const Status = statusStory(TopNavMetadata.governance);

export const Default: Story = {
  args: {
    breadcrumbs: breadcrumbItems,
    avatarInitials: 'LV',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('banner').length).toBeGreaterThan(0);
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    await waitFor(() =>
      expect(canvas.getByRole('searchbox', { name: 'Search' })).toBeVisible(),
    );
  },
};

export const SubNavExpanded: Story = {
  args: {
    breadcrumbs: breadcrumbItems,
    avatarInitials: 'LV',
    subNavExpanded: true,
    searchExpanded: false,
    searchQuery: '',
  },
};

export const SearchOpen: Story = {
  args: {
    breadcrumbs: breadcrumbItems,
    avatarInitials: 'LV',
    subNavExpanded: false,
    searchExpanded: true,
    searchQuery: 'Keyboard',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('searchbox', { name: 'Search' }),
    ).toHaveValue('Keyboard');
  },
};