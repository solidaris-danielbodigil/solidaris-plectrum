/**
 * Paste-ready application example. The docs page, the Vertical story source
 * panel, and tools/packaging/consumer-app must keep this shape: public
 * `@solidaris/ui` import, PrimeNG `pInputText`, and every binding the template uses.
 */
export const FORM_FIELD_CONSUMER_EXAMPLE = `import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormFieldComponent } from '@solidaris/ui';

@Component({
  selector: 'app-root',
  imports: [FormFieldComponent, InputText],
  template: \`
    <pds-form-field
      label="Member number"
      inputId="member"
      hint="Ten digits, no spaces"
      requiredLabel="obligatoire"
    >
      <input pInputText id="member" type="text" autocomplete="off" />
    </pds-form-field>
  \`,
})
export class App {}
`;
