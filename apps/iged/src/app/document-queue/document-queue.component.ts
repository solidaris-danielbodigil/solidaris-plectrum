import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { Badge } from 'primeng/badge';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import {
  FormFieldComponent,
  InputClearComponent,
  ToolbarComponent,
  pdsOverlayAppendTo,
} from '@solidaris-danielbodigil/ui';
import { injectIgedMessages } from '../i18n';
import { BreadcrumbService } from '../layout/breadcrumb.service';
import {
  DOCUMENT_QUEUE_ROWS,
  type DocumentQueueRow,
} from './document-queue.mock';

type StatusKey = DocumentQueueRow['etat'];
type TypeKey = DocumentQueueRow['type'];
type AutocompleteId = 'doctype' | 'oa' | 'statuts';
type ToggleId =
  | 'mesDossiers'
  | 'dossiersClotures'
  | 'dossiersUrgents'
  | 'rappels';

interface SavedFilter {
  id: string;
  name: string;
  autocompleteValues: Record<AutocompleteId, string[]>;
  toggleValues: Record<ToggleId, boolean>;
}

interface AutocompleteFilter {
  id: AutocompleteId;
  selectedValues: string[];
}

interface ToggleFilter {
  id: ToggleId;
  value: boolean;
}

@Component({
  selector: 'app-document-queue',
  standalone: true,
  imports: [
    FormsModule,
    AutoComplete,
    Badge,
    ButtonModule,
    Dialog,
    Divider,
    IconField,
    InputIcon,
    InputText,
    Select,
    SelectButton,
    TableModule,
    Tag,
    ToggleSwitch,
    Tooltip,
    FormFieldComponent,
    InputClearComponent,
    ToolbarComponent,
  ],
  templateUrl: './document-queue.component.html',
  host: {
    class:
      'o-flex o-flex--y o-flex__item o-flex__item--grow-1 o-layout o-layout--gap-3 o-layout--min-h-0 o-layout--min-w-0 o-layout--overflow-hidden',
  },
})
export class DocumentQueueComponent {
  private readonly breadcrumbs = inject(BreadcrumbService);
  readonly copy = injectIgedMessages();
  readonly overlayAppendTo = pdsOverlayAppendTo();

  /** Body scrolls inside the flex scroller; horizontal overflow stays on the same container. */
  readonly tablePassThrough = {
    tableContainer: {
      style: {
        overflowX: 'auto',
        overflowY: 'auto',
        minHeight: '0',
      },
    },
  };

  readonly expanded = signal(false);
  readonly draftSearch = signal('');

  readonly savedFilters = signal<SavedFilter[]>([]);
  readonly selectedFilterId = signal<string | null>(null);

  readonly showSaveDialog = signal(false);
  readonly saveFilterName = signal('');
  readonly showDeleteDialog = signal(false);
  readonly showRenameDialog = signal(false);
  readonly renameFilterName = signal('');

  autocompleteFilters: AutocompleteFilter[] = [
    { id: 'doctype', selectedValues: [] },
    { id: 'oa', selectedValues: [] },
    { id: 'statuts', selectedValues: [] },
  ];

  toggleFilters: ToggleFilter[] = [
    { id: 'mesDossiers', value: false },
    { id: 'dossiersClotures', value: false },
    { id: 'dossiersUrgents', value: false },
    { id: 'rappels', value: false },
  ];

  suggestions: Record<AutocompleteId, string[]> = {
    doctype: [],
    oa: [],
    statuts: [],
  };

  private appliedDoctypes: string[] = [];
  private appliedOas: string[] = [];
  private appliedStatuses: string[] = [];
  private appliedToggles: Record<ToggleId, boolean> = {
    mesDossiers: false,
    dossiersClotures: false,
    dossiersUrgents: false,
    rappels: false,
  };
  private readonly appliedRevision = signal(0);

  readonly filterOptions = computed(() =>
    this.savedFilters().map((filter) => ({
      label: filter.name,
      value: filter.id,
    })),
  );

  readonly useDropdown = computed(() => this.savedFilters().length > 4);
  readonly hasSelectedFilter = computed(() => this.selectedFilterId() !== null);

  readonly duplicateExists = computed(() => {
    const name = this.saveFilterName().trim().toLowerCase();
    if (!name) {
      return false;
    }
    return this.savedFilters().some(
      (filter) => filter.name.toLowerCase() === name,
    );
  });

  readonly renameDuplicateExists = computed(() => {
    const name = this.renameFilterName().trim().toLowerCase();
    const id = this.selectedFilterId();
    if (!name || !id) {
      return false;
    }
    return this.savedFilters().some(
      (filter) => filter.id !== id && filter.name.toLowerCase() === name,
    );
  });

  readonly searchPlaceholder = computed(() =>
    this.expanded()
      ? this.copy().queue.searchExpanded
      : this.copy().queue.search,
  );

  readonly sortableColumns = computed(() => {
    const queue = this.copy().queue;
    return [
      { field: 'oa', label: queue.colOa },
      { field: 'ter', label: queue.colTer },
      { field: 'source', label: queue.colSource },
      { field: 'identification', label: queue.colId },
      { field: 'nom', label: queue.colName },
      { field: 'type', label: queue.colType },
      { field: 'dateReception', label: queue.colReceived },
      { field: 'dateEntree', label: queue.colEntered },
      { field: 'dateEtat', label: queue.colStateDate },
      { field: 'etat', label: queue.colState },
    ];
  });

  readonly rowActions = [
    { id: 'lock', icon: 'bi bi-lock' },
    { id: 'view', icon: 'bi bi-eye' },
    { id: 'open', icon: 'bi bi-box-arrow-up-right' },
    { id: 'add', icon: 'bi bi-plus-lg' },
    { id: 'forward', icon: 'bi bi-reply' },
  ] as const;

  private readonly filterUiRevision = signal(0);

  readonly activeFilterCount = computed(() => {
    this.filterUiRevision();
    const all = this.copy().queue.all.toLowerCase();
    const countValues = (values: string[]) =>
      values.filter((value) => value.toLowerCase() !== all).length;
    return (
      countValues(this.fieldValues('doctype')) +
      countValues(this.fieldValues('oa')) +
      countValues(this.fieldValues('statuts')) +
      this.toggleFilters.filter((toggle) => toggle.value).length
    );
  });

  filtersCountAria(): string {
    return this.copy().queue.filtersCountAria.replace(
      '{count}',
      String(this.activeFilterCount()),
    );
  }

  onFilterDraftChange(): void {
    this.filterUiRevision.update((value) => value + 1);
  }

  readonly rows = computed(() => {
    this.copy();
    this.appliedRevision();
    const search = this.draftSearch().trim().toLowerCase();
    const doctypes = this.appliedDoctypes.filter(
      (value) => !this.isAllValue(value),
    );
    const oas = this.appliedOas.filter((value) => !this.isAllValue(value));
    const statuses = this.appliedStatuses.filter(
      (value) => !this.isAllValue(value),
    );
    const toggles = this.appliedToggles;
    const statusKeys = new Set(
      statuses
        .map((label) => this.statusKeyFromLabel(label))
        .filter((key): key is StatusKey => key !== null),
    );
    const typeKeys = new Set(
      doctypes
        .map((label) => this.typeKeyFromLabel(label))
        .filter((key): key is TypeKey => key !== null),
    );

    return DOCUMENT_QUEUE_ROWS.filter((row) => {
      if (
        search &&
        !row.nom.toLowerCase().includes(search) &&
        !row.identification.toLowerCase().includes(search) &&
        !String(row.oa).includes(search) &&
        !this.typeLabel(row.type).toLowerCase().includes(search)
      ) {
        return false;
      }
      if (typeKeys.size && !typeKeys.has(row.type)) {
        return false;
      }
      if (oas.length && !oas.includes(String(row.oa))) {
        return false;
      }
      if (statusKeys.size && !statusKeys.has(row.etat)) {
        return false;
      }
      if (toggles.mesDossiers && !row.mine) {
        return false;
      }
      if (toggles.dossiersClotures && row.etat !== 'cloture') {
        return false;
      }
      if (toggles.dossiersUrgents && !row.urgent) {
        return false;
      }
      if (toggles.rappels && row.etat !== 'rappel') {
        return false;
      }
      return true;
    });
  });

  readonly resultsCountLabel = computed(() =>
    this.copy().queue.resultsCount.replace(
      '{totalRecords}',
      String(this.rows().length),
    ),
  );

  constructor() {
    const all = this.copy().queue.all;
    this.autocompleteFilters[0].selectedValues = [all];
    this.autocompleteFilters[2].selectedValues = [all];

    effect(() => {
      const messages = this.copy();
      this.breadcrumbs.setBreadcrumbs([
        { label: messages.domains.indemnites },
        { label: messages.indemnitesSections.atDc },
        { label: messages.indemnitesItems['at-dc-demande'] },
      ]);
    });
  }

  autocompleteLabel(id: AutocompleteId): string {
    const queue = this.copy().queue;
    switch (id) {
      case 'doctype':
        return queue.doctype;
      case 'oa':
        return queue.oa;
      case 'statuts':
        return queue.status;
    }
  }

  toggleLabel(id: ToggleId): string {
    const queue = this.copy().queue;
    switch (id) {
      case 'mesDossiers':
        return queue.mine;
      case 'dossiersClotures':
        return queue.closed;
      case 'dossiersUrgents':
        return queue.urgent;
      case 'rappels':
        return queue.reminders;
    }
  }

  onAutocompleteSuggest(event: { query: string }, id: AutocompleteId): void {
    const query = event.query.toLowerCase();
    this.suggestions[id] = this.sourceSuggestions(id).filter((item) =>
      item.toLowerCase().includes(query),
    );
  }

  toggleExpanded(): void {
    this.expanded.update((value) => !value);
  }

  applyFilters(): void {
    this.appliedDoctypes = [...this.fieldValues('doctype')];
    this.appliedOas = [...this.fieldValues('oa')];
    this.appliedStatuses = [...this.fieldValues('statuts')];
    this.appliedToggles = this.snapshotToggleValues();
    this.appliedRevision.update((value) => value + 1);
    this.expanded.set(false);
  }

  onApply(): void {
    this.applyFilters();
  }

  onSaveAndApply(): void {
    this.saveFilterName.set('');
    this.showSaveDialog.set(true);
  }

  onConfirmSave(): void {
    const name = this.saveFilterName().trim();
    if (!name || this.duplicateExists()) {
      return;
    }
    this.createNewFilter(name);
  }

  onReplace(): void {
    const name = this.saveFilterName().trim().toLowerCase();
    const existing = this.savedFilters().find(
      (filter) => filter.name.toLowerCase() === name,
    );
    if (!existing) {
      return;
    }

    this.savedFilters.update((filters) =>
      filters.map((filter) =>
        filter.id === existing.id
          ? {
              ...filter,
              autocompleteValues: this.snapshotAutocompleteValues(),
              toggleValues: this.snapshotToggleValues(),
            }
          : filter,
      ),
    );
    this.selectedFilterId.set(existing.id);
    this.showSaveDialog.set(false);
    this.applyFilters();
  }

  onRename(): void {
    if (!this.selectedFilterId()) {
      return;
    }
    this.renameFilterName.set(this.selectedFilterName());
    this.showRenameDialog.set(true);
  }

  onConfirmRename(): void {
    const name = this.renameFilterName().trim();
    const id = this.selectedFilterId();
    if (!name || !id || this.renameDuplicateExists()) {
      return;
    }

    this.savedFilters.update((filters) =>
      filters.map((filter) =>
        filter.id === id ? { ...filter, name } : filter,
      ),
    );
    this.showRenameDialog.set(false);
  }

  onDelete(): void {
    if (!this.selectedFilterId()) {
      return;
    }
    this.showDeleteDialog.set(true);
  }

  onConfirmDelete(): void {
    const id = this.selectedFilterId();
    if (!id) {
      return;
    }

    this.savedFilters.update((filters) =>
      filters.filter((filter) => filter.id !== id),
    );
    const remaining = this.savedFilters();
    this.selectedFilterId.set(remaining.length > 0 ? remaining[0].id : null);
    this.showDeleteDialog.set(false);
  }

  onCancel(): void {
    this.expanded.set(false);
  }

  onFilterSelect(id: string | null): void {
    this.selectedFilterId.set(id);
    if (!id) {
      return;
    }
    const filter = this.savedFilters().find((item) => item.id === id);
    if (!filter) {
      return;
    }
    this.restoreFilter(filter);
    this.applyFilters();
  }

  selectedFilterName(): string {
    const id = this.selectedFilterId();
    if (!id) {
      return '';
    }
    return this.savedFilters().find((filter) => filter.id === id)?.name ?? '';
  }

  deleteConfirmMessage(): string {
    return this.copy().queue.deleteFilterConfirm.replace(
      '{name}',
      this.selectedFilterName(),
    );
  }

  onOpenDocument(_row: DocumentQueueRow): void {
    // POC — no document detail route yet.
  }

  rowActionLabel(id: (typeof this.rowActions)[number]['id']): string {
    const queue = this.copy().queue;
    switch (id) {
      case 'lock':
        return queue.lock;
      case 'view':
        return queue.view;
      case 'open':
        return queue.open;
      case 'add':
        return queue.add;
      case 'forward':
        return queue.forward;
    }
  }

  statusLabel(etat: StatusKey): string {
    return this.statusLabels()[etat];
  }

  typeLabel(type: TypeKey): string {
    return this.typeLabels()[type];
  }

  statusSeverity(
    etat: StatusKey,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (etat) {
      case 'recu':
        return 'info';
      case 'attribue':
        return 'secondary';
      case 'en-traitement':
        return 'warn';
      case 'incomplet':
        return 'danger';
      case 'rappel':
        return 'contrast';
      case 'cloture':
        return 'success';
    }
  }

  private createNewFilter(name: string): void {
    const newFilter: SavedFilter = {
      id: crypto.randomUUID(),
      name,
      autocompleteValues: this.snapshotAutocompleteValues(),
      toggleValues: this.snapshotToggleValues(),
    };

    this.savedFilters.update((filters) => [...filters, newFilter]);
    this.selectedFilterId.set(newFilter.id);
    this.showSaveDialog.set(false);
    this.applyFilters();
  }

  private snapshotAutocompleteValues(): Record<AutocompleteId, string[]> {
    return {
      doctype: [...this.fieldValues('doctype')],
      oa: [...this.fieldValues('oa')],
      statuts: [...this.fieldValues('statuts')],
    };
  }

  private snapshotToggleValues(): Record<ToggleId, boolean> {
    const snapshot: Record<ToggleId, boolean> = {
      mesDossiers: false,
      dossiersClotures: false,
      dossiersUrgents: false,
      rappels: false,
    };
    for (const toggle of this.toggleFilters) {
      snapshot[toggle.id] = toggle.value;
    }
    return snapshot;
  }

  private restoreFilter(saved: SavedFilter): void {
    for (const field of this.autocompleteFilters) {
      if (saved.autocompleteValues[field.id]) {
        field.selectedValues = [...saved.autocompleteValues[field.id]];
      }
    }
    for (const toggle of this.toggleFilters) {
      if (saved.toggleValues[toggle.id] !== undefined) {
        toggle.value = saved.toggleValues[toggle.id];
      }
    }
    this.onFilterDraftChange();
  }

  private fieldValues(id: AutocompleteId): string[] {
    return (
      this.autocompleteFilters.find((field) => field.id === id)
        ?.selectedValues ?? []
    );
  }

  private sourceSuggestions(id: AutocompleteId): string[] {
    const all = this.copy().queue.all;
    switch (id) {
      case 'doctype':
        return [all, ...Object.values(this.typeLabels())];
      case 'oa':
        return [
          all,
          ...new Set(DOCUMENT_QUEUE_ROWS.map((row) => String(row.oa))),
        ];
      case 'statuts':
        return [all, ...Object.values(this.statusLabels())];
    }
  }

  private isAllValue(value: string): boolean {
    return value.toLowerCase() === this.copy().queue.all.toLowerCase();
  }

  private statusKeyFromLabel(label: string): StatusKey | null {
    const entry = Object.entries(this.statusLabels()).find(
      ([, value]) => value === label,
    );
    return (entry?.[0] as StatusKey | undefined) ?? null;
  }

  private typeKeyFromLabel(label: string): TypeKey | null {
    const entry = Object.entries(this.typeLabels()).find(
      ([, value]) => value === label,
    );
    return (entry?.[0] as TypeKey | undefined) ?? null;
  }

  private typeLabels(): Record<TypeKey, string> {
    return this.copy().queue.doctypes;
  }

  private statusLabels(): Record<StatusKey, string> {
    const kpi = this.copy().overview;
    return {
      recu: kpi.kpiRecus,
      attribue: kpi.kpiAttribues,
      'en-traitement': kpi.kpiEnTraitement,
      incomplet: kpi.kpiIncomplets,
      rappel: kpi.kpiRappels,
      cloture: kpi.kpiClotures,
    };
  }
}
