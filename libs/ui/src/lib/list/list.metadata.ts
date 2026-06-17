import type { ComponentMetadata } from '@solidaris/contracts';

export const ListMetadata: ComponentMetadata = {
  component: {
    name: 'List',
    category: 'molecules',
    description:
      'iSHARE affiliate document list with journey (grouped) and flat modes rendered via PrimeNG Tree node templates with card row chrome.',
    type: 'display',
    path: 'libs/ui/src/lib/list/list.component.ts',
    primeNgComponent: 'Tree',
    bemBlock: 'c-list',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.list.scss',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  usage: {
    useCases: [
      'Affiliate document suivi panel (Suivi des documents)',
      'Journey-grouped parcours with expandable tree groups',
      'Flat document listing without grouping',
    ],
    commonPatterns: [
      {
        name: 'Journey grouped list',
        description:
          'Pass non-null groups with expandedGroupIds for tree group nodes and nested document rows.',
        composition:
          '<sds-list [groups]="groups" [expandedGroupIds]="expandedIds" (expandedGroupIdsChange)="expandedIds = $event" />',
      },
      {
        name: 'Flat document list',
        description: 'Pass groups=null and flat document items for a flat tree of document nodes.',
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
        reason: 'List rows are document summaries, not tabular data.',
        alternative: 'Use a data table for dense columnar listings.',
      },
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'role="region" + aria-label on host',
      'aria-busy on host when loading',
      'PrimeNG Tree treeitem semantics for groups and documents',
      'role="button" + tabindex + aria-selected on document row cards',
      'aria-hidden on decorative sort icon',
    ],
    contrastRequirements: [
      'Status and footer tags must include visible French label text — not colour alone.',
      'Selected document uses accent colour and bold weight in addition to aria-selected.',
    ],
  },
  tokens: {
    consumed: [
      '--sds-color-list-bg',
      '--sds-color-panel-border',
      '--sds-color-list-section-title',
      '--sds-color-list-count-badge-bg',
      '--sds-color-list-count-badge-text',
      '--sds-color-list-row-bg',
      '--sds-color-list-row-border',
      '--sds-color-list-row-hover-border',
      '--sds-color-list-row-selected-border',
      '--sds-color-list-title-text',
      '--sds-color-list-title-accent',
      '--sds-color-list-icon',
      '--sds-color-divider',
      '--sds-color-list-date-label',
      '--sds-color-list-date-value',
      '--sds-color-list-timeline-line',
      '--sds-color-list-timeline-marker',
      '--sds-color-list-timeline-marker-border',
      '--sds-color-list-skeleton-bg',
      '--sds-size-list-icon',
      '--sds-size-list-timeline-gutter',
      '--sds-size-list-timeline-marker',
      '--sds-size-list-count-badge-min',
      '--sds-border-width-list',
      '--sds-border-width-list-row',
      '--sds-border-width-list-selected',
      '--sds-shadow-list-row-selected',
      '--sds-transition-list-row',
      '--sds-opacity-divider',
      '--sds-radius-xl',
      '--sds-radius-sm',
      '--sds-disabled-opacity',
    ],
  },
  aiHints: {
    priority: 'high',
    context:
      'Primary document list for iSHARE affiliate details. Journey ON: PrimeNG Tree with group/document card templates (Figma 2:125 row states). Journey OFF: flat document tree. Native tree toggler for expand/collapse.',
    selectionCriteria: {
      'groups non-null': 'Journey / parcours grouped tree mode',
      'groups null': 'Flat document tree without group nodes',
    },
    keywords: ['list', 'documents', 'journey', 'parcours', 'tree', 'affiliate', 'iSHARE'],
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
    {
      name: 'selectedItemId',
      type: 'string | null',
      required: false,
      default: 'null',
      description: 'ID of the selected document row — takes precedence over doc.selected',
    },
  ],
  examples: [],
};
