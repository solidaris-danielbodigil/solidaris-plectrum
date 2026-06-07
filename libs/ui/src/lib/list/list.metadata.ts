import type { ComponentMetadata } from '@solidaris/contracts';

export const ListMetadata: ComponentMetadata = {
  component: {
    name: 'List',
    category: 'molecules',
    description:
      'iSHARE affiliate document list with journey (grouped timeline) and flat modes, status tags, and selectable document rows.',
    type: 'display',
    path: 'libs/ui/src/lib/list/list.component.ts',
    primeNgComponent: 'Tag',
    bemBlock: 'c-list',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.list.scss',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  usage: {
    useCases: [
      'Affiliate document suivi panel (Suivi des documents)',
      'Journey-grouped parcours timeline with expandable groups',
      'Flat document listing without grouping',
    ],
    commonPatterns: [
      {
        name: 'Journey grouped list',
        description:
          'Pass non-null groups with expandedGroupIds for accordion-style parcours headers and timeline child rows.',
        composition:
          '<sds-list [groups]="groups" [expandedGroupIds]="expandedIds" (expandedGroupIdsChange)="expandedIds = $event" />',
      },
      {
        name: 'Flat document list',
        description: 'Pass groups=null and flat document items for full-width cards without chevrons.',
        composition: '<sds-list [groups]="null" [items]="documents" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Mixed groups and flat items simultaneously',
        reason: 'Mode is determined by groups being null or non-null — not both.',
        alternative: 'Shape data into groups OR flat items before binding.',
      },
      {
        scenario: 'Full-page data table',
        reason: 'List rows are card-style document summaries, not tabular data.',
        alternative: 'Use a data table for dense columnar listings.',
      },
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'role="region" + aria-label on host',
      'aria-busy on host when loading',
      'aria-expanded + aria-label on journey group header buttons',
      'role="button" + tabindex on document rows',
      'aria-hidden on decorative icons (chevron, folder, clipboard, sort)',
    ],
    contrastRequirements: [
      'Status and footer tags must include visible French label text — not colour alone.',
      'Selected document border must not be the only selection indicator.',
    ],
  },
  tokens: {
    consumed: [
      '--sds-color-list-bg',
      '--sds-color-list-border',
      '--sds-color-list-section-title',
      '--sds-color-list-count-badge-bg',
      '--sds-color-list-count-badge-text',
      '--sds-color-list-row-bg',
      '--sds-color-list-row-border',
      '--sds-color-list-row-selected-border',
      '--sds-shadow-list-row-selected',
      '--sds-color-list-title-text',
      '--sds-color-list-title-accent',
      '--sds-color-list-chevron',
      '--sds-color-list-icon',
      '--sds-color-list-divider',
      '--sds-color-list-date-label',
      '--sds-color-list-date-value',
      '--sds-color-list-timeline-line',
      '--sds-color-list-timeline-marker',
      '--sds-color-list-timeline-marker-border',
      '--sds-color-list-skeleton-bg',
      '--sds-size-list-count-badge-min',
      '--sds-size-list-chevron-column',
      '--sds-size-list-icon',
      '--sds-size-list-timeline-gutter',
      '--sds-size-list-timeline-marker',
      '--sds-space-list-section-header-padding',
      '--sds-space-list-body-padding-inline',
      '--sds-space-list-row-padding-block',
      '--sds-space-list-row-padding-inline',
      '--sds-space-list-chevron-padding-inline-start',
      '--sds-space-list-timeline-marker-offset',
      '--sds-border-width-list-row',
      '--sds-border-width-list-selected',
      '--sds-radius-xl',
      '--sds-radius-sm',
      '--sds-radius-pill',
      '--sds-radius-xs',
      '--sds-opacity-list-divider',
      '--sds-disabled-opacity',
    ],
  },
  aiHints: {
    priority: 'high',
    context:
      'Primary document list for iSHARE affiliate details. Journey ON: chevron on group headers, timeline gutter on child rows. Journey OFF: flat cards. Figma nodes 324:5827, 518:48833, 435:7387.',
    selectionCriteria: {
      'groups non-null': 'Journey / parcours grouped accordion mode',
      'groups null': 'Flat document list without chevrons or timeline',
    },
    keywords: ['list', 'documents', 'journey', 'parcours', 'timeline', 'affiliate', 'iSHARE'],
  },
  props: [
    {
      name: 'groups',
      type: 'ListGroup[] | null',
      required: false,
      default: 'null',
      description: 'Non-null enables journey grouped mode; null enables flat mode',
    },
    {
      name: 'items',
      type: 'ListItem[]',
      required: false,
      default: '[]',
      description: 'Flat document rows when groups is null',
    },
    { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Skeleton placeholder state' },
    {
      name: 'expandedGroupIds',
      type: 'string[]',
      required: false,
      default: '[]',
      description: 'IDs of expanded journey groups (controlled state)',
    },
  ],
  examples: [],
};
