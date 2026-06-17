import type { Meta, StoryObj } from '@storybook/angular';
import { CopyableTextComponent } from './copyable-text.component';

const meta: Meta<CopyableTextComponent> = {
  title: 'UI/Copyable Text',
  component: CopyableTextComponent,
  parameters: {
    docs: {
      description: {
        component: `
Reusable copy-to-clipboard chip for identifier buttons and similar metadata.

**When to use**
- Stable identifiers users copy often (Territoire, NISS, NSI, dossier numbers)
- Any \`label + value\` pair where the value must land on the clipboard in one click

**Clipboard behaviour**
- Writes \`value\` via the async Clipboard API when available
- Falls back to a temporary textarea + \`document.execCommand('copy')\` in older or non-secure contexts
- Emits \`(copied)\` with the copied string after a successful write — use for toasts or analytics only

**Accessibility**
- Renders a PrimeNG text button with \`aria-label\` defaulting to \`Copier {label}\`
- Override with \`ariaLabel\` when the visible label is insufficient
- Bullet separators between chips must use \`aria-hidden="true"\`
        `,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    ariaLabel: { control: 'text' },
    iconSize: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<CopyableTextComponent>;

export const Default: Story = {
  args: {
    label: 'Territoire',
    value: '319',
    iconSize: 'xs',
    disabled: false,
  },
};

export const IdentifierRow: Story = {
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [CopyableTextComponent],
    },
    template: `
      <div class="o-flex o-flex--align-items-center o-layout--gap-1 o-flex--wrap">
        <(pds|app|lib)-copyable-text label="Territoire" value="319" [iconSize]="iconSize" />
        <span class="c-copyable-text__separator" aria-hidden="true">•</span>
        <(pds|app|lib)-copyable-text label="NISS" value="85010112345" [iconSize]="iconSize" />
        <span class="c-copyable-text__separator" aria-hidden="true">•</span>
        <(pds|app|lib)-copyable-text label="NSI" value="A-123456" [iconSize]="iconSize" />
      </div>
    `,
  }),
  args: {
    iconSize: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple identifiers in a row with bullet separators — same layout as the affiliate overview card.',
      },
    },
  },
};

export const CustomAriaLabel: Story = {
  args: {
    label: 'Territoire',
    value: '319',
    ariaLabel: 'Copier le numéro de territoire 319',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Territoire',
    value: '319',
    disabled: true,
  },
};
