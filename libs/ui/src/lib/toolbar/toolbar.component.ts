import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { Card } from 'primeng/card';

/** PrimeNG Card chrome on the toolbar surface. */
export type ToolbarVariant = 'default' | 'bordered';

/**
 * ToolbarComponent — generic sticky-capable toolbar with named content slots.
 *
 * ## Slots
 * - `[slot=start]`  — left-aligned content (search field, filters, …)
 * - `[slot=end]`    — right-aligned content (badge, actions, …)
 *
 * ## Inputs
 * - `sticky` — when `true` (default) the toolbar gets `position: sticky; top: 0`
 * - `variant` — `default` keeps the elevated PrimeNG Card; `bordered` uses the
 *   existing `u-border-all` / card-border utilities and clears `--p-card-shadow`
 *
 * ## Styles
 * All styles live in `libs/styles/src/06-components/_components.toolbar.scss`.
 * `ViewEncapsulation.None` is required because styles are in the global ITCSS sheet.
 *
 * ## Domain variants
 * Apply a BEM block class on `<(pds|app|lib)-toolbar>` for page-specific chrome overrides.
 * - `c-affiliate-documents-toolbar` — affiliate document filter row (Figma 324:5772).
 *   Tokens: `libs/styles/src/01-settings/_settings.affiliate-documents.scss`
 *   Styles: `libs/styles/src/06-components/_components.affiliate-documents.scss`
 *   Reference: `apps/ishare/src/app/affiliate-details/affiliate-details.component.html`
 *
 * ## Usage
 * ```html
 * <(pds|app|lib)-toolbar [sticky]="true" variant="bordered">
 *   <ng-container slot="start">
 *     <!-- search, filters … -->
 *   </ng-container>
 *   <ng-container slot="end">
 *     <!-- badge, actions … -->
 *   </ng-container>
 * </pds-toolbar>
 * ```
 */
@Component({
  selector: 'pds-toolbar',
  standalone: true,
  imports: [Card],
  templateUrl: './toolbar.component.html',
  // ViewEncapsulation.None — styles live in libs/styles global sheet (SSOT).
  // Component styles must not be encapsulated or the BEM classes won't resolve.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // c-toolbar is applied to the host element so position:sticky is on the real
  // scroll-ancestor boundary — applying it to an inner div breaks sticky in any
  // parent that has overflow constraints (Storybook canvas, app shell, etc.)
  host: {
    class: 'c-toolbar o-layout o-layout--block',
    '[class.c-toolbar--sticky]': 'sticky()',
    '[class.c-toolbar--bordered]': 'bordered()',
  },
})
export class ToolbarComponent {
  /** When true (default) the toolbar sticks to the top of its scroll container. */
  readonly sticky = input<boolean>(true);

  /**
   * Card chrome. `bordered` is the existing utility ring (`u-border-all` +
   * `--pds-color-card-border`) with the elevated `--p-card-shadow` cleared.
   */
  readonly variant = input<ToolbarVariant>('default');

  readonly bordered = computed(() => this.variant() === 'bordered');
}
