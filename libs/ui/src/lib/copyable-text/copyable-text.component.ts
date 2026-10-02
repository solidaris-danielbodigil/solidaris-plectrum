import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '../icon';
import type { IconSize } from '../icon/icon.types';
import { injectPdsMessages } from '../i18n';
import { copyTextToClipboard } from './copy-to-clipboard';
import { CopyableTextMessages } from './copyable-text.i18n';

/** Side of the copy icon — `end` is the Profile header identifier chip (Figma inplace 2443:4217). */
export type CopyableTextIconPosition = 'start' | 'end';

/** Label weight — `regular` pairs a regular label with the bold value (product decision for the Profile header identifier chip). */
export type CopyableTextLabelWeight = 'semibold' | 'regular';

/**
 * Copyable metadata chip — icon, label, and value rendered as a PrimeNG text button.
 * Copies `value` to the clipboard on click.
 */
@Component({
  selector: 'pds-copyable-text',
  standalone: true,
  imports: [ButtonModule, IconComponent, NgTemplateOutlet],
  templateUrl: './copyable-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyableTextComponent {
  /** Visible label prefix (e.g. "Territoire"). */
  readonly label = input.required<string>();

  /** Text copied to the clipboard (e.g. "319"). */
  readonly value = input.required<string>();

  /** Accessible name; defaults to the locale copy of `Copier {label}`. */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Copy icon size — `sm` in overview card, `xs` in drawer. */
  readonly iconSize = input<IconSize>('xs');

  /** Copy icon before the label (`start`, default) or after the value (`end`). */
  readonly iconPosition = input<CopyableTextIconPosition>('start');

  /** Label weight — `semibold` (default) or `regular` beside the bold value. */
  readonly labelWeight = input<CopyableTextLabelWeight>('semibold');

  /** When true, the button is inert (e.g. parent loading state). */
  readonly disabled = input(false);

  /** Emitted with the copied value after a successful clipboard write. */
  readonly copied = output<string>();

  private readonly messages = injectPdsMessages(CopyableTextMessages);

  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.messages().copyLabel(this.label()),
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
