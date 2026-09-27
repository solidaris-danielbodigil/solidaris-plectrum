import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormFieldComponent } from '@solidaris-danielbodigil/ui';
import { DemoAutoComplete } from './controls/auto-complete';
import { DemoButton } from './controls/button';
import { DemoDialog } from './controls/dialog';
import { DemoFeedback } from './controls/feedback';
import { DemoInputText } from './controls/input-text';
import { DemoSelect } from './controls/select';
import { DemoSelectButton } from './controls/select-button';
import { DemoToggleButton } from './controls/toggle-button';

@Component({
  selector: 'app-root',
  imports: [
    FormFieldComponent,
    InputText,
    DemoButton,
    DemoToggleButton,
    DemoSelectButton,
    DemoInputText,
    DemoSelect,
    DemoAutoComplete,
    DemoDialog,
    DemoFeedback,
  ],
  template: `
    <pds-form-field
      label="Member number"
      inputId="member"
      hint="Ten digits, no spaces"
      requiredLabel="obligatoire"
    >
      <input pInputText id="member" type="text" autocomplete="off" />
    </pds-form-field>

    <!-- Paste-ready examples from the PrimeNG control pages. Each file under
         ./controls matches libs/ui/src/primeng/primeng.examples.ts exactly. -->
    <demo-button />
    <demo-toggle-button />
    <demo-select-button />
    <demo-input-text />
    <demo-select />
    <demo-auto-complete />
    <demo-dialog />
    <demo-feedback />
  `,
})
export class App {}
