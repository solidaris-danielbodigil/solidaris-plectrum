import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import {
  EmptyStateComponent,
  FormFieldComponent,
  InputClearComponent,
  ListComponent,
  ToolbarComponent,
} from '@solidaris/ui';
import type {
  AffiliateOverviewIdentifier,
  AffiliateOverviewInfoTag,
  AffiliateOverviewInfoTagFilterKey,
  AffiliateOverviewPrimaryAction,
  AffiliateOverviewStatusAction,
  ListDocumentItem,
  ListGroup,
} from '@solidaris/ui';
import { AffiliateHeaderService } from '../layout/affiliate-header.service';
import { BreadcrumbService } from '../layout/breadcrumb.service';
import { AffiliateDocumentDetailComponent } from './affiliate-document-detail/affiliate-document-detail.component';

interface SectorOption {
  label: string;
  value: string;
}

interface SortOption {
  label: string;
  value: string;
}

const EVA_MARTINEZ_DOCUMENT_GROUPS: ListGroup[] = [
  {
    id: 'parcours-demande-primaire',
    title: 'Parcours Indemnités -',
    titleAccent: 'Demande primaire',
    startDate: '24/11/2025',
    endDate: '24/12/2025',
    expanded: true,
    documents: [
      {
        id: 'doc-demande-primaire',
        title: 'Demande primaire -',
        titleLine2: 'Régime général',
        status: {
          label: 'En traitement',
          severity: 'warn',
          icon: 'bi bi-hourglass-split',
        },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          {
            label: '1',
            severity: 'warn',
            icon: 'bi bi-exclamation-triangle-fill',
          },
        ],
      },
      {
        id: 'doc-incapacite',
        title: 'Incapacité',
        status: {
          label: 'En traitement',
          severity: 'warn',
          icon: 'bi bi-hourglass-split',
        },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          {
            label: '1',
            severity: 'warn',
            icon: 'bi bi-exclamation-triangle-fill',
          },
        ],
      },
    ],
  },
  {
    id: 'parcours-rechute',
    title: 'Parcours Indemnités -',
    titleAccent: 'Rechute',
    startDate: '01/01/2026',
    endDate: '15/01/2026',
    expanded: true,
    documents: [
      {
        id: 'doc-rechute',
        title: 'Rechute',
        status: {
          label: 'En traitement',
          severity: 'warn',
          icon: 'bi bi-hourglass-split',
        },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          {
            label: '1',
            severity: 'warn',
            icon: 'bi bi-exclamation-triangle-fill',
          },
        ],
      },
    ],
  },
  {
    id: 'parcours-clotures',
    title: 'Parcours Indemnités -',
    titleAccent: 'Documents clôturés',
    startDate: '01/06/2025',
    endDate: '12/04/2026',
    expanded: false,
    documents: [
      {
        id: 'doc-cloture-primaire',
        title: 'Demande primaire -',
        titleLine2: 'Régime général',
        status: {
          label: 'Clôturé',
          severity: 'success',
          icon: 'bi bi-check-lg',
        },
      },
      {
        id: 'doc-cloture-incapacite',
        title: 'Incapacité',
        status: {
          label: 'Clôturé',
          severity: 'success',
          icon: 'bi bi-check-lg',
        },
      },
      {
        id: 'doc-cloture-indemnites',
        title: 'Indemnités',
        status: {
          label: 'Clôturé',
          severity: 'success',
          icon: 'bi bi-check-lg',
        },
      },
    ],
  },
];

@Component({
  selector: 'app-affiliate-details',
  standalone: true,
  imports: [
    FormsModule,
    AutoCompleteModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ToggleSwitchModule,
    ToolbarComponent,
    FormFieldComponent,
    InputClearComponent,
    EmptyStateComponent,
    ListComponent,
    AffiliateDocumentDetailComponent,
  ],
  templateUrl: './affiliate-details.component.html',
  styleUrl: './affiliate-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliateDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly affiliateHeaderService = inject(AffiliateHeaderService);
  private readonly destroyRef = inject(DestroyRef);

  // PLACEHOLDER affiliate data — real data binding (lookup by route id) comes in
  // the next iteration. The Eva Martinez "warning" example mirrors the Figma SSOT
  // (iSHARE-Audit node 324:5744).
  readonly affiliateName = 'Eva Martinez';

  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  /** Searched identifier passed from the home search page (route param). */
  readonly affiliateId = computed(() => this.routeParams().get('id') ?? '');

  readonly statusAction: AffiliateOverviewStatusAction = {
    label: 'Action requise',
    icon: 'bi bi-exclamation-triangle-fill',
  };

  readonly documentInfoFilter =
    signal<AffiliateOverviewInfoTagFilterKey | null>(null);

  readonly infoTags = computed<AffiliateOverviewInfoTag[]>(() => {
    const allDocuments = EVA_MARTINEZ_DOCUMENT_GROUPS.flatMap(
      (group) => group.documents,
    );
    const activeCount = allDocuments.filter(isActiveDocument).length;
    const closedCount = allDocuments.filter(isClosedDocument).length;
    const filter = this.documentInfoFilter();

    return [
      {
        label: 'Dernière action:',
        value: this.lastActionLabel(),
        filterKey: 'last-action',
        active: filter === 'last-action',
      },
      {
        label: 'Documents actifs:',
        value: String(activeCount),
        filterKey: 'active-documents',
        active: filter === 'active-documents',
      },
      {
        label: 'Documents clôturés:',
        value: String(closedCount),
        filterKey: 'closed-documents',
        active: filter === 'closed-documents',
      },
    ];
  });

  // The NISS chip echoes the identifier searched on the home page when present.
  readonly identifiers = computed<AffiliateOverviewIdentifier[]>(() => [
    { label: 'Territoire', value: '319' },
    { label: 'NSI', value: '00004212182' },
    { label: 'N° de contrat', value: '1241786-19630928-2' },
    { label: 'NISS', value: this.affiliateId() || '63092814612' },
  ]);

  readonly primaryAction: AffiliateOverviewPrimaryAction = {
    label: 'Voir carte affilié',
    icon: 'bi bi-eye',
    shortcut: 'ALT + A',
  };

  // Document filter toolbar — static mock data for Eva Martinez demo (Figma 324:5772).
  readonly sectorOptions: SectorOption[] = [
    { label: '319', value: '319' },
    { label: '412', value: '412' },
    { label: '507', value: '507' },
  ];

  readonly sortOptions: SortOption[] = [
    { label: 'Actions en cours', value: 'actions-en-cours' },
    { label: 'Date de réception', value: 'date-reception' },
    { label: 'Nom du document', value: 'nom-document' },
  ];

  readonly documentSearch = signal('');

  clearDocumentSearch(): void {
    this.documentSearch.set('');
  }

  selectedSector: SectorOption | null = this.sectorOptions[0];
  sectorSuggestions: SectorOption[] = [...this.sectorOptions];
  readonly selectedSort = signal<SortOption | null>(this.sortOptions[0]);
  sortSuggestions: SortOption[] = [...this.sortOptions];
  journeyView = true;
  readonly archivedOnly = signal(false);

  readonly expandedGroupIds = signal(
    EVA_MARTINEZ_DOCUMENT_GROUPS.filter((group) => group.expanded).map(
      (group) => group.id,
    ),
  );

  // Second-column document detail viewer — Figma iSHARE-Audit node 324:5860.
  // https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1
  readonly selectedDocumentId = signal('doc-demande-primaire');

  readonly visibleDocuments = computed(() =>
    this.filterDocuments(
      EVA_MARTINEZ_DOCUMENT_GROUPS.flatMap((group) => group.documents),
    ),
  );

  get listGroups(): ListGroup[] | null {
    if (!this.journeyView) {
      return null;
    }

    let groups = EVA_MARTINEZ_DOCUMENT_GROUPS;

    if (this.documentInfoFilter() === 'last-action') {
      const latestGroupId = this.latestJourneyGroupId();
      groups = groups.filter((group) => group.id === latestGroupId);
    }

    return groups
      .map((group) => ({
        ...group,
        documents: this.filterDocuments(group.documents),
      }))
      .filter((group) => group.documents.length > 0);
  }

  get listItems(): ListDocumentItem[] {
    if (this.journeyView) {
      return [];
    }

    return this.filterDocuments(
      EVA_MARTINEZ_DOCUMENT_GROUPS.flatMap((group) => group.documents),
    );
  }

  get hasListResults(): boolean {
    if (this.journeyView) {
      return (this.listGroups ?? []).length > 0;
    }

    return this.listItems.length > 0;
  }

  filterSectors(event: { query: string }): void {
    const query = event.query.trim().toLowerCase();

    this.sectorSuggestions = query
      ? this.sectorOptions.filter(
          (option) =>
            option.label.toLowerCase().includes(query) ||
            option.value.includes(query),
        )
      : [...this.sectorOptions];
  }

  filterSortOptions(event: { query: string }): void {
    const query = event.query.trim().toLowerCase();

    this.sortSuggestions = query
      ? this.sortOptions.filter((option) =>
          option.label.toLowerCase().includes(query),
        )
      : [...this.sortOptions];
  }

  onExpandedGroupIdsChange(expandedGroupIds: string[]): void {
    this.expandedGroupIds.set(expandedGroupIds);
  }

  onDocumentClick(document: ListDocumentItem): void {
    this.selectedDocumentId.set(document.id);
  }

  onSelectedDocumentIdChange(documentId: string): void {
    this.selectedDocumentId.set(documentId);
  }

  onInfoTagClick(tag: AffiliateOverviewInfoTag): void {
    if (!tag.filterKey) {
      return;
    }

    const current = this.documentInfoFilter();
    this.documentInfoFilter.set(
      current === tag.filterKey ? null : tag.filterKey,
    );
  }

  private lastActionLabel(): string {
    const latestGroup = this.latestJourneyGroup();

    if (!latestGroup?.endDate) {
      return '—';
    }

    return `Document reçu ${latestGroup.endDate}`;
  }

  private latestJourneyGroup(): ListGroup | null {
    const latestGroupId = this.latestJourneyGroupId();

    return (
      EVA_MARTINEZ_DOCUMENT_GROUPS.find((group) => group.id === latestGroupId) ??
      null
    );
  }

  private latestJourneyGroupId(): string {
    const groupsWithEndDate = EVA_MARTINEZ_DOCUMENT_GROUPS.filter(
      (group) => group.endDate,
    );

    if (groupsWithEndDate.length === 0) {
      return EVA_MARTINEZ_DOCUMENT_GROUPS[0]?.id ?? '';
    }

    return groupsWithEndDate.reduce((latest, group) =>
      parseFrenchDate(group.endDate!) > parseFrenchDate(latest.endDate!)
        ? group
        : latest,
    ).id;
  }

  private filterDocuments(documents: ListDocumentItem[]): ListDocumentItem[] {
    if (this.archivedOnly()) {
      return documents.filter(isClosedDocument);
    }

    const query = this.documentSearch().trim().toLowerCase();
    let filtered = query
      ? documents.filter(
          (document) =>
            document.title.toLowerCase().includes(query) ||
            document.titleLine2?.toLowerCase().includes(query),
        )
      : [...documents];

    const infoFilter = this.documentInfoFilter();
    if (infoFilter === 'active-documents') {
      filtered = filtered.filter(isActiveDocument);
    } else if (infoFilter === 'closed-documents') {
      filtered = filtered.filter(isClosedDocument);
    } else if (infoFilter === 'last-action') {
      const latestGroup = this.latestJourneyGroup();
      const latestDocumentIds = new Set(
        latestGroup?.documents.map((document) => document.id) ?? [],
      );
      filtered = filtered.filter((document) =>
        latestDocumentIds.has(document.id),
      );
    }

    if (this.selectedSort()?.value === 'nom-document') {
      filtered = [...filtered].sort((left, right) =>
        left.title.localeCompare(right.title),
      );
    }

    return filtered;
  }

  constructor() {
    effect(() => {
      const visible = this.visibleDocuments();
      const selected = this.selectedDocumentId();

      if (
        visible.length > 0 &&
        !visible.some((document) => document.id === selected)
      ) {
        this.selectedDocumentId.set(visible[0].id);
      }
    });

    effect(() => {
      this.archivedOnly();

      if (!this.journeyView || !this.archivedOnly()) {
        return;
      }

      const groupIds =
        this.listGroups
          ?.filter((group) => group.documents.length > 0)
          .map((group) => group.id) ?? [];

      if (groupIds.length === 0) {
        return;
      }

      const current = this.expandedGroupIds();
      const missing = groupIds.filter((id) => !current.includes(id));

      if (missing.length > 0) {
        this.expandedGroupIds.set([...current, ...missing]);
      }
    });

    effect(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'iShare' },
        { label: "Recherche d'affilié", routerLink: '/home' },
        { label: this.affiliateName },
      ]);

      this.affiliateHeaderService.setHeader({
        title: this.affiliateName,
        variant: 'warning',
        avatarGender: 'female',
        avatarVariant: 1,
        avatarInitials: 'EM',
        statusAction: this.statusAction,
        infoTags: this.infoTags(),
        identifiers: this.identifiers(),
        primaryAction: this.primaryAction,
        onInfoTagClick: (tag) => this.onInfoTagClick(tag),
      });
    });

    this.destroyRef.onDestroy(() => {
      this.affiliateHeaderService.clearHeader();
    });
  }
}

function isActiveDocument(document: ListDocumentItem): boolean {
  return document.status?.label !== 'Clôturé';
}

function isClosedDocument(document: ListDocumentItem): boolean {
  return document.status?.label === 'Clôturé';
}

function parseFrenchDate(value: string): number {
  const [day, month, year] = value.split('/').map(Number);

  return new Date(year, month - 1, day).getTime();
}
