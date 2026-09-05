// Figures for Docs/CSS architecture (css-architecture.mdx). Hidden from the sidebar.
import type { Meta, StoryObj } from '@storybook/angular';
import { calloutStory, cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Docs/CSS architecture/Figures',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const AuthoringOrder: StoryObj = stepsStory([
  {
    who: 'Theme',
    tone: 'design',
    title: 'PrimeNG first',
    detail:
      'Use the Plectrum preset via providePlectrum(). Do not restyle a control that already matches Figma.',
  },
  {
    who: 'Template',
    tone: 'system',
    title: 'Layout with objects',
    detail:
      'Flex, gap, padding, margin, overflow and equal columns are o-flex / o-layout classes on the element.',
  },
  {
    who: 'Template',
    tone: 'system',
    title: 'Static chrome with utilities',
    detail:
      'Borders, radii and resting shadows are u-border-* / u-radius-* / u-shadow-* on the same element.',
  },
  {
    who: 'Settings',
    tone: 'system',
    title: 'Add a missing token first',
    detail:
      'A new value lands in 01-settings as --pds-*. PrimeNG --p-* bridges live in _settings.{component}.scss.',
  },
  {
    who: 'Component',
    tone: 'app',
    title: 'Write 06-components last',
    detail:
      'The c- block owns identity, states and token-driven visuals. It does not restate layout that an object class already covers.',
  },
]);

export const Prefixes: StoryObj = cardsStory([
  {
    title: 'o- object',
    lead: 'Layout patterns. o-flex, o-layout, o-scroll-shadow. Mixed onto BEM elements in the template.',
  },
  {
    title: 'c- component',
    lead: 'One block per libs/ui component. Elements with __, modifiers with --. Never an app prefix.',
  },
  {
    title: 'u- utility',
    lead: 'One job: hide, radius, border, shadow, type. Generated lists live on Foundations pages.',
  },
]);

export const Rules: StoryObj = cardsStory([
  {
    title: 'libs/styles is the SSOT',
    lead: 'Every SCSS change lands in the matching ITCSS layer. Apps do not redefine tokens or BEM blocks.',
  },
  {
    title: 'No Tailwind in HTML',
    lead: 'Templates carry semantic BEMIT classes only. Utility intent is expressed as o-* / u-*, never as raw flex / gap / p-4 classes.',
  },
  {
    title: 'BEM + objects mix',
    lead: 'The c- class says what the element is. o-flex / o-layout say how it is laid out. Both sit on the same node. Never @extend an object class.',
  },
  {
    title: 'States are is- / has-',
    lead: '.c-form-field.is-invalid, not .c-form-field--invalid. JS hooks are js-* and are never styled.',
  },
  {
    title: 'Keep specificity flat',
    lead: 'One class level. Do not nest .c-card { .c-card__header { … } }. Do not double the block (.c-foo.c-foo).',
  },
  {
    title: 'Content-first sizing',
    lead: 'No arbitrary width or height. Size from padding, line-height and gap. Fixed sizes need a comment (icon box, reserved overlay slot).',
  },
]);

export const StaysInScss: StoryObj = calloutStory({
  tone: 'info',
  title: 'What stays in 06-components',
  items: [
    'PrimeNG internals with no template hook (.p-accordionheader, .p-card-body).',
    'Component-token gap or padding that is not on the global spacing scale.',
    'State-driven border, radius or shadow (hover, selected, expanded).',
    'Bespoke display: grid with named areas — comment why o-flex is not enough.',
    'Position, z-index, transitions, typography that objects and utilities cannot express.',
  ],
});
