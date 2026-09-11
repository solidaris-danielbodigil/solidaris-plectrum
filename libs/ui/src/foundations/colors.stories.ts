import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { Tag } from 'primeng/tag';
import { doDontStory } from '../docs/docs-figure-stories';
import { CopyableTextComponent } from '../lib/copyable-text/copyable-text.component';
import {
  ContrastCheckerComponent,
  contrastFromResolved,
  contrastRatioLabel,
  measureTokenColor,
  semanticColorVars,
} from '../storybook/contrast-checker.component';
import {
  hideExplorerArgTypes,
  hideExplorerControls,
} from '../storybook/hide-explorer-controls';
import { assertTextVisible } from '../storybook/story-tests';
import { showStorybookToast } from '../storybook/storybook-toast';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';
import {
  COLOR_PRIMITIVE_GROUPS,
  COLOR_SEMANTIC_GROUPS,
} from '../storybook/token-sections';
import { COMPONENT_GROUP } from '../storybook/token-taxonomy';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Colors',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'color' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const UsagePrimitive = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Authoring a new semantic role in 01-settings',
        detail:
          'Point the role at a ramp step (--pds-color-text: var(--pds-color-gray-900)). Apps never consume the step.',
      },
    ],
    donts: [
      {
        title: 'A hue step from a card, button or 06-components sheet',
        detail: 'That skips the semantic role and breaks theme switching.',
        alternative: 'var(--pds-color-text) (or another role). Add the role first if it is missing.',
      },
    ],
  }),
};

export const UsageSemantic = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Any color in 06-components',
        detail:
          'A Semantic Common role first — text, surface, content, form, navigation, primary — via var(--pds-color-…).',
      },
      {
        title: 'A primitive step only while defining that role',
        detail: 'The ramp lives in 01-settings. Components consume the role, not blue-600.',
      },
    ],
    donts: [
      {
        title: 'hex, rgb() or hsl() in component SCSS',
        detail: 'A literal will not follow the preset or a theme toggle.',
        alternative: 'var(--pds-color-…). If no role fits, add one in 01-settings.',
      },
      {
        title: '--p-* declared outside the settings bridge',
        detail: 'PrimeNG mappings belong in 01-settings/_settings.{component}.scss.',
        alternative: 'Bridge --p-* to --pds-* there, scoped to the BEM wrapper.',
      },
    ],
  }),
};

export const Primitive: Story = {
  args: { groups: COLOR_PRIMITIVE_GROUPS },
};

export const SemanticCommon: Story = {
  args: { groups: [...COLOR_SEMANTIC_GROUPS, COMPONENT_GROUP] },
};

export const StubbedProvidePlectrum: Story = {
  name: 'Stubbed providePlectrum',
  args: { stubPrime: true, groups: [...COLOR_SEMANTIC_GROUPS, COMPONENT_GROUP] },
};

/**
 * WCAG 2.1 pair checker — measure any text/surface combination before writing
 * SCSS. Thresholds from .ai/rules/06-accessibility.md. Results are for text
 * size, not a whole-component certification.
 */
export const Contrast: StoryObj = {
  tags: ['dev'],
  decorators: [moduleMetadata({ imports: [ContrastCheckerComponent] })],
  parameters: { layout: 'padded' },
  render: () => ({ template: `<pds-contrast-checker />` }),
};

/**
 * Pair a surface role with a text role on a sample tile — the fastest way to
 * try a combination before writing SCSS. Both option lists come from the CSSOM.
 * Approved pairings are a design-team question; this list is not a palette.
 */
export const Playground: StoryObj = {
  tags: ['dev'],
  args: {
    background: '--pds-color-surface-0',
    text: '--pds-color-text',
  },
  argTypes: {
    ...hideExplorerArgTypes,
    background: {
      name: 'Background',
      control: 'select',
      options: semanticColorVars([
        'surface',
        'primary',
        'content',
        'highlight',
        'form',
        'navigation',
        'overlay',
        'list',
      ]),
      description: 'Surface / background role.',
    },
    text: {
      name: 'Text',
      control: 'select',
      options: semanticColorVars(['text', 'primary', 'content']),
      description: 'Text role.',
    },
  },
  decorators: [
    moduleMetadata({ imports: [CopyableTextComponent, Tag] }),
  ],
  parameters: { layout: 'padded', ...hideExplorerControls },
  render: (args) => {
    const { background, text } = args as { background: string; text: string };
    const host = typeof document === 'undefined' ? null : document.body;
    const resolvedBg = host ? measureTokenColor(background, host) : '';
    const resolvedText = host ? measureTokenColor(text, host) : '';
    const contrast = contrastFromResolved(resolvedBg, resolvedText);
    const bgVar = `var(${background})`;
    const textVar = `var(${text})`;
    return {
      props: {
        background,
        text,
        bgVar,
        textVar,
        resolvedBg,
        resolvedText,
        ratioLabel: contrastRatioLabel(contrast.ratio),
        aa: contrast.aa ? 'pass' : 'fail',
        aaLarge: contrast.aaLarge ? 'pass' : 'fail',
        aaa: contrast.aaa ? 'pass' : 'fail',
        aaSeverity: contrast.aa ? 'success' : 'danger',
        aaLargeSeverity: contrast.aaLarge ? 'success' : 'danger',
        aaaSeverity: contrast.aaa ? 'success' : 'secondary',
        onCopied: (value: string) =>
          showStorybookToast({ summary: 'Copied', detail: value }),
      },
      template: `
        <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3">
          <p class="o-layout--margin-0">
            Contrast is for text size, not a whole-component certification.
            Approved text and background pairs are a design-team decision.
          </p>
          <div class="u-radius-md o-layout--padding-4" style="background: var({{ background }}); color: var({{ text }}); max-width: 32rem;">
            <strong>Sample heading</strong>
            <p class="o-layout--margin-0">Body copy rendered with the selected roles.</p>
          </div>
          <p class="o-layout--margin-0">{{ background }} — {{ resolvedBg }}</p>
          <p class="o-layout--margin-0">{{ text }} — {{ resolvedText }}</p>
          <div class="o-flex o-flex--align-items-center o-flex--wrap o-layout--gap-2">
            <strong>{{ ratioLabel }}</strong>
            <p-tag [value]="'AA normal text ≥ 4.5 — ' + aa" [severity]="aaSeverity" />
            <p-tag [value]="'AA large text ≥ 3 — ' + aaLarge" [severity]="aaLargeSeverity" />
            <p-tag [value]="'AAA normal text ≥ 7 — ' + aaa" [severity]="aaaSeverity" />
          </div>
          <div class="o-flex o-flex--col o-layout--gap-2">
            <pds-copyable-text
              label="Background"
              [value]="bgVar"
              ariaLabel="Copy background variable"
              (copied)="onCopied($event)"
            />
            <pds-copyable-text
              label="Text"
              [value]="textVar"
              ariaLabel="Copy text variable"
              (copied)="onCopied($event)"
            />
          </div>
        </div>`,
    };
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Background');
  },
};
