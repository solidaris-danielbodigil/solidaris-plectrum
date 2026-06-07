import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '../icon';
import type { IconSize } from '../icon/icon.types';
import { copyTextToClipboard } from './copy-to-clipboard';

/**
 * Copyable metadata chip — icon, label, and value rendered as a PrimeNG text button.
 * Copies `value` to the clipboard on click.
 */
@Component({
  selector: 'sds-copyable-text',
  standalone: true,
  imports: [ButtonModule, IconComponent],
  templateUrl: './copyable-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyableTextComponent {
  /** Visible label prefix (e.g. "Territoire"). */
  readonly label = input.required<string>();

  /** Text copied to the clipboard (e.g. "319"). */
  readonly value = input.required<string>();

  /** Accessible name; defaults to `Copier {label}`. */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Copy icon size — `sm` in overview card, `xs` in drawer. */
  readonly iconSize = input<IconSize>('xs');

  /** When true, the button is inert (e.g. parent loading state). */
  readonly disabled = input(false);

  /** Emitted with the copied value after a successful clipboard write. */
  readonly copied = output<string>();

  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? `Copier ${this.label()}`,
  );

  async onCopy(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled()) {
      return;
    }

    const text = this.value();
    const success = await copyTextToClipboard(text);

    if (success) {
      this.copied.emit(text);
    }
  }
}
