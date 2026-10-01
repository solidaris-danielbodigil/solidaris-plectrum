// Figures for Start here/Contribute (get-started-contribute.mdx). Hidden from the sidebar.
// Decisions, routes, steps, owners and commands come from .ai/contracts/process.json
// and registry.json; only the guardrail callouts and roles are written here.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';
import { journeySteps, outcomeCards, routeSteps, teamCards } from '../storybook/process-docs';

const meta: Meta = {
  title: 'Start here/Figures/Contribute',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const ProposeEarly: StoryObj = calloutStory({
  tone: 'warning',
  title: 'Search first, then build locally',
  items: [
    'Ask the Plectrum agent, or look at themed PrimeNG and Core components yourself. If nothing fits, build the component in your application.',
    'Show new UX early to the core team or an available designer, while you build. It is advice, not an approval step.',
    'Ask Core for a decision only when you want to share it with other teams.',
    'Your team owns what it builds. Another team that needs it opens a proposal instead of importing yours.',
  ],
});

export const Journey: StoryObj = {
  tags: ['!dev'],
  ...stepsStory(
    journeySteps('contribution', {
      discover: [
        { label: 'PrimeNG components', path: '/docs/primeng-ui-kit--docs' },
        { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
      ],
      approve: [{ label: 'Proposal decisions', href: '#proposal-decisions' }],
      implement: [{ label: 'Develop a candidate', href: '#develop-and-submit-a-candidate' }],
      integrate: [{ label: 'Promote existing work', href: '#promote-existing-work' }],
      'design-return': [{ label: 'Figma sync', path: '/docs/docs-token-pipeline-figma-sync--docs' }],
      release: [{ label: 'Releases and versioning', path: '/docs/docs-releases-and-versioning--docs' }],
    }),
  ),
};

export const Outcomes: StoryObj = { tags: ['!dev'], ...cardsStory(outcomeCards(), 2) };

export const DesignOrigin: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('design-origin')) };

export const Teams: StoryObj = { tags: ['!dev'], ...cardsStory(teamCards(), 2) };

export const PlectrumAgent: StoryObj = calloutStory({
  tone: 'info',
  title: 'Invoke /plectrum',
  text: 'In an application, the Plectrum agent is the team’s first reviewer: it suggests what to reuse, answers layout and UX questions, and helps with tokens, implementation and QA. Every command it runs also works by hand.',
  linkLabel: 'How to use the Plectrum agent',
  linkPath: '/docs/docs-ai-strategy--docs#your-plectrum-agent',
});

export const AlreadyBuilt: StoryObj = calloutStory({
  tone: 'info',
  title: 'Already built it without asking?',
  items: [
    'Open a proposal and attach what you have: a screen, a local component or a Figma frame.',
    'The core team records one of the decisions above. Nothing becomes Core automatically.',
  ],
});

export const Roles: StoryObj = cardsStory(
  [
    {
      eyebrow: 'Core design-system team',
      tone: 'design',
      title: 'Owns the system',
      items: [
        'libs/ui, libs/styles, tokens.json and the Plectrum package contract',
        'Records a decision on every proposal',
        'Reviews teams’ local components and picks the ones worth sharing',
        'Reviews pull requests under libs/ and promotes candidates',
      ],
    },
    {
      eyebrow: 'Application team',
      tone: 'app',
      title: 'Owns its screens',
      items: [
        'Uses themed PrimeNG and Core components first',
        'Builds and owns its local components, and estimates their reuse potential',
        'Proposes missing primitive or semantic tokens instead of adding them',
      ],
    },
    {
      eyebrow: 'Designer',
      tone: 'design',
      title: 'Designs against the source',
      items: [
        'Draws candidates in PLECTRUM · Custom components, before any code exists',
        'Proposes tokens on a branch of Plectrum DS · PrimeNG v21',
        'Reviews stories against the Figma design before release',
      ],
    },
    {
      eyebrow: 'Consumer',
      tone: 'system',
      title: 'Uses what is packaged',
      items: [
        'Installs released Plectrum packages, never source paths',
        'Imports Core components, never another team’s components',
      ],
    },
  ],
  2,
);

export const AppLayer: StoryObj = calloutStory({
  tone: 'warning',
  title: 'Local components follow the same rules',
  items: [
    'Build from PrimeNG and Plectrum components, and style with --pds-* tokens. The checks reject unknown tokens and hardcoded colours or pixel values.',
    'Name blocks after your feature (c-affiliate-*), never after a Core block.',
    'Put layout classes in the template.',
    'The metadata names your team as owner.',
  ],
});

/** How a local component becomes visible and, when worth it, shared — no extra step for the team. */
export const SharingLoop: StoryObj = stepsStory([
  {
    who: 'Application team',
    tone: 'app',
    title: 'Build locally',
    detail: 'npm run pds:component lists similar components other teams already built. Fill the Reuse potential line of the evidence checklist.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'Report usage',
    detail: 'After each push to main, the usage report sends your local components and their reuse estimate to Core.',
  },
  {
    who: 'Core team',
    tone: 'system',
    title: 'Spot what to share',
    detail: 'Core reviews the Local scope of Find a component: duplicates across teams and components marked Reuse likely.',
  },
  {
    who: 'Core team',
    tone: 'system',
    title: 'Contact the team',
    detail: 'Core proposes sharing the component, then integrates and generalizes it. The team keeps its copy until the release.',
  },
]);
