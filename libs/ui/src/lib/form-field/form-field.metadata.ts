import type { ComponentMetadata } from '@solidaris/contracts';

export const FormFieldMetadata: ComponentMetadata = {
  component: {
    name: 'FormField',
    category: 'molecules',
    description:
      'Field shell around any PrimeNG or native control: a static label (not PrimeNG FloatLabel), optional helper text, a required marker, invalid label colour and a built-in p-message error slot, laid out vertically or horizontally.',
    type: 'input',
    path: 'libs/ui/src/lib/form-field/form-field.component.ts',
    primeNgComponent: 'Message',
    bemBlock: 'c-form-field',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.form-field.scss',
    figmaUrl: 'https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-',
    created: '2026-06-07',
    modified: '2026-09-09',
  },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Static labels above or beside PrimeNG and native inputs',
      'Horizontal label + control rows that share one invalid colour',
      'A required marker, helper text and a p-message error under the control',
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
        scenario: 'PrimeNG FloatLabel for a static label',
        reason: 'FloatLabel animates the placeholder into the label; the design calls for a separate, static, muted label.',
        alternative: 'Use pds-form-field — vertical layout by default.',
      },
      {
        scenario: 'Horizontal layout without a matching inputId',
        reason: 'Unless inputId matches the control id, the label cannot be associated with the control for assistive technology.',
        alternative: 'Pass the same value to inputId and to the control id, or point the control at the generated label id with aria-labelledby.',
      },
      {
        scenario: 'Clearable pInputText with type="search"',
        reason: 'The browser-native clear button conflicts with pds-input-clear.',
        alternative: 'Use type="text" with role="searchbox" and pds-input-clear inside p-inputicon.',
      },
    ],
  },
  anatomy: [
    { part: 'c-form-field', role: 'Block — vertical or horizontal via modifiers and o-flex; is-invalid when invalid' },
    { part: 'c-form-field__label', role: 'Static label — for matches inputId, id is generated for aria-labelledby' },
    { part: 'c-form-field__required', role: 'Decorative asterisk (aria-hidden) followed by a visually hidden (requiredLabel)' },
    { part: 'c-form-field__control', role: 'Projected PrimeNG or native control' },
    { part: 'c-form-field__hint', role: 'Helper text, shown while the field is valid' },
    { part: 'p-message / [pdsFormFieldError]', role: 'Error slot when invalid — errorMessage text or projected content' },
  ],
  behavior: {
    states: ['vertical', 'horizontal', 'required', 'with-hint', 'invalid'],
    interactions: [
      'The parent computes invalid: pass [invalid]="isFieldInvalid(form, name)" where isFieldInvalid checks control.invalid && (control.touched || control.dirty || form.submitted) — SelectButton and similar controls set dirty but not touched on click',
      'While invalid the hint is hidden and errorMessage (or the projected [pdsFormFieldError] content) is shown in a small simple p-message',
      'After each render the shell syncs aria-invalid, aria-required and aria-describedby on the projected control (input, textarea, select or [role="combobox"])',
    ],
  },
  composition: {
    slots: [
      { name: 'default', description: 'The control — a PrimeNG or native input, textarea, select or combobox' },
      { name: '[pdsFormFieldError]', description: 'Custom error content, shown when invalid is true and errorMessage is null' },
    ],
    nestedComponents: ['Message'],
    companions: ['InputClear', 'IconField', 'InputText'],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'Associate the label with the control by passing the same inputId as the control id (<label for>) — every field on a page needs its own inputId',
      'When inputId is omitted the label still has a generated id that a control can reference with aria-labelledby',
      'The hint and the error have stable ids; the shell sets aria-describedby on the projected control so helper and error text are announced',
      'Required: the visible asterisk is aria-hidden and a visually hidden (requiredLabel) is announced — pass the localized word (obligatoire, verplicht; the default is required). An empty requiredLabel renders no marker text at all, never empty parentheses',
      'The shell sets aria-required and aria-invalid on the projected control; still add the native required attribute for form validation',
    ],
    keyboardSupport: [
      'The shell adds no focusable parts — Tab order is that of the projected control',
    ],
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
    { name: 'layout', type: 'FormFieldLayout', required: false, default: 'vertical', description: 'Label above the control (vertical) or beside it (horizontal).' },
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
