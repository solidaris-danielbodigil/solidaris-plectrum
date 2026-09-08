import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
} from '@angular/core';
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
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Stable id for `aria-labelledby` when `inputId` is not set on the control. */
  protected readonly labelId = `pds-form-field-label-${FormFieldComponent.nextLabelId++}`;
  protected readonly hintId = `${this.labelId}-hint`;
  protected readonly errorId = `${this.labelId}-error`;

  constructor() {
    afterRenderEffect(() => {
      this.syncControlAria();
    });
  }

  private syncControlAria(): void {
    const control = this.host.nativeElement.querySelector(
      '.c-form-field__control input, .c-form-field__control textarea, .c-form-field__control select, .c-form-field__control [role="combobox"]',
    ) as HTMLElement | null;

    if (!control) {
      return;
    }

    const invalid = this.invalid();
    control.setAttribute('aria-invalid', invalid ? 'true' : 'false');

    if (this.required()) {
      control.setAttribute('aria-required', 'true');
    } else {
      control.removeAttribute('aria-required');
    }

    const describedBy: string[] = [];
    if (this.hint() && !invalid) {
      describedBy.push(this.hintId);
    }
    if (invalid && (this.errorMessage() || this.host.nativeElement.querySelector('[pdsFormFieldError]'))) {
      describedBy.push(this.errorId);
    }

    if (describedBy.length) {
      control.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      control.removeAttribute('aria-describedby');
    }
  }

  readonly label = input.required<string>();
  readonly layout = input<FormFieldLayout>('vertical');
  readonly required = input(false);
  readonly invalid = input(false);
  readonly errorMessage = input<string | null>(null);
  /** Associates the horizontal label with a control id (`inputId` / `id` on the field). */
  readonly inputId = input<string | undefined>(undefined);
  /** Optional helper text under the control. */
  readonly hint = input<string | undefined>(undefined);
  /** Screen-reader text appended after the required asterisk. */
  readonly requiredLabel = input('required');
}
