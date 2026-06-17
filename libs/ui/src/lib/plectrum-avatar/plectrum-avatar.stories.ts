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
**PlectrumAvatar** — initials-based and illustrated identity avatar for the Plectrum design system.

- Figma initials: [Custom component node 1:1586](https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=1-1586)
- Figma illustrated large: [node 507:7915](https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=507-7915) — 51.333 × 56px
- Default size: 32px initials variant (\`--pds-size-avatar\`)
- Large modifier: \`c-plectrum-avatar--large\` with a single illustrated SVG from \`libs/assets/\`
- Hover, focus-visible, and pressed are CSS pseudo-class states
- The \`state\` input controls the persistent selected/active state
- Active state uses the blue halo + white outline from the Figma spec
- Not the same as PrimeNG Avatar; this is a custom Plectrum treatment
        `,
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Small 32px initials avatar — default Plectrum identity treatment.',
      },
    },
  },
};

export const Active: Story = {
  args: {
    initials: 'LV',
    state: 'active',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small initials avatar with persistent active halo state.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          'Large illustrated avatar (51.333 × 56px) — Female Variant 1 from libs/assets.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Large illustrated avatar — Male Variant 2.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Large illustrated avatar — Other Variant 1 (only available variant).',
      },
    },
  },
};
