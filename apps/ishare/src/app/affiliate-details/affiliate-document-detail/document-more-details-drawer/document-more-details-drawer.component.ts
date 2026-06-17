import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  input,
  model,
  signal,
} from '@angular/core';
import {
  EmptyStateComponent,
  SDS_DRAWER_APPEND_TO,
  SDS_DRAWER_CONTENT_STYLE,
  SDS_PANEL_BORDER_BOTTOM_STYLE,
  normalizeAccordionPanelIds,
} from '@solidaris/ui';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import type { DocumentCertificatPanel } from '../affiliate-document-detail.types';
import {
  isDocumentAuditMultiline,
  isDocumentAuditTag,
} from '../affiliate-document-detail.types';

/**
 * DocumentMoreDetailsDrawerComponent — iSHARE audit trail drawer for certificate panels.
 *
 * Wraps PrimeNG `p-drawer` (headless) with a vertical timeline of audit events,
 * each containing a nested accordion and sortable audit table.
 *
 * ## Figma
 * Node 382:10723 — "drawer - plus de details - certif ITT"
 * https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=382-10723
 */
@Component({
  selector: 'app-document-more-details-drawer',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    Drawer,
    EmptyStateComponent,
    TableModule,
    TagModule,
    TimelineModule,
  ],
  templateUrl: './document-more-details-drawer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-drawer',
  },
})
export class DocumentMoreDetailsDrawerComponent {
  protected readonly drawerAppendTo = SDS_DRAWER_APPEND_TO;
  protected readonly drawerPanelStyle = SDS_DRAWER_CONTENT_STYLE;
  protected readonly drawerPanelBorderStyle = SDS_PANEL_BORDER_BOTTOM_STYLE;
  protected readonly isAuditTag = isDocumentAuditTag;
  protected readonly isAuditMultiline = isDocumentAuditMultiline;

  readonly panel = input<DocumentCertificatPanel | null>(null);
  readonly visible = model<boolean>(false);

  protected readonly expandedEventIds = signal<string[]>([]);

  protected readonly drawerTitle = computed(() => {
    const currentPanel = this.panel();
    return currentPanel ? `Details - ${currentPanel.title}` : '';
  });

  protected readonly events = computed(
    () => this.panel()?.moreDetails?.events ?? [],
  );

  protected readonly hasEvents = computed(() => this.events().length > 0);

  constructor() {
    effect(() => {
      this.expandedEventIds.set(this.events().map((event) => event.id));
    });
  }

  protected onClose(): void {
    this.visible.set(false);
  }

  protected onExpandedEventIdsChange(
    value: string | number | string[] | number[] | null | undefined,
  ): void {
    this.expandedEventIds.set(normalizeAccordionPanelIds(value));
  }
}
