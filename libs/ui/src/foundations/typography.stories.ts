import type { Meta, StoryObj } from '@storybook/angular-vite';
import { doDontStory } from '../docs/docs-figure-stories';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';
import { textStyles, textStyleTokens } from './typography-playground';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Typography',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'typography' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'A semantic role that matches the content',
        detail:
          'Display for hero figures, heading for titles, label for UI chrome, body for prose. Take the whole role.',
      },
      {
        title: 'The mixin in component SCSS, u-text-* in a template',
        detail:
          '@include text-heading-sm in 06-components. The utility is for one-off documentation text.',
      },
    ],
    donts: [
      {
        title: 'Hardcoded font-size or font-family',
        detail: 'Agenda and Open Sans are assigned per role. A literal breaks the 14px root.',
        alternative: '@include text-{role}-{size} or var(--pds-text-{role}-{size}-{prop}) for one property.',
      },
      {
        title: 'A size from one role with a line-height from another',
        detail: 'That is how vertical rhythm drifts.',
        alternative: 'The whole role. Isolate a single property only when you must.',
      },
    ],
  }),
};

export const Roles: Story = {
  args: { bundle: 'type-role' },
};

export const Primitives: Story = {
  args: { groups: ['family', 'size', 'weight', 'line-height', 'spacing'] },
};

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
    const tokens = textStyleTokens(style)
      .map((cssVar) => `var(${cssVar})`)
      .join(' · ');
    return {
      props: { sample },
      template: `
        <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3">
          <p class="u-text-${style} o-layout--margin-0" style="max-width: 48rem;">{{ sample }}</p>
          <div class="o-flex o-flex--col o-layout--gap-1">
            <code>class="u-text-${style}"</code>
            ${tokens ? `<code>${tokens}</code>` : ''}
          </div>
        </div>`,
    };
  },
};
