import type { Meta, StoryObj } from '@storybook/angular';
import { readClassSuffixes } from '../storybook/cssom';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Spacing',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'spacing' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Scale: Story = {};

/** Non-responsive gap stops from the compiled stylesheet (rule 10-css-ssot). */
const spacingStops = () =>
  readClassSuffixes(/^o-layout--gap-([a-z0-9-]+)$/).filter((stop) => !stop.includes('@'));

/**
 * Pick a spacing intent and a scale stop; the demo applies the real class and
 * shows the snippet to copy. Options come from the CSSOM, never a list here.
 */
export const Playground: StoryObj = {
  tags: ['dev'],
  args: { property: 'gap', stop: '2' },
  argTypes: {
    property: {
      control: 'inline-radio',
      options: ['gap', 'padding', 'margin'],
      description: 'Which box property the o-layout class sets.',
    },
    stop: {
      control: 'select',
      options: spacingStops(),
      description: 'Scale stop — every stop generated in the stylesheet.',
    },
  },
  parameters: { layout: 'padded' },
  render: (args) => {
    const { property, stop } = args as { property: string; stop: string };
    const cls = `o-layout--${property}-${stop}`;
    const cell =
      '<div class="c-demo-cell o-layout--padding-2" style="background: var(--pds-color-primary-100);">cell</div>';
    const demo =
      property === 'gap'
        ? `<div class="o-flex ${cls}">${cell}${cell}${cell}</div>`
        : property === 'padding'
          ? `<div class="${cls}" style="background: var(--pds-color-primary-100); width: max-content;">${cell}</div>`
          : `<div style="background: var(--pds-color-primary-100); width: max-content;"><div class="c-demo-cell ${cls} o-layout--padding-2">cell</div></div>`;
    return {
      template: `
        <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3">
          ${demo}
          <div class="o-flex o-flex--col o-layout--gap-1">
            <code>class="${cls}"</code>
            <code>var(--pds-spacing-${stop})</code>
          </div>
        </div>`,
    };
  },
};
