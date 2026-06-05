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
  title: 'Navigation / TopNav',
  component: TopNavComponent,
  decorators: [moduleMetadata({ imports: [TopNavComponent] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**TopNav** — application shell header bar.

- Figma: [Custom components node 1:1533](https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=1-1533)
- Breadcrumb data is passed in via the \`breadcrumbs\` input; the component does not derive routes itself
- Sub-navigation state is controlled via \`subNavExpanded\` / \`subNavExpandedChange\`
- The search icon expands into a PrimeNG \`IconField\` + \`InputText\` control
- Buttons use the PrimeNG text variant and keep hover / focus-visible / active states in CSS
        `,
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Resting state with collapsed sub-navigation and only the search icon visible. The component is fully interactive.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Shows the persistent pressed state for the sub-navigation toggle button.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Shows the expanded PrimeNG search field state.',
      },
    },
  },
};