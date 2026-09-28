// Figures for Start here/Build with Plectrum (get-started-consume.mdx). Hidden from the sidebar.
// Steps, commands and the CI profile come from .ai/contracts/process.json — the same
// contract the installed toolkit renders into its help and agent guidance.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { calloutStory, stepsStory } from './docs-figure-stories';
import { DocsReleaseComponent } from '../storybook/docs-release.component';
import { consumerCiRequirements, docsStep, journeySteps } from '../storybook/process-docs';

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

/** Install commands matching the release record (registry) or its absence (tarballs). */
export const Install: StoryObj = { tags: ['!dev'], ...releaseStory('install') };

export const InstallFlow: StoryObj = {
  tags: ['!dev'],
  ...stepsStory(
    journeySteps('onboarding', {
      install: [{ label: 'Install the packages', href: '#install-the-packages' }],
      initialize: [{ label: 'Initialize the team toolkit', href: '#initialize-the-team-toolkit' }],
      build: [
        { label: 'Wire the stylesheet', href: '#wire-the-stylesheet' },
        { label: 'First component', href: '#first-component' },
      ],
      validate: [{ label: 'Validate', href: '#validate' }],
      adopt: [{ label: 'Report adoption', href: '#report-adoption' }],
      upgrade: [{ label: 'Upgrade', href: '#upgrade' }],
    }),
  ),
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
    title: 'Propose the gap',
    detail:
      'If still nothing covers the need, open a proposal. Do not start a new component before the recorded decision.',
    links: [
      { label: 'Contribute', path: '/docs/get-started-contribute--docs' },
    ],
  },
]);
