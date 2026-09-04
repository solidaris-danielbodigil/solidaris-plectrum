import type { Meta, StoryObj } from '@storybook/angular';
import { PlectrumAvatarComponent } from './plectrum-avatar.component';

const meta: Meta<PlectrumAvatarComponent> = {
  tags: ['!dev'],
  title: 'Custom components/PlectrumAvatar',
  component: PlectrumAvatarComponent,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'large'],
    },
    gender: {
      control: 'select',
      options: ['female', 'male', 'other'],
    },
    variant: {
      control: 'select',
      options: [1, 2, 3],
    },
    state: {
      control: 'select',
      options: ['default', 'active'],
    },
    initials: {
      control: 'text',
      description: 'Initials rendered in the small variant center.',
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible label for screen readers; falls back to uppercase initials when omitted.',
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

export const LargeIllustrated: Story = {
  args: {
    initials: 'EM',
    size: 'large',
    gender: 'female',
    variant: 1,
    ariaLabel: 'Eva Martinez',
  },
};

export const LargeMaleVariant2: Story = {
  args: {
    initials: 'JD',
    size: 'large',
    gender: 'male',
    variant: 2,
    ariaLabel: 'John Doe',
  },
};

export const LargeOther: Story = {
  args: {
    initials: 'AX',
    size: 'large',
    gender: 'other',
    variant: 1,
    ariaLabel: 'Alex',
  },
};
