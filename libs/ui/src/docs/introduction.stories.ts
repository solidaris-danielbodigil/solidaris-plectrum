// Figures for the Introduction landing page (introduction.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
import { cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Introduction/Figures',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const Audiences: StoryObj = cardsStory([
  {
    eyebrow: 'App developer', tone: 'app', title: 'Use Plectrum in an application',
    items: [
      'Install the published @solidaris/* packages',
      'Boot the theme with providePlectrum()',
      'Build screens from PrimeNG + the catalogue here',
    ],
  },
  {
    eyebrow: 'Contributor', tone: 'system', title: 'Change the design system',
    items: [
      'Run this Storybook locally and scaffold with pds:component',
      'Tokens in 01-settings, layout via o-flex / o-layout, BEMIT names',
      'A component is done when its stories cover every state',
    ],
  },
  {
    eyebrow: 'Designer', tone: 'design', title: 'Design against the source',
    items: [
      'The Figma UI Kit is the SSOT for visual decisions',
      'Foundations pages mirror the compiled CSS at runtime',
      'Token changes travel through the reviewed pipeline, never by hand',
    ],
  },
]);

export const FirstHour: StoryObj = stepsStory([
  { who: 'You', tone: 'neutral', title: 'Skim the Foundations', detail: 'Colors, Typography, Spacing, Layout — every value on those pages is read live from the compiled stylesheet.' },
  { who: 'You', tone: 'neutral', title: 'Open a component story', detail: 'Each state is a story; the attached Docs page explains usage and links the Figma node. Show code reveals the template.' },
  { who: 'You', tone: 'app', title: 'Follow your path', detail: 'Use Plectrum in an app (install and consume) or Contribute (run, scaffold, ship). Both pages are in Get started.' },
  { who: 'You', tone: 'system', title: 'Learn the two contracts', detail: 'CSS architecture explains where styles live; Token pipeline explains where values come from.' },
]);
