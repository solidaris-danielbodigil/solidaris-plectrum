// Figures for Docs/Token pipeline/CSS-first surface (token-pipeline-css-first.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Docs/Token pipeline/Figures/CSS-first surface',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const Scope: StoryObj = cardsStory([
  {
    eyebrow: 'Component authors write', tone: 'system', title: 'var(--pds-*) and BEM classes',
    items: ['06-components/_components.{name}.scss', 'Feature settings in 01-settings when a value is missing', 'tokens.consumed in the component .metadata.ts'],
  },
  {
    eyebrow: 'Generated', tone: 'neutral', title: '*.generated.scss and the Storybook manifest',
    items: ['colors-primitive, colors-semantic', 'radius, shadows, transitions, focus', 'tokens.generated.ts for the token explorer'],
  },
  {
    eyebrow: 'Not permitted', tone: 'design', title: 'PrimeNG internals',
    items: ['--p-* declarations outside 01-settings', '@primeuix/themes runtime helpers ($dt, dt, usePreset, updatePreset)', 'Hard-coded hex or px where a token exists'],
  },
]);

export const AddingAToken: StoryObj = stepsStory([
  { who: 'Developer', tone: 'system', title: 'Add the value in libs/styles/src/01-settings/', detail: 'Generated file if Style Dictionary owns the token; otherwise the feature settings file _settings.{name}.scss.' },
  { who: 'Developer', tone: 'system', title: 'Reference it as var(--pds-*) in 06-components', detail: 'No raw hex or px, no --p-* names.' },
  { who: 'Developer', tone: 'system', title: 'List it under tokens.consumed in the component .metadata.ts', detail: 'Input for the Tokens consumed view below and for the token-usage CLI.' },
  { who: 'CI', tone: 'neutral', title: 'tokens:lint', detail: 'Fails on --p-* declarations in 06-components and on @primeuix/themes runtime imports. --strict also fails on hard-coded hex/px.' },
]);

export const DarkMode: StoryObj = calloutStory({
  tone: 'warning',
  title: 'Dark mode is out of scope',
  text: 'v1 defines colorScheme.light only. With a dark scheme, aliased --p-* would switch and generated literals would not. Either keep dark mode out of scope or emit a .dark block next to the generated colours. Hybrid colours are not theme-aware.',
});
