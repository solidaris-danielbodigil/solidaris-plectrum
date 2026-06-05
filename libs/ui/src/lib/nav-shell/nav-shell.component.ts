import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { IconComponent } from '../icon/icon.component';
import { NavItem } from './nav-item.model';

@Component({
  selector: 'sds-nav-shell',
  standalone: true,
  imports: [RouterLink, TooltipModule, IconComponent],
  templateUrl: './nav-shell.component.html',
  // ViewEncapsulation.None — styles live in libs/styles global sheet (SSOT).
  // Emulated encapsulation would add attribute selectors that conflict with
  // global BEM class selectors on the host element.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-nav-shell o-flex o-flex--col o-flex--align-items-center',
    '[class.c-nav-shell--expanded]': 'expanded()',
    '[attr.aria-expanded]': 'expanded()',
    role: 'navigation',
    'aria-label': 'Primary navigation',
  },
})
export class NavShellComponent {
  /** Navigation items to render */
  readonly items = input<NavItem[]>([]);

  /**
   * Externally-controlled active item ID.
   * When null (default), the component manages active state internally
   * and defaults to the first item.
   */
  readonly activeItemId = input<string | null>(null);

  /** Emitted when an item is clicked */
  readonly itemClicked = output<NavItem>();

  /** Internal hover-expanded state */
  readonly expanded = signal(false);

  /** Internal active item ID — overridden by activeItemId input when provided */
  private readonly _activeId = signal<string | null>(null);

  /**
   * Resolved active id: external input takes precedence;
   * falls back to internal state (defaults to first item on load).
   */
  readonly activeId = computed(() => this.activeItemId() ?? this._activeId());

  constructor() {
    // Default to first item when items are loaded and no external id is set
    effect(() => {
      const items = this.items();
      if (this._activeId() === null && items.length > 0) {
        this._activeId.set(items[0].id);
      }
    });
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.expanded.set(true);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.expanded.set(false);
  }

  onItemClick(item: NavItem): void {
    this._activeId.set(item.id);
    this.itemClicked.emit(item);
  }
}
