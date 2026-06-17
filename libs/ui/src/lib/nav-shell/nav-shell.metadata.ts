import type { ComponentMetadata } from '@solidaris/contracts';

export const NavShellMetadata: ComponentMetadata = {
  component: {
    name: 'NavShell',
    category: 'organisms',
    description:
      'First-level navigation shell — vertical sidebar that renders a list of icon-based nav items. Supports collapsed (icon-only) and expanded (icon + label) modes. No PrimeNG equivalent; built with semantic HTML and ARIA.',
    type: 'navigation',
    path: 'libs/ui/src/lib/nav-shell/nav-shell.component.ts',
    bemBlock: 'c-nav-shell',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.nav-shell.scss',
    created: '2025-01-01',
    modified: '2026-05-20',
  },

  usage: {
    useCases: [
      'app-wide first-level navigation',
      'collapsed sidebar — icon-only',
      'expanded sidebar — icon + label',
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
        scenario: 'Hardcoding routes inside NavShell',
        reason: 'NavShell must be app-agnostic — it lives in libs/ui',
        alternative: 'Pass items via the [items] Input()',
      },
      {
        scenario: 'Adding second-level navigation inside NavShell',
        reason: 'NavShell is first-level only; nesting nav levels breaks the design pattern',
        alternative: 'Create a separate SecondaryNav component',
      },
    ],
  },

  behavior: {
    states: ['default', 'collapsed', 'expanded', 'item-active', 'item-hover'],
  },

  props: [
    { name: 'items',        type: 'NavItem[]', required: true,  description: 'Navigation items to render' },
    { name: 'activeItemId', type: 'string',    required: false, default: 'null',  description: 'ID of the currently active nav item' },
  ],

  accessibility: {
    role: 'navigation',
    ariaAttributes: ['aria-label', 'aria-current="page"', 'aria-hidden (decorative logo)'],
    keyboardSupport: ['Tab / Shift+Tab — move between items', 'Enter / Space — activate item'],
    wcagLevel: 'AA',
  },

  tokens: {
    consumed: [
      '--sds-color-nav-shell-bg',
      '--sds-color-content-border',
      '--sds-color-nav-shell-text',
      '--sds-color-nav-shell-label',
      '--sds-color-nav-shell-item-hover',
      '--sds-color-nav-shell-item-pressed',
      '--sds-color-nav-shell-item-active',
      '--sds-size-nav-shell-footprint',
      '--sds-size-nav-shell-logomark',
      '--sds-size-nav-shell-wordmark',
      '--sds-size-nav-shell-icon',
      '--sds-size-nav-shell-trailing-icon',
      '--sds-space-nav-shell-section-gap',
      '--sds-space-nav-shell-list-gap',
      '--sds-space-nav-shell-list-px',
      '--sds-space-nav-shell-item-px',
      '--sds-space-nav-shell-item-py',
      '--sds-space-nav-shell-item-gap-inner',
      '--sds-size-nav-shell-label-max',
      '--sds-radius-nav-shell-item',
      '--sds-shadow-overlay-navigation',
      '--sds-transition-nav-shell',
      '--sds-transition-nav-reveal',
      '--sds-focus-ring-color',
      '--sds-focus-ring-width',
      '--sds-focus-ring-style',
      '--sds-focus-ring-offset',
    ],
  },

  composition: {
    nestedComponents: ['Icon'],
    companions: [],
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
      code: '<sds-nav-shell [items]="navItems" [activeItemId]="activeId" />',
    },
  ],
};
