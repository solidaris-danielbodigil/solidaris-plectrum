// Figures for Get started/Contribute (get-started-contribute.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Get started/Figures/Contribute',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const DevLoop: StoryObj = stepsStory([
  {
    who: 'Anyone',
    tone: 'neutral',
    title: 'Propose',
    detail:
      'Before any code: the screen or need, the Figma node or mock, and whether it is specific to your application. Send it to the core design-system team.',
  },
  {
    who: 'Core team',
    tone: 'design',
    title: 'Decide',
    detail:
      'Three possible answers, none of them a waiting list: it already exists (use it), it is system-level (the core team takes it, pairing with you if needed), or it is app-specific (you build it in your application layer as a candidate).',
  },
  {
    who: 'Dev',
    tone: 'system',
    title: 'Set up',
    detail: 'git clone, npm install, npm run storybook — the catalogue runs at localhost:6006 with live reload. Nothing on your machine reaches anyone until it is on a branch.',
  },
  {
    who: 'Dev',
    tone: 'system',
    title: 'Scaffold',
    detail:
      'npm run pds:component -- --owner=<team> creates the component, stories, metadata contract with its governance block, the 06-components partial with its @forward, and regenerates the index. An application owner scaffolds a candidate, the core team scaffolds core.',
  },
  {
    who: 'Dev',
    tone: 'design',
    title: 'Check the sources first',
    detail: 'PrimeNG MCP: does a component exist? Figma MCP: exact specs from the UI Kit. Custom code only when neither covers the need.',
  },
  {
    who: 'Dev',
    tone: 'system',
    title: 'Implement in Storybook',
    detail: 'Tokens in 01-settings, BEMIT SCSS in 06-components, layout classes in the template, one story per state. Validate here before any app uses it.',
  },
  {
    who: 'Core team',
    tone: 'design',
    title: 'Review',
    detail:
      'One developer review plus the design-system review for anything under libs/ (rule 07 §3). Medium and high-risk token changes need design and technical review. Code-owned tokens are proposed to Figma and accepted before the merge, not after.',
  },
  {
    who: 'CI',
    tone: 'neutral',
    title: 'Ship through the gates',
    detail: 'Token audits, generated-file diffs, contracts-index freshness, build, tests. Changesets version and publish the packages; applications receive bump pull requests.',
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
        'Proposes first — a Storybook page is never the first move',
        'Builds app-specific components in its own layer, as candidates',
        'Never adds primitives or semantic tokens; a missing token is a proposal',
      ],
    },
    {
      eyebrow: 'Designer',
      tone: 'design',
      title: 'Designs against the source',
      items: [
        'Core designers edit the UI Kit main file and run the plugin sync',
        'Application designers work in proposals/{app} and never touch Primitive or Semantic collections',
        'Both review stories against the UI Kit; proposals reach the core designers, not the main file',
      ],
    },
    {
      eyebrow: 'Consumer',
      tone: 'system',
      title: 'Uses what is published',
      items: [
        'Installs the versioned @solidaris/* packages',
        'Imports Core components; asks before importing a Candidate',
        'Never imports an App-specific component from another team',
      ],
    },
  ],
  2,
);

export const AppLayer: StoryObj = calloutStory({
  tone: 'warning',
  title: 'While a component is app-owned, drift stays contained by tooling — not by trust',
  items: [
    'Compose from PrimeNG and @solidaris/ui; consume --pds-* tokens only. tokens:lint fails on hex, px and unknown --pds-* names.',
    'Feature tokens are component tokens in 01-settings/_settings.{feature}.scss that alias semantic roles. tokens:propose registers them in the proposals/{app} Figma collection.',
    'Domain BEM blocks (c-affiliate-*) never reuse a core block name; feature children on a shared block prefix the element (rule 09 §9). Layout is o-flex / o-layout in the template.',
    'The Storybook page lives under Patterns/{App}; metadata governance says owner: <app> and status: candidate or app.',
  ],
});
