import type { ComponentMetadata } from '@solidaris/contracts';

export const FormFieldMetadata: ComponentMetadata = {
  component: {
    name: 'FormField',
    category: 'molecules',
    description:
      'Optional reusable field shell with custom label, required marker, validation styling, and vertical or horizontal layout.',
    type: 'input',
    path: 'libs/ui/src/lib/form-field/form-field.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-form-field',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.form-field.scss',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  usage: {
    useCases: [
      'Static labels above PrimeNG inputs',
      'Horizontal label + control rows',
      'Shared invalid label colour with p-message errors',
    ],
    commonPatterns: [
      {
        name: 'Clearable text field',
        description:
          'Pair pds-form-field with p-iconfield + pds-input-clear for filter/search pInputText. See InputClear metadata.',
        composition: `<(pds|app|lib)-form-field label="Rechercher" inputId="query">
  <p-iconfield>
    <p-inputicon><i class="bi bi-search" aria-hidden="true"></i></p-inputicon>
    <input pInputText type="text" role="searchbox" id="query" [(ngModel)]="query" />
    <p-inputicon>
      <(pds|app|lib)-input-clear [visible]="!!query" ariaLabel="Clear" (clear)="query = ''" />
    </p-inputicon>
  </p-iconfield>
</pds-form-field>`,
      },
      {
        name: 'Vertical field',
        description:
          'Default layout. Wraps the control in a native label for implicit association.',
        composition: `<(pds|app|lib)-form-field label="O.A." [required]="true" [invalid]="showError" errorMessage="Required.">
  <p-autocomplete [(ngModel)]="value" required />
</pds-form-field>`,
      },
      {
        name: 'Horizontal field',
        description: 'Set inputId on the control and pass the same value to pds-form-field.',
        composition: `<(pds|app|lib)-form-field label="Reference" layout="horizontal" inputId="reference" [invalid]="showError" errorMessage="Required.">
  <input pInputText id="reference" [(ngModel)]="value" required />
</pds-form-field>`,
      },
    ],
    antiPatterns: [
      {
        scenario: 'PrimeNG FloatLabel for static labels',
        reason: 'FloatLabel animates placeholder text; this design uses a separate muted label.',
        alternative: 'Use pds-form-field with vertical layout.',
      },
      {
        scenario: 'Horizontal layout without inputId',
        reason: 'The label cannot be associated with the control for assistive tech.',
        alternative: 'Pass matching inputId and id attributes.',
      },
      {
        scenario: 'Clearable pInputText with type="search"',
        reason: 'Browser-native clear buttons conflict with pds-input-clear.',
        alternative: 'Use type="text", role="searchbox", and pds-input-clear inside p-inputicon.',
      },
    ],
  },
  accessibility: {
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [
      '--pds-space-form-field-gap',
      '--pds-space-form-field-gap-horizontal',
      '--pds-size-form-field-label-min-width',
      '--pds-color-text-muted',
      '--pds-color-form-float-label-invalid',
      '--text-label-sm-family',
      '--text-label-sm-size',
      '--text-label-sm-weight',
      '--text-label-sm-line-height',
      '--text-label-sm-spacing',
    ],
  },
  aiHints: {
    priority: 'high',
    context:
      'Preferred label wrapper for app forms. Parent computes invalid from NgModel touched/submitted state.',
    selectionCriteria: {},
    keywords: ['form field', 'label', 'required', 'validation', 'horizontal', 'vertical'],
  },
  examples: [],
};
