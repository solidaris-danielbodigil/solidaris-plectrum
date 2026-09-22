import type { Meta, StoryObj } from '@storybook/angular-vite';
import { cardsStory, stepsStory } from './docs-figure-stories';

const meta: Meta = {
  title: 'Start here/Figures/Design with Plectrum',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

/** Every library needs the same switch-on step — Figma does not enable it by default. */
const ENABLE_LIBRARY =
  'Turn it on from Assets, the library icon, in Figma. Ask the design-system team for access if you cannot see it.';

export const Libraries: StoryObj = cardsStory(
  [
    {
      eyebrow: 'PrimeNG v21',
      tone: 'design',
      title: 'Themed controls',
      items: [
        'Buttons, fields, overlays and the other themed PrimeNG components. Use the kit component, not a rectangle with the same colours.',
        ENABLE_LIBRARY,
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
        ENABLE_LIBRARY,
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
        ENABLE_LIBRARY,
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
        ENABLE_LIBRARY,
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

/** The six build-a-form steps, each linked to the exact Figma node or Storybook page it names. */
export const BuildForm: StoryObj = stepsStory([
  {
    who: 'Design',
    tone: 'design',
    title: 'Pick Form Field',
    detail: 'Open Find a component and choose Form Field. Do not start from a blank input.',
    links: [{ label: 'Find a component', path: '/docs/start-here-catalogue--docs' }],
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Build it from the PrimeNG kit',
    detail:
      'Place InputText inside a Label and a Help text, all three from the PrimeNG kit. Storybook documents this composition as Form Field.',
    links: [
      {
        label: 'InputText',
        href: 'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=23-835',
      },
      {
        label: 'Label',
        href: 'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=9857-13210',
      },
      {
        label: 'Help text',
        href: 'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=9858-7904',
      },
    ],
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Use every state',
    detail:
      'Use the variants this Storybook documents: label, hint, required, invalid. Open the component page and the Figma component, not the whole file.',
    links: [{ label: 'Form Field', path: '/docs/custom-components-form-field--docs' }],
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Check the narrow layout',
    detail: 'Stack the label above the control. Do not shrink the type below the body role.',
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Write the error',
    detail: 'Write the error in the same language as the label, and say how to fix it.',
  },
  {
    who: 'Design',
    tone: 'design',
    title: 'Hand off',
    detail:
      'Hand off the frame link plus the Storybook page. A developer should not have to guess which variant you meant.',
    links: [{ label: 'Form Field', path: '/docs/custom-components-form-field--docs' }],
  },
]);

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
