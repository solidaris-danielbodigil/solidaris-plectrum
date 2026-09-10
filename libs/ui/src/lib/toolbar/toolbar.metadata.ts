import type { ComponentMetadata } from '@solidaris/contracts';

export const ToolbarMetadata: ComponentMetadata = {
  component: {
    name: 'Toolbar',
    category: 'molecules',
    description:
      'Sticky-capable action row on a PrimeNG Card surface with two named slots, start and end. Layout inside the card is o-flex / o-layout mixes in the template; the SCSS owns only the sticky position and the wrap constraint.',
    type: 'container',
    path: 'libs/ui/src/lib/toolbar/toolbar.component.ts',
    primeNgComponent: 'Card',
    bemBlock: 'c-toolbar',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.toolbar.scss',
    figmaUrl:
      'https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5772',
    created: '2026-09-05',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
    note: 'No Plectrum UI Kit node for the generic toolbar yet — the Figma link opens the iSHARE-Audit documents filter row, reference usage of a domain variant.',
  },
  usage: {
    useCases: [
      'Filter and search row above a list or table',
      'Sticky page-level action bar inside a scroll container',
    ],
    commonPatterns: [
      {
        name: 'Search + filters with count badge',
        description:
          'Search input and filter buttons in the start slot; badge and primary action in the end slot.',
        composition:
          '<pds-toolbar [sticky]="true"><ng-container slot="start">…</ng-container><ng-container slot="end">…</ng-container></pds-toolbar>',
      },
      {
        name: 'Domain variant',
        description:
          'Page-specific chrome via a domain BEM class on the host (e.g. c-affiliate-documents-toolbar) — the shared block stays generic.',
        composition:
          '<pds-toolbar class="c-affiliate-documents-toolbar">…</pds-toolbar>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Application navigation',
        reason: 'The toolbar is an action row above content, not navigation chrome.',
        alternative: 'Use Top Nav for the header bar and Nav Shell / Sub Nav Shell for the sidebars.',
      },
      {
        scenario: 'Page-specific chrome in the shared block',
        reason: 'c-toolbar is shared by every consumer; page styling in it leaks everywhere.',
        alternative: 'Add a domain BEM class on the host (e.g. c-affiliate-documents-toolbar) and style that block in 06-components.',
      },
    ],
  },
  anatomy: [
    { part: 'c-toolbar', role: 'Host — c-toolbar--sticky bound to the sticky input, so position: sticky sits on the scroll-ancestor boundary' },
    { part: 'p-card', role: 'PrimeNG surface' },
    { part: 'c-toolbar__inner', role: 'o-flex wrap row with row / column gaps' },
    { part: 'c-toolbar__start', role: 'Start slot wrapper — grows, wraps its content on narrow viewports' },
    { part: 'c-toolbar__end', role: 'End slot wrapper — forced onto its own line by the SCSS wrap constraint' },
  ],
  composition: {
    nestedComponents: ['Card'],
    slots: [
      {
        name: '[slot=start]',
        description: 'Left-aligned content — search field, filter buttons. Wraps below on narrow viewports.',
      },
      {
        name: '[slot=end]',
        description: 'Right-aligned content — count badge, primary actions. Always on its own line.',
      },
    ],
  },
  props: [
    {
      name: 'sticky',
      type: 'boolean',
      default: 'true',
      description:
        'When true (default) the toolbar sticks to the top of its scroll container.',
      required: false,
    },
  ],
  behavior: {
    states: ['default', 'sticky'],
    interactions: [
      'sticky (default true) toggles c-toolbar--sticky on the host: position: sticky against the nearest scroll container, including overflow-constrained app shells',
      'The toolbar renders whatever is projected into the slots and adds no behaviour of its own',
    ],
    responsive: [
      'Start-slot content wraps below the search field on narrow viewports',
      'The end slot is always on its own line (flex-basis 100%)',
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'The toolbar adds no names of its own — every search field, filter and action in the slots must carry its own accessible name',
      'No landmark role: it is a plain p-card surface. Wrap the page region in the app when a landmark is needed',
    ],
    keyboardSupport: [
      'Slot content keeps its native tab order (start slot, then end slot)',
      'Sticky positioning does not change focus behaviour',
    ],
  },
  tokens: {
    consumed: ['--pds-z-sticky', '--pds-color-surface-0'],
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
      code: '<pds-toolbar [sticky]="true">\n  <ng-container slot="start"><input pInputText placeholder="Search" /></ng-container>\n  <ng-container slot="end"><p-badge value="12" /></ng-container>\n</pds-toolbar>',
    },
  ],
};
