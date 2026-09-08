import type { ComponentMetadata } from '@solidaris/contracts';

export const FormFieldMetadata: ComponentMetadata = {
  component: {
    name: 'FormField',
    category: 'molecules',
    description:
      'Optional reusable field shell with custom label, optional helper text, required marker, validation styling, and vertical or horizontal layout.',
    type: 'input',
    path: 'libs/ui/src/lib/form-field/form-field.component.ts',
    primeNgComponent: undefined,
    bemBlock: 'c-form-field',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.form-field.scss',
    figmaUrl: 'https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  governance: {
    status: 'core',
    owner: 'design-system',
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
      '--pds-text-label-sm-family',
      '--pds-text-label-sm-size',
      '--pds-text-label-sm-weight',
      '--pds-text-label-sm-line-height',
      '--pds-text-label-sm-spacing',
    ],
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'Visible field label.' },
    { name: 'layout', type: "'vertical' | 'horizontal'", required: false, default: 'vertical', description: 'Label above the control (vertical) or beside it (horizontal).' },
    { name: 'required', type: 'boolean', required: false, default: 'false', description: 'Shows the required marker and sets aria-required on the control.' },
    { name: 'invalid', type: 'boolean', required: false, default: 'false', description: 'Invalid state — label colour, aria-invalid, and the error message.' },
    { name: 'errorMessage', type: 'string | null', required: false, default: 'null', description: 'Validation message shown when invalid is true.' },
    { name: 'inputId', type: 'string | undefined', required: false, default: 'undefined', description: 'Associates the horizontal label with the control id.' },
    { name: 'hint', type: 'string | undefined', required: false, default: 'undefined', description: 'Optional helper text under the control (aria-describedby).' },
    { name: 'requiredLabel', type: 'string', required: false, default: 'required', description: 'Screen-reader text appended after the required asterisk.' },
  ],
  aiHints: {
    priority: 'high',
    context:
      'Preferred label wrapper for app forms. Parent computes invalid from NgModel touched/submitted state.',
    selectionCriteria: {},
    keywords: ['form field', 'label', 'required', 'validation', 'horizontal', 'vertical'],
  },
  examples: [],
};
