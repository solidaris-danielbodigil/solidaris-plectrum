import type { ComponentMetadata } from '@solidaris/contracts';

export const InputClearMetadata: ComponentMetadata = {
  component: {
    name: 'InputClear',
    category: 'atoms',
    description:
      'Clear affordance for pInputText fields inside p-iconfield: a button that reuses the PrimeNG times SVG — the same 14×14 asset as showClear on autocomplete, select and multiselect — and emits clear when activated.',
    type: 'input',
    path: 'libs/ui/src/lib/input-clear/input-clear.component.ts',
    primeNgComponent: 'IconField / InputIcon',
    bemBlock: 'c-input-clear',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.input-clear.scss',
    figmaUrl:
      'https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-',
    created: '2026-06-07',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Clearable pInputText fields',
      'Search inputs with an inline clear, with or without a leading search icon',
      'Query fields inside p-inputgroup and toolbar filters',
    ],
    commonPatterns: [
      {
        name: 'Clearable icon field',
        description:
          'Wrap the input in p-iconfield, place pds-input-clear inside p-inputicon after the input.',
        composition: `<p-iconfield>
  <input pInputText type="text" role="searchbox" autocomplete="off" [(ngModel)]="value" />
  <p-inputicon>
    <(pds|app|lib)-input-clear [visible]="!!value" ariaLabel="Clear" (clear)="value = ''" />
  </p-inputicon>
</p-iconfield>`,
      },
      {
        name: 'Search field with leading icon',
        description:
          'Leading search icon in the first p-inputicon; pds-input-clear in a second p-inputicon after the input. Never use type="search".',
        composition: `<p-iconfield>
  <p-inputicon><i class="bi bi-search" aria-hidden="true"></i></p-inputicon>
  <input pInputText type="text" role="searchbox" autocomplete="off" [(ngModel)]="query" />
  <p-inputicon>
    <(pds|app|lib)-input-clear [visible]="!!query" ariaLabel="Clear search" (clear)="query = ''" />
  </p-inputicon>
</p-iconfield>`,
      },
      {
        name: 'Clearable input group',
        description:
          'Use the same pattern as the first child of p-inputgroup when a trailing button is required.',
        composition: `<p-inputgroup>
  <p-iconfield>
    <input pInputText type="text" [(ngModel)]="value" />
    <p-inputicon>
      <(pds|app|lib)-input-clear [visible]="!!value" (clear)="value = ''" />
    </p-inputicon>
  </p-iconfield>
  <button pButton type="submit" label="Search" />
</p-inputgroup>`,
      },
    ],
    antiPatterns: [
      {
        scenario: 'Bootstrap bi-x-lg inside p-inputicon',
        reason:
          'Font glyph metrics differ from the PrimeNG showClear SVG, so the clear looks different from native PrimeNG clears.',
        alternative:
          'Use pds-input-clear — the same 14×14 PrimeNG times asset.',
      },
      {
        scenario: 'type="search" on the input',
        reason:
          'Browsers draw their own clear control next to the PrimeNG one.',
        alternative:
          'Use type="text" with role="searchbox" and pds-input-clear only.',
      },
      {
        scenario: 'pds-input-clear on autocomplete, select or multiselect',
        reason:
          'Those PrimeNG components ship a native clear with the same icon.',
        alternative: 'Enable showClear on the PrimeNG component instead.',
      },
      {
        scenario: 'Clearable pInputText without any clear control',
        reason:
          'Users get no affordance to reset the field, or a browser-native one that differs per browser.',
        alternative:
          'Add pds-input-clear inside p-inputicon after the input.',
      },
    ],
  },
  anatomy: [
    { part: 'c-input-clear', role: 'Button host — stays in the DOM when hidden' },
    { part: 'is-hidden', role: 'State class when visible is false — inert, aria-hidden, tabindex="-1"' },
    { part: 'svg[data-p-icon="times"]', role: 'PrimeNG times icon, decorative' },
    { part: 'p-iconfield / p-inputicon', role: 'Required PrimeNG wrappers around the input' },
  ],
  behavior: {
    states: ['visible', 'hidden'],
    interactions: [
      'Keep the control in the DOM and toggle [visible] (typically !!value) so the p-iconfield padding stays reserved and the layout never shifts',
      'Activating the button emits clear; the parent resets the model — the control never touches the input itself',
      'mousedown is prevented so the input keeps focus while the clear click is handled',
      'While hidden the click handler ignores activations',
    ],
  },
  composition: {
    parentConstraints: ['Inside p-inputicon, after the input, within p-iconfield'],
    companions: ['IconField', 'InputIcon', 'InputText', 'InputGroup', 'FormField', 'TopNav'],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'The button aria-label defaults to "Clear" — override it for search fields ("Clear search")',
      'When hidden the control is aria-hidden and tabindex="-1"',
      'Pair search fields with type="text" and role="searchbox" so only this clear is announced',
    ],
    keyboardSupport: [
      'Native button: Tab reaches it while visible, Enter or Space emits clear',
      'Hidden controls are skipped in the tab order',
    ],
  },
  tokens: {
    consumed: [],
  },
  props: [
    {
      name: 'visible',
      type: 'boolean',
      required: false,
      default: 'true',
      description:
        'When false the clear button is hidden (typically bound to a non-empty value).',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      required: false,
      default: 'Clear',
      description: 'Accessible name of the clear button.',
    },
    {
      name: 'clear',
      type: 'output<void>',
      required: false,
      description: 'Emitted when the user activates the clear control.',
    },
  ],
  aiHints: {
    priority: 'high',
    context:
      'Required for every clearable pInputText field in apps and Storybook demos. Use type="text" (not search) with role="searchbox" when the field filters content. Prefer native showClear on PrimeNG components that support it (autocomplete, select, multiselect). Reference implementations: home affiliate search, top-nav search, affiliate-details document toolbar.',
    selectionCriteria: {},
    keywords: [
      'input clear',
      'showClear',
      'times icon',
      'iconfield',
      'searchbox',
    ],
  },
  examples: [],
};
