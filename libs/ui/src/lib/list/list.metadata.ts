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
          '<(pds|app|lib)-list [groups]="groups" [expandedGroupIds]="expandedIds" (expandedGroupIdsChange)="expandedIds = $event" />',
      },
      {
        name: 'Flat document list',
        description: 'Pass groups=null and flat document items for a flat tree of document nodes.',
        composition: '<(pds|app|lib)-list [groups]="null" [items]="documents" />',
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
      '--pds-color-list-bg',
      '--pds-color-panel-border',
      '--pds-color-list-section-title',
      '--pds-color-list-count-badge-bg',
      '--pds-color-list-count-badge-text',
      '--pds-color-list-row-bg',
      '--pds-color-list-row-border',
      '--pds-color-list-row-hover-border',
      '--pds-color-list-row-selected-border',
      '--pds-color-list-title-text',
      '--pds-color-list-title-accent',
      '--pds-color-list-icon',
      '--pds-color-divider',
      '--pds-color-list-date-label',
      '--pds-color-list-date-value',
      '--pds-color-list-timeline-line',
      '--pds-color-list-timeline-marker',
      '--pds-color-list-timeline-marker-border',
      '--pds-color-list-skeleton-bg',
      '--pds-size-list-icon',
      '--pds-size-list-timeline-gutter',
      '--pds-size-list-timeline-marker',
      '--pds-size-list-count-badge-min',
      '--pds-border-width-list',
      '--pds-border-width-list-row',
      '--pds-border-width-list-selected',
      '--pds-shadow-list-row-selected',
      '--pds-transition-list-row',
      '--pds-opacity-divider',
      '--pds-radius-xl',
      '--pds-radius-sm',
      '--pds-disabled-opacity',
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
