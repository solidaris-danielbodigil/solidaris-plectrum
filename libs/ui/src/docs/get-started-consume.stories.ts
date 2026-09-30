// Figures for Start here/Build with Plectrum (get-started-consume.mdx). Hidden from the sidebar.
// Process commands and the CI profile come from .ai/contracts/process.json — the same
// contract the installed toolkit renders into its help and agent guidance.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { calloutStory, stepsStory } from './docs-figure-stories';
import { DocsReleaseComponent } from '../storybook/docs-release.component';
import { consumerCiRequirements, docsStep } from '../storybook/process-docs';

const meta: Meta = {
  title: 'Start here/Figures/Build with Plectrum',
  tags: ['!dev'],
  parameters: { layout: 'padded', chromatic: { disableSnapshot: true } },
};

export default meta;

function releaseStory(mode: 'summary' | 'install'): StoryObj {
  return {
    render: () => ({
      moduleMetadata: { imports: [DocsReleaseComponent] },
      props: { mode },
      template: `<pds-docs-release [mode]="mode" />`,
    }),
  };
}

/** Which docs these are: a recorded release, or the development preview of main. */
export const Release: StoryObj = { tags: ['!dev'], ...releaseStory('summary') };

/** Registry commands for a recorded release; otherwise link to the published installation guide. */
export const Install: StoryObj = { tags: ['!dev'], ...releaseStory('install') };

export const InstallFlow: StoryObj = {
  tags: ['!dev'],
  ...stepsStory([
    {
      title: 'Prepare the application and package access',
      who: 'App team + Core',
      tone: 'app',
      detail: 'Start from the application starter or an existing Angular project. Confirm private package access and set the local identity.',
      links: [{ label: 'Prerequisites', href: '#prerequisites' }],
    },
    {
      title: 'Install the runtime packages and devkit',
      who: 'App team',
      tone: 'app',
      detail: 'Install the matching released packages and peers, including PrimeNG. The starter postinstall runs the devkit bootstrap.',
      links: [{ label: 'Install the packages', href: '#install-the-packages' }],
    },
    {
      title: 'Inspect toolkit and editor instructions',
      who: 'App team',
      tone: 'app',
      detail: 'Verify generated configuration, .ai guidance, editor adapters, hook and checks workflow.',
      links: [{ label: 'Initialize the team toolkit', href: '#initialize-the-team-toolkit' }],
    },
    {
      title: 'Configure SCSS, ITCSS and assets',
      who: 'App team',
      tone: 'app',
      detail: 'Verify the generated empty ITCSS layers, ordered shared/local SCSS and font/icon assets.',
      links: [{ label: 'Wire the stylesheet', href: '#wire-the-stylesheet' }],
    },
    {
      title: 'Register the Plectrum theme',
      who: 'App team',
      tone: 'app',
      detail: 'Add the Plectrum providers to the application and verify that a PrimeNG control renders with the theme.',
      links: [{ label: 'Boot the theme', href: '#boot-the-theme' }],
    },
    {
      title: 'Render the first component',
      who: 'App team',
      tone: 'app',
      detail: 'Build the Form Field example to check package imports, theme and shared styles together.',
      links: [{ label: 'First component', href: '#first-component' }],
    },
    {
      title: 'Set up local Storybook and executable tests',
      who: 'App team',
      tone: 'app',
      detail: 'Run local Storybook, its static build and Angular unit tests; complete interaction and accessibility evidence.',
      links: [{ label: 'Set up Storybook and tests', href: '#set-up-storybook-and-tests' }],
    },
    {
      title: 'Connect Plectrum checks to application CI',
      who: 'App team + CI owners',
      tone: 'app',
      detail: 'Run static checks, build and tests, then map generated jobs to the Solidaris pipeline.',
      links: [{ label: 'Validate', href: '#validate' }],
    },
    {
      title: 'Verify that the team workspace is ready',
      who: 'App team',
      tone: 'app',
      detail: 'Review the acceptance checklist and have a second developer reproduce the setup from the committed configuration.',
      links: [{ label: 'Workspace readiness', href: '#workspace-readiness' }],
    },
  ]),
};

export const Initialize: StoryObj = { tags: ['!dev'], ...stepsStory([docsStep('initialize')]) };

export const Validate: StoryObj = { tags: ['!dev'], ...stepsStory([docsStep('validate')]) };

export const CiProfile: StoryObj = {
  tags: ['!dev'],
  ...calloutStory({
    tone: 'info',
    title: 'The consumer CI profile',
    items: consumerCiRequirements(),
  }),
};

export const Adopt: StoryObj = { tags: ['!dev'], ...stepsStory([docsStep('adopt')]) };

export const Upgrade: StoryObj = { tags: ['!dev'], ...stepsStory([docsStep('upgrade')]) };

/** Check, then ask, then maybe build — the default before inventing. */
export const BeforeYouInvent: StoryObj = stepsStory([
  {
    who: 'App team',
    tone: 'app',
    title: 'Use Plectrum-themed PrimeNG',
    detail:
      'Start in the theme gallery. Most screens are a PrimeNG control with the Plectrum theme, plus layout classes.',
    links: [{ label: 'Theme gallery', path: '/docs/primeng-actions--docs' }],
  },
  {
    who: 'App team',
    tone: 'app',
    title: 'Use a Core pds-* component',
    detail:
      'If PrimeNG is not enough, import a Core component. Find a component lists each one and which teams already use it.',
    links: [
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
    ],
  },
  {
    who: 'App team',
    tone: 'design',
    title: 'Build locally, propose sharing when useful',
    detail:
      'If nothing covers the need, the application team may create a local component. Core reviews only central intake and promotion.',
    links: [
      { label: 'Contribute', path: '/docs/get-started-contribute--docs' },
    ],
  },
]);
