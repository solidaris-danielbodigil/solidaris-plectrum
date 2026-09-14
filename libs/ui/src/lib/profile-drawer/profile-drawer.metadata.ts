import type { ComponentMetadata } from '@solidaris/contracts';

export const ProfileDrawerMetadata: ComponentMetadata = {
  component: {
    name: 'ProfileDrawer',
    category: 'organisms',
    description:
      'Slide-in profile detail drawer on a headless PrimeNG p-drawer: a header with the large avatar, the person\'s name, copyable identifiers, menu and close; a Details / Documents switch with quick actions; general and contact rows; and related-people and notes accordions.',
    type: 'container',
    path: 'libs/ui/src/lib/profile-drawer/profile-drawer.component.ts',
    primeNgComponent: 'Drawer, SelectButton, Accordion, Tag, Button',
    bemBlock: 'c-drawer',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.drawer.scss',
    figmaUrl:
      'https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=7-1012',
    created: '2026-09-08',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
    note: 'No Plectrum UI Kit node yet — the Figma link opens the iSHARE-Audit reference usage (open question: .ai/questions/profile-card-drawer-figma.md).',
  },
  usage: {
    useCases: [
      'Slide-in profile detail overlay opened from a summary card or a list row',
      'Read-only identity, contact, related-people and notes summary of one person',
      'Details / Documents view switch on the same surface — the Documents content is provided by the host',
    ],
    commonPatterns: [
      {
        name: 'Open the profile drawer',
        description:
          'Bind visibility two-way and pass the full profile data object.',
        composition:
          '<(pds|app|lib)-profile-drawer [(visible)]="open" [data]="profile" (identifierCopy)="copy($event)" />',
      },
      {
        name: 'Controlled view switch',
        description:
          'Listen to viewChange and pass the view back to swap between Details and Documents.',
        composition:
          '<(pds|app|lib)-profile-drawer [(visible)]="open" [data]="profile" [view]="view" (viewChange)="view = $event" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Always-visible side panel',
        reason: 'The drawer is an overlay surface controlled by visible; while open it is a modal dialog that traps focus.',
        alternative:
          'Use a static column or card layout for content that must stay visible.',
      },
      {
        scenario: 'Editing the record in place',
        reason: 'The drawer is a read-only summary — its buttons only emit intents.',
        alternative: 'Open a dedicated form view from the menu or quick actions.',
      },
    ],
  },
  anatomy: [
    { part: 'p-drawer', role: 'Headless PrimeNG drawer; its root becomes role="dialog" + aria-modal (modal) or a complementary region through [pt], labelled by the heading' },
    { part: 'c-drawer__header', role: 'Large pds-plectrum-avatar, the profile name (h2, focus target on open), pds-copyable-text identifiers, menu + close buttons' },
    { part: 'c-drawer__toolbar', role: 'p-selectbutton Details / Documents switch and the Quick actions button' },
    { part: 'c-drawer__section / c-detail-list', role: 'General and contact rows as a dl; the contact header carries the call and email buttons' },
    { part: 'c-drawer__profile-family-tile', role: 'Related-person buttons (small coloured avatar, name, relationship) inside a p-accordion panel' },
    { part: 'c-drawer__profile-note', role: 'Note articles (author, timestamp, p-tag category, body) inside a p-accordion panel — omitted with showNotes false' },
  ],
  composition: {
    nestedComponents: ['Drawer', 'SelectButton', 'Accordion', 'Tag', 'Button', 'PlectrumAvatar', 'CopyableText'],
    companions: ['ProfileCardComponent'],
    slots: [],
  },
  behavior: {
    states: ['closed', 'open', 'view-details', 'view-documents', 'notes-hidden'],
    interactions: [
      '[(visible)] controls open / close; the close button, Escape and a mask click set it back to false',
      'viewChange reports the Details / Documents choice; Documents is host-controlled, so the control keeps Details selected until the host passes [view]="documents"',
      'Related people and Notes are PrimeNG accordion panels, open by default; Notes is omitted with [showNotes]="false"',
      'Header identifiers are pds-copyable-text chips — identifierCopy fires after a copy; menu, quick actions, call, email and related-person tiles emit their own outputs',
      'Section and action copy comes from the active locale (PDS_LOCALE); labels overrides individual keys',
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    role: 'dialog',
    ariaAttributes: [
      'With modal (default) the drawer root is role="dialog" with aria-modal="true"; with [modal]="false" it is a complementary region — both named by the profile heading through aria-labelledby (PrimeNG\'s unnamed default root is overridden through [pt])',
      'Menu (More actions), close (Close) and related-person buttons carry aria-labels; copy chips are named by pds-copyable-text (locale default "Copier {label}")',
      'The large avatar is named by the profile name; general and contact sections are aria-labelledby their h3 ids',
      'Bullet separators, dividers and decorative icons are aria-hidden',
    ],
    keyboardSupport: [
      'Focus moves onto the profile heading (tabindex -1) when the drawer opens',
      'Focus returns to the element that opened the drawer when it closes — close button, Escape, mask click or the host setting visible to false',
      'p-drawer owns the focus trap and Escape (dismissible)',
      'Accordion headers toggle with Enter / Space (PrimeNG); every action is a native button',
    ],
    contrastRequirements: [
      'Yellow related-person avatars use dark initials for contrast; blue and green use white.',
      'Sensitive note tags pair an icon with visible label text — not colour alone.',
    ],
  },
  tokens: {
    consumed: [
      '--pds-size-drawer-min-width',
      '--pds-size-drawer-max-width',
      '--pds-shadow-xl',
      '--pds-color-panel-border',
      '--pds-color-content-border',
      '--pds-size-detail-list-label-width',
      '--pds-color-profile-drawer-relationship',
      '--pds-color-profile-drawer-tile-bg',
      '--pds-radius-profile-drawer-tile',
      '--pds-color-profile-drawer-note-bg',
      '--pds-radius-profile-drawer-note',
      '--pds-color-profile-drawer-note-author',
      '--pds-color-profile-drawer-note-timestamp',
      '--pds-color-avatar-color-blue',
      '--pds-color-avatar-color-green',
      '--pds-color-avatar-color-yellow',
      '--pds-color-avatar-initials-on-yellow',
      '--pds-text-heading-lg-size',
      '--pds-text-heading-sm-size',
      '--pds-text-label-sm-size',
      '--pds-text-body-sm-size',
    ],
  },
  aiHints: {
    priority: 'high',
    context:
      'Generic single-person detail drawer. Headless p-drawer wrapper with a dialog role, focus management and locale copy. Reuses pds-plectrum-avatar (large illustrated + small coloured) and the pds-copyable-text identifier chips of ProfileCardComponent.',
    selectionCriteria: {
      'detail drawer':
        'Slide-in profile detail surface with sections and accordions',
      'overview card': 'Use pds-profile-card for the inline summary instead',
    },
    keywords: [
      'profile',
      'person',
      'drawer',
      'detail',
      'related people',
      'notes',
      'contact',
      'overlay',
    ],
  },
  props: [
    {
      name: 'data',
      type: 'ProfileDrawerData',
      required: true,
      description: 'Full profile content rendered inside the drawer.',
    },
    {
      name: 'visible',
      type: 'model<boolean>',
      required: false,
      default: 'false',
      description: 'Two-way visibility ([(visible)]) controlling open/close.',
    },
    {
      name: 'position',
      type: 'DrawerPosition',
      required: false,
      default: 'right',
      description: 'Edge the drawer slides in from.',
    },
    {
      name: 'modal',
      type: 'boolean',
      required: false,
      default: 'true',
      description: 'Whether a backdrop mask is shown behind the drawer.',
    },
    {
      name: 'view',
      type: 'ProfileDrawerView',
      required: false,
      default: 'details',
      description: 'Active segmented-control view (Détails / Documents).',
    },
    {
      name: 'showNotes',
      type: 'boolean',
      required: false,
      default: 'true',
      description: 'Whether the Notes accordion section is rendered.',
    },
    {
      name: 'labels',
      type: 'ProfileDrawerLabels',
      required: false,
      default: '{}',
      description: 'Partial copy override. Unset keys use PDS_LOCALE messages.',
    },
    {
      name: 'identifierCopy',
      type: 'output<ProfileDrawerIdentifier>',
      required: false,
      description: 'Emitted after a header identifier is copied.',
    },
    {
      name: 'viewChange',
      type: 'output<ProfileDrawerView>',
      required: false,
      description: 'Emitted when the Détails / Documents control changes.',
    },
    {
      name: 'menuClick',
      type: 'output<void>',
      required: false,
      description: 'Emitted when the header overflow menu is activated.',
    },
    {
      name: 'quickActionsClick',
      type: 'output<void>',
      required: false,
      description: 'Emitted when Quick actions is activated.',
    },
    {
      name: 'callClick',
      type: 'output<void>',
      required: false,
      description: 'Emitted when the call action is activated.',
    },
    {
      name: 'emailClick',
      type: 'output<void>',
      required: false,
      description: 'Emitted when the email action is activated.',
    },
    {
      name: 'familyMemberSelect',
      type: 'output<ProfileDrawerRelatedMember>',
      required: false,
      description: 'Emitted when a related-person tile is activated.',
    },
  ],
  examples: [],
};
