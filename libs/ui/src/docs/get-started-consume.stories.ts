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
      title: 'Prepare the application',
      who: 'App team',
      tone: 'app',
      detail: 'Copy the starter or open an existing Angular project, and set your team identity.',
      links: [{ label: 'Prerequisites', href: '#prerequisites' }],
    },
    {
      title: 'Install the packages',
      who: 'App team',
      tone: 'app',
      detail: 'Run npm install. It sets up the application for Plectrum.',
      links: [{ label: 'Install the packages', href: '#install-the-packages' }],
    },
    {
      title: 'Check the generated setup',
      who: 'App team',
      tone: 'app',
      detail: 'Review the team identity and source paths in .plectrum/config.json.',
      links: [{ label: 'Initialize the team toolkit', href: '#initialize-the-team-toolkit' }],
    },
    {
      title: 'Find your style layers',
      who: 'App team',
      tone: 'app',
      detail: 'Your styles go in the local ITCSS layers under src/styles/.',
      links: [{ label: 'Wire the stylesheet', href: '#wire-the-stylesheet' }],
    },
    {
      title: 'Check the theme',
      who: 'App team',
      tone: 'app',
      detail: 'A PrimeNG control should render with the Plectrum theme.',
      links: [{ label: 'Boot the theme', href: '#boot-the-theme' }],
    },
    {
      title: 'Render the first component',
      who: 'App team',
      tone: 'app',
      detail: 'Add the Form Field example to a screen.',
      links: [{ label: 'First component', href: '#first-component' }],
    },
    {
      title: 'Run Storybook and the tests',
      who: 'App team',
      tone: 'app',
      detail: 'Start your local Storybook and run the unit and story tests.',
      links: [{ label: 'Set up Storybook and tests', href: '#set-up-storybook-and-tests' }],
    },
    {
      title: 'Add the checks to CI',
      who: 'App team + CI owners',
      tone: 'app',
      detail: 'Run the checks before merging and decide with your CI owners which ones block.',
      links: [{ label: 'Validate', href: '#validate' }],
    },
    {
      title: 'Confirm the setup is ready',
      who: 'App team',
      tone: 'app',
      detail: 'A second developer reproduces it from a clean clone.',
      links: [{ label: 'Workspace readiness', href: '#workspace-readiness' }],
    },
  ]),
};

export const CiProfile: StoryObj = {
  tags: ['!dev'],
  ...calloutStory({
    tone: 'info',
    title: 'What CI runs',
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
      'Most screens are PrimeNG controls with the Plectrum theme and layout classes.',
    links: [{ label: 'PrimeNG components', path: '/docs/primeng-ui-kit--docs' }],
  },
  {
    who: 'App team',
    tone: 'app',
    title: 'Use a Core pds-* component',
    detail:
      'If PrimeNG is not enough, import a Core component. Find a component lists them all.',
    links: [
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
    ],
  },
  {
    who: 'App team',
    tone: 'design',
    title: 'Build it locally',
    detail:
      'If nothing fits, build the component in your application. Propose it to Core when other teams could use it.',
    links: [
      { label: 'Contribute', path: '/docs/get-started-contribute--docs' },
    ],
  },
]);

/** Shown on Build with Plectrum and Contribute: the agent is the team's first reviewer. */
export const AskPlectrum: StoryObj = calloutStory({
  tone: 'info',
  title: 'Ask /plectrum before you build',
  items: [
    'Your team owns its components, so the Plectrum agent is your first reviewer. In Cursor or VS Code, select Plectrum and describe what the screen must do.',
    'It checks PrimeNG and the Plectrum catalogue and tells you when something already does the job. Example: “I need a side panel with member details” → Drawer with Detail List, no new component.',
    'It also helps with layout and UX: spacing, states, responsive behaviour, accessibility. It tells you when a designer should decide.',
    'For new UX (a component, pattern or page), show it early to the core team or an available designer, while you build. The agent does not replace them.',
  ],
});
