// Figures for Start here/Contribute (get-started-contribute.mdx). Hidden from the sidebar.
// Decisions, routes, steps, owners and commands come from .ai/contracts/process.json
// and registry.json; only the guardrail callouts and roles are written here.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';
import { journeySteps, outcomeCards, routeSteps, teamCards } from '../storybook/process-docs';

const meta: Meta = {
  title: 'Get started/Figures/Contribute',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const ProposeEarly: StoryObj = calloutStory({
  tone: 'warning',
  title: 'Propose before code — a Candidate is not a core-team ticket',
  items: [
    'Look at themed PrimeNG, then Core components. If neither fits, open a proposal. Do not start a new component on a guess.',
    'Talking first is cheaper than two teams building the same thing, and cheaper than the core team inheriting work they never agreed to.',
    'If you build a Candidate, your team owns it. Another app that needs it opens a new proposal — they do not import yours.',
  ],
});

export const Journey: StoryObj = {
  tags: ['!dev'],
  ...stepsStory(
    journeySteps('contribution', {
      discover: [
        { label: 'Theme gallery', path: '/docs/primeng-actions--docs' },
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

export const LocalCandidate: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('local-candidate')) };

export const PlectrumChange: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('plectrum-change')) };

export const DesignOrigin: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('design-origin')) };

export const Promotion: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('promotion')) };

export const Teams: StoryObj = { tags: ['!dev'], ...cardsStory(teamCards(), 2) };

export const PlectrumAgent: StoryObj = calloutStory({
  tone: 'info',
  title: 'Invoke /plectrum',
  text: 'Agents can help with research, tokens, implementation and QA. After promotion they can propose Figma variables in PrimeNG 21 and a component in Custom components on their respective branches. Designers can also start the component in Figma and bring its reviewed design to Core. Every command stays runnable by hand. The Plectrum tokens plugin is the fallback for token proposals when no agent is available. Neither route skips a recorded proposal and Core decision.',
  linkLabel: 'AI strategy → Subagents',
  linkPath: '/docs/docs-ai-strategy--docs#subagents',
});

export const AlreadyBuilt: StoryObj = calloutStory({
  tone: 'info',
  title: 'Already built it without asking?',
  items: [
    'Open the same proposal and attach what you already have — a screen, a local component, or a Figma frame.',
    'The core team still records one of the decisions above. Nothing becomes Core automatically.',
    'It does not land on the core team’s backlog by default.',
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
        'Reviews pull requests under libs/ and promotes candidates',
      ],
    },
    {
      eyebrow: 'Application team',
      tone: 'app',
      title: 'Owns its screens',
      items: [
        'Uses themed PrimeNG and Core first; proposes a gap',
        'Builds an approved candidate in its own repository and owns it',
        'Never adds primitives or semantic tokens; a missing token is a proposal',
      ],
    },
    {
      eyebrow: 'Designer',
      tone: 'design',
      title: 'Designs against the source',
      items: [
        'Candidate components live in PLECTRUM · Custom components; designers may start a proposal there before code exists',
        'All token variables live in Plectrum DS · PrimeNG v21; token proposals use a separate branch of that file',
        'Designers review stories and the Custom components design before Core implementation and publication',
      ],
    },
    {
      eyebrow: 'Consumer',
      tone: 'system',
      title: 'Uses what is packaged',
      items: [
        'Installs the versioned Plectrum runtime packages — never source paths',
        'Imports Core components; asks before importing a Candidate',
        'Never imports an App-specific component from another team',
      ],
    },
  ],
  2,
);

export const AppLayer: StoryObj = calloutStory({
  tone: 'warning',
  title: 'While your team owns it, the lint and token checks still apply',
  items: [
    'Build it from PrimeNG and the Plectrum UI package, and use --pds-* tokens. The CI profile fails hex, px and unknown token names.',
    'Name your blocks after your feature (c-affiliate-*). Never reuse a Core block name.',
    'Put the layout classes in the template.',
    'The metadata names your team as owner and the candidate status.',
  ],
});
