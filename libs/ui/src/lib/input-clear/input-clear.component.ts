import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimesIcon } from 'primeng/icons';

/**
 * PrimeNG-aligned clear control for text inputs inside `p-iconfield`.
 *
 * Place inside `p-inputicon` after a `pInputText` field. Keeps the PrimeNG
 * `times` SVG asset (14×14) and reserves icon-field padding so layout does not shift.
 */
@Component({
  selector: 'sds-input-clear',
  standalone: true,
  imports: [TimesIcon],
  templateUrl: './input-clear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputClearComponent {
  /** When false, the control stays in the DOM but is hidden and inert. */
  readonly visible = input(true);

  /** Accessible name for the clear button. */
  readonly ariaLabel = input('Clear');

  readonly clear = output<void>();

  onClear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.visible()) {
      return;
    }

    this.clear.emit();
  }

  /** Prevent the host input from blurring before the clear click is handled. */
  onPointerDown(event: Event): void {
    event.preventDefault();
  }
}
