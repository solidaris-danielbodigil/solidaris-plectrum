import type { Meta, StoryObj } from '@storybook/angular-vite';
import { cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Start here/Figures/Design with Plectrum',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const Libraries: StoryObj = cardsStory(
  [
    {
      eyebrow: 'PrimeNG v21',
      tone: 'design',
      title: 'Themed controls',
      items: [
        'Buttons, fields, overlays and the other themed PrimeNG components. Use the kit component, not a rectangle with the same colours.',
      ],
      links: [
        {
          label: 'Open the PrimeNG kit',
          href: 'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=2-3977',
        },
      ],
    },
    {
      eyebrow: 'Foundations',
      tone: 'system',
      title: 'Colour, type, space',
      items: [
        'Colour, type, spacing, radius and elevation. Pick a named role. Do not type a hex or a one-off spacing value.',
      ],
      links: [
        {
          label: 'Open Foundations',
          href: 'https://www.figma.com/design/jH0paYnBCco2Ye6ysNcWrr/PLECTRUM-%C2%B7-Foundations',
        },
      ],
    },
    {
      eyebrow: 'Custom components',
      tone: 'app',
      title: 'Plectrum pieces',
      items: [
        'Form Field, Empty State, Drawer and the other Plectrum components PrimeNG does not provide as-is.',
      ],
      links: [
        {
          label: 'Open custom components',
          href: 'https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=1-2305',
        },
      ],
    },
    {
      eyebrow: 'Icons',
      tone: 'neutral',
      title: 'Icons and illustrations',
      items: [
        'Bootstrap Icons and the empty-state illustrations. Pin an illustration on a real screen.',
      ],
      links: [
        {
          label: 'Open icons and illustrations',
          href: 'https://www.figma.com/design/947lOBHnx8VJUPLuKhLqby/PLECTRUM-%C2%B7-Icons---illustrations?node-id=314-942',
        },
      ],
    },
  ],
  2,
);

export const Handoff: StoryObj = stepsStory([
  {
    who: 'Design',
    tone: 'design',
    title: 'Name the decision',
    detail:
      'Which component, which variant, and which state: default, loading, empty, error. Link the Storybook heading, not only the Figma file.',
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Include the narrow layout',
    detail:
      'Show the same screen at the sm breakpoint. Say what stacks, what hides, and what stays.',
  },
  {
    who: 'Dev',
    tone: 'app',
    title: 'Build that page',
    detail:
      'A developer follows Build with Plectrum, then the component page. They should not have to invent a variant you already chose.',
  },
]);
