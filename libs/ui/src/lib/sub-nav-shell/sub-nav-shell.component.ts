import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { InputClearComponent } from '../input-clear';
import { SubNavShellItem, SubNavShellSection } from './sub-nav-shell.types';

/** A standalone block — items rendered without an accordion wrapper */
export interface StandaloneBlock {
  type: 'standalone';
  section: SubNavShellSection;
}

/** An accordion block — consecutive labeled sections grouped into one p-accordion */
export interface AccordionBlock {
  type: 'accordion';
  sections: SubNavShellSection[];
}

export type RenderBlock = StandaloneBlock | AccordionBlock;

/**
 * SubNavShellComponent — second-level navigation sidebar.
 *
 * Renders a fixed-width panel with:
 * - A heading header with the module/app title
 * - Optional featured/standalone items (sections without a label)
 * - Collapsible grouped sections using PrimeNG Accordion
 * - Menu items with optional leading icon and PrimeNG Badge counter
 * - A version/changelog footer
 *
 * Standalone sections can appear anywhere in the list (interleaved with accordion groups).
 *
 * ## Figma
 * https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-·-Custom-components?node-id=1-1476
 */
@Component({
  selector: 'pds-sub-nav-shell',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    AccordionModule,
    BadgeModule,
    ButtonModule,
    IconField,
    InputClearComponent,
    InputIcon,
    InputText,
    TooltipModule,
  ],
  templateUrl: './sub-nav-shell.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-sub-nav-shell o-flex o-flex--col o-layout o-layout--overflow-hidden',
    role: 'navigation',
    '[attr.aria-label]': 'title()',
  },
})
export class SubNavShellComponent {
  /** Module/app title shown in the header */
  readonly title = input<string>('');

  /** Grouped navigation sections */
  readonly sections = input<SubNavShellSection[]>([]);

  /** Currently active item ID */
  readonly activeItemId = input<string | null>(null);

  /** Version string displayed in footer */
  readonly version = input<string>('');

  /** Changelog URL for the footer link */
  readonly changelogUrl = input<string>('#');

  /** Show an expandable search that filters section and item labels. */
  readonly showSearch = input(false);

  /** Placeholder shown in the expanded search field. */
  readonly searchPlaceholder = input('Search');

  /** Accessible name for the search toggle and field. */
  readonly searchAriaLabel = input('Search');

  /** Accessible name for the search clear control. */
  readonly searchClearLabel = input('Clear search');

  /** Empty-state copy when the query matches no items. */
  readonly searchEmptyLabel = input('No results found.');

  /** Emitted when a menu item is clicked */
  readonly itemClicked = output<SubNavShellItem>();

  readonly searchExpanded = signal(false);
  readonly searchQuery = signal('');
  readonly searchInputId = 'sub-nav-shell-search';

  readonly visibleSections = computed(() => {
    const query = normalizeSearch(this.searchQuery());
    const sections = this.sections();
    if (!query) {
      return sections;
    }

    return sections
      .map((section) => {
        const sectionMatches = normalizeSearch(section.label).includes(query);
        return {
          ...section,
          items: sectionMatches
            ? section.items
            : section.items.filter((item) =>
                normalizeSearch(item.label).includes(query),
              ),
        };
      })
      .filter((section) => section.items.length > 0);
  });

  readonly searchEmpty = computed(
    () =>
      this.searchQuery().trim().length > 0 && this.visibleSections().length === 0,
  );

  /**
   * Groups sections into render blocks maintaining original order.
   * - Sections with no label → standalone blocks
   * - Consecutive sections with a label → grouped into a single accordion block
   */
  readonly renderBlocks = computed<RenderBlock[]>(() => {
    const blocks: RenderBlock[] = [];
    let currentAccordionGroup: SubNavShellSection[] = [];

    for (const section of this.visibleSections()) {
      if (section.label) {
        currentAccordionGroup.push(section);
      } else {
        // Flush any pending accordion group
        if (currentAccordionGroup.length) {
          blocks.push({ type: 'accordion', sections: currentAccordionGroup });
          currentAccordionGroup = [];
        }
        blocks.push({ type: 'standalone', section });
      }
    }

    // Flush remaining accordion group
    if (currentAccordionGroup.length) {
      blocks.push({ type: 'accordion', sections: currentAccordionGroup });
    }

    return blocks;
  });

  /** Panel values that are currently expanded */
  readonly expandedPanels = signal<string[]>([]);

  constructor() {
    effect(() => {
      if (!this.searchQuery().trim()) {
        return;
      }

      this.expandedPanels.set(
        this.visibleSections()
          .filter((section) => section.label)
          .map((section) => section.id),
      );
    });
  }

  ngOnInit(): void {
    const expanded = this.sections()
      .filter(s => s.label && !s.collapsed)
      .map(s => s.id);
    this.expandedPanels.set(expanded);
  }

  onItemClick(item: SubNavShellItem): void {
    if (item.disabled) return;
    this.itemClicked.emit(item);
  }

  isActive(item: SubNavShellItem): boolean {
    return this.activeItemId() === item.id;
  }

  openSearch(): void {
    this.searchExpanded.set(true);
    queueMicrotask(() => {
      const el = document.getElementById(this.searchInputId) as HTMLInputElement | null;
      el?.focus();
    });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    const el = document.getElementById(this.searchInputId) as HTMLInputElement | null;
    if (el) {
      el.value = '';
      el.focus();
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.searchQuery.set('');
      this.searchExpanded.set(false);
    }
  }

  onSearchBlur(event: FocusEvent): void {
    const searchField = (event.target as HTMLElement | null)?.closest(
      '.c-sub-nav-shell__search',
    );
    const related = event.relatedTarget;
    if (related instanceof Node && searchField?.contains(related)) {
      return;
    }

    if (!this.searchQuery().trim()) {
      this.searchExpanded.set(false);
    }
  }
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
