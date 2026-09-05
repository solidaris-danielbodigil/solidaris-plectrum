import type { Meta, StoryObj } from '@storybook/angular';
import { readClassSuffixes } from '../storybook/cssom';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Typography',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'typography' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Roles: Story = {
  args: { bundle: 'type-role' },
};

export const Primitives: Story = {
  args: { groups: ['family', 'size', 'weight', 'line-height', 'spacing'] },
};

/** Generated .u-text-{role}-{size} classes, from the compiled stylesheet. */
const textStyles = () =>
  readClassSuffixes(/^u-text-([a-z0-9-]+)$/).filter((style) => !style.includes('@'));

/**
 * Pick a text role on an editable sample; the demo applies the real utility
 * class and shows the token family behind it.
 */
export const Playground: StoryObj = {
  tags: ['dev'],
  args: {
    style: 'body-md',
    sample: 'Solidaris renders Agenda for display and Open Sans for body — 0123456789.',
  },
  argTypes: {
    style: {
      control: 'select',
      options: textStyles(),
      description: 'u-text-{role}-{size} — every generated text style.',
    },
    sample: { control: 'text', description: 'Sample text to render.' },
  },
  parameters: { layout: 'padded' },
  render: (args) => {
    const { style, sample } = args as { style: string; sample: string };
    return {
      props: { sample },
      template: `
        <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3">
          <p class="u-text-${style} o-layout--margin-0" style="max-width: 48rem;">{{ sample }}</p>
          <div class="o-flex o-flex--col o-layout--gap-1">
            <code>class="u-text-${style}"</code>
            <code>var(--pds-text-${style}-size) · var(--pds-text-${style}-family) · var(--pds-text-${style}-weight) · var(--pds-text-${style}-line)</code>
          </div>
        </div>`,
    };
  },
};
