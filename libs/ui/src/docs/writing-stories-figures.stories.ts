// Figures for Docs/Writing stories (story-authoring.mdx).
// Hidden from the sidebar. Accordion canvases live in
// libs/ui/src/lib/accordion/accordion.stories.ts.
import type { Meta, StoryObj } from '@storybook/angular';
import { calloutStory, cardsStory } from './docs-figure-stories';

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

export const Rules: StoryObj = cardsStory([
  {
    title: 'CSF owns stories, MDX owns prose',
    lead: 'Do not put usage guidance in parameters.docs.description.component or .story. Attach {name}.mdx with Meta of={Stories}.',
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
    lead: "Default always. Then Selected, Disabled, Empty, Loading and Error when the component has those states. Stories stay visible in the sidebar so the Interactions and Accessibility panels are reachable; only docs-figure stories use tags: ['!dev'].",
  },
  {
    title: 'Controls on Default, API last',
    lead: 'An h2 / h3 per canvas so On this page can list them. Controls of={Stories.Default} sit under the Default canvas. ## API and ArgTypes of={Stories} stay last.',
  },
  {
    title: 'Docs tables',
    lead: 'Use DocsTable from libs/ui/.storybook/docs-table.ts. Markdown pipe tables collapse to one line in Storybook 10 MDX.',
  },
]);
