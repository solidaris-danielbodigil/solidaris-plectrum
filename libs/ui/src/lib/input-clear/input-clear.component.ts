import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output } from '@angular/core';
import { TimesIcon } from 'primeng/icons';

/**
 * PrimeNG-aligned clear control for text inputs inside `p-iconfield`.
 *
 * Place inside `p-inputicon` after a `pInputText` field. Keeps the PrimeNG
 * `times` SVG asset (14×14) and reserves icon-field padding so layout does not shift.
 */
@Component({
  selector: 'pds-input-clear',
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

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  onClear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.visible()) {
      return;
    }

    // A keyboard user activated the button, which hides itself once the field is
    // empty: hand focus back to the field instead of leaving it on a hidden control.
    const button = event.currentTarget as HTMLElement | null;
    const hadFocus = !!button && button.ownerDocument.activeElement === button;
    this.clear.emit();
    if (hadFocus) this.field()?.focus();
  }

  /** The text field this control clears: the input of the enclosing icon field or input group. */
  private field(): HTMLInputElement | HTMLTextAreaElement | null {
    const group = this.host.nativeElement.closest('p-iconfield, .p-iconfield, p-inputgroup, .p-inputgroup');
    return group?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]), textarea') ?? null;
  }

  /** Prevent the host input from blurring before the clear click is handled. */
  onPointerDown(event: Event): void {
    event.preventDefault();
  }
}
