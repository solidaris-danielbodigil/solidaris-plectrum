// Figures for Get started/Contribute (get-started-contribute.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';

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

export const PlectrumAgent: StoryObj = calloutStory({
  tone: 'info',
  title: 'Invoke /plectrum',
  text: 'By default the agents do this work. It runs research, tokens, implementation and QA end to end. After promotion they can also write the Figma variables and component from the repo. Every command stays runnable by hand, and a designer may still draw the Figma component instead of the agent. The Plectrum tokens plugin is the fallback when no agent is available. The agent does not skip the proposal either: it asks for the owner and files an open question when the decision is missing.',
  linkLabel: 'AI strategy → Subagents',
  linkPath: '/docs/docs-ai-strategy--docs#subagents',
});

export const AlreadyBuilt: StoryObj = calloutStory({
  tone: 'info',
  title: 'Already built it without asking?',
  items: [
    'Open the same proposal and attach what you already have — a screen, a local component, or a Figma frame.',
    'The core team still decides: switch to what already exists, keep it as yours, or promote it later.',
    'It does not become Core automatically, and it does not land on the core team’s backlog.',
  ],
});

export const DevLoop: StoryObj = stepsStory([
  {
    who: 'Anyone',
    tone: 'design',
    title: 'Check the catalogue',
    detail:
      'Look in the theme gallery first (PrimeNG with the Plectrum theme), then at Core components on Find a component. If something already does the job, use it. If the docs were just hard to find, add an example on that page instead of inventing a new component.',
    links: [
      { label: 'Theme gallery', path: '/docs/primeng-actions--docs' },
      { label: 'Find a component', path: '/docs/start-here-catalogue--docs' },
    ],
  },
  {
    who: 'Anyone',
    tone: 'neutral',
    title: 'Propose',
    detail:
      'If nothing in the catalogue covers the need, open a GitHub proposal. Write what the screen must do, which PrimeNG or Core components you already tried, and attach a Figma link or mock. Do not start building until the core team answers.',
  },
  {
    who: 'Core team',
    tone: 'design',
    title: 'Decide',
    detail:
      'The core team answers in one of three ways: it already exists (use that), it belongs in the design system (they build it, with you if needed), or it is only for your app (you build it and you own it).',
  },
  {
    who: 'Dev',
    tone: 'system',
    title: 'Set up',
    detail:
      'Clone the repo, run npm install and npm run storybook. The catalogue is at localhost:6006. Local work stays on your machine until you open a pull request.',
  },
  {
    who: 'Dev',
    tone: 'system',
    title: 'Scaffold',
    detail:
      'Only after the decision. Run npm run pds:component -- --owner=<team>. That creates the files, stories and metadata. Use --owner=design-system for Core, or your app name (ishare, icrm) for a Candidate your team will own.',
  },
  {
    who: 'Dev',
    tone: 'system',
    title: 'Implement in Storybook',
    detail:
      'Build it here first: tokens, then styles, layout classes in the template, one story per state. An application should not use it until it looks right in Storybook.',
  },
  {
    who: 'Core team',
    tone: 'design',
    title: 'Review',
    detail:
      'Every pull request needs a developer review. Changes under libs/ also need a design-system review. New tokens go to Figma and get accepted before merge, not after.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'Ship through the gates',
    detail:
      'CI checks tokens, generated files, tests and Storybook. A changeset records the version bump. After release, applications get an upgrade pull request.',
  },
]);

export const Roles: StoryObj = cardsStory(
  [
    {
      eyebrow: 'Core design-system team',
      tone: 'design',
      title: 'Owns the system',
      items: [
        'libs/ui, libs/styles, tokens.json and the Plectrum UI Kit',
        'Triages every proposal and gives one of the three answers',
        'Reviews pull requests under libs/ and promotes candidates',
      ],
    },
    {
      eyebrow: 'Application team',
      tone: 'app',
      title: 'Owns its screens',
      items: [
        'Use themed PrimeNG and Core first; propose a gap — do not hand the core team a finished candidate',
        'Builds app-specific work in its own layer, as a Candidate it owns',
        'Never adds primitives or semantic tokens; a missing token is a proposal',
      ],
    },
    {
      eyebrow: 'Designer',
      tone: 'design',
      title: 'Designs against the source',
      items: [
        'Core designers edit the UI Kit main file and run the plugin sync; they may also draw a core component from the repo by hand',
        'Application designers work in proposals/{app} and never touch Primitive or Semantic collections',
        'Both review stories against the UI Kit; proposals reach the core designers, not the main file',
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
    'Build it from PrimeNG and @solidaris-danielbodigil/ui, and use --pds-* tokens. CI fails hex, px and unknown token names.',
    'Name your blocks after your feature (c-affiliate-*). Never reuse a Core block name.',
    'Put the layout classes in the template.',
    'The Storybook page lives under Patterns/{App}, and the metadata says your team owns it.',
  ],
});
