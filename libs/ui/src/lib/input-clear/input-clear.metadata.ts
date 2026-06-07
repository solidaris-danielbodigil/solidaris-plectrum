import type { ComponentMetadata } from '@solidaris/contracts';

export const InputClearMetadata: ComponentMetadata = {
  component: {
    name: 'InputClear',
    category: 'atoms',
    description:
      'PrimeNG-aligned clear button using the shared times SVG for text inputs inside p-iconfield.',
    type: 'input',
    path: 'libs/ui/src/lib/input-clear/input-clear.component.ts',
    primeNgComponent: 'IconField / InputIcon',
    bemBlock: 'c-input-clear',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.input-clear.scss',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  usage: {
    useCases: [
      'Clearable pInputText fields',
      'Search inputs with inline clear',
      'Input group query fields',
    ],
    commonPatterns: [
      {
        name: 'Clearable icon field',
        description:
          'Wrap the input in p-iconfield, place sds-input-clear inside p-inputicon after the input.',
        composition: `<p-iconfield>
  <input pInputText [(ngModel)]="value" />
  <p-inputicon>
    <sds-input-clear [visible]="!!value" (clear)="value = ''" />
  </p-inputicon>
</p-iconfield>`,
      },
      {
        name: 'Clearable input group',
        description:
          'Use the same pattern as the first child of p-inputgroup when a trailing button is required.',
        composition: `<p-inputgroup>
  <p-iconfield>
    <input pInputText [(ngModel)]="value" />
    <p-inputicon>
      <sds-input-clear [visible]="!!value" (clear)="value = ''" />
    </p-inputicon>
  </p-iconfield>
  <button pButton type="submit" label="Search" />
</p-inputgroup>`,
      },
    ],
    antiPatterns: [
      {
        scenario: 'Bootstrap bi-x-lg inside p-inputicon',
        reason: 'Font icons render at different metrics than PrimeNG showClear SVGs.',
        alternative: 'Use sds-input-clear for consistent 14×14 PrimeNG times asset.',
      },
      {
        scenario: 'Input type="search" with sds-input-clear',
        reason: 'Browsers render a native clear control alongside the PrimeNG times icon.',
        alternative: 'Use type="text" with role="searchbox" and sds-input-clear only.',
      },
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [
      '--p-form-field-icon-color',
      '--p-form-field-focus-border-color',
      '--p-form-field-border-radius',
      '--p-icon-size',
    ],
  },
  aiHints: {
    priority: 'high',
    context:
      'Use for custom clear affordances on pInputText. Prefer native showClear on PrimeNG components that support it.',
    selectionCriteria: {},
    keywords: ['input clear', 'showClear', 'times icon', 'iconfield'],
  },
  examples: [],
};
