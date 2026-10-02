import type { ComponentMetadata } from '@solidaris/contracts';

export const ProfileHeaderMetadata: ComponentMetadata = {
  component: {
    id: 'plectrum:profile-header',
    name: 'ProfileHeader',
    category: 'organisms',
    description:
      'Shell header for one person on PrimeNG Card: a large avatar, the name as an outlined primary Button that opens the profile, a severity-coloured status action (Button, or SplitButton when several actions wait), quick-filter tags and copyable identifiers. Slots take the application\'s own actions, an aside panel and the shell tabs. The background gradient follows statusAction.severity; variant is the fallback. Replaces Profile Card.',
    type: 'display',
    path: 'libs/ui/src/lib/profile-header/profile-header.component.ts',
    primeNgComponent: 'Card, Button, SplitButton, Badge, ToggleButton, Tag, Tooltip, Skeleton',
    bemBlock: 'c-profile-header',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.profile-header.scss',
    figmaUrl:
      'https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=2438-10587',
    created: '2026-10-02',
    modified: '2026-10-02',
  },
  distribution: {
    kind: 'angular',
    entryPoint: '.',
    exportName: 'ProfileHeaderComponent',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Header of a person-centred page in the application shell, under the top navigation',
      'Status-driven overview: the severity of the status action colours the header and names what needs doing',
      'Quick filters (info tags) and copyable identifiers that every view of the dossier shares',
      'One place for the application\'s own page actions, an aside summary and the shell tabs, through slots',
    ],
    commonPatterns: [
      {
        name: 'Person dossier header',
        description:
          'Name opens the profile drawer, with a keyboard shortcut; quick filters and identifiers below.',
        composition:
          '<(pds|app|lib)-profile-header [title]="name" [avatarInitials]="initials" [primaryAction]="{ label: \'Voir carte affilié\', shortcut: \'ALT + A\' }" [infoTags]="tags" [identifiers]="ids" (primaryActionClick)="openDrawer()" (infoTagClick)="toggleFilter($event)" />',
      },
      {
        name: 'Several status actions',
        description:
          'With more than one menuItems entry the status action is a SplitButton; both halves open the menu and statusMenuSelect reports the choice.',
        composition:
          '<(pds|app|lib)-profile-header [title]="name" [statusAction]="{ label: \'Actions à réaliser\', severity: \'warn\', menuItems: items }" (statusMenuSelect)="onAction($event)" />',
      },
      {
        name: 'Shell slots',
        description:
          'Project the page actions, an aside panel and the shell tabs; the header lays them out per Figma and owns no logic for them.',
        composition: `<(pds|app|lib)-profile-header [title]="name">
  <div slot="actions" class="o-flex o-flex--align-items-center o-layout o-layout--gap-2">…icon buttons…</div>
  <div slot="actions" class="o-flex o-flex--align-items-center o-layout o-layout--gap-2">…buttons…</div>
  <p-panel slot="aside">…</p-panel>
  <p-tabs slot="nav" [value]="tab">…</p-tabs>
  <p-selectbutton slot="nav-end" [options]="views" />
</(pds|app|lib)-profile-header>`,
      },
    ],
    antiPatterns: [
      {
        scenario: 'A list or table of several people',
        reason:
          'The header describes one person\'s dossier; repeating it per row duplicates the shortcut and the landmark.',
        alternative:
          'Use a data table or pds-list, and show the header for the selected person.',
      },
      {
        scenario: 'Putting tabs or page logic inside the header',
        reason:
          'Navigation and actions belong to the shell or the page; the header only lays out what is projected.',
        alternative:
          'Project p-tabs into [slot=nav] and the page buttons into [slot=actions], wired by the application.',
      },
      {
        scenario: 'Starting new work on pds-profile-card',
        reason: 'Profile Card is deprecated and is removed in the next major.',
        alternative:
          'Use pds-profile-header — same inputs and outputs, ProfileCard* types renamed ProfileHeader*.',
      },
    ],
  },
  anatomy: [
    {
      part: 'c-profile-header',
      role: 'Host — modifier --default / --in-order / --warning / --danger from statusAction.severity or variant; is-loading. Wraps a p-card (c-profile-header__card) whose background carries the gradient. The Card bridges sit on that p-card only and are restored for slot content. Bottom edge: Figma has no stroke; a content/border line (u-border-bottom) closes the header without tabs and is dropped when [slot=nav] has content (the tablist border replaces it)',
    },
    {
      part: 'c-profile-header__avatar',
      role: 'Large pds-plectrum-avatar, decorative ([focusable]="false" — aria-hidden, no tab stop; the h2 already names the person). A circle p-skeleton while loading',
    },
    {
      part: 'c-profile-header__name',
      role: 'h2 holding the outlined primary Button — name in Heading md and the bi-person-square icon on the right; plain heading text without primaryAction',
    },
    {
      part: 'c-profile-header__status-action',
      role: 'Button coloured by severity with icon, label and a contrast count Badge; a SplitButton with a bi-chevron-down toggle when menuItems has more than one entry. With exactly one menuItems entry the plain Button stands for that item (runs its command, emits statusMenuSelect)',
    },
    {
      part: 'c-profile-header__info-tags',
      role: 'role="group" of quick filters — filterable tags (filterKey) are PrimeNG ToggleButtons (size small, "{label} {value}" content, bi-check-lg when pressed); display-only tags are plain secondary PrimeNG Tags',
    },
    {
      part: 'c-profile-header__actions',
      role: '[slot=actions] — end of the top bar, 48px between projected groups',
    },
    {
      part: 'c-profile-header__identifiers',
      role: 'pds-copyable-text chips (iconPosition end, labelWeight regular, iconSize md) separated by aria-hidden c-profile-header__identifier-separator bullets. Regular label + Bold value is a product decision (not the Figma inplace typography); the Figma 16px copy icon maps to iconSize md on the 14px root',
    },
    {
      part: 'c-profile-header__aside',
      role: '[slot=aside] — end of the identifier row (e.g. an amount panel)',
    },
    {
      part: 'c-profile-header__nav-row',
      role: '[slot=nav] full-bleed shell tabs and [slot=nav-end] view switch; hidden when both are empty',
    },
    {
      part: 'c-profile-header__skeleton-slot',
      role: 'p-skeleton placeholders for the name, status, tags and identifiers while loading',
    },
  ],
  variants: {
    variant: {
      options: ['default', 'in-order', 'warning', 'danger'],
      default: 'default',
      purpose: {
        default: 'Neutral header without status emphasis',
        'in-order':
          'Success gradient — everything checks out (statusAction.severity success)',
        warning:
          'Warning gradient — a non-blocking action is required (statusAction.severity warn)',
        danger:
          'Danger gradient — a critical issue (statusAction.severity danger)',
      },
    },
  },
  composition: {
    nestedComponents: [
      'Card',
      'Button',
      'SplitButton',
      'Badge',
      'ToggleButton',
      'Tag',
      'Tooltip',
      'Skeleton',
      'PlectrumAvatar',
      'CopyableText',
    ],
    companions: ['ProfileDrawerComponent', 'TopNavComponent'],
    parentConstraints: [
      'Shell content column under pds-top-nav, full width — one header per page',
    ],
    slots: [
      {
        name: '[slot=actions]',
        description:
          'End of the top bar. Each projected element is a group; groups sit 48px apart (Figma icon actions, action buttons, kebab).',
        allowedComponents: ['Button', 'OverlayBadge', 'Menu'],
      },
      {
        name: '[slot=aside]',
        description:
          'End of the identifier row, right-aligned (Figma A-valoir panel). A projected Card keeps the theme look — the header Card bridges do not reach it.',
        allowedComponents: ['Panel', 'Card'],
      },
      {
        name: '[slot=nav]',
        description:
          'Full-bleed bottom row for the shell tabs (third-level navigation). The shell owns the tabs and their routing.',
        allowedComponents: ['Tabs'],
      },
      {
        name: '[slot=nav-end]',
        description:
          'End of the nav row, bottom-aligned with the tabs (Figma view select button).',
        allowedComponents: ['SelectButton'],
      },
    ],
  },
  behavior: {
    states: [
      'default',
      'in-order',
      'warning',
      'danger',
      'loading',
      'status-menu-open',
      'info-tag-pressed',
    ],
    interactions: [
      'statusAction.severity drives the gradient, the button severity and the default icon (success → in-order + check-lg, warn → warning + exclamation-triangle, danger → danger + exclamation-octagon); variant is only the fallback',
      'The name Button emits primaryActionClick; primaryAction.shortcut (e.g. "ALT + A") is listened to on the document, outside editable fields, and shown in the tooltip',
      'A single status action emits statusActionClick; with exactly one menuItems entry the plain Button runs that item (command + statusMenuSelect, no statusActionClick); with more than one entry both the main button and the chevron open the SplitButton menu and statusMenuSelect reports the chosen (enabled) item',
      'When the status menu closes (Escape, an item chosen, Tab) focus returns to the half that opened it, unless the item command moved focus elsewhere',
      'A filterable info tag is a PrimeNG ToggleButton: it toggles its pressed state (one at a time — pressing the pressed one clears it) and emits infoTagClick; display-only tags are not interactive',
      'Copying an identifier emits identifierCopy; loading shows skeletons in place of the person content, keeps the slots and suspends the shortcut',
    ],
    responsive: [
      'The top bar, the primary info, the tags and the identifier row wrap in narrow containers (o-flex--wrap)',
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'Loaded: the article is aria-labelledby the h2 that holds the name (or the name button)',
      'Loading: the article carries aria-label (title) and aria-busy; skeleton placeholders are aria-hidden',
      'The name Button is named "{title} — {primaryAction.label}" and exposes aria-keyshortcuts when a shortcut is set; its tooltip repeats the action and shortcut',
      'Label in name (WCAG 2.5.3): a single status action is named by its visible text — "Actions à réaliser: {tagValue} — {label}" with tagValue, else {label}; the SplitButton main button is "Actions à réaliser ({count})" (NL "Uit te voeren acties ({count})"). statusAction.ariaLabel overrides and must start with the visible text',
      'The SplitButton main button opens the menu too, so it carries aria-haspopup="menu" and aria-expanded (PrimeNG pt pcButton.root); the chevron has aria-haspopup, aria-expanded and "Afficher le menu pour {label}"',
      'Info tags sit in a role="group" named "Filtres rapides"; filterable tags are PrimeNG ToggleButtons (role="button", aria-pressed) named by the visible "{label} {value}" text',
      'The avatar is aria-hidden (no tab stop) — the name is announced once, by the h2',
      'Copy chips are named by pds-copyable-text ("Copier {label}"); icons, the pressed check and bullet separators are aria-hidden',
    ],
    keyboardSupport: [
      'Tab order: name button, status action (main, then chevron), filterable tags, projected actions, copy chips, aside, nav — the avatar is not a tab stop',
      'primaryAction.shortcut (e.g. Alt+A) activates the name button from anywhere on the page except editable fields',
      'Enter / Space on the status main button or chevron opens the menu; arrows move, Enter selects, Escape closes (PrimeNG TieredMenu) and focus returns to the button that opened it',
      'Enter / Space on a filterable tag (ToggleButton) toggles it',
    ],
    contrastRequirements: [
      'The status action always shows a text label, or a code / count badge — never colour alone.',
      'The pressed quick filter is not colour alone (WCAG 1.4.1): the Plectrum ToggleButton checked and unchecked backgrounds measure 1.38:1, so the pressed toggle also shows a bi-check-lg icon; aria-pressed carries the state; label and value stay visible in both states. Pressed style pending design confirmation — .ai/questions/profile-header-pressed-filter.md.',
    ],
  },
  tokens: {
    consumed: [
      '--pds-color-profile-header-bg-default',
      '--pds-color-profile-header-bg-gradient-end',
      '--pds-color-profile-header-bg-in-order',
      '--pds-color-profile-header-bg-in-order-gradient-start',
      '--pds-color-profile-header-bg-warning',
      '--pds-color-profile-header-bg-warning-gradient-start',
      '--pds-color-profile-header-bg-danger',
      '--pds-color-profile-header-bg-danger-gradient-start',
      '--pds-size-profile-header-bg-gradient-angle',
      '--pds-size-profile-header-bg-gradient-stop',
      '--pds-space-profile-header-padding-block-start',
      '--pds-space-profile-header-padding-inline',
      '--pds-size-profile-header-top-bar-min-h',
      '--pds-space-profile-header-name-padding-block',
      '--pds-space-profile-header-info-tag-padding-block',
      '--pds-space-profile-header-info-tag-padding-inline',
      '--pds-space-profile-header-identifier-padding-inline',
      '--pds-space-profile-header-identifier-padding-block',
      '--pds-size-profile-header-skeleton-name-w',
      '--pds-size-profile-header-skeleton-name-h',
      '--pds-size-profile-header-skeleton-status-w',
      '--pds-size-profile-header-skeleton-status-h',
      '--pds-size-profile-header-skeleton-info-tags-w',
      '--pds-size-profile-header-skeleton-info-tags-h',
      '--pds-size-profile-header-skeleton-identifier-h',
      '--pds-size-profile-header-skeleton-identifier-w-1',
      '--pds-size-profile-header-skeleton-identifier-w-2',
      '--pds-size-profile-header-skeleton-identifier-w-3',
      '--pds-size-profile-header-skeleton-identifier-w-4',
      '--pds-color-profile-header-theme-card-bg',
      '--pds-space-profile-header-theme-card-body-padding',
      '--pds-radius-profile-header-theme-card',
      '--pds-shadow-profile-header-theme-card',
      '--pds-space-profile-header-theme-tabpanel-padding',
      '--pds-size-avatar-large-h',
      '--pds-base-unit',
      '--pds-color-content-bg',
      '--pds-color-content-border',
      '--pds-border-width-default',
      '--pds-color-success-subtle',
      '--pds-color-orange-50',
      '--pds-color-danger-subtle',
      '--pds-color-text',
      '--pds-color-text-muted',
      '--pds-radius-none',
      '--pds-radius-md',
      '--pds-radius-lg',
      '--pds-radius-pill',
      '--pds-spacing-0-5',
      '--pds-spacing-0-75',
      '--pds-spacing-1',
      '--pds-spacing-1-5',
      '--pds-spacing-2',
      '--pds-text-heading-md-family',
      '--pds-text-heading-md-size',
      '--pds-text-heading-md-weight',
      '--pds-text-heading-md-line-height',
      '--pds-text-heading-md-spacing',
      '--pds-text-label-sm-size',
      '--pds-text-label-sm-weight',
      '--pds-font-weight-regular',
      '--pds-font-weight-semibold',
      '--pds-font-weight-bold',
      '--pds-focus-ring-width',
      '--pds-focus-ring-style',
      '--pds-focus-ring-color',
      '--pds-focus-ring-offset',
    ],
    primeNgMappings: {
      '--p-card-body-padding': '--pds-space-profile-header-padding-block-start (top only)',
      '--p-card-background': '--pds-color-profile-header-bg-{default|in-order|warning|danger} (header p-card only; slot content gets the theme value back)',
      '--p-card-border-radius': '--pds-radius-none',
      '--p-card-shadow': 'none',
      '--p-button-padding-y': '--pds-space-profile-header-name-padding-block (name button)',
      '--p-badge-border-radius': '--pds-radius-pill (status count badge)',
      '--p-tag-font-size': '--pds-text-label-sm-size (info tags)',
      '--p-tag-font-weight': '--pds-text-label-sm-weight (info tags)',
      '--p-tag-padding': '--pds-space-profile-header-info-tag-padding-{block|inline}',
      '--p-tag-border-radius': '--pds-radius-md (info tags)',
      '--p-tabs-tabpanel-padding': '0 (tab panels kept inside [slot=nav]; panel content gets the theme value back)',
      '--p-button-sm-padding-x': '--pds-space-profile-header-identifier-padding-inline (identifier chips)',
      '--p-button-sm-padding-y': '--pds-space-profile-header-identifier-padding-block (identifier chips)',
      '--p-button-rounded-border-radius': '--pds-radius-md (identifier chips)',
    },
  },
  aiHints: {
    priority: 'high',
    context:
      'Core shell header for a single person (replaces the deprecated pds-profile-card; inputs and outputs keep their names, ProfileCard* types become ProfileHeader*). Name = outlined primary Button opening the profile drawer, with an optional document shortcut. Status = Button or SplitButton (menuItems > 1) whose severity also colours the header. Info tags = quick filters (filterKey → PrimeNG ToggleButton) or display-only Tags. Identifiers = pds-copyable-text chips. Everything else — page actions, aside panels, tabs, view switch — is projected through the actions / aside / nav / nav-end slots and stays application logic. Pair with ProfileDrawerComponent.',
    selectionCriteria: {
      'statusAction.severity success':
        'Everything in order — in-order gradient, success button, check icon',
      'statusAction.severity warn':
        'Action required — warning gradient, warn button, triangle icon',
      'statusAction.severity danger':
        'Critical issue — danger gradient, danger button, octagon icon',
      'statusAction.menuItems > 1':
        'Several actions — SplitButton whose menu lists them; listen to statusMenuSelect',
      'statusAction.menuItems = 1':
        'One action — plain Button that runs the item (command + statusMenuSelect)',
      'variant (no statusAction)': 'Gradient fallback without a status button',
      'pds-profile-card in existing code':
        'Migrate to pds-profile-header (same API, renamed types)',
    },
    keywords: [
      'profile header',
      'profile',
      'person',
      'dossier',
      'shell header',
      'identifiers',
      'status action',
      'split button',
      'quick filters',
      'info tags',
    ],
  },
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Display name of the person (name button text or heading).',
    },
    {
      name: 'avatarInitials',
      type: 'string',
      required: false,
      default: "''",
      description: 'Initials fallback for the Plectrum avatar.',
    },
    {
      name: 'avatarGender',
      type: 'PlectrumAvatarGender',
      required: false,
      default: 'female',
      description: 'Illustrated avatar gender passed to pds-plectrum-avatar.',
    },
    {
      name: 'avatarVariant',
      type: 'PlectrumAvatarVariant',
      required: false,
      default: '1',
      description: 'Illustrated avatar variant passed to pds-plectrum-avatar.',
    },
    {
      name: 'variant',
      type: 'ProfileHeaderVariant',
      required: false,
      default: 'default',
      description: 'Background fallback when statusAction has no severity.',
    },
    {
      name: 'statusAction',
      type: 'ProfileHeaderStatusAction | null',
      required: false,
      default: 'null',
      description:
        'Status button config. severity (success | warn | danger) drives the gradient and icon; menuItems > 1 renders a SplitButton, a single entry is run by the plain Button.',
    },
    {
      name: 'infoTags',
      type: 'ProfileHeaderInfoTag[]',
      required: false,
      default: '[]',
      description:
        'Quick-filter tags. Tags with filterKey are PrimeNG ToggleButtons; others are display-only Tags.',
    },
    {
      name: 'identifiers',
      type: 'ProfileHeaderIdentifier[]',
      required: false,
      default: '[]',
      description: 'Copyable identifier chips in the bottom row.',
    },
    {
      name: 'primaryAction',
      type: 'ProfileHeaderPrimaryAction | null',
      required: false,
      default: 'null',
      description:
        'Turns the name into an outlined Button (label, icon, optional keyboard shortcut).',
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Skeleton placeholders for the person content; the shortcut is suspended.',
    },
    {
      name: 'primaryActionClick',
      type: 'output<void>',
      required: false,
      description: 'Emitted when the name button or its shortcut is activated.',
    },
    {
      name: 'statusActionClick',
      type: 'output<void>',
      required: false,
      description:
        'Emitted when a single status action without menuItems is activated.',
    },
    {
      name: 'infoTagClick',
      type: 'output<ProfileHeaderInfoTag>',
      required: false,
      description: 'Emitted with the filterable tag that was toggled.',
    },
    {
      name: 'identifierCopy',
      type: 'output<ProfileHeaderIdentifier>',
      required: false,
      description: 'Emitted after an identifier is copied.',
    },
    {
      name: 'statusMenuSelect',
      type: 'output<MenuItem>',
      required: false,
      description: 'Emitted with the enabled status menu item that was chosen (or the only item, run by the plain Button).',
    },
  ],
  examples: [
    {
      name: 'Dossier header',
      description:
        'Warning status, quick filters, identifiers and the shell tabs projected into the nav slot.',
      code: `<pds-profile-header
  [title]="name"
  avatarInitials="EM"
  [statusAction]="{ label: 'C4 non reçu', tagValue: 'C4', severity: 'warn' }"
  [primaryAction]="{ label: 'Voir carte affilié', shortcut: 'ALT + A' }"
  [infoTags]="tags"
  [identifiers]="ids"
  (primaryActionClick)="openDrawer()"
  (infoTagClick)="toggleFilter($event)"
>
  <p-tabs slot="nav" [value]="tab">…</p-tabs>
</pds-profile-header>`,
    },
  ],
};
