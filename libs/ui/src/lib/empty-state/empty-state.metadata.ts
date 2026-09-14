import type { ComponentMetadata } from '@solidaris/contracts';

export const EmptyStateMetadata: ComponentMetadata = {
  component: {
    name: 'EmptyState',
    category: 'molecules',
    description:
      'Placeholder for empty results, empty detail panels and onboarding states: a decorative illustration (a random catalog pick by default, or a pinned id) above a title and an optional supporting sentence.',
    type: 'feedback',
    path: 'libs/ui/src/lib/empty-state/empty-state.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-empty-state',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.empty-state.scss',
    figmaUrl: 'https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=441-7641',
    created: '2026-06-05',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Empty result panes after a search or a filter',
      'Placeholder for a detail panel with nothing selected yet',
      'Onboarding empty states with a short heading and one supporting sentence',
    ],
    commonPatterns: [
      {
        name: 'Empty detail panel',
        description: 'Use the component with a short heading and one supporting sentence.',
        composition:
          '<pds-empty-state title="No results" description="Try another search." />',
      },
      {
        name: 'Pinned illustration',
        description:
          'Pass illustration to lock a catalog SVG instead of the default random pick.',
        composition:
          '<pds-empty-state title="No results" description="Try another search." illustration="people-search" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Actionable error recovery',
        reason: 'The block is descriptive only — it has no action slot and no interactive parts.',
        alternative: 'Use a dedicated error banner (p-message) or a recovery screen with its own actions.',
      },
    ],
  },
  anatomy: [
    { part: 'c-empty-state', role: 'Section that stacks the art and the text' },
    { part: 'c-empty-state__art', role: 'Decorative illustration frame (aria-hidden)' },
    { part: 'c-empty-state__illustration', role: 'Catalog SVG rendered as an img with an empty alt' },
    { part: 'c-empty-state__title', role: 'Visible h3 heading that carries the message' },
    { part: 'c-empty-state__description', role: 'Optional supporting sentence' },
  ],
  behavior: {
    states: ['random-illustration', 'pinned-illustration', 'title-only'],
    interactions: [
      'illustration defaults to random: one catalog SVG is chosen when the instance is created and kept for the lifetime of the component',
      'Pass a catalog id to pin a specific asset — Storybook, visual tests, or a screen that must always show the same drawing',
      'description is optional; when null only the title is rendered',
      'Static block — no hover, focus or click behaviour',
    ],
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Heading shown under the illustration.' },
    { name: 'description', type: 'string | null', required: false, default: 'null', description: 'Optional supporting sentence under the title.' },
    { name: 'illustration', type: 'EmptyStateIllustrationChoice', required: false, default: 'random', description: 'Decorative hero. random picks one catalog SVG per instance; pass an id to pin one.' },
  ],
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'The hero art is decorative — the art frame is aria-hidden and the img has an empty alt, so the title and description carry the message',
      'The title renders as an <h3>; place the block where a level-3 heading fits the page outline',
    ],
    keyboardSupport: ['No interactive parts — the block never takes focus'],
  },
  tokens: {
    consumed: [
      '--pds-text-heading-md-family',
      '--pds-text-heading-md-size',
      '--pds-text-heading-md-weight',
      '--pds-text-heading-md-line-height',
      '--pds-text-heading-md-spacing',
      '--pds-text-body-md-family',
      '--pds-text-body-md-size',
      '--pds-text-body-md-weight',
      '--pds-text-body-md-line-height',
      '--pds-text-body-md-spacing',
      '--pds-color-text',
      '--pds-color-text-muted',
    ],
  },
  aiHints: {
    priority: 'medium',
    context: 'Use as a reusable placeholder wrapper for empty pages and detail panels.',
    selectionCriteria: {},
    keywords: ['empty state', 'placeholder', 'illustration', 'no results'],
  },
  examples: [],
};