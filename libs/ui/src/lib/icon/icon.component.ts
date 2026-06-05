// =============================================================================
// libs/ui/src/lib/icon/icon.component.ts
// <sds-icon> — universal icon component for the Solidaris Design System.
//
// Supports:
//   - Bootstrap Icons via CSS class strings  (source="class", default)
//   - Custom SVG icons via the IconRegistry  (source="svg")
//
// Size variants map to --sds-icon-size-* tokens.
// Colour inherits via currentColor by default.
// =============================================================================

import {
  Component,
  computed,
  inject,
  input,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconRegistry } from './icon.registry';
import { IconSize, IconSource } from './icon.types';

@Component({
  selector: 'sds-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-hidden]': 'ariaHidden()',
    '[attr.aria-label]': 'ariaLabelAttr()',
    '[attr.role]': 'roleAttr()',
    '[attr.focusable]': '"false"',
  },
})
export class IconComponent {
  // ── Inputs ────────────────────────────────────────────────────────────────

  /**
   * For source="class": Bootstrap Icons class string, e.g. `'bi bi-house'`.
   * For source="svg":   Registry key registered via IconRegistry.register().
   */
  readonly icon = input.required<string>();

  /** How the icon value should be interpreted. Defaults to Bootstrap Icons class. */
  readonly source = input<IconSource>('class');

  /** Visual size variant. Defaults to 'md'. */
  readonly size = input<IconSize>('md');

  /**
   * Accessible label for standalone (non-decorative) icons.
   * When provided, the icon is not aria-hidden and gets role="img".
   * When omitted, the icon is treated as decorative (aria-hidden="true").
   */
  readonly label = input<string | undefined>(undefined);

  // ── Dependencies ──────────────────────────────────────────────────────────

  private readonly registry = inject(IconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  // ── Computed ──────────────────────────────────────────────────────────────

  readonly hostClass = computed(
    () => `c-icon c-icon--${this.size()}`
  );

  readonly isDecorative = computed(() => !this.label());
  readonly ariaHidden = computed(() => (this.isDecorative() ? 'true' : null));
  readonly ariaLabelAttr = computed(() => this.label() ?? null);
  readonly roleAttr = computed(() => (this.isDecorative() ? null : 'img'));

  /** Resolved SVG markup (safe) for source="svg" icons. */
  readonly svgMarkup = computed<SafeHtml | null>(() => {
    if (this.source() !== 'svg') return null;
    const entry = this.registry.get(this.icon());
    if (!entry) {
      if (this.isBrowser) {
        console.warn(`[sds-icon] SVG icon "${this.icon()}" is not registered.`);
      }
      return null;
    }
    return this.sanitizer.bypassSecurityTrustHtml(entry.svg);
  });
}
