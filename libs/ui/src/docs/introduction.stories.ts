// Figures for the Introduction landing page (introduction.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
import { cardsStory, heroStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Introduction/Figures',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const Hero: StoryObj = heroStory({
  title: 'Plectrum Design System',
  lead: 'The Solidaris design system — one source of truth for every application.',
  actions: [
    {
      label: 'Use Plectrum in an app',
      path: '/docs/get-started-use-plectrum-in-an-app--docs',
      variant: 'primary',
    },
    {
      label: 'Contribute',
      path: '/docs/get-started-contribute--docs',
      variant: 'secondary',
    },
    {
      label: 'Browse components',
      path: '/docs/custom-components-accordion--docs',
      variant: 'secondary',
    },
  ],
});

export const Audiences: StoryObj = cardsStory(
  [
    {
      eyebrow: 'Developer',
      tone: 'app',
      title: 'Use Plectrum in an application',
      items: [
        'Install the published @solidaris/* packages',
        'Boot the theme with providePlectrum()',
        'Build screens from PrimeNG + the Core components here',
      ],
    },
    {
      eyebrow: 'Application team',
      tone: 'app',
      title: 'Migrate an application to Plectrum',
      items: [
        'Need a variant the system lacks? Propose it to the core team first',
        'App-specific answers are built in your layer as Candidates, under Patterns/{App}',
        'Consume --pds-* tokens only; the core team promotes what proves reusable',
      ],
    },
    {
      eyebrow: 'Contributor',
      tone: 'system',
      title: 'Change the design system',
      items: [
        'Propose, get the core team’s decision, then scaffold with pds:component',
        'Tokens in 01-settings, layout via o-flex / o-layout, BEMIT names',
        'A component ships through a pull request with design-system review and stories for every state',
      ],
    },
    {
      eyebrow: 'Designer',
      tone: 'design',
      title: 'Design against the source',
      items: [
        'The Figma UI Kit is the SSOT for visual decisions',
        'Core designers edit the UI Kit and run the sync; application designers propose through proposals/{app}',
        'Token changes travel through the reviewed pipeline, never by hand',
      ],
    },
  ],
  2,
);

export const FirstHour: StoryObj = stepsStory([
  {
    who: 'You',
    tone: 'neutral',
    title: 'Skim the Foundations',
    detail:
      'Colors, Typography, Spacing, Layout — every value on those pages is read live from the compiled stylesheet.',
    links: [
      {
        label: 'Colors',
        path: '/docs/foundations-colors-semantic-common--docs',
      },
      { label: 'Typography', path: '/docs/foundations-typography-roles--docs' },
      { label: 'Spacing', path: '/docs/foundations-spacing--docs' },
      { label: 'Layout', path: '/docs/foundations-layout--docs' },
    ],
  },
  {
    who: 'You',
    tone: 'neutral',
    title: 'Open a component story',
    detail:
      'Each state is a story; the attached Docs page explains usage and links the Figma node. Show code reveals the template.',
    links: [
      {
        label: 'Accordion — a typical component page',
        path: '/docs/custom-components-accordion--docs',
      },
    ],
  },
  {
    who: 'You',
    tone: 'app',
    title: 'Follow your path',
    detail:
      'Use Plectrum in an app (install and consume) or Contribute (propose, decide, build, ship). Both pages are in Get started.',
    links: [
      {
        label: 'Use Plectrum in an app',
        path: '/docs/get-started-use-plectrum-in-an-app--docs',
      },
      { label: 'Contribute', path: '/docs/get-started-contribute--docs' },
    ],
  },
  {
    who: 'You',
    tone: 'system',
    title: 'Learn the two contracts',
    detail:
      'CSS architecture explains where styles live; Token pipeline explains where values come from.',
    links: [
      { label: 'CSS architecture', path: '/docs/docs-css-architecture--docs' },
      { label: 'Token pipeline', path: '/docs/docs-token-pipeline--docs' },
    ],
  },
]);
