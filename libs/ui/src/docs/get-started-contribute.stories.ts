// Figures for Get started/Contribute (get-started-contribute.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
import { stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Get started/Figures/Contribute',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const DevLoop: StoryObj = stepsStory([
  { who: 'Dev', tone: 'system', title: 'Set up', detail: 'git clone, npm install, npm run storybook — the catalogue runs at localhost:6006 with live reload.' },
  { who: 'Dev', tone: 'system', title: 'Scaffold', detail: 'npm run pds:component creates the component, stories, metadata contract, the 06-components partial with its @forward, and regenerates the index.' },
  { who: 'Dev', tone: 'design', title: 'Check the sources first', detail: 'PrimeNG MCP: does a component exist? Figma MCP: exact specs from the UI Kit. Custom code only when neither covers the need.' },
  { who: 'Dev', tone: 'system', title: 'Implement in Storybook', detail: 'Tokens in 01-settings, BEMIT SCSS in 06-components, layout classes in the template, one story per state. Validate here before any app uses it.' },
  { who: 'CI', tone: 'neutral', title: 'Ship through the gates', detail: 'Token audits, generated-file diffs, contracts-index freshness, build, tests. Changesets version and publish the packages.' },
]);
