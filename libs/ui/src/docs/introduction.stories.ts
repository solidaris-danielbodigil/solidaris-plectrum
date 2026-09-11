// Figures for the Introduction landing page (introduction.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { heroStory, stepsStory } from './docs-figure-stories';

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

/** Install → render one component. Further catalogues sit behind the hero actions. */
export const FirstHour: StoryObj = stepsStory([
  {
    who: 'Dev',
    tone: 'app',
    title: 'Use Plectrum in an app',
    detail:
      'Install the packages, wire the stylesheet, boot the theme with providePlectrum(). A sample application is used to verify package installation.',
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
      'pds-form-field from @solidaris/ui around a PrimeNG pInputText — the full example, with import paths, is on the same page.',
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
    title: 'Find the next piece',
    detail:
      'Component status lists every pds-* component. Token finder searches every --pds-* custom property. PrimeNG components stay in the theme gallery.',
    links: [
      { label: 'Component status', path: '/docs/docs-component-status--docs' },
      { label: 'Token finder', path: '/docs/foundations-token-finder--docs' },
    ],
  },
]);
