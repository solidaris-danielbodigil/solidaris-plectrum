import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'demo-select-button',
  imports: [FormsModule, SelectButton],
  template: `
    <p-selectbutton
      [(ngModel)]="period"
      [options]="periods"
      optionLabel="label"
      optionValue="value"
      [allowEmpty]="false"
      ariaLabel="Période"
    />
  `,
})
export class DemoSelectButton {
  readonly periods = [
    { label: 'Semaine', value: 'week' },
    { label: 'Mois', value: 'month' },
    { label: 'Année', value: 'year' },
  ];
  period = 'month';
}
