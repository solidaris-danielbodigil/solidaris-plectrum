import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { getPlectrumAvatarIllustrationSrc } from './plectrum-avatar.assets';
import {
  PlectrumAvatarColor,
  PlectrumAvatarGender,
  PlectrumAvatarSize,
  PlectrumAvatarState,
  PlectrumAvatarVariant,
} from './plectrum-avatar.types';

@Component({
  selector: 'pds-plectrum-avatar',
  standalone: true,
  templateUrl: './plectrum-avatar.component.html',
  // Styles live in libs/styles global sheet (SSOT).
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-plectrum-avatar',
    '[class.c-plectrum-avatar--large]': 'size() === "large"',
    '[class.c-plectrum-avatar--color-blue]': 'color() === "blue"',
    '[class.c-plectrum-avatar--color-green]': 'color() === "green"',
    '[class.c-plectrum-avatar--color-yellow]': 'color() === "yellow"',
    '[class.c-plectrum-avatar--color-red]': 'color() === "red"',
    '[attr.data-state]': 'state() === "active" ? "active" : null',
    '[attr.tabindex]': 'focusable() ? 0 : null',
    '[attr.role]': 'focusable() ? "img" : null',
    '[attr.aria-label]': 'focusable() ? (ariaLabel() ?? initials().toUpperCase()) : null',
    '[attr.aria-hidden]': 'focusable() ? null : "true"',
  },
})
export class PlectrumAvatarComponent {
  /** Avatar initials shown in the center (small variant). */
  readonly initials = input.required<string>();

  /** Visual size — small initials or large illustrated treatment. */
  readonly size = input<PlectrumAvatarSize>('small');

  /** Illustrated avatar gender (large variant). */
  readonly gender = input<PlectrumAvatarGender>('female');

  /** Illustrated avatar style variant (large variant). */
  readonly variant = input<PlectrumAvatarVariant>(1);

  /**
   * Optional named colour for the small shield. When unset the default
   * Solidaris red treatment is preserved (backward compatible).
   */
  readonly color = input<PlectrumAvatarColor | null>(null);

  /** Visual state shown in the Figma component. */
  readonly state = input<PlectrumAvatarState>('default');

  /** Optional accessible label; falls back to the initials. */
  readonly ariaLabel = input<string | null>(null);

  /**
   * When false, the avatar is decorative (no tabindex/role) — use inside another
   * interactive control such as the top-nav menu trigger button.
   */
  readonly focusable = input(true);

  readonly isLarge = computed(() => this.size() === 'large');

  readonly illustrationSrc = computed(() =>
    getPlectrumAvatarIllustrationSrc(this.gender(), this.variant()),
  );
}
