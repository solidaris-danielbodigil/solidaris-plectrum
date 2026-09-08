import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { statusStory } from '../../docs/docs-figure-stories';
import { storyDesign } from '../../storybook/story-design';
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
    ...storyDesign(TopNavMetadata.component.figmaUrl),
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

export const Dutch: Story = {
  globals: { locale: 'nl' },
  args: {
    breadcrumbs: breadcrumbItems,
    avatarInitials: 'LV',
    showAvatarMenu: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: 'Gebruikersmenu' }),
    ).toBeVisible();
  },
};

export const AvatarMenu: Story = {
  args: {
    breadcrumbs: breadcrumbItems,
    avatarInitials: 'LV',
    showAvatarMenu: true,
    avatarMenuItems: [{ label: 'Export', icon: 'bi bi-download' }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Menu utilisateur' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
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