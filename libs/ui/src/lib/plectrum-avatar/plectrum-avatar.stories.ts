import type { Meta, StoryObj } from '@storybook/angular';
import { PlectrumAvatarComponent } from './plectrum-avatar.component';

const meta: Meta<PlectrumAvatarComponent> = {
  title: 'Atoms / PlectrumAvatar',
  component: PlectrumAvatarComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**PlectrumAvatar** — initials-based avatar treatment for the Plectrum design system.

- Figma: [Custom component node 1:1586](https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=1-1586)
- Hover, focus-visible, and pressed are CSS pseudo-class states
- The \`state\` input controls the persistent selected/active state
- Active state uses the blue halo + white outline from the Figma spec
- Not the same as PrimeNG Avatar; this is a custom Plectrum treatment
        `,
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'active'],
    },
    initials: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<PlectrumAvatarComponent>;

export const Default: Story = {
  args: {
    initials: 'LV',
    state: 'default',
  },
};

export const Active: Story = {
  args: {
    initials: 'LV',
    state: 'active',
  },
};
