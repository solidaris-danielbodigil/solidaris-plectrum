/**
 * Paste-ready application examples for the common PrimeNG controls.
 *
 * Each snippet is a complete standalone component with public imports only.
 * The same code lives in tools/packaging/consumer-app/src/app/controls/<id>.ts
 * so `npm run pack:smoke` compiles it against the packed packages.
 * `tools/scripts/check-docs-release.mjs` fails when the two copies drift.
 */

export interface PrimeNgExample {
  /** File name in the consumer app, without extension. */
  readonly id: string;
  /** Control name as the docs page shows it. */
  readonly control: string;
  readonly code: string;
}

export const PRIMENG_EXAMPLES: readonly PrimeNgExample[] = [
  {
    id: 'button',
    control: 'Button',
    code: `import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'demo-button',
  imports: [Button],
  template: \`
    <div class="o-flex o-flex--row-wrap o-flex--align-items-center o-layout o-layout--gap-2">
      <p-button label="Enregistrer" type="submit" />
      <p-button label="Annuler" severity="secondary" [outlined]="true" />
      <p-button label="Supprimer le document" severity="danger" (onClick)="confirmDelete()" />
    </div>
  \`,
})
export class DemoButton {
  confirmDelete(): void {
    // Open a confirmation dialog before deleting.
  }
}
`,
  },
  {
    id: 'toggle-button',
    control: 'ToggleButton',
    code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButton } from 'primeng/togglebutton';

@Component({
  selector: 'demo-toggle-button',
  imports: [FormsModule, ToggleButton],
  template: \`
    <p-togglebutton
      [(ngModel)]="notifications"
      onLabel="Notifications activées"
      offLabel="Notifications désactivées"
      onIcon="bi bi-bell"
      offIcon="bi bi-bell-slash"
    />
  \`,
})
export class DemoToggleButton {
  notifications = true;
}
`,
  },
  {
    id: 'select-button',
    control: 'SelectButton',
    code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'demo-select-button',
  imports: [FormsModule, SelectButton],
  template: \`
    <p-selectbutton
      [(ngModel)]="period"
      [options]="periods"
      optionLabel="label"
      optionValue="value"
      [allowEmpty]="false"
      ariaLabel="Période"
    />
  \`,
})
export class DemoSelectButton {
  readonly periods = [
    { label: 'Semaine', value: 'week' },
    { label: 'Mois', value: 'month' },
    { label: 'Année', value: 'year' },
  ];
  period = 'month';
}
`,
  },
  {
    id: 'input-text',
    control: 'InputText',
    code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { FormFieldComponent } from '@solidaris/ui';

@Component({
  selector: 'demo-input-text',
  imports: [FormsModule, InputText, FormFieldComponent],
  template: \`
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
  \`,
})
export class DemoInputText {
  member = '';
  submitted = false;
}
`,
  },
  {
    id: 'select',
    control: 'Select',
    code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { FormFieldComponent } from '@solidaris/ui';

@Component({
  selector: 'demo-select',
  imports: [FormsModule, Select, FormFieldComponent],
  template: \`
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
  \`,
})
export class DemoSelect {
  readonly offices = [
    { name: 'Solidaris Brabant', code: '306' },
    { name: 'Solidaris Liège', code: '319' },
    { name: 'Solidaris Wallonie', code: '323' },
  ];
  office: string | null = null;
}
`,
  },
  {
    id: 'auto-complete',
    control: 'AutoComplete',
    code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete, type AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FormFieldComponent } from '@solidaris/ui';

@Component({
  selector: 'demo-auto-complete',
  imports: [FormsModule, AutoComplete, FormFieldComponent],
  template: \`
    <pds-form-field label="Commune" inputId="city" hint="Tapez les premières lettres">
      <p-autocomplete
        inputId="city"
        [(ngModel)]="city"
        [suggestions]="suggestions"
        (completeMethod)="search($event)"
        [forceSelection]="true"
        appendTo="body"
        [fluid]="true"
      />
    </pds-form-field>
  \`,
})
export class DemoAutoComplete {
  private readonly cities = ['Bruxelles', 'Charleroi', 'Liège', 'Mons', 'Namur'];
  suggestions: string[] = [];
  city: string | null = null;

  search(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.suggestions = this.cities.filter((name) => name.toLowerCase().startsWith(query));
  }
}
`,
  },
  {
    id: 'dialog',
    control: 'Dialog',
    code: `import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'demo-dialog',
  imports: [Button, Dialog],
  template: \`
    <p-button label="Supprimer le document" severity="danger" (onClick)="visible = true" />

    <p-dialog
      header="Supprimer ce document ?"
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      appendTo="body"
    >
      <p>Le document sera retiré du dossier. Cette action ne peut pas être annulée.</p>
      <ng-template #footer>
        <p-button label="Annuler" severity="secondary" [text]="true" (onClick)="visible = false" />
        <p-button label="Supprimer" severity="danger" (onClick)="remove()" />
      </ng-template>
    </p-dialog>
  \`,
})
export class DemoDialog {
  visible = false;

  remove(): void {
    this.visible = false;
  }
}
`,
  },
  {
    id: 'feedback',
    control: 'Message and Toast',
    code: `import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'demo-feedback',
  imports: [Button, Message, Toast],
  providers: [MessageService],
  template: \`
    <p-toast position="top-right" />

    <div class="o-flex o-flex--col o-layout o-layout--gap-2">
      <p-message severity="error">
        Le paiement n'a pas pu être enregistré. Vérifiez le numéro de compte et réessayez.
      </p-message>
      <p-button label="Enregistrer" (onClick)="save()" />
    </div>
  \`,
})
export class DemoFeedback {
  private readonly messages = inject(MessageService);

  save(): void {
    this.messages.add({ severity: 'success', summary: 'Enregistré', detail: 'Vos modifications sont sauvegardées.' });
  }
}
`,
  },
];

export function primeNgExample(id: string): PrimeNgExample {
  const example = PRIMENG_EXAMPLES.find((entry) => entry.id === id);
  if (!example) {
    throw new Error(`No PrimeNG example with id "${id}"`);
  }
  return example;
}
