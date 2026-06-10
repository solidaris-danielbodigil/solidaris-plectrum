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
import { EmptyStateComponent } from '@solidaris/ui';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import type {
  DocumentAuditDescription,
  DocumentCertificatPanel,
} from '../affiliate-document-detail.types';
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
  styleUrl: './document-more-details-drawer.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentMoreDetailsDrawerComponent {
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
    if (value === null || value === undefined) {
      this.expandedEventIds.set([]);
      return;
    }

    if (Array.isArray(value)) {
      this.expandedEventIds.set(value.map(String));
      return;
    }

    this.expandedEventIds.set([String(value)]);
  }

  protected isAuditTag(description: DocumentAuditDescription): boolean {
    return isDocumentAuditTag(description);
  }

  protected isAuditMultiline(description: DocumentAuditDescription): boolean {
    return isDocumentAuditMultiline(description);
  }

}
