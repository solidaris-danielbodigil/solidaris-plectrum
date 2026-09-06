import type { ComponentMetadata } from '@solidaris/contracts';

export const ToolbarMetadata: ComponentMetadata = {
  component: {
    name: 'Toolbar',
    category: 'molecules',
    description:
      'Sticky-capable action row on a p-card surface with start/end content slots.',
    type: 'container',
    path: 'libs/ui/src/lib/toolbar/toolbar.component.ts',
    primeNgComponent: 'Card',
    bemBlock: 'c-toolbar',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.toolbar.scss',
    created: '2026-09-05',
    modified: '2026-09-05',
  },
  governance: {
    status: 'candidate',
    owner: 'ishare',
    note: 'Built for the iSHARE documents toolbar. The Foundations pages already embed it, so promotion is the expected outcome once a second application needs it.',
  },
  usage: {
    useCases: [
      'Filter and search row above a list or table',
      'Sticky page-level action bar inside a scroll container',
    ],
    commonPatterns: [
      {
        name: 'Search + filters with count badge',
        description: 'Search input and filter buttons in the start slot; badge and primary action in the end slot.',
        composition:
          '<pds-toolbar [sticky]="true"><ng-container slot="start">…</ng-container><ng-container slot="end">…</ng-container></pds-toolbar>',
      },
      {
        name: 'Domain variant',
        description:
          'Page-specific chrome via a domain BEM class on the host (e.g. c-affiliate-documents-toolbar) — the shared block stays generic.',
        composition: '<pds-toolbar class="c-affiliate-documents-toolbar">…</pds-toolbar>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Navigation bar',
        reason: 'The toolbar is an action row, not navigation chrome.',
        alternative: 'Use TopNav / NavShell.',
      },
    ],
  },
  props: [
    {
      name: 'sticky',
      type: 'boolean',
      default: 'true',
      description: 'Sticks the toolbar to the top of its scroll container.',
      required: false,
    },
  ],
  behavior: {
    states: ['default', 'sticky'],
    responsive: ['Start-slot content wraps below the search field on narrow viewports'],
  },
  accessibility: {
    wcagLevel: 'AA',
    keyboardSupport: ['Slot content keeps its native tab order'],
  },
  tokens: {
    consumed: [],
  },
  aiHints: {
    priority: 'medium',
    context:
      'Use above lists/tables for search-filter-action rows. Sticky works against the nearest scroll container because c-toolbar sits on the host element.',
    selectionCriteria: {
      'action row above content': 'Toolbar',
      'app navigation': 'TopNav / NavShell instead',
    },
    keywords: ['toolbar', 'filter bar', 'action row', 'sticky'],
  },
  examples: [
    {
      name: 'default',
      description: 'Search + actions toolbar',
      code: '<pds-toolbar [sticky]="true">\n  <ng-container slot="start"><input pInputText placeholder="Rechercher" /></ng-container>\n  <ng-container slot="end"><p-badge value="12" /></ng-container>\n</pds-toolbar>',
    },
  ],
};
