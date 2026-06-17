import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
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
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive, AccordionModule, BadgeModule, TooltipModule],
  templateUrl: './sub-nav-shell.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-sub-nav-shell o-flex o-flex--col o-layout--overflow-hidden',
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

  /** Emitted when a menu item is clicked */
  readonly itemClicked = output<SubNavShellItem>();

  /**
   * Groups sections into render blocks maintaining original order.
   * - Sections with no label → standalone blocks
   * - Consecutive sections with a label → grouped into a single accordion block
   */
  readonly renderBlocks = computed<RenderBlock[]>(() => {
    const blocks: RenderBlock[] = [];
    let currentAccordionGroup: SubNavShellSection[] = [];

    for (const section of this.sections()) {
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
}
