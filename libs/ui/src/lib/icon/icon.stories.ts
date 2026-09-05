// =============================================================================
// libs/ui/src/lib/icon/icon.stories.ts
// Storybook stories for <pds-icon>
// =============================================================================

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { IconComponent } from './icon.component';
import { IconRegistry } from './icon.registry';

// Sample SVG for demonstrating the registry-based source.
const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 12.5A5.5 5.5 0 1 1 8 2.5a5.5 5.5 0 0 1 0 11Zm.75-7.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.25 7h1.5v4h-1.5V7Z"/></svg>`;

const meta: Meta<IconComponent> = {
  title: 'Custom components/Icon',
  component: IconComponent,
  decorators: [
    moduleMetadata({ imports: [IconComponent] }),
  ],
  argTypes: {
    icon: { control: 'text' },
    source: { control: 'select', options: ['class', 'svg'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<IconComponent>;

// ── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { icon: 'bi bi-house', source: 'class', size: 'md' },
};

export const SizeVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:1rem;">
        <pds-icon icon="bi bi-star-fill" size="xs" />
        <pds-icon icon="bi bi-star-fill" size="sm" />
        <pds-icon icon="bi bi-star-fill" size="md" />
        <pds-icon icon="bi bi-star-fill" size="lg" />
        <pds-icon icon="bi bi-star-fill" size="xl" />
      </div>
    `,
    moduleMetadata: { imports: [IconComponent] },
  }),
};

export const StandaloneAccessible: Story = {
  args: { icon: 'bi bi-bell', source: 'class', size: 'md', label: 'Notifications' },
};

export const CustomSvgFromRegistry: Story = {
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: IconRegistry,
          useFactory: () => {
            const reg = new IconRegistry();
            reg.register('info-circle', SAMPLE_SVG);
            return reg;
          },
        },
      ],
    }),
  ],
  args: { icon: 'info-circle', source: 'svg', size: 'lg' },
};

export const ColourInheritance: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1.5rem;">
        <span style="color:var(--pds-color-brand, #da002f)"><pds-icon icon="bi bi-heart-fill" size="lg"/></span>
        <span style="color:var(--pds-color-success, #2e7d32)"><pds-icon icon="bi bi-check-circle-fill" size="lg"/></span>
        <span style="color:var(--pds-color-danger, #c62828)"><pds-icon icon="bi bi-exclamation-triangle-fill" size="lg"/></span>
      </div>
    `,
    moduleMetadata: { imports: [IconComponent] },
  }),
};
