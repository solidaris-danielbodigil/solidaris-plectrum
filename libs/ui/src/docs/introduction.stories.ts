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
    detail: `Start from a working Angular application, confirm private package access and register the application with Core. Follow a published release's guide to install \`${PACKAGE_NAMES.ui}\`, \`${PACKAGE_NAMES.plectrum}\`, \`${PACKAGE_NAMES.styles}\` and \`${PACKAGE_NAMES.toolkit}\`, with compatible PrimeNG peers.`,
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
    title: 'Initialize the team toolkit',
    detail: 'Run `plectrum init` in the application repository. Verify the application identity, source paths, editor instructions and generated checks workflow. This does not create a complete application workspace.',
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
    title: 'Wire the styles and render the first field',
    detail: 'Configure SCSS, the local ITCSS layers, fonts and icons, then register `providePlectrum()`. Render the Form Field example to verify the theme and shared styles together. This configuration is currently manual.',
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
    detail: 'Set up local Storybook, executable tests and a pre-commit hook. Connect Plectrum checks, the application build and tests to the Solidaris pipeline. The current devkit does not install this complete toolchain; verify the readiness checklist before closing onboarding.',
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
