// Figures for Docs/Token pipeline (token-pipeline.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Docs/Token pipeline/Figures/Overview',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const ChangeFlow: StoryObj = stepsStory([
  { who: 'Designer', tone: 'design', title: 'Edit the variable in the Plectrum UI Kit', detail: 'Primitive and Semantic collections are the source of truth. Component collections reference them.' },
  { who: 'Designer', tone: 'design', title: 'Run the plugin sync', detail: 'The PrimeUI theme generator commits to the staging branch design-tokens/sync. It has no access to main.' },
  { who: 'CI', tone: 'neutral', title: 'Audit and promotion pull request', detail: 'tokens-sync.yml compares Figma, the PrimeNG preset and the SCSS three ways, rebuilds generated files and opens a pull request. Drift fails the check.' },
  { who: 'Developer', tone: 'system', title: 'Review and merge', detail: 'tokens.json is updated. Generated SCSS and the Storybook manifest are rebuilt. Manual overrides stay in extend.ts.' },
  { who: 'CI', tone: 'neutral', title: 'Storybook reflects the change', detail: 'Foundations pages read the compiled CSS at runtime; no documentation edit is required.' },
  { who: 'CI', tone: 'neutral', title: 'Version and publish', detail: 'Changesets publish @solidaris/ui, @solidaris/styles and @solidaris/plectrum with a changelog entry.' },
  { who: 'Developer', tone: 'app', title: 'Upgrade the application', detail: 'Each application receives a bump pull request. The installed version is visible in package.json.' },
]);

export const Roles: StoryObj = cardsStory([
  {
    eyebrow: 'Designer', tone: 'design', title: 'Owns design decisions',
    items: [
      'Edits variables in the Plectrum UI Kit (PrimeNG v21 file)',
      'Runs the plugin sync; the target is the staging branch, never main',
      'Reviews and merges Figma branches named proposals/{app}',
      'Publishes the Figma library after a merge',
    ],
  },
  {
    eyebrow: 'Developer', tone: 'system', title: 'Consumes tokens',
    items: [
      'References tokens as var(--pds-*) with BEMIT classes only',
      'Adds missing values in 01-settings before using them',
      'Runs tokens:propose to register code-owned tokens with Figma',
      'Keeps PrimeNG --p-* bridges in 01-settings',
    ],
  },
  {
    eyebrow: 'Architect', tone: 'app', title: 'Owns the contract',
    items: [
      'CSS is the only interface between the design system and applications',
      'Figma main is never written by CI',
      'Applications install versions; drift is visible as a package bump',
      'Commands, delivery status and constraints: see Reference',
    ],
  },
]);

export const Rules: StoryObj = cardsStory([
  { title: 'CSS is the API', lead: 'Applications and libs/ui use var(--pds-*) and o- / c- / u- classes. PrimeNG theme helpers ($dt, dt, usePreset, updatePreset) are not imported at runtime.' },
  { title: 'Hybrid colours', lead: 'A mapped colour is emitted as var(--p-primary-600, #487395): the live PrimeNG value with the Figma literal as fallback. Both values are generated from data.' },
  { title: '--pds- prefix', lead: 'All declarations are prefixed. Bare --spacing-* / --text-* / --font-* remain for one release as aliases in _settings.legacy-aliases.scss. BEM class names such as o-layout--gap-2 are unchanged.' },
  { title: 'Branch-only Figma writes', lead: 'Code proposes into proposals/{app}. A designer merges and publishes. Creating the branch is a one-time manual step; Figma has no API for it.' },
  { title: 'v0.6 is the production default', lead: 'The Storybook toolbar toggle remains. v1 is the Figma / tokens.json source for generated fallbacks.' },
  { title: 'Spacing and typography are code-owned', lead: 'The Foundations Figma file exposes them as text styles, not variables. They are authored in SCSS and proposed back to Figma when required.' },
]);

export const OutOfScope: StoryObj = calloutStory({
  tone: 'info',
  title: 'Out of scope',
  items: [
    'Dark mode. Aliased --p-* would switch with a dark scheme; generated literals would not.',
    'Deleting Plectrum_v0.6 or changing resolvePresetVersion() to default to v1.',
    'Rebuilding the PrimeUI token mapping, Tokens Studio, Nx.',
  ],
});
