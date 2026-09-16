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
      'Look in the theme gallery first (PrimeNG with the Plectrum theme), then at Core components on Component status. If something already does the job, use it. If the docs were just hard to find, add an example on that page instead of inventing a new component.',
    links: [
      { label: 'Theme gallery', path: '/docs/primeng-actions--docs' },
      { label: 'Component status', path: '/docs/docs-component-status--docs' },
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
        'Installs the versioned @solidaris/* packages — never source paths',
        'Imports Core components; asks before importing a Candidate',
        'Never imports an App-specific component from another team',
      ],
    },
  ],
  2,
);

export const AppLayer: StoryObj = calloutStory({
  tone: 'warning',
  title:
    'While a component is app-owned, drift stays contained by tooling — not by trust',
  items: [
    'Compose from PrimeNG and @solidaris/ui; consume --pds-* tokens only. tokens:lint fails on hex, px and unknown --pds-* names.',
    'Feature tokens are component tokens in 01-settings/_settings.{feature}.scss that alias semantic roles. tokens:propose lists them; apply selected names on proposals/{app} via agent + Figma MCP when a session is running, or the Plectrum tokens plugin otherwise (see Token pipeline → Figma sync).',
    'Domain BEM blocks (c-affiliate-*) never reuse a core block name; feature children on a shared block prefix the element (rule 09 §9). Layout is o-flex / o-layout in the template.',
    'The Storybook page lives under Patterns/{App}; metadata governance says owner: <app> and status: candidate or app.',
  ],
});
