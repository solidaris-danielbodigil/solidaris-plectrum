import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { doDontStory } from '../docs/docs-figure-stories';
import { CopyableTextComponent } from '../lib/copyable-text/copyable-text.component';
import {
  hideExplorerArgTypes,
  hideExplorerControls,
} from '../storybook/hide-explorer-controls';
import { assertTextVisible } from '../storybook/story-tests';
import { showStorybookToast } from '../storybook/storybook-toast';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';
import {
  textRoleHint,
  textStyleMetrics,
  textStyles,
  textStyleTokens,
} from './typography-playground';

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
 * Pick a text role on editable preview text; the demo applies the real utility
 * class and shows the resolved metrics behind it.
 */
export const Playground: StoryObj = {
  tags: ['dev'],
  args: {
    style: 'body-md',
    sample: 'Solidaris renders Agenda for display and Open Sans for body — 0123456789.',
  },
  argTypes: {
    ...hideExplorerArgTypes,
    style: {
      name: 'Text role',
      control: 'select',
      options: textStyles(),
      description: 'u-text-{role}-{size} — every generated text style.',
    },
    sample: {
      name: 'Preview text',
      control: 'text',
      description: 'Preview text to render.',
    },
  },
  decorators: [moduleMetadata({ imports: [CopyableTextComponent] })],
  parameters: { layout: 'padded', ...hideExplorerControls },
  render: (args) => {
    const { style, sample } = args as { style: string; sample: string };
    const hint = textRoleHint(style);
    const metrics = textStyleMetrics(style);
    const tokens = textStyleTokens(style)
      .map((cssVar) => `var(${cssVar})`)
      .join(' · ');
    const cls = `u-text-${style}`;
    const snippet = `<p class="${cls}">…</p>`;
    const metricRows = metrics
      .map(
        (metric) =>
          `<div class="o-flex o-flex--align-items-baseline o-layout--gap-2">
            <span>${metric.property}</span>
            <code>${metric.value}</code>
            <code>var(${metric.cssVar})</code>
          </div>`,
      )
      .join('');
    return {
      props: {
        sample,
        cls,
        snippet,
        onCopied: (text: string) =>
          showStorybookToast({ summary: 'Copied', detail: text }),
      },
      template: `
        <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3">
          ${hint ? `<p class="o-layout--margin-0">${hint}</p>` : ''}
          <p class="${cls} o-layout--margin-0" style="max-width: 48rem;">{{ sample }}</p>
          <div class="o-flex o-flex--col o-layout--gap-1">
            ${metricRows}
            ${tokens ? `<code>${tokens}</code>` : ''}
          </div>
          <div class="o-flex o-flex--col o-layout--gap-2">
            <pds-copyable-text
              label="Class"
              [value]="cls"
              ariaLabel="Copy class"
              (copied)="onCopied($event)"
            />
            <pds-copyable-text
              label="Snippet"
              [value]="snippet"
              ariaLabel="Copy snippet"
              (copied)="onCopied($event)"
            />
          </div>
        </div>`,
    };
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Class');
  },
};
