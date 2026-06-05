import type { ComponentMetadata } from '@solidaris/contracts';

export const IconMetadata: ComponentMetadata = {
  component: {
    name: 'Icon',
    category: 'atoms',
    description:
      'Universal icon primitive. Renders Bootstrap Icons via CSS class or custom SVG via IconRegistry.',
    type: 'display',
    path: 'libs/ui/src/lib/icon/icon.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-icon',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.icon.scss',
    created: '2026-05-20',
    modified: '2026-05-20',
  },
  usage: {
    useCases: [
      'Navigation item icons',
      'Button leading/trailing icons',
      'Status/feedback indicators',
      'Standalone labelled icons in empty states',
    ],
    commonPatterns: [
      {
        name: 'Decorative Bootstrap Icon',
        description: 'Icon is purely visual — label is on the surrounding interactive element.',
        composition: '<sds-icon icon="bi bi-house" />',
      },
      {
        name: 'Accessible standalone icon',
        description: 'Icon conveys meaning on its own — provide a label for screen readers.',
        composition: '<sds-icon icon="bi bi-bell" label="Notifications" />',
      },
      {
        name: 'Custom SVG from registry',
        description: 'Register once via IconRegistry.register(), then reference by key.',
        composition: '<sds-icon icon="logo-solidaris" source="svg" size="lg" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Setting an explicit color on sds-icon',
        reason: 'Icons inherit currentColor — overriding breaks theme coherence.',
        alternative: 'Set the color on the parent element and let it inherit.',
      },
      {
        scenario: 'Omitting label when the icon is the only indicator of meaning',
        reason: 'Decorative-only rendering (aria-hidden) leaves the content inaccessible.',
        alternative: 'Add [label]="description" to make the icon role="img" with aria-label.',
      },
      {
        scenario: 'Using source="svg" without registering the icon first',
        reason: 'IconRegistry.get() returns undefined — the icon renders nothing.',
        alternative: 'Call IconRegistry.register(name, svgMarkup) in the app config or feature provider.',
      },
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: ['aria-hidden="true" (decorative)', 'role="img" + aria-label (standalone)'],
  },
  tokens: {
    consumed: [
      '--sds-icon-size-xs',
      '--sds-icon-size-sm',
      '--sds-icon-size-md',
      '--sds-icon-size-lg',
      '--sds-icon-size-xl',
    ],
  },
  aiHints: {
    priority: 'high',
    context: 'Used everywhere icons appear — nav, buttons, status chips, empty states.',
    selectionCriteria: {
      'Bootstrap Icon': 'source="class" (default)',
      'Custom/branded SVG': 'source="svg" — register first via IconRegistry',
    },
    keywords: ['icon', 'glyph', 'svg', 'bootstrap icons', 'bi', 'pictogram'],
  },
  examples: [
    {
      name: 'Decorative nav icon',
      description: 'Used inside a nav item where the <a> carries the accessible label.',
      code: '<sds-icon icon="bi bi-house" size="md" />',
    },
    {
      name: 'Accessible standalone icon',
      description: 'Non-decorative use — icon is the only representation of the action.',
      code: '<sds-icon icon="bi bi-bell" label="Notifications" size="md" />',
    },
    {
      name: 'Custom SVG (registry)',
      description: 'Custom branded SVG registered via IconRegistry and rendered inline.',
      code: '<sds-icon icon="logo-solidaris" source="svg" size="xl" />',
    },
  ],
};
