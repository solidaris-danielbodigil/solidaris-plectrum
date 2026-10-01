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
      'Enable the Plectrum libraries in Figma: the PrimeNG kit, Foundations, Custom components, and Icons and illustrations.',
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
      'Start from Find a component. Use the component that already does the job, including its documented variants, error state and narrow layout.',
    links: [
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
    ],
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Hand off the decision',
    detail:
      'Link the Figma frame and the Storybook page. If nothing covers the need, open a proposal. Do not draw a new component on the main kit.',
  },
];

const DEV_STEPS: readonly DocsStep[] = [
  {
    who: 'Dev',
    tone: 'app',
    title: 'Prepare the application and install a release',
    detail: `Start from the Plectrum application starter or an existing Angular project. Confirm private package access, set the local identity and install \`${PACKAGE_NAMES.ui}\`, \`${PACKAGE_NAMES.plectrum}\`, \`${PACKAGE_NAMES.styles}\` and \`${PACKAGE_NAMES.toolkit}\` with compatible PrimeNG peers.`,
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
    title: 'Inspect the generated toolkit',
    detail: 'The starter postinstall runs `plectrum bootstrap`. Verify identity, source paths, .ai and editor instructions, hook and checks workflow. The source implementation targets the next devkit release.',
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
    title: 'Verify styles and render the first field',
    detail: 'Inspect the generated SCSS composition, empty local ITCSS layers, fonts and icons. The starter registers `providePlectrum()`. Render Form Field to verify the theme and shared styles together.',
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
    detail: 'Run local Storybook, unit tests, the static build and Plectrum checks. Map the generated jobs and hook to the application’s Solidaris CI policy before closing onboarding.',
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
      'Search by task — error, side panel, no results — then open that page. Find a token is for colour, type and spacing.',
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
