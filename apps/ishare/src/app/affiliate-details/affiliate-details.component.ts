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
import { MessageService, PrimeTemplate } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import {
  AffiliateDetailDrawerComponent,
  EmptyStateComponent,
  FormFieldComponent,
  InputClearComponent,
  ListComponent,
  ToolbarComponent,
  type AffiliateDetailDrawerData,
} from '@solidaris/ui';
import type {
  AffiliateOverviewIdentifier,
  AffiliateOverviewInfoTag,
  AffiliateOverviewInfoTagFilterKey,
  AffiliateOverviewPrimaryAction,
  AffiliateOverviewStatusAction,
  ListDocumentItem,
  ListDocumentTag,
  ListDocumentTagTarget,
  ListGroup,
} from '@solidaris/ui';
import { AffiliateHeaderService } from '../layout/affiliate-header.service';
import { BreadcrumbService } from '../layout/breadcrumb.service';
import { AffiliateDocumentDetailComponent } from './affiliate-document-detail/affiliate-document-detail.component';
import { EVA_MARTINEZ_DOCUMENT_DETAILS } from './affiliate-document-detail/affiliate-document-detail.mock';
import { DocumentMoreDetailsDrawerComponent } from './affiliate-document-detail/document-more-details-drawer/document-more-details-drawer.component';
import {
  COMMENT_ICONS,
  type DocumentCertificatPanel,
  type DocumentCertificatPanelStatusSeverity,
} from './affiliate-document-detail/affiliate-document-detail.types';

interface SectorOption {
  label: string;
  value: string;
}

interface SortOption {
  label: string;
  value: string;
}

type ListTagSeverity = ListDocumentTag['severity'];

/** Severities that {@link ListDocumentTag} accepts (panel comments add `contrast`). */
const LIST_TAG_SEVERITIES: readonly ListTagSeverity[] = [
  'info',
  'warn',
  'success',
  'danger',
  'secondary',
];

/** Icon shown on a derived comment-count tag, keyed by mapped severity. */
const COMMENT_TAG_ICONS: Record<ListTagSeverity, string> = {
  info: COMMENT_ICONS.info,
  warn: COMMENT_ICONS.warn,
  success: 'bi bi-check-circle-fill',
  danger: 'bi bi-exclamation-octagon-fill',
  secondary: COMMENT_ICONS.info,
};

/** Singular noun used to build the tag `ariaLabel`, keyed by mapped severity. */
const COMMENT_TAG_NOUNS: Record<ListTagSeverity, string> = {
  info: 'commentaire',
  warn: 'avertissement',
  success: 'confirmation',
  danger: 'alerte',
  secondary: 'note',
};

/**
 * Maps a panel comment severity onto a {@link ListDocumentTag} severity. Panel
 * comments may carry `contrast`, which the list tag does not support, so any
 * value outside the supported set falls back to `secondary`.
 */
function toListTagSeverity(
  severity: DocumentCertificatPanelStatusSeverity,
): ListTagSeverity {
  return LIST_TAG_SEVERITIES.includes(severity as ListTagSeverity)
    ? (severity as ListTagSeverity)
    : 'secondary';
}

function commentTagAriaLabel(severity: ListTagSeverity, count: number): string {
  const noun = COMMENT_TAG_NOUNS[severity];
  return `${count} ${noun}${count > 1 ? 's' : ''}`;
}

/**
 * Derives a document's count tags from the detail mock so the row badges and the
 * deep-link jump targets share one source of truth. Scans every panel's
 * `workerComment`, groups them by (mapped) severity, and emits one tag per
 * severity whose `targets` point at each commented step/panel. The target `id`
 * is encoded as `` `${stepValue}::${panelId}` `` for the detail component to
 * decode.
 */
export function deriveDocumentTags(documentId: string): ListDocumentTag[] {
  const detail = EVA_MARTINEZ_DOCUMENT_DETAILS[documentId];
  if (!detail) {
    return [];
  }

  const targetsBySeverity = new Map<ListTagSeverity, ListDocumentTagTarget[]>();

  for (const step of detail.steps) {
    for (const panel of step.panels ?? []) {
      if (!panel.workerComment) {
        continue;
      }

      const severity = toListTagSeverity(panel.workerComment.severity);
      const targets = targetsBySeverity.get(severity) ?? [];
      targets.push({
        id: `${step.value}::${panel.id}`,
        label: `${step.label} - ${panel.title}`,
      });
      targetsBySeverity.set(severity, targets);
    }
  }

  return [...targetsBySeverity.entries()].map(([severity, targets]) => ({
    label: String(targets.length),
    severity,
    icon: COMMENT_TAG_ICONS[severity],
    ariaLabel: commentTagAriaLabel(severity, targets.length),
    targets,
  }));
}

function withDerivedTags(document: ListDocumentItem): ListDocumentItem {
  const tags = deriveDocumentTags(document.id);
  return tags.length > 0 ? { ...document, tags } : document;
}

// Row count tags are derived from the detail mock (see `withDerivedTags`) so the
// badge counts and the deep-link jump targets always stay in sync.
const EVA_MARTINEZ_DOCUMENT_GROUPS: ListGroup[] = ([
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
      },
      {
        id: 'doc-incapacite',
        title: 'Incapacité',
        status: {
          label: 'En traitement',
          severity: 'warn',
          icon: 'bi bi-hourglass-split',
        },
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
] as ListGroup[]).map((group) => ({
  ...group,
  documents: group.documents.map(withDerivedTags),
}));

const EVA_MARTINEZ_DRAWER_STATIC: Omit<
  AffiliateDetailDrawerData,
  'name' | 'identifiers'
> = {
  avatarInitials: 'EM',
  avatarGender: 'female',
  avatarVariant: 1,
  generalInfo: [
    { label: 'NSI', value: '00004212182' },
    { label: 'Date de naissance', value: '14/08/1989 (36 ans)' },
    { label: 'Nationalité', value: 'Espagnol (ES)' },
    { label: 'Langue de contact', value: 'Espagnol (ES)' },
  ],
  contactInfo: [
    { label: 'Adresse officielle', value: 'Solidariteitsstraat 5, 2500 Lier' },
    { label: 'E-mail', value: 'lies.verhoeven@gmail.com' },
    { label: 'Numéro de téléphone', value: '+32 89 123 004' },
    { label: 'Numéro de portable', value: '+32 472 987 567' },
  ],
  family: [
    {
      initials: 'Q',
      name: 'Quinten Mota',
      relationship: 'partenaire',
      color: 'blue',
    },
    {
      initials: 'S',
      name: 'Shiloh Mota',
      relationship: 'enfant à charge',
      color: 'green',
    },
    {
      initials: 'J',
      name: 'Jack Mota',
      relationship: 'enfant à charge',
      color: 'yellow',
    },
  ],
  notes: [
    {
      author: 'Eva de Moyer',
      timestamp: '11/11/2022, 09:10',
      body: 'Personne agressive',
      tagLabel: 'Informations sensibles',
      severity: 'sensitive',
    },
    {
      author: 'Bert Luyckx',
      timestamp: '02/12/2023, 16:18',
      body: 'L’affilié est de langue étrangère.',
      tagLabel: 'Remarque libre',
      severity: 'neutral',
    },
    {
      author: 'Bert Luyckx',
      timestamp: '02/12/2023, 16:18',
      body: 'Lorem ipsum',
      tagLabel: 'Informations sensibles',
      severity: 'sensitive',
    },
  ],
};

@Component({
  selector: 'app-affiliate-details',
  standalone: true,
  imports: [
    FormsModule,
    PrimeTemplate,
    ButtonModule,
    AutoCompleteModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CardModule,
    ToggleSwitchModule,
    ToolbarComponent,
    FormFieldComponent,
    InputClearComponent,
    EmptyStateComponent,
    ListComponent,
    AffiliateDocumentDetailComponent,
    AffiliateDetailDrawerComponent,
    DocumentMoreDetailsDrawerComponent,
  ],
  templateUrl: './affiliate-details.component.html',
  styleUrl: './affiliate-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-flex__item--grow-1 o-layout--min-h-0 o-layout--min-w-0' },
})
export class AffiliateDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly affiliateHeaderService = inject(AffiliateHeaderService);
  private readonly messageService = inject(MessageService);
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

  readonly affiliateDetailDrawerVisible = signal(false);

  readonly moreDetailsDrawerVisible = signal(false);
  readonly moreDetailsPanel = signal<DocumentCertificatPanel | null>(null);

  readonly affiliateDetailDrawerData = computed<AffiliateDetailDrawerData>(
    () => ({
      name: this.affiliateName,
      ...EVA_MARTINEZ_DRAWER_STATIC,
      identifiers: this.identifiers().map(({ label, value }) => ({
        label,
        value,
      })),
    }),
  );

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

  // Deep-link target forwarded to the detail card when a row count tag is
  // clicked. Reset to null on a plain row select so a later click does not keep
  // forcing a stale step/panel jump.
  readonly documentFocus = signal<{ stepValue: number; panelId: string } | null>(
    null,
  );

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

  get documentCount(): number {
    if (this.journeyView) {
      return (this.listGroups ?? []).reduce(
        (sum, group) => sum + group.documents.length,
        0,
      );
    }

    return this.listItems.length;
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
    // A plain row select clears any prior deep-link focus so the detail card
    // resets to the document defaults instead of re-jumping to the old panel.
    this.documentFocus.set(null);
    this.selectedDocumentId.set(document.id);
  }

  onTagTargetClick({
    doc,
    target,
  }: {
    doc: ListDocumentItem;
    tag: ListDocumentTag;
    target: ListDocumentTagTarget;
  }): void {
    const separator = target.id.indexOf('::');
    if (separator < 0) {
      return;
    }

    const stepValue = Number(target.id.slice(0, separator));
    const panelId = target.id.slice(separator + 2);
    if (Number.isNaN(stepValue) || panelId.length === 0) {
      return;
    }

    this.selectedDocumentId.set(doc.id);
    this.documentFocus.set({ stepValue, panelId });
  }

  onSelectedDocumentIdChange(documentId: string): void {
    // Prev/next document navigation is a plain selection, so drop any deep-link
    // focus from an earlier tag click.
    this.documentFocus.set(null);
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

  onPrimaryActionClick(): void {
    this.affiliateDetailDrawerVisible.set(true);
  }

  onMoreDetailsOpen(panel: DocumentCertificatPanel): void {
    this.moreDetailsPanel.set(panel);
    this.moreDetailsDrawerVisible.set(true);
  }

  onDrawerMenuClick(): void {
    // PLACEHOLDER — drawer menu actions wired in a later iteration.
  }

  onDrawerQuickActionsClick(): void {
    // PLACEHOLDER — drawer quick actions wired in a later iteration.
  }

  onDrawerIdentifierCopy(identifier: {
    label: string;
    value: string;
  }): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Copié !',
      detail: `${identifier.label}: ${identifier.value}`,
    });
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
        onPrimaryActionClick: () => this.onPrimaryActionClick(),
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
