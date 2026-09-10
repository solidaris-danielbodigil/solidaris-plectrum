import type { ComponentMetadata } from '@solidaris/contracts';

export const NavShellMetadata: ComponentMetadata = {
  component: {
    name: 'NavShell',
    category: 'organisms',
    description:
      'First-level navigation shell — a vertical sidebar of icon-based items that stays collapsed (icon-only) and expands to icon + label on hover or keyboard focus, overlaying the content instead of pushing it. No PrimeNG equivalent; a semantic list with ARIA.',
    type: 'navigation',
    path: 'libs/ui/src/lib/nav-shell/nav-shell.component.ts',
    bemBlock: 'c-nav-shell',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.nav-shell.scss',
    figmaUrl: 'https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=1-1433',
    created: '2025-01-01',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },

  usage: {
    useCases: [
      'App-wide first-level navigation',
      'Collapsed icon-only sidebar that expands on hover or keyboard focus',
      'Ecosystem app switcher — the apps are passed as generic [items]',
    ],
    commonPatterns: [
      {
        name: 'Bootstrap Icons nav item',
        description: 'Standard nav item using a Bootstrap Icons class string.',
        composition: '{ id: "home", label: "Home", icon: "bi bi-house" }',
      },
      {
        name: 'Custom SVG nav item',
        description: 'Nav item whose icon comes from the IconRegistry (custom branded SVG).',
        composition: '{ id: "logo", label: "Brand", icon: "logo-solidaris", iconSource: "svg" }',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Hardcoding routes inside Nav Shell',
        reason: 'Nav Shell is app-agnostic — it lives in libs/ui and renders whatever items it is given.',
        alternative: 'Pass the items from the app through [items] and react to itemClicked.',
      },
      {
        scenario: 'Second-level navigation inside this shell',
        reason: 'Nav Shell is first-level only; nesting levels breaks the two-level shell pattern.',
        alternative: 'Pair it with Sub Nav Shell for the second level.',
      },
    ],
  },

  anatomy: [
    { part: 'c-nav-shell__panel', role: 'Overlay panel — absolutely positioned so expansion overlays the content, no flow push' },
    { part: 'c-nav-shell__logo', role: 'Decorative logomark + wordmark (aria-hidden); the wordmark is revealed with the labels' },
    { part: 'c-nav-shell__list', role: 'Semantic list of nav items' },
    { part: 'c-nav-shell__link', role: 'Item link — is-active + aria-current="page", named by the item label' },
    { part: 'c-nav-shell__icon / __label', role: 'Decorative pds-icon + visible label (label hidden when collapsed)' },
    { part: 'c-nav-shell__trailing-icon', role: 'External-link pds-icon for items with trailingIcon — expanded mode only' },
  ],

  behavior: {
    states: ['collapsed', 'expanded', 'item-hover', 'item-active', 'item-focus-visible', 'empty'],
    interactions: [
      'Collapsed by default: icon-only, the width follows the icon column + padding',
      'Expands on :hover / :focus-within (CSS only): labels and wordmark fade in through a discrete display transition and the panel grows to its widest item, overlaying the content',
      'activeItemId marks the current item (is-active + aria-current="page"); when it is null the highlight falls back to the first item and follows clicks locally',
      'itemClicked emits the NavItem; routing is left to the routerLink on the item',
    ],
  },

  props: [
    { name: 'items', type: 'NavItem[]', required: false, default: '[]', description: 'Primary navigation items to render.' },
    { name: 'activeItemId', type: 'string | null', required: false, default: 'null', description: 'ID of the currently active nav item. When null, no item is marked current.' },
    { name: 'itemClicked', type: 'output<NavItem>', required: false, description: 'Emitted when a nav item is activated.' },
  ],

  accessibility: {
    role: 'navigation',
    ariaAttributes: [
      'The host is a navigation landmark (role="navigation", aria-label="Primary navigation")',
      'Each link takes its accessible name from the item label (aria-label); the pds-icon is decorative',
      'The active item carries aria-current="page"',
      'The logo (logomark + wordmark) is aria-hidden — it is not a link',
    ],
    keyboardSupport: [
      'Tab / Shift+Tab move between links — an item needs a routerLink to be focusable',
      'Focus inside the shell expands it (:focus-within), so keyboard users see the labels',
      'Enter activates the focused link',
    ],
    wcagLevel: 'AA',
  },

  tokens: {
    consumed: [
      '--pds-color-nav-shell-bg',
      '--pds-color-content-border',
      '--pds-color-nav-shell-text',
      '--pds-color-nav-shell-label',
      '--pds-color-nav-shell-item-hover',
      '--pds-color-nav-shell-item-pressed',
      '--pds-color-nav-shell-item-active',
      '--pds-size-nav-shell-footprint',
      '--pds-size-nav-shell-logomark',
      '--pds-size-nav-shell-wordmark',
      '--pds-size-nav-shell-icon',
      '--pds-size-nav-shell-trailing-icon',
      '--pds-space-nav-shell-section-gap',
      '--pds-space-nav-shell-list-gap',
      '--pds-space-nav-shell-list-px',
      '--pds-space-nav-shell-item-px',
      '--pds-space-nav-shell-item-py',
      '--pds-space-nav-shell-item-gap-inner',
      '--pds-size-nav-shell-label-max',
      '--pds-radius-nav-shell-item',
      '--pds-shadow-overlay-navigation',
      '--pds-transition-nav-shell',
      '--pds-transition-nav-reveal',
      '--pds-focus-ring-color',
      '--pds-focus-ring-width',
      '--pds-focus-ring-style',
      '--pds-focus-ring-offset',
    ],
  },

  composition: {
    nestedComponents: ['Icon'],
    companions: ['SubNavShellComponent', 'TopNavComponent'],
    slots: [],
  },

  aiHints: {
    priority: 'high',
    context:
      'First-level nav sidebar used across all Solidaris apps. Collapsed by default (icon-only). ' +
      'Expands on hover / focus-within (CSS only) — slides over content, no document-flow push. ' +
      'Figma: https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=1-1433',
    selectionCriteria: {
      'first-level navigation': 'use NavShell',
      'icon-only sidebar': 'use NavShell collapsed state',
      'app switcher / ecosystem nav': 'use NavShell with appropriate items',
    },
    keywords: ['navigation', 'sidebar', 'nav-shell', 'collapsed', 'expanded', 'first-level'],
  },

  examples: [
    {
      name: 'Basic usage',
      description: 'Render NavShell with a list of nav items',
      code: '<(pds|app|lib)-nav-shell [items]="navItems" [activeItemId]="activeId" />',
    },
  ],
};
