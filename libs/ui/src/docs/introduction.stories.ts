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
      label: 'Find a component',
      path: '/docs/docs-component-status--docs',
      variant: 'secondary',
    },
    {
      label: 'Pick a token',
      path: '/docs/foundations-token-finder--docs',
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
        'Install the versioned @solidaris/* packages (packed tarballs until the first release)',
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

/** The consumer path, in the order a developer needs it: install → render → find → style → ask. */
export const FirstHour: StoryObj = stepsStory([
  {
    who: 'Dev',
    tone: 'app',
    title: 'Use Plectrum in an app',
    detail:
      'Install the packages, wire the stylesheet, boot the theme with providePlectrum(). The page is the packed-consumer fixture CI builds on every push.',
    links: [
      {
        label: 'Use Plectrum in an app',
        path: '/docs/get-started-use-plectrum-in-an-app--docs',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Render your first component',
    detail:
      'pds-form-field from @solidaris/ui around a PrimeNG pInputText — the full example, with import paths, is on the same page. Form Field is a typical component page: one story per state, Show code reveals the template.',
    links: [
      {
        label: 'Form Field',
        path: '/docs/custom-components-form-field--docs',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Find a component',
    detail:
      'Component status lists every pds-* component with its status and owner and links its docs page. Anything PrimeNG already provides is in the PrimeNG theme gallery — use it as-is.',
    links: [
      { label: 'Component status', path: '/docs/docs-component-status--docs' },
      { label: 'PrimeNG forms', path: '/docs/primeng-forms--docs' },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Choose a token',
    detail:
      'Token finder searches every --pds-* custom property by name and value; the Foundations catalogues are read live from the compiled stylesheet.',
    links: [
      { label: 'Token finder', path: '/docs/foundations-token-finder--docs' },
      {
        label: 'Colors',
        path: '/docs/foundations-colors-semantic-common--docs',
      },
      { label: 'Spacing', path: '/docs/foundations-spacing--docs' },
    ],
  },
  {
    who: 'Dev',
    tone: 'neutral',
    title: 'Get help',
    detail:
      'Missing a variant or a token? Propose it to the core design-system team before building — Contribute explains the three possible answers and where each lands.',
    links: [{ label: 'Contribute', path: '/docs/get-started-contribute--docs' }],
  },
]);
