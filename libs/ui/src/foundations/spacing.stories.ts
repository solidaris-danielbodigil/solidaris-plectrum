import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { doDontStory } from '../docs/docs-figure-stories';
import { CopyableTextComponent } from '../lib/copyable-text/copyable-text.component';
import { readTokenDeclarations } from '../storybook/cssom';
import {
  hideExplorerArgTypes,
  hideExplorerControls,
} from '../storybook/hide-explorer-controls';
import { assertTextVisible } from '../storybook/story-tests';
import { showStorybookToast } from '../storybook/storybook-toast';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';
import {
  resolveSpacingStop,
  SPACING_PROPERTIES,
  SPACING_PROPERTY_HINTS,
  spacingClass,
  spacingSnippet,
  spacingStops,
  spacingTokenVar,
  stopArgName,
  stopDisplayLabel,
  type SpacingProperty,
} from './spacing-playground';

const meta: Meta<TokenExplorerComponent> = {
  title: 'Foundations/Spacing',
  component: TokenExplorerComponent,
  tags: ['!dev'],
  args: { category: 'spacing' },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TokenExplorerComponent>;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Gap, padding and margin on the global scale',
        detail:
          'Write o-layout--gap-2 / o-layout--padding-3 in the template. Almost never var(--pds-spacing-*) in component SCSS.',
      },
      {
        title: 'A component token that composes the scale',
        detail:
          'When the value belongs in 01-settings, point it at the scale (including calc of two stops).',
      },
    ],
    donts: [
      {
        title: 'Raw px or rem padding in 06-components',
        detail: 'A literal will not track the 14px root or the half-unit scale.',
        alternative: 'o-layout--* in the template, or a component token that aliases a stop.',
      },
      {
        title: 'display: flex; gap: … in component SCSS',
        detail: 'Layout belongs on the object classes, not in the BEM sheet.',
        alternative: 'o-flex plus o-layout--gap-* on the same element.',
      },
    ],
  }),
};

export const Scale: Story = {};

interface PlaygroundArgs {
  property: SpacingProperty;
  gapStop: string;
  paddingStop: string;
  marginStop: string;
}

const stopArgTypes = Object.fromEntries(
  SPACING_PROPERTIES.map((property) => [
    stopArgName(property),
    {
      name: 'Spacing size',
      control: {
        type: 'select',
        labels: Object.fromEntries(
          spacingStops(property).map((stop) => [stop, stopDisplayLabel(stop)]),
        ),
      },
      options: spacingStops(property),
      if: { arg: 'property', eq: property },
      description: `Scale value — every stop the stylesheet generates for o-layout--${property}-*.`,
    },
  ]),
);

/**
 * Pick a spacing intent and a scale stop; the demo applies the real class and
 * shows the snippet to copy. Options come from the CSSOM, never a list here.
 * Each property has its own stop select, so only combinations the stylesheet
 * actually supports can be composed.
 */
export const Playground: StoryObj<PlaygroundArgs> = {
  tags: ['dev'],
  args: { property: 'gap', gapStop: '2', paddingStop: '2', marginStop: '2' },
  argTypes: {
    ...hideExplorerArgTypes,
    property: {
      name: 'Property',
      control: 'inline-radio',
      options: [...SPACING_PROPERTIES],
      description: 'Which box property the o-layout class sets.',
    },
    ...stopArgTypes,
  },
  decorators: [moduleMetadata({ imports: [CopyableTextComponent] })],
  parameters: { layout: 'padded', ...hideExplorerControls },
  render: (args) => {
    const property = SPACING_PROPERTIES.includes(args.property)
      ? args.property
      : SPACING_PROPERTIES[0];
    const stops = spacingStops(property);
    const requested = args[stopArgName(property) as keyof PlaygroundArgs];
    const stop = stops.includes(requested) ? requested : stops[0];
    const cls = spacingClass(property, stop);
    const snippet = spacingSnippet(property, stop);
    const tokenVar = spacingTokenVar(stop);
    const hasToken = readTokenDeclarations().has(tokenVar);
    const resolved = resolveSpacingStop(stop);
    const hint = SPACING_PROPERTY_HINTS[property];
    const cell =
      '<div class="c-demo-cell o-layout--padding-2" style="background: var(--pds-color-primary-100);">cell</div>';
    const demo =
      property === 'gap'
        ? `<div class="o-flex ${cls}">${cell}${cell}${cell}</div>`
        : property === 'padding'
          ? `<div class="${cls}" style="background: var(--pds-color-primary-100); width: max-content;">${cell}</div>`
          : `<div style="background: var(--pds-color-primary-100); width: max-content;"><div class="c-demo-cell ${cls} o-layout--padding-2">cell</div></div>`;
    return {
      props: {
        cls,
        snippet,
        onCopied: (text: string) =>
          showStorybookToast({ summary: 'Copied', detail: text }),
      },
      template: `
        <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3">
          <p class="o-layout--margin-0">${hint}</p>
          ${demo}
          <p class="o-layout--margin-0">${resolved}${hasToken ? ` · var(${tokenVar})` : ''}</p>
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
