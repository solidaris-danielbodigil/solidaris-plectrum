import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { anatomyStory, contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { accessibleLabel, expect, expectFocus, focused, resetFocus, userEvent, waitFor, within } from '../../storybook/story-tests';
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
  argTypes: argTypesFromProps(TopNavMetadata.props ?? []),
};

export default meta;
type Story = StoryObj<TopNavComponent>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from top-nav.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(TopNavMetadata.governance, TopNavMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(TopNavMetadata, 'usage') };
export const Patterns = { tags: ['!dev'], ...contractStory(TopNavMetadata, 'patterns') };
export const Examples = { tags: ['!dev'], ...contractStory(TopNavMetadata, 'examples') };
export const Composition = { tags: ['!dev'], ...contractStory(TopNavMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(TopNavMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(TopNavMetadata, 'accessibility') };

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

export const Anatomy = { tags: ['!dev'], ...anatomyStory(TopNavMetadata, Default) };

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

export const LocaleSwitcher: Story = {
  args: {
    breadcrumbs: breadcrumbItems,
    avatarInitials: 'IG',
    showLocaleSwitcher: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Langue')).toBeVisible();
    await expect(canvas.getByText('FR')).toBeVisible();
    await expect(canvas.getByText('NL')).toBeVisible();
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
/**
 * Keyboard contract (top-nav.metadata.ts → accessibility.keyboardSupport):
 * Tab follows the visual order up to the search, focus on the search toggle opens
 * the field, Escape closes it and returns focus to the toggle, and Tab continues
 * to the help button.
 */
export const Keyboard: Story = {
  tags: ['keyboard'],
  args: {
    breadcrumbs: breadcrumbItems,
    avatarInitials: 'LV',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    resetFocus(canvasElement);
    const reached: Element[] = [];
    for (let i = 0; i < 15 && focused(canvasElement)?.getAttribute('role') !== 'searchbox'; i++) {
      await userEvent.tab();
      reached.push(focused(canvasElement)!);
    }
    const searchbox = canvas.getByRole('searchbox', { name: 'Search' });
    await expectFocus(searchbox);
    // Everything before the search sits on one row: each stop is right of the previous one.
    const lefts = reached.slice(0, -1).map((element) => element.getBoundingClientRect().left);
    await expect(lefts).toEqual([...lefts].sort((a, b) => a - b));
    await expect(reached.slice(0, -1).map(accessibleLabel).filter(Boolean).length).toBe(reached.length - 1);

    await userEvent.type(searchbox, 'clavier');
    await userEvent.keyboard('{Escape}');
    const toggle = await waitFor(() => canvas.getByRole('button', { name: 'Search' }));
    await expectFocus(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('searchbox')).toBeNull();

    await userEvent.tab();
    await expect(accessibleLabel(focused(canvasElement))).toBe('Help');
  },
};
