import type { ComponentMetadata } from '@solidaris/contracts';

export const AffiliateDetailDrawerMetadata: ComponentMetadata = {
  component: {
    name: 'AffiliateDetailDrawer',
    category: 'organisms',
    description:
      'iSHARE "Carte affilié" detail drawer wrapping PrimeNG p-drawer: header (illustrated avatar, name, copyable identifier tags, menu + close), Détails/Documents segmented control, quick actions, Informations générales / Coordonnées sections, and Famille / Notes accordions.',
    type: 'container',
    path: 'libs/ui/src/lib/affiliate-detail-drawer/affiliate-detail-drawer.component.ts',
    primeNgComponent: 'Drawer, SelectButton, Accordion, Card, Tag, Button',
    bemBlock: 'c-drawer',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.drawer.scss',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  usage: {
    useCases: [
      'Affiliate detail panel opened from the audit overview',
      'Read-only affiliate identity, contact, family and notes summary',
      'Slide-in detail drawer for the Dossier Affilié flow',
    ],
    commonPatterns: [
      {
        name: 'Open affiliate detail drawer',
        description:
          'Bind visibility two-way and pass the full affiliate data object.',
        composition:
          '<(pds|app|lib)-affiliate-detail-drawer [(visible)]="open" [data]="affiliate" (identifierCopy)="copy($event)" />',
      },
      {
        name: 'Controlled segmented view',
        description:
          'Listen to viewChange to swap between the Détails and Documents tabs.',
        composition:
          '<(pds|app|lib)-affiliate-detail-drawer [(visible)]="open" [data]="affiliate" [view]="view" (viewChange)="view = $event" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Inline always-visible panel',
        reason: 'The drawer is an overlay surface controlled by visibility.',
        alternative: 'Use a static card/section layout for always-visible content.',
      },
      {
        scenario: 'Editing affiliate data in place',
        reason: 'The drawer is a read-only summary with action triggers.',
        alternative: 'Open a dedicated form view from the drawer actions.',
      },
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'aria-label on copy identifier buttons (Copier {label})',
      'aria-label on header menu (Plus d\'actions) and close (Fermer) buttons',
      'aria-label on family arrow buttons ({name} ({relationship}))',
      'aria-labelledby links sections to their heading ids',
      'aria-hidden on bullet separators and section dividers',
      'p-drawer focus trap + Escape handling for the overlay surface',
    ],
    contrastRequirements: [
      'Yellow family avatar uses dark initials (rgba(0,0,0,0.9)) for contrast; blue/green use white.',
      'Sensitive note tag pairs an icon and label text — not colour alone.',
    ],
  },
  tokens: {
    consumed: [
      '--pds-size-drawer-min-width',
      '--pds-size-drawer-max-width',
      '--pds-color-affiliate-detail-drawer-bg',
      '--pds-shadow-affiliate-detail-drawer',
      '--pds-shadow-xl',
      '--pds-color-panel-border',
      '--pds-color-content-border',
      '--pds-space-affiliate-detail-drawer-header-padding-block-start',
      '--pds-space-affiliate-detail-drawer-header-padding-block-end',
      '--pds-space-affiliate-detail-drawer-padding-inline',
      '--pds-space-affiliate-detail-drawer-content-gap',
      '--pds-space-affiliate-detail-drawer-content-padding-block',
      '--pds-space-affiliate-detail-drawer-section-gap',
      '--pds-size-detail-list-label-width',
      '--pds-color-affiliate-detail-drawer-metadata-text',
      '--pds-color-affiliate-detail-drawer-relationship',
      '--pds-color-affiliate-detail-drawer-tile-bg',
      '--pds-radius-affiliate-detail-drawer-tile',
      '--pds-color-affiliate-detail-drawer-note-bg',
      '--pds-radius-affiliate-detail-drawer-note',
      '--pds-color-affiliate-detail-drawer-note-author',
      '--pds-color-affiliate-detail-drawer-note-timestamp',
      '--pds-color-affiliate-detail-drawer-note-tag-sensitive-bg',
      '--pds-color-affiliate-detail-drawer-note-tag-sensitive-text',
      '--pds-color-avatar-color-blue',
      '--pds-color-avatar-color-green',
      '--pds-color-avatar-color-yellow',
      '--pds-color-avatar-initials-on-yellow',
      '--text-heading-lg-size',
      '--text-heading-sm-size',
      '--text-label-sm-size',
      '--text-body-sm-size',
      '--p-card-body-padding',
      '--p-accordion-header-padding',
      '--p-tag-danger-background',
      '--p-tag-danger-color',
    ],
  },
  aiHints: {
    priority: 'high',
    context:
      'Affiliate detail drawer for iSHARE audit flows. Headless p-drawer wrapper rendering the full Carte affilié per Figma 7:1012. Reuses pds-plectrum-avatar (large illustrated + small coloured) and the overview-card copyable identifier pattern.',
    selectionCriteria: {
      'detail drawer': 'Slide-in affiliate detail surface with sections and accordions',
      'overview card': 'Use pds-affiliate-overview-card for the inline summary instead',
    },
    keywords: [
      'affiliate',
      'drawer',
      'carte affilié',
      'detail',
      'famille',
      'notes',
      'coordonnées',
      'iSHARE',
    ],
  },
  props: [
    { name: 'data', type: 'AffiliateDetailDrawerData', required: true, description: 'Full affiliate content rendered inside the drawer' },
    { name: 'visible', type: 'boolean', required: false, default: 'false', description: 'Two-way visibility ([(visible)]) controlling open/close' },
    { name: 'position', type: 'AffiliateDetailDrawerPosition', required: false, default: 'right', description: 'Edge the drawer slides in from' },
    { name: 'modal', type: 'boolean', required: false, default: 'true', description: 'Whether a backdrop mask is shown behind the drawer' },
    { name: 'view', type: 'AffiliateDetailDrawerView', required: false, default: 'details', description: 'Active segmented-control view (Détails / Documents)' },
    { name: 'showNotes', type: 'boolean', required: false, default: 'true', description: 'Whether the Notes accordion section is rendered' },
  ],
  examples: [],
};
