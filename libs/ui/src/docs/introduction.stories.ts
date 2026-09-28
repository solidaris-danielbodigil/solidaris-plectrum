// Figures for the Introduction landing page (introduction.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import type { DocsStep } from '../storybook/docs-figures.types';
import { DocsAudienceComponent } from '../storybook/docs-audience.component';
import { heroStory } from './docs-figure-stories';
import { DocsReleaseComponent } from '../storybook/docs-release.component';
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
      variant: 'secondary',
    },
    {
      label: 'Find a component',
      path: '/docs/start-here-catalogue--docs',
      variant: 'secondary',
    },
  ],
});

/** Which docs these are, from the recorded release beside a versioned build. */
export const Release: StoryObj = {
  parameters: { chromatic: { disableSnapshot: true }, layout: 'padded' },
  render: () => ({
    moduleMetadata: { imports: [DocsReleaseComponent] },
    template: '<pds-docs-release mode="summary" />',
  }),
};

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
    title: 'Install the packages',
    detail:
      `Install \`${PACKAGE_NAMES.ui}\`, \`${PACKAGE_NAMES.plectrum}\` and \`${PACKAGE_NAMES.styles}\`, plus the PrimeNG peers, in the version these docs describe. Then add the stylesheet and call \`providePlectrum()\`. Install \`${PACKAGE_NAMES.toolkit}\` and run \`plectrum init\` in the application repository to set up the team toolkit.`,
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
    title: 'Render the first field',
    detail:
      `Copy the Form Field example. It imports from \`${PACKAGE_NAMES.ui}\` and includes the PrimeNG input directive.`,
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
      'Search by task — error, side panel, no results — then open that page. Find a Token is for colour, type and spacing.',
    links: [
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
      { label: 'Find a Token', path: '/docs/foundations-token-finder--docs' },
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
