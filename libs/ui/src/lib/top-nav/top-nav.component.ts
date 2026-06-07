import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { InputClearComponent } from '../input-clear';
import { PlectrumAvatarComponent } from '../plectrum-avatar';
import { PlectrumAvatarState } from '../plectrum-avatar/plectrum-avatar.types';

/**
 * TopNavComponent — application top navigation bar.
 *
 * Renders a fixed-height header row with:
 * - A sub-navigation toggle button
 * - PrimeNG Breadcrumb for route context
 * - A search button that expands into a PrimeNG IconField + InputText field
 * - A help button
 * - The custom PlectrumAvatar component
 *
 * ## Figma
 * https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=1-1533
 */
@Component({
  selector: 'sds-top-nav',
  standalone: true,
  imports: [
    ButtonModule,
    BreadcrumbModule,
    IconField,
    InputClearComponent,
    InputIcon,
    InputText,
    RippleModule,
    PlectrumAvatarComponent,
  ],
  templateUrl: './top-nav.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-top-nav o-layout--full-width',
    role: 'banner',
  },
})
export class TopNavComponent {
  /** Breadcrumb items that describe the current route context. */
  readonly breadcrumbs = input.required<MenuItem[]>();

  /** Optional breadcrumb home item. */
  readonly home = input<MenuItem | null>(null);

  /** Controlled sub-navigation expanded state. Falls back to the component's internal state when undefined. */
  readonly subNavExpanded = input<boolean | undefined>(undefined);

  /** Optional ID of the sub-navigation region controlled by the toggle button. */
  readonly subNavControlsId = input<string | null>(null);

  /** Controlled search-open state. Falls back to the component's internal state when undefined. */
  readonly searchExpanded = input<boolean | undefined>(undefined);

  /** Controlled search query. Falls back to the component's internal state when undefined. */
  readonly searchQuery = input<string | undefined>(undefined);

  /** Placeholder shown inside the PrimeNG search input. */
  readonly searchPlaceholder = input<string>('Search');

  /** Accessible label for the search toggle and input. */
  readonly searchAriaLabel = input<string>('Search');

  /** Accessible label for the inline search clear control. */
  readonly searchClearLabel = input<string>('Clear search');

  /** Accessible label for the sub-navigation toggle button. */
  readonly subNavToggleLabel = input<string>('Toggle sub-navigation');

  /** Controls whether the sub-navigation toggle button is rendered. */
  readonly showSubNavToggle = input<boolean>(true);

  /** Accessible label for the help button. */
  readonly helpLabel = input<string>('Help');

  /** Initials shown by the Plectrum avatar. */
  readonly avatarInitials = input.required<string>();

  /** Persistent avatar state from the custom avatar component. */
  readonly avatarState = input<PlectrumAvatarState>('default');

  /** Optional accessible label for the avatar. */
  readonly avatarAriaLabel = input<string | null>(null);

  /** Emitted when the sub-navigation toggle changes state. */
  readonly subNavExpandedChange = output<boolean>();

  /** Emitted when the search open state changes. */
  readonly searchExpandedChange = output<boolean>();

  /** Emitted when the search query changes. */
  readonly searchQueryChange = output<string>();

  /** Emitted when the user presses Enter in the search input. */
  readonly searchSubmit = output<string>();

  /** Emitted when the help button is activated. */
  readonly helpClicked = output<void>();

  private readonly _subNavExpanded = signal(false);
  private readonly _searchExpanded = signal(false);
  private readonly _searchQuery = signal('');

  /** Resolved sub-navigation state — controlled input wins, otherwise use the local fallback. */
  readonly resolvedSubNavExpanded = computed(() => {
    const controlled = this.subNavExpanded();
    return controlled !== undefined ? controlled : this._subNavExpanded();
  });

  /** Resolved search-open state — controlled input wins, otherwise use the local fallback. */
  readonly resolvedSearchExpanded = computed(() => {
    const controlled = this.searchExpanded();
    return controlled !== undefined ? controlled : this._searchExpanded();
  });

  /** Resolved search query — controlled input wins, otherwise use the local fallback. */
  readonly resolvedSearchQuery = computed(() => {
    const controlled = this.searchQuery();
    return controlled !== undefined ? controlled : this._searchQuery();
  });

  readonly searchInputId = 'top-nav-search';

  toggleSubNav(): void {
    const next = !this.resolvedSubNavExpanded();
    this._subNavExpanded.set(next);
    this.subNavExpandedChange.emit(next);
  }

  openSearch(): void {
    this.setSearchExpanded(true);
    // Programmatically focus the newly rendered search input on next change detection cycle
    setTimeout(() => {
      const el = document.getElementById(this.searchInputId) as HTMLInputElement;
      if (el) {
        el.focus();
      }
    }, 0);
  }

  closeSearch(): void {
    this.setSearchExpanded(false);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this._searchQuery.set(target.value);
    this.searchQueryChange.emit(target.value);
  }

  clearSearch(): void {
    this._searchQuery.set('');
    this.searchQueryChange.emit('');

    const el = document.getElementById(this.searchInputId) as HTMLInputElement | null;
    el?.focus();
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeSearch();
      return;
    }

    if (event.key === 'Enter') {
      this.searchSubmit.emit(this.resolvedSearchQuery());
    }
  }

  onSearchBlur(event: FocusEvent): void {
    const related = event.relatedTarget;
    const searchField = (event.target as HTMLElement | null)?.closest('.c-top-nav__search');

    if (related instanceof Node && searchField?.contains(related)) {
      return;
    }

    this.closeSearch();
  }

  onHelpClick(): void {
    this.helpClicked.emit();
  }

  private setSearchExpanded(next: boolean): void {
    this._searchExpanded.set(next);
    this.searchExpandedChange.emit(next);
  }
}