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
  title: 'Search first; local work can start without Core',
  items: [
    'Look at themed PrimeNG, then Core components. If neither fits, document the gap and build locally under your team’s ownership.',
    'Ask Core for a decision when you want to submit that work to the shared system. Design feedback may happen asynchronously.',
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

export const LocalCandidate: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('local-application')) };

export const PlectrumChange: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('plectrum-change')) };

export const DesignOrigin: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('design-origin')) };

export const Promotion: StoryObj = { tags: ['!dev'], ...stepsStory(routeSteps('promotion')) };

export const Teams: StoryObj = { tags: ['!dev'], ...cardsStory(teamCards(), 2) };

export const PlectrumAgent: StoryObj = calloutStory({
  tone: 'info',
  title: 'Invoke /plectrum',
  text: 'Agents can help with research, tokens, implementation and QA. Local application development needs no Core decision. Sharing through Core still requires a recorded proposal, review and release. Every command remains runnable by hand.',
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
        'Uses themed PrimeNG and Core first; records a gap',
        'Builds a local component in its own repository and owns it',
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
        'Imports Core components; proposes a gap before reusing another team’s Candidate',
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
    'Build it from PrimeNG and the Plectrum UI package, and use --pds-* tokens. The CI profile checks unknown tokens in configured sources and applies strict hex/px checks to SCSS, CSS and HTML; it is not a complete style or runtime test suite.',
    'Name your blocks after your feature (c-affiliate-*). Never reuse a Core block name.',
    'Put the layout classes in the template.',
    'The metadata names your team as owner and the candidate status.',
  ],
});
