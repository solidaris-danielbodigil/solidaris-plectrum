import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete, type AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FormFieldComponent } from '@solidaris-danielbodigil/ui';

@Component({
  selector: 'demo-auto-complete',
  imports: [FormsModule, AutoComplete, FormFieldComponent],
  template: `
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
  `,
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
