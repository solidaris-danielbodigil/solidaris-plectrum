import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { FormFieldComponent } from '@solidaris-danielbodigil/ui';

@Component({
  selector: 'demo-input-text',
  imports: [FormsModule, InputText, FormFieldComponent],
  template: `
    <pds-form-field
      label="Numéro de membre"
      inputId="membership"
      hint="Dix chiffres, sans espaces"
      requiredLabel="obligatoire"
      [required]="true"
      [invalid]="submitted && !member"
      errorMessage="Indiquez votre numéro de membre."
    >
      <input pInputText id="membership" name="member" [(ngModel)]="member" autocomplete="off" required />
    </pds-form-field>
  `,
})
export class DemoInputText {
  member = '';
  submitted = false;
}
