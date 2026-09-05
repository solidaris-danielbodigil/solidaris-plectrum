import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ContrastCheckerComponent } from '../storybook/contrast-checker.component';
import { readTokenDeclarations } from '../storybook/cssom';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';
import {
  COLOR_PRIMITIVE_GROUPS,
  COLOR_SEMANTIC_GROUPS,
} from '../storybook/token-sections';
import { classifyToken, COMPONENT_GROUP } from '../storybook/token-taxonomy';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Colors',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'color' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

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
 * SCSS. Thresholds from .ai/rules/06-accessibility.md.
 */
export const Contrast: StoryObj = {
  tags: ['dev'],
  decorators: [moduleMetadata({ imports: [ContrastCheckerComponent] })],
  parameters: { layout: 'padded' },
  render: () => ({ template: `<pds-contrast-checker />` }),
};

/** Semantic colour roles from the CSSOM — primitives (hue ramps) excluded. */
const semanticColorVars = (groups: readonly string[]) =>
  [...readTokenDeclarations().values()]
    .filter((decl) => {
      const taxon = classifyToken(decl.name);
      return (
        taxon.category === 'color' &&
        groups.includes(taxon.group) &&
        !(COLOR_PRIMITIVE_GROUPS as readonly string[]).includes(taxon.group)
      );
    })
    .map((decl) => decl.cssVar)
    .sort();

/**
 * Pair a surface role with a text role on a sample tile — the fastest way to
 * try a combination before writing SCSS. Both option lists come from the CSSOM.
 */
export const Playground: StoryObj = {
  tags: ['dev'],
  args: {
    background: '--pds-color-surface-0',
    text: '--pds-color-text',
  },
  argTypes: {
    background: {
      control: 'select',
      options: semanticColorVars(['surface', 'primary', 'content', 'highlight', 'form', 'navigation', 'overlay', 'list']),
      description: 'Surface / background role.',
    },
    text: {
      control: 'select',
      options: semanticColorVars(['text', 'primary', 'content']),
      description: 'Text role.',
    },
  },
  parameters: { layout: 'padded' },
  render: (args) => {
    const { background, text } = args as { background: string; text: string };
    return {
      template: `
        <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3">
          <div class="u-radius-md o-layout--padding-4" style="background: var(${background}); color: var(${text}); max-width: 32rem;">
            <strong>Sample heading</strong>
            <p class="o-layout--margin-0">Body copy rendered with the selected roles.</p>
          </div>
          <div class="o-flex o-flex--col o-layout--gap-1">
            <code>background: var(${background});</code>
            <code>color: var(${text});</code>
          </div>
        </div>`,
    };
  },
};
