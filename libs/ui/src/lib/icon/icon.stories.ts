// =============================================================================
// libs/ui/src/lib/icon/icon.stories.ts
// Storybook stories for <(pds|app|lib)-icon>
// =============================================================================

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { IconComponent } from './icon.component';
import { IconRegistry } from './icon.registry';

// Sample SVG for demonstrating the registry-based source.
const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 12.5A5.5 5.5 0 1 1 8 2.5a5.5 5.5 0 0 1 0 11Zm.75-7.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.25 7h1.5v4h-1.5V7Z"/></svg>`;

const meta: Meta<IconComponent> = {
  title: 'Atoms/Icon',
  component: IconComponent,
  decorators: [
    moduleMetadata({ imports: [IconComponent] }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Icon** — universal icon primitive for the Plectrum Design System.

Renders a Bootstrap Icons class or a custom SVG retrieved from \`IconRegistry\`.

- **source="class"** (default) — pass any Bootstrap Icons class string, e.g. \`bi bi-house\`
- **source="svg"** — pass a registry key previously registered via \`IconRegistry.register(name, svg)\`
- **size** — \`xs | sm | md | lg | xl\` — maps to \`--pds-icon-size-*\` tokens
- **label** — when provided the icon is non-decorative (\`role="img"\`, \`aria-label\`); when omitted it is \`aria-hidden\`

Figma: [Icons — Plectrum UI Kit](https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-)
        `,
      },
    },
  },
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
  parameters: {
    docs: { description: { story: 'Default Bootstrap Icons class icon at `md` size, decorative (aria-hidden).' } },
  },
};

export const SizeVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:1rem;">
        <(pds|app|lib)-icon icon="bi bi-star-fill" size="xs" />
        <(pds|app|lib)-icon icon="bi bi-star-fill" size="sm" />
        <(pds|app|lib)-icon icon="bi bi-star-fill" size="md" />
        <(pds|app|lib)-icon icon="bi bi-star-fill" size="lg" />
        <(pds|app|lib)-icon icon="bi bi-star-fill" size="xl" />
      </div>
    `,
    moduleMetadata: { imports: [IconComponent] },
  }),
  parameters: {
    docs: { description: { story: 'All five size variants: `xs`, `sm`, `md`, `lg`, `xl`.' } },
  },
};

export const StandaloneAccessible: Story = {
  args: { icon: 'bi bi-bell', source: 'class', size: 'md', label: 'Notifications' },
  parameters: {
    docs: { description: { story: 'Non-decorative icon with `label` → gets `role="img"` and `aria-label`.' } },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Custom SVG registered via `IconRegistry.register()` and rendered via `source="svg"`.',
      },
    },
  },
};

export const ColourInheritance: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1.5rem;">
        <span style="color:var(--pds-color-brand, #da002f)"><(pds|app|lib)-icon icon="bi bi-heart-fill" size="lg"/></span>
        <span style="color:var(--pds-color-success, #2e7d32)"><(pds|app|lib)-icon icon="bi bi-check-circle-fill" size="lg"/></span>
        <span style="color:var(--pds-color-danger, #c62828)"><(pds|app|lib)-icon icon="bi bi-exclamation-triangle-fill" size="lg"/></span>
      </div>
    `,
    moduleMetadata: { imports: [IconComponent] },
  }),
  parameters: {
    docs: { description: { story: 'Icons inherit `currentColor` from the surrounding text colour.' } },
  },
};
