import type { ComponentMetadata } from '@solidaris/contracts';

export const IconMetadata: ComponentMetadata = {
  component: {
    name: 'Icon',
    category: 'atoms',
    description:
      'Universal icon primitive: renders a Bootstrap Icons class (source="class") or a custom SVG registered in IconRegistry (source="svg") at one of five token-driven sizes — decorative by default, named with label.',
    type: 'display',
    path: 'libs/ui/src/lib/icon/icon.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-icon',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.icon.scss',
    figmaUrl: 'https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-',
    created: '2026-05-20',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Navigation item icons',
      'Button leading or trailing icons',
      'Status and feedback indicators',
      'Standalone labelled icons in empty states',
    ],
    commonPatterns: [
      {
        name: 'Decorative Bootstrap Icon',
        description: 'Icon is purely visual — label is on the surrounding interactive element.',
        composition: '<(pds|app|lib)-icon icon="bi bi-house" />',
      },
      {
        name: 'Accessible standalone icon',
        description: 'Icon conveys meaning on its own — provide a label for screen readers.',
        composition: '<(pds|app|lib)-icon icon="bi bi-bell" label="Notifications" />',
      },
      {
        name: 'Custom SVG from registry',
        description: 'Register once via IconRegistry.register(), then reference by key.',
        composition: '<(pds|app|lib)-icon icon="logo-solidaris" source="svg" size="lg" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Setting an explicit colour on pds-icon',
        reason: 'Icons inherit currentColor — a hard-coded colour breaks theme coherence.',
        alternative: 'Set the colour on the parent element and let the icon inherit it.',
      },
      {
        scenario: 'Omitting label when the icon is the only indicator of meaning',
        reason: 'Decorative rendering (aria-hidden) leaves the meaning inaccessible.',
        alternative: 'Pass label so the host becomes role="img" with an aria-label.',
      },
      {
        scenario: 'source="svg" without registering the key first',
        reason: 'IconRegistry.get() returns undefined, so the icon renders nothing and warns in the browser console.',
        alternative: 'Call IconRegistry.register(name, svgMarkup) in the app config or a feature provider before use.',
      },
    ],
  },
  anatomy: [
    { part: 'c-icon', role: 'Host — inline-flex box sized by the c-icon--{size} modifier' },
    { part: 'c-icon--xs … c-icon--xl', role: 'Size modifier — maps width, height and font-size to --pds-icon-size-*' },
    { part: 'i.bi', role: 'Bootstrap Icons font glyph, always aria-hidden (source="class", default)' },
    { part: 'c-icon__svg', role: 'Inline SVG from IconRegistry, filled with currentColor (source="svg")' },
  ],
  variants: {
    source: {
      options: ['class', 'svg'],
      default: 'class',
      purpose: {
        class: 'Bootstrap Icons class string, e.g. bi bi-house, rendered as a font glyph',
        svg: 'Registry key registered via IconRegistry.register(name, svg), rendered inline',
      },
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      default: 'md',
      purpose: {
        xs: 'Maps to --pds-icon-size-xs',
        sm: 'Maps to --pds-icon-size-sm',
        md: 'Maps to --pds-icon-size-md — the host default',
        lg: 'Maps to --pds-icon-size-lg',
        xl: 'Maps to --pds-icon-size-xl',
      },
    },
  },
  behavior: {
    states: ['decorative', 'labelled'],
    interactions: [
      'Colour is never set by the icon — it inherits currentColor from the surrounding text',
      'source="svg" resolves the key through IconRegistry at render time; an unregistered key renders nothing and logs a console warning in the browser',
      'Registered SVG markup must not carry width/height attributes so it scales with the size modifier',
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'Decorative (no label): the host is aria-hidden="true" — the surrounding control carries the name',
      'Standalone: pass label so the host gets role="img" and aria-label',
      'The inner Bootstrap <i> is always aria-hidden',
    ],
    keyboardSupport: [
      'Never focusable — the host carries focusable="false" and no tabindex; interaction belongs to the surrounding control',
    ],
  },
  tokens: {
    consumed: [
      '--pds-icon-size-xs',
      '--pds-icon-size-sm',
      '--pds-icon-size-md',
      '--pds-icon-size-lg',
      '--pds-icon-size-xl',
    ],
  },
  props: [
    { name: 'icon', type: 'string', required: true, description: 'Bootstrap Icons class (source=class) or IconRegistry key (source=svg).' },
    { name: 'source', type: 'IconSource', required: false, default: 'class', description: 'How icon is interpreted — class (Bootstrap Icons) or svg (registry).' },
    { name: 'size', type: 'IconSize', required: false, default: 'md', description: 'Visual size — maps to --pds-icon-size-* tokens.' },
    { name: 'label', type: 'string | undefined', required: false, default: 'undefined', description: 'Accessible name for a standalone icon. Omit for decorative (aria-hidden).' },
  ],
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
      code: '<(pds|app|lib)-icon icon="bi bi-house" size="md" />',
    },
    {
      name: 'Accessible standalone icon',
      description: 'Non-decorative use — icon is the only representation of the action.',
      code: '<(pds|app|lib)-icon icon="bi bi-bell" label="Notifications" size="md" />',
    },
    {
      name: 'Custom SVG (registry)',
      description: 'Custom branded SVG registered via IconRegistry and rendered inline.',
      code: '<(pds|app|lib)-icon icon="logo-solidaris" source="svg" size="xl" />',
    },
  ],
};
