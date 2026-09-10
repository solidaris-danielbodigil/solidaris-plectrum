import type { ComponentMetadata } from '@solidaris/contracts';

export const ProfileCardMetadata: ComponentMetadata = {
  component: {
    name: 'ProfileCard',
    category: 'molecules',
    description:
      'Horizontal profile summary card on PrimeNG Card: a large avatar, the person\'s name as heading or primary action, a severity-coloured status action, info tags and copyable identifiers. The card gradient follows statusAction.severity; the variant input is the fallback when no status action is set.',
    type: 'display',
    path: 'libs/ui/src/lib/profile-card/profile-card.component.ts',
    primeNgComponent: 'Card, Button, Badge, SelectButton, Popover, Skeleton',
    bemBlock: 'c-profile-card',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.profile-card.scss',
    figmaUrl:
      'https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=507-8227',
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
      'Single-person profile summary shown after a lookup or search',
      'Status-driven overview: severity-coloured status action, info tags and copyable identifiers',
      'Header of a detail page that offers one primary action, optionally with a keyboard shortcut',
    ],
    commonPatterns: [
      {
        name: 'Lookup result',
        description:
          'Show the person\'s identity, info tags and copyable identifiers after a successful lookup.',
        composition:
          '<(pds|app|lib)-profile-card variant="in-order" [title]="name" [avatarInitials]="initials" [infoTags]="tags" [identifiers]="ids" />',
      },
      {
        name: 'Action required',
        description:
          'Surface a non-blocking issue with a warn status action and a short code badge; the card takes the warning gradient.',
        composition:
          '<(pds|app|lib)-profile-card [statusAction]="{ label: \'Missing document\', tagValue: \'DOC\', severity: \'warn\' }" [infoTags]="tags" [identifiers]="ids" />',
      },
      {
        name: 'Several status actions',
        description:
          'With more than one menuItems entry the status action becomes a count chip that opens a listbox; statusMenuSelect reports the choice.',
        composition:
          '<(pds|app|lib)-profile-card [statusAction]="{ label: \'Actions\', severity: \'warn\', menuItems: items }" (statusMenuSelect)="onAction($event)" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Full-page form layout',
        reason: 'The card is a read-only summary container, not a form shell.',
        alternative: 'Use form-field groups inside a dedicated form card.',
      },
      {
        scenario: 'A table of many people',
        reason:
          'Identifier chips and the status action describe a single person\'s snapshot.',
        alternative: 'Use a data table for multi-row listings and open a card for the selected row.',
      },
    ],
  },
  anatomy: [
    { part: 'c-profile-card', role: 'p-card host — modifier --default / --in-order / --warning / --danger from statusAction.severity or variant; is-loading' },
    { part: 'c-profile-card__avatar', role: 'Large pds-plectrum-avatar named by the title (a circle p-skeleton while loading)' },
    { part: 'c-profile-card__title / __title-action', role: 'h2 heading, or the primary-action text button (icon, name, shortcut badge) when primaryAction is set' },
    { part: 'c-profile-card__status-action', role: 'PrimeNG button coloured by severity; p-badge for the tagValue code or the action count; p-popover listbox when menuItems > 1' },
    { part: 'c-profile-card__info-tags', role: 'p-selectbutton for filterable tags (filterKey); secondary button chips for display-only tags' },
    { part: 'c-profile-card__identifiers', role: 'pds-copyable-text chips separated by aria-hidden bullets' },
    { part: 'c-profile-card__skeleton-slot', role: 'p-skeleton placeholders for title, status, info tags and identifiers while loading' },
  ],
  variants: {
    variant: {
      options: ['default', 'in-order', 'warning', 'danger'],
      default: 'default',
      purpose: {
        default: 'Neutral summary without status emphasis',
        'in-order': 'Success gradient — everything checks out (statusAction.severity success)',
        warning: 'Warning gradient — a non-blocking action is required (statusAction.severity warn)',
        danger: 'Danger gradient — a critical issue (statusAction.severity danger)',
      },
    },
  },
  composition: {
    nestedComponents: ['Card', 'Button', 'Badge', 'SelectButton', 'Popover', 'Skeleton', 'PlectrumAvatar', 'CopyableText'],
    companions: ['ProfileDrawerComponent'],
    slots: [],
  },
  behavior: {
    states: ['default', 'in-order', 'warning', 'danger', 'loading', 'status-menu-open'],
    interactions: [
      'statusAction.severity drives the card gradient and the status button colour (success → in-order, warn → warning, danger → danger); variant is only the fallback when no status action is set',
      'The title becomes the primary-action button when primaryAction is set; primaryAction.shortcut (e.g. "ALT + A") is listened to on the document and shown as a badge',
      'A single status action emits statusActionClick; with more than one menuItems entry it opens a p-popover listbox and statusMenuSelect reports the chosen item',
      'Filterable info tags (filterKey) form one p-selectbutton group; selecting or clearing one emits infoTagClick',
      'Copying an identifier emits identifierCopy; loading disables every action and shows skeleton placeholders',
    ],
    responsive: [
      'Header, info tags and identifier rows wrap in narrow containers (o-flex wrap mixes)',
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'Loaded: the article is aria-labelledby the title (h2) or the title-action button',
      'Loading: the article carries aria-label (title) and aria-busy; skeleton placeholders are aria-hidden',
      'The title-action button is named "{title} — {primaryAction.label}" and exposes aria-keyshortcuts when a shortcut is set',
      'The status action is named by statusAction.ariaLabel, its label, or the action count; with several actions it has aria-haspopup="listbox" and aria-expanded',
      'Filterable info-tag options expose aria-pressed (p-selectbutton); display-only chips are named "{label} {value}"',
      'Copy chips are named by pds-copyable-text (locale default "Copier {label}"); bullet separators and the shortcut badge are aria-hidden',
    ],
    keyboardSupport: [
      'Tab order: title action, status action, info-tag options, copy chips — display-only chips are not focusable',
      'primaryAction.shortcut (e.g. Alt+A) triggers the primary action from anywhere on the page except editable fields',
      'Enter / Space on the status action opens the listbox when several actions exist; Enter / Space on an option selects it',
    ],
    contrastRequirements: [
      'The status button always shows visible label text or a code badge — never colour alone.',
      'Info tags pair label and value text — never colour alone.',
    ],
  },
  tokens: {
    consumed: [
      '--pds-color-profile-card-bg-default',
      '--pds-profile-card-bg-gradient-angle',
      '--pds-profile-card-bg-gradient-stop',
      '--pds-color-profile-card-bg-warning-gradient-start',
      '--pds-color-profile-card-bg-warning',
      '--pds-color-profile-card-bg-danger-gradient-start',
      '--pds-color-profile-card-bg-danger',
      '--pds-color-profile-card-bg-in-order-gradient-start',
      '--pds-color-profile-card-bg-in-order',
      '--pds-color-profile-card-info-tag-bg',
      '--pds-color-profile-card-info-tag-text',
      '--pds-color-profile-card-metadata-text',
      '--pds-color-profile-card-metadata-separator',
      '--pds-color-profile-card-shortcut-badge-bg',
      '--pds-color-profile-card-shortcut-badge-text',
      '--pds-text-profile-card-shortcut-badge-size',
      '--pds-text-profile-card-shortcut-badge-weight',
      '--pds-text-profile-card-shortcut-badge-line-height',
      '--pds-color-profile-card-skeleton-bg',
      '--pds-size-profile-card-padding',
      '--pds-space-profile-card-avatar-gap',
      '--pds-space-profile-card-header-gap',
      '--pds-space-profile-card-header-inner-gap',
      '--pds-space-profile-card-metadata-gap',
      '--pds-space-profile-card-info-tag-padding-inline',
      '--pds-space-profile-card-info-tag-padding-block',
      '--pds-space-profile-card-shortcut-badge-padding-inline',
      '--pds-space-profile-card-shortcut-badge-padding-block',
      '--pds-size-profile-card-metadata-icon',
      '--pds-color-panel-border',
      '--pds-color-orange-50',
      '--pds-color-danger-subtle',
      '--pds-color-success-subtle',
      '--pds-color-surface-0',
      '--pds-color-info-tag-text',
      '--pds-color-metadata-chip-text',
      '--pds-color-text',
      '--pds-color-text-muted',
      '--pds-color-surface-border',
      '--pds-radius-none',
      '--pds-spacing-0-25',
      '--pds-spacing-0-5',
      '--pds-spacing-1',
      '--pds-spacing-1-5',
      '--pds-spacing-2',
      '--pds-spacing-5',
      '--pds-text-heading-lg-family',
      '--pds-text-heading-lg-size',
      '--pds-text-heading-lg-weight',
      '--pds-text-heading-lg-line-height',
      '--pds-text-heading-lg-spacing',
      '--pds-text-label-sm-family',
      '--pds-text-label-sm-size',
      '--pds-text-label-sm-weight',
      '--pds-text-label-sm-line-height',
      '--pds-text-label-sm-spacing',
      '--pds-text-body-sm-family',
      '--pds-text-body-sm-size',
      '--pds-text-body-sm-weight',
      '--pds-text-body-sm-line-height',
      '--pds-text-body-sm-spacing',
    ],
  },
  aiHints: {
    priority: 'high',
    context:
      'Generic single-person summary card: horizontal layout with avatar, title / primary action, status action, info tags and copyable identifiers. Card gradient driven by statusAction.severity; the variant input is the fallback when no status action is set. Pair with ProfileDrawerComponent for the detail overlay.',
    selectionCriteria: {
      'statusAction.severity success':
        'Everything in order — in-order gradient + success button',
      'statusAction.severity warn':
        'Action required — warning gradient + warn button',
      'statusAction.severity danger':
        'Critical issue — danger gradient + danger button',
      'variant in-order (no statusAction)':
        'Success gradient via variant fallback only',
      'variant default (no statusAction)':
        'Neutral lookup result without status emphasis',
    },
    keywords: [
      'profile',
      'person',
      'summary card',
      'overview',
      'identifiers',
      'status action',
      'info tags',
    ],
  },
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Display name of the person (card heading)',
    },
    {
      name: 'avatarInitials',
      type: 'string',
      required: false,
      default: "''",
      description: 'Initials fallback for the Plectrum avatar',
    },
    {
      name: 'avatarGender',
      type: 'PlectrumAvatarGender',
      required: false,
      default: 'female',
      description: 'Illustrated avatar gender passed to pds-plectrum-avatar',
    },
    {
      name: 'avatarVariant',
      type: 'PlectrumAvatarVariant',
      required: false,
      default: '1',
      description: 'Illustrated avatar variant passed to pds-plectrum-avatar',
    },
    {
      name: 'variant',
      type: 'ProfileCardVariant',
      required: false,
      default: 'default',
      description: 'Fallback card treatment when statusAction is absent',
    },
    {
      name: 'statusAction',
      type: 'ProfileCardStatusAction | null',
      required: false,
      default: 'null',
      description:
        'Outlined status button config. severity (success | warn | danger) drives card gradient when set.',
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Skeleton placeholder with large avatar and disabled actions.',
    },
    {
      name: 'infoTags',
      type: 'ProfileCardInfoTag[]',
      required: false,
      default: '[]',
      description:
        'Header info tags. Filterable tags render as a select-button group; others as chips.',
    },
    {
      name: 'identifiers',
      type: 'ProfileCardIdentifier[]',
      required: false,
      default: '[]',
      description: 'Copyable identifier chips in the metadata row.',
    },
    {
      name: 'primaryAction',
      type: 'ProfileCardPrimaryAction | null',
      required: false,
      default: 'null',
      description:
        'Secondary header button with optional keyboard shortcut badge.',
    },
    {
      name: 'primaryActionClick',
      type: 'output<void>',
      required: false,
      description: 'Emitted when the primary action is activated.',
    },
    {
      name: 'statusActionClick',
      type: 'output<void>',
      required: false,
      description: 'Emitted when the status action is activated.',
    },
    {
      name: 'infoTagClick',
      type: 'output<ProfileCardInfoTag>',
      required: false,
      description: 'Emitted when a display-only info tag is activated.',
    },
    {
      name: 'identifierCopy',
      type: 'output<ProfileCardIdentifier>',
      required: false,
      description: 'Emitted after an identifier is copied.',
    },
    {
      name: 'statusMenuSelect',
      type: 'output<MenuItem>',
      required: false,
      description: 'Emitted when a status overflow menu item is chosen.',
    },
  ],
  examples: [],
};
