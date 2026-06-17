import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MessageModule } from 'primeng/message';
import type { FormFieldLayout } from './form-field.types';

/**
 * FormFieldComponent — reusable field label, layout, and validation message shell.
 *
 * Use instead of PrimeNG FloatLabel when the design calls for a static label above
 * or beside the control. Pass `inputId` matching the control `id` / `inputId` when possible.
 * For invalid state, include `control.dirty` for controls such as SelectButton that do not
 * mark ngModel as touched on interaction.
 */
@Component({
  selector: 'pds-form-field',
  standalone: true,
  imports: [MessageModule],
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  private static nextLabelId = 0;

  /** Stable id for `aria-labelledby` when `inputId` is not set on the control. */
  protected readonly labelId = `pds-form-field-label-${FormFieldComponent.nextLabelId++}`;

  readonly label = input.required<string>();
  readonly layout = input<FormFieldLayout>('vertical');
  readonly required = input(false);
  readonly invalid = input(false);
  readonly errorMessage = input<string | null>(null);
  /** Associates the horizontal label with a control id (`inputId` / `id` on the field). */
  readonly inputId = input<string | undefined>(undefined);
  /** Screen-reader text appended after the required asterisk. */
  readonly requiredLabel = input('required');
}
