// Figures for the Introduction landing page (introduction.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import type { DocsStep } from '../storybook/docs-figures.types';
import { DocsAudienceComponent } from '../storybook/docs-audience.component';
import { heroStory } from './docs-figure-stories';
import { PACKAGE_NAMES } from '../storybook/process-docs';

const meta: Meta = {
  title: 'Introduction/Figures',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const Hero: StoryObj = heroStory({
  title: 'Plectrum Design System',
  lead: 'Shared components, tokens and layout for every Solidaris application.',
  actions: [
    {
      label: 'Design with Plectrum',
      path: '/docs/start-here-design-with-plectrum--docs',
      variant: 'primary',
    },
    {
      label: 'Build with Plectrum',
      path: '/docs/get-started-use-plectrum-in-an-app--docs',
      variant: 'primary',
    },
    {
      label: 'Find a component',
      path: '/docs/start-here-catalogue--docs',
      variant: 'secondary',
    },
  ],
});

const DESIGN_STEPS: readonly DocsStep[] = [
  {
    who: 'Design',
    tone: 'design',
    title: 'Open the libraries',
    detail:
      'Enable the four Plectrum libraries in Figma: the PrimeNG kit, Foundations, Custom components, and Icons and illustrations.',
    links: [
      {
        label: 'Design with Plectrum',
        path: '/docs/start-here-design-with-plectrum--docs',
      },
    ],
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Pick an approved component',
    detail:
      'Search Find a component and use what already does the job, with its variants, error state and narrow layout.',
    links: [
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
    ],
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Hand off the decision',
    detail:
      'Share the Figma frame with the Storybook page. If nothing fits, open a proposal — never draw a new component on the main kit.',
  },
];

const DEV_STEPS: readonly DocsStep[] = [
  {
    who: 'Dev',
    tone: 'app',
    title: 'Create the application',
    detail: `Copy the Plectrum starter, or open an existing Angular project. With access to the private packages, \`npm install\` adds \`${PACKAGE_NAMES.ui}\`, \`${PACKAGE_NAMES.plectrum}\`, \`${PACKAGE_NAMES.styles}\` and \`${PACKAGE_NAMES.toolkit}\`.`,
    links: [
      {
        label: 'Build with Plectrum',
        path: '/docs/get-started-use-plectrum-in-an-app--docs',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Check the generated setup',
    detail: 'Installation runs `plectrum bootstrap`. Review the team identity and source paths in `.plectrum/config.json`.',
    links: [
      {
        label: 'Initialize the team toolkit',
        path: '/docs/get-started-use-plectrum-in-an-app--docs#initialize-the-team-toolkit',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Render the first field',
    detail: 'Styles, fonts, icons and `providePlectrum()` are already wired. Render Form Field to see the theme at work.',
    links: [
      {
        label: 'Styles and ITCSS',
        path: '/docs/get-started-use-plectrum-in-an-app--docs#wire-the-stylesheet',
      },
      {
        label: 'Form Field',
        path: '/docs/get-started-use-plectrum-in-an-app--docs#first-component',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Prepare Storybook, tests and CI',
    detail: 'Run Storybook, the tests and the Plectrum checks locally, then add them to your CI.',
    links: [
      {
        label: 'Storybook and tests',
        path: '/docs/get-started-use-plectrum-in-an-app--docs#set-up-storybook-and-tests',
      },
      {
        label: 'Checks and CI',
        path: '/docs/get-started-use-plectrum-in-an-app--docs#validate',
      },
      {
        label: 'Workspace readiness',
        path: '/docs/get-started-use-plectrum-in-an-app--docs#workspace-readiness',
      },
    ],
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Find the next piece',
    detail:
      'Search by task — error, side panel, no results. Use Find a token for colour, type and spacing.',
    links: [
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
      { label: 'Find a token', path: '/docs/foundations-token-finder--docs' },
    ],
  },
];

export const Audience: StoryObj = {
  parameters: { chromatic: { disableSnapshot: true }, layout: 'padded' },
  render: () => ({
    moduleMetadata: { imports: [DocsAudienceComponent] },
    props: { designSteps: DESIGN_STEPS, devSteps: DEV_STEPS },
    template:
      '<pds-docs-audience [designSteps]="designSteps" [devSteps]="devSteps" />',
  }),
};
