import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { FormFieldComponent } from '@solidaris/ui';

@Component({
  selector: 'demo-select',
  imports: [FormsModule, Select, FormFieldComponent],
  template: `
    <pds-form-field label="Mutualité" inputId="office">
      <p-select
        inputId="office"
        [(ngModel)]="office"
        [options]="offices"
        optionLabel="name"
        optionValue="code"
        placeholder="Choisissez une mutualité"
        appendTo="body"
        [fluid]="true"
      />
    </pds-form-field>
  `,
})
export class DemoSelect {
  readonly offices = [
    { name: 'Solidaris Brabant', code: '306' },
    { name: 'Solidaris Liège', code: '319' },
    { name: 'Solidaris Wallonie', code: '323' },
  ];
  office: string | null = null;
}
