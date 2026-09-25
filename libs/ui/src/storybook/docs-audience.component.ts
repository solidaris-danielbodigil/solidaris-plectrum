import { ChangeDetectionStrategy, Component, input, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { type DocsStep } from './docs-figures.types';
import { DocsStepsComponent } from './docs-steps.component';

type Audience = 'design' | 'dev';

@Component({
  selector: 'pds-docs-audience',
  imports: [FormsModule, SelectButton, DocsStepsComponent],
  template: `
    <p-selectButton
      [options]="options"
      [ngModel]="audience()"
      (ngModelChange)="audience.set($event)"
      optionLabel="label"
      optionValue="value"
      [allowEmpty]="false"
      aria-label="Show the path for designers or developers"
    />
    <pds-docs-steps [steps]="audience() === 'design' ? designSteps() : devSteps()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c-docs-audience o-flex o-flex--col o-layout o-layout--gap-2 o-layout--margin-block-3',
  },
})
export class DocsAudienceComponent {
  readonly designSteps = input.required<readonly DocsStep[]>();
  readonly devSteps = input.required<readonly DocsStep[]>();

  protected readonly audience = signal<Audience>('design');

  protected readonly options: readonly { label: string; value: Audience }[] = [
    { label: 'Designers', value: 'design' },
    { label: 'Developers', value: 'dev' },
  ];
}
