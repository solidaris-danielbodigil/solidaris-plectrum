// Figures for Docs/Writing stories (story-authoring.mdx).
// Hidden from the sidebar. Accordion canvases live in
// libs/ui/src/lib/accordion/accordion.stories.ts.
import type { Meta, StoryObj } from '@storybook/angular';
import { calloutStory, cardsStory, doDontStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Docs/Writing stories/Figures',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const ExampleOnly: StoryObj = calloutStory({
  tone: 'info',
  title: 'c-accordion--bordered is already in the repository',
  text: 'Certificate and audit panels need a card-like bordered stack that stock PrimeNG + Plectrum do not provide. There is no [border] input. Write class="c-accordion--bordered" on p-accordion. The canvases below are the catalogue stories at Custom components/Accordion.',
});

/**
 * The documentation SSOT, shown with the very figure component pages use for
 * their Usage block (pds-docs-do-dont). Hand-authored here because this page
 * has no .metadata.ts of its own.
 */
export const DocsSource: StoryObj = doDontStory({
  dos: [
    {
      title: 'Add a use case to usage.useCases in the .metadata.ts',
      detail:
        'The Do card on the docs page re-renders from it. Same for antiPatterns, anatomy and accessibility.',
    },
    {
      title: 'Embed the block: <Story of={Stories.Usage} />',
      detail:
        'One CSF export per block, with a literal tag the indexer can see: { tags: ["!dev"], ...contractStory(XMetadata, "usage") }.',
    },
    {
      title: 'Add visuals in the MDX, under the figure',
      detail:
        'A screenshot or a canvas that illustrates a Do / Don’t is MDX content. The text it illustrates stays in the metadata.',
    },
  ],
  donts: [
    {
      title: 'Write a bullet under ## When to use',
      detail:
        'Two copies of the same fact drift — the audit measured 20 of 39 use cases and 6 of 32 anti-patterns still matching.',
      alternative:
        'usage.useCases / usage.antiPatterns, then <Story of={Stories.Usage} />. npm run docs:check fails the page otherwise.',
    },
    {
      title: 'Put the Anatomy rows in a <DocsTable>',
      detail: 'A table the schema has a field for is a second source.',
      alternative:
        'metadata.anatomy: [{ part, role }] and <Story of={Stories.Anatomy} />.',
    },
    {
      title: 'Restate the description or the Figma URL in the MDX',
      detail:
        'component.description and component.figmaUrl already render through the Status figure.',
      alternative: 'statusStory(XMetadata.governance, XMetadata.component).',
    },
  ],
});

export const Rules: StoryObj = cardsStory([
  {
    title: 'Metadata owns the documentation',
    lead: 'usage, anatomy, accessibility, description and Figma URL live in {name}.metadata.ts and render through pds-docs-status / pds-docs-contract. The MDX embeds them with <Story of={…} /> and adds canvases and visuals — never a restated bullet. Not parameters.docs.description either.',
  },
  {
    title: 'PrimeNG owns chrome',
    lead: 'Do not restyle .p-accordionpanel or other .p-* internals. Theme tokens come from providePlectrum(). A BEMIT modifier is justified only when the kit needs structure the preset cannot express.',
  },
  {
    title: 'Tokens and BEMIT',
    lead: 'Templates use o-flex / o-layout. Component SCSS uses var(--pds-*). No Tailwind utility classes in HTML, no hardcoded hex or px.',
  },
  {
    title: 'One export per state',
    lead: "Default or primary state always. Then Selected, Disabled, Empty, Loading and Error when the component has those states. Stories stay visible in the sidebar so the Interactions and Accessibility panels are reachable; only docs-figure stories use tags: ['!dev'].",
  },
  {
    title: 'Controls under the primary canvas',
    lead: 'An h2 / h3 per canvas so On this page can list them. Controls of={Stories.Default} sit under the Default canvas. Do not add ## API / ArgTypes on the same page — that table is the Controls panel again.',
  },
  {
    title: 'Docs tables',
    lead: 'Use DocsTable from libs/ui/.storybook/docs-table.ts. Markdown pipe tables collapse to one line in Storybook 10 MDX.',
  },
]);
