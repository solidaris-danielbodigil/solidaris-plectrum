import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { PlectrumAvatarState } from './plectrum-avatar.types';

@Component({
  selector: 'sds-plectrum-avatar',
  standalone: true,
  templateUrl: './plectrum-avatar.component.html',
  // Styles live in libs/styles global sheet (SSOT).
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-plectrum-avatar',
    '[attr.data-state]': 'state() === "active" ? "active" : null',
    tabindex: '0',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel() ?? initials().toUpperCase()',
  },
})
export class PlectrumAvatarComponent {
  /** Avatar initials shown in the center. */
  readonly initials = input.required<string>();

  /** Visual state shown in the Figma component. */
  readonly state = input<PlectrumAvatarState>('default');

  /** Optional accessible label; falls back to the initials. */
  readonly ariaLabel = input<string | null>(null);
}
