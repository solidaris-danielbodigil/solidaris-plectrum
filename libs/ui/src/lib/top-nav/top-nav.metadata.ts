import type { ComponentMetadata } from '@solidaris/contracts';

export const TopNavMetadata: ComponentMetadata = {
  component: {
    name: 'TopNav',
    category: 'organisms',
    description:
      'Application top navigation bar that combines breadcrumb context, a sub-navigation toggle, inline search, a help action, and the custom Plectrum avatar.',
    type: 'navigation',
    path: 'libs/ui/src/lib/top-nav/top-nav.component.ts',
    primeNgComponent: 'Breadcrumb, Button, IconField, InputText',
    bemBlock: 'c-top-nav',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.top-nav.scss',
    created: '2026-06-05',
    modified: '2026-06-05',
  },
  usage: {
    useCases: [
      'Application shell top bar',
      'Breadcrumb-driven page context',
      'Inline search and utility actions in the header',
    ],
    commonPatterns: [
      {
        name: 'Default top navigation',
        description: 'Collapsed search, collapsed sub-navigation, breadcrumb context, help action, and avatar.',
        composition: '<(pds|app|lib)-top-nav [breadcrumbs]="..." avatarInitials="LV" />',
      },
      {
        name: 'Search expanded',
        description: 'The search icon expands into a PrimeNG IconField + InputText control.',
        composition: '<(pds|app|lib)-top-nav [searchExpanded]="true" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Parsing router state inside TopNav',
        reason: 'TopNav must stay presentation-first and accept breadcrumb data from the container.',
        alternative: 'Build the breadcrumb model in the app shell and pass it through [breadcrumbs].',
      },
      {
        scenario: 'Letting TopNav directly control the sub-nav component',
        reason: 'The component should emit intent, not reach across to sibling state.',
        alternative: 'Bind subNavExpandedChange in the parent and pass sub-nav state down separately.',
      },
    ],
  },
  behavior: {
    states: ['default', 'subnav-expanded', 'search-open', 'action-hover', 'action-focus-visible'],
  },
  props: [
    { name: 'breadcrumbs', type: 'MenuItem[]', required: true, description: 'Breadcrumb items rendered by PrimeNG Breadcrumb' },
    { name: 'home', type: 'MenuItem | null', required: false, default: 'null', description: 'Optional breadcrumb home item' },
    { name: 'subNavExpanded', type: 'boolean | null', required: false, default: 'null', description: 'Controlled sub-navigation open state' },
    { name: 'subNavControlsId', type: 'string | null', required: false, default: 'null', description: 'ID of the controlled sub-navigation region' },
    { name: 'searchExpanded', type: 'boolean | null', required: false, default: 'null', description: 'Controlled search open state' },
    { name: 'searchQuery', type: 'string | null', required: false, default: 'null', description: 'Controlled search query' },
    { name: 'searchPlaceholder', type: 'string', required: false, default: 'Search', description: 'Placeholder shown in the expanded search input' },
    { name: 'searchAriaLabel', type: 'string', required: false, default: 'Search', description: 'Accessible label for the search button and input' },
    { name: 'subNavToggleLabel', type: 'string', required: false, default: 'Toggle sub-navigation', description: 'Accessible label for the sub-nav button' },
    { name: 'showSubNavToggle', type: 'boolean', required: false, default: 'true', description: 'Controls whether the sub-navigation toggle button renders' },
    { name: 'helpLabel', type: 'string', required: false, default: 'Help', description: 'Accessible label for the help button' },
    { name: 'avatarInitials', type: 'string', required: true, description: 'Initials rendered by the Plectrum avatar' },
    { name: 'avatarState', type: 'PlectrumAvatarState', required: false, default: 'default', description: 'Persistent avatar state' },
    { name: 'avatarAriaLabel', type: 'string | null', required: false, default: 'null', description: 'Optional accessible label for the avatar' },
  ],
  accessibility: {
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [
      '--pds-color-content-bg',
      '--pds-color-content-border',
      '--pds-color-content-hover-bg',
      '--pds-color-text',
      '--pds-color-text-muted',
      '--pds-radius-lg',
      '--pds-size-top-nav-height',
      '--pds-space-top-nav-inline',
      '--pds-size-top-nav-action-button',
      '--pds-size-top-nav-action-icon',
      '--pds-size-top-nav-search-width',
      '--pds-transition-duration',
      '--pds-focus-ring-color',
      '--pds-focus-ring-style',
      '--pds-focus-ring-width',
      '--pds-focus-ring-offset',
      '--pds-focus-ring-shadow',
    ],
  },
  composition: {
    nestedComponents: ['Breadcrumb', 'Button', 'IconField', 'InputText', 'PlectrumAvatar'],
    companions: ['SubNavShellComponent'],
    slots: [],
  },
  aiHints: {
    priority: 'high',
    context:
      'Use this top navigation component as the header bar for app shells. Breadcrumb data is passed in, sub-navigation is controlled via input/output state, and the search field expands inline from the icon button.',
    selectionCriteria: {
      'application shell header': 'use TopNav',
      'breadcrumb + actions bar': 'use TopNav',
    },
    keywords: ['top nav', 'header', 'breadcrumb', 'search', 'subnav', 'avatar', 'navigation'],
  },
  examples: [
    {
      name: 'Default top navigation',
      description: 'Render the top nav with breadcrumb data and avatar initials.',
      code: '<(pds|app|lib)-top-nav [breadcrumbs]="breadcrumbs" avatarInitials="LV" />',
    },
  ],
};