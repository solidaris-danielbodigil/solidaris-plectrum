import type { ComponentMetadata } from '@solidaris/contracts';

export const EmptyStateMetadata: ComponentMetadata = {
  component: {
    name: 'EmptyState',
    category: 'molecules',
    description:
      'Reusable empty-state placeholder with an illustrated hero (random by default, or a pinned catalog id) and message text.',
    type: 'feedback',
    path: 'libs/ui/src/lib/empty-state/empty-state.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-empty-state',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.empty-state.scss',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  usage: {
    useCases: ['Empty result panes', 'Placeholder document details', 'Onboarding empty states'],
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
        scenario: 'Actionable error recovery flow',
        reason: 'The component is descriptive, not interactive.',
        alternative: 'Use a dedicated error banner or recovery screen.',
      },
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
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