import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TopNavComponent } from './top-nav.component';

const breadcrumbItems = [
  { label: 'Electronics', url: '#' },
  { label: 'Computer', url: '#' },
  { label: 'Accessories', url: '#' },
  { label: 'Keyboard' },
];

const meta: Meta<TopNavComponent> = {
  tags: ['!dev'],
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

export const Default: Story = {
  args: {
    breadcrumbs: breadcrumbItems,
    avatarInitials: 'LV',
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
};