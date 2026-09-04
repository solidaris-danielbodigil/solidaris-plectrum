import { Component } from '@angular/core';
import { FormFieldComponent } from '@solidaris/ui';

@Component({
  selector: 'app-root',
  imports: [FormFieldComponent],
  template: `
    <pds-form-field label="Packed consumer" inputId="smoke">
      <input id="smoke" type="text" value="ok" />
    </pds-form-field>
  `,
})
export class App {}
