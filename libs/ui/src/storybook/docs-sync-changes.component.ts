// =============================================================================
// libs/ui/src/storybook/docs-sync-changes.component.ts
// Every resolved value the last promoted token sync changed, added, removed or
// re-ordered (Docs/Token pipeline/Sync status). Data: sync-report.generated.ts.
//
// PrimeNG components used:
//   - pds-toolbar — search + kind filter in start, visible / total in end
//   - p-table — the change list, paginated and sortable
//   - p-iconfield + pInputText — search token, value or alias
//   - p-selectButton — filter by change kind (≤ 5 options)
//   - p-tag — change kind per row; p-badge — visible / total count
//   - pds-docs-callout (p-message) — empty states
//
// Styles: c-docs-sync-changes* in libs/styles/src/06-components/_components.docs-figures.scss
// (monospace cells and the colour swatch — PrimeNG and pds-toolbar own the rest).
// The swatch paints the row's own before/after value; it is data, not a token.
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Badge } from 'primeng/badge';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
import { DocsCalloutComponent } from './docs-callout.component';
import {
  changeKindSeverity,
  flattenChanges,
  isColorValue,
  type SyncChangeKind,
  type SyncChangeRow,
  type SyncReport,
} from './sync-report.types';

type KindFilter = SyncChangeKind | 'all';

const KIND_LABEL: Readonly<Record<SyncChangeKind, string>> = {
  changed: 'Changed',
  added: 'Added',
  removed: 'Removed',
  reordered: 'Reordered',
};

@Component({
  selector: 'pds-docs-sync-changes',
  imports: [
    FormsModule,
    TableModule,
    Tag,
    Badge,
    IconField,
    InputIcon,
    InputText,
    SelectButton,
    ToolbarComponent,
    DocsCalloutComponent,
  ],
  templateUrl: './docs-sync-changes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-sync-changes' },
})
export class DocsSyncChangesComponent {
  readonly report = input.required<SyncReport>();
  readonly pageSize = input(25);

  protected readonly search = signal('');
  protected readonly kind = signal<KindFilter>('all');
  protected readonly first = signal(0);

  protected readonly rows = computed<SyncChangeRow[]>(() =>
    flattenChanges(this.report().diff),
  );

  protected readonly kindOptions = computed(() => {
    const rows = this.rows();
    const options: { label: string; value: KindFilter }[] = [
      { label: `All (${rows.length})`, value: 'all' },
    ];
    for (const kind of Object.keys(KIND_LABEL) as SyncChangeKind[]) {
      const count = rows.filter((row) => row.kind === kind).length;
      if (count > 0)
        options.push({ label: `${KIND_LABEL[kind]} (${count})`, value: kind });
    }
    return options;
  });

  protected readonly visible = computed(() => {
    const kind = this.kind();
    const needle = this.search().trim().toLowerCase();
    return this.rows().filter((row) => {
      if (kind !== 'all' && row.kind !== kind) return false;
      if (!needle) return true;
      return [row.path, row.before, row.after, row.alias].some((field) =>
        field?.toLowerCase().includes(needle),
      );
    });
  });

  protected onSearch(value: string): void {
    this.search.set(value);
    this.first.set(0);
  }

  protected onKind(value: KindFilter): void {
    this.kind.set(value);
    this.first.set(0);
  }

  protected kindSeverity(kind: SyncChangeKind) {
    return changeKindSeverity(kind);
  }

  protected kindLabel(kind: SyncChangeKind): string {
    return KIND_LABEL[kind];
  }

  protected isColor(value: string | null | undefined): boolean {
    return isColorValue(value);
  }
}
