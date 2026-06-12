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
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import {
  AffiliateDetailDrawerComponent,
  EmptyStateComponent,
  FormFieldComponent,
  InputClearComponent,
  ListComponent,
  TestingTelemetryService,
  ToolbarComponent,
  TransactionsCicsModalComponent,
  type AffiliateDetailDrawerData,
  type AffiliateDetailDrawerFamilyMember,
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
import { environment } from '../../environments/environment';
import {
  familyMembersForDossier,
  resolveAffiliateProfile,
  resolveFamilyMemberNiss,
} from './affiliate-family-mock';
import {
  isEvaMartinezAffiliate,
  isKnownFamilyMember,
  JACK_MOTA_NISS,
} from './affiliate-mock.constants';
import {
  COMMENT_ICONS,
  commentCountTagSeverity,
  type AffiliateDocumentDetail,
  type DocumentCertificatPanel,
  type DocumentCertificatPanelStatusSeverity,
  type DocumentCrossReference,
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

/**
 * Visual severity for list comment-count tags. Applies the shared comment-count
 * mapping (info → `secondary`, see {@link commentCountTagSeverity}) and then
 * narrows to a {@link ListTagSeverity}, since the list tag does not support
 * `contrast`.
 */
function commentCountListTagSeverity(
  panelSeverity: DocumentCertificatPanelStatusSeverity,
): ListTagSeverity {
  return toListTagSeverity(commentCountTagSeverity(panelSeverity));
}

function commentTagAriaLabel(severity: ListTagSeverity, count: number): string {
  const noun = COMMENT_TAG_NOUNS[severity];
  return `${count} ${noun}${count > 1 ? 's' : ''}`;
}

function commentTagAriaLabelForBucket(
  displaySeverity: ListTagSeverity,
  panelSeverities: DocumentCertificatPanelStatusSeverity[],
  count: number,
): string {
  const nounSeverity: ListTagSeverity =
    displaySeverity === 'secondary' &&
    panelSeverities.every((severity) => severity === 'info')
      ? 'info'
      : displaySeverity;

  return commentTagAriaLabel(nounSeverity, count);
}

/**
 * Derives a document's count tags from the detail mock so the row badges and the
 * deep-link jump targets share one source of truth. Scans every panel's
 * `workerComment`, groups them by (mapped) severity, and emits one tag per
 * severity whose `targets` point at each commented step/panel. The target `id`
 * is encoded as `` `${stepValue}::${panelId}` `` for the detail component to
 * decode.
 */
export function deriveDocumentTags(
  documentId: string,
  details: Record<string, AffiliateDocumentDetail> = EVA_MARTINEZ_DOCUMENT_DETAILS,
): ListDocumentTag[] {
  const detail = details[documentId];
  if (!detail) {
    return [];
  }

  const targetsBySeverity = new Map<
    ListTagSeverity,
    {
      targets: ListDocumentTagTarget[];
      panelSeverities: DocumentCertificatPanelStatusSeverity[];
    }
  >();

  const addTarget = (
    displaySeverity: ListTagSeverity,
    panelSeverity: DocumentCertificatPanelStatusSeverity,
    target: ListDocumentTagTarget,
  ): void => {
    const bucket = targetsBySeverity.get(displaySeverity) ?? {
      targets: [],
      panelSeverities: [],
    };
    bucket.targets.push(target);
    bucket.panelSeverities.push(panelSeverity);
    targetsBySeverity.set(displaySeverity, bucket);
  };

  for (const step of detail.steps) {
    for (const panel of step.panels ?? []) {
      if (!panel.workerComment) {
        continue;
      }

      const targetLabel =
        detail.layout === 'standalone'
          ? panel.title
          : `${step.label} - ${panel.title}`;

      addTarget(
        commentCountListTagSeverity(panel.workerComment.severity),
        panel.workerComment.severity,
        {
          id: `${step.value}::${panel.id}`,
          label: targetLabel,
        },
      );
    }
  }

  return [...targetsBySeverity.entries()].map(([severity, bucket]) => ({
    label: String(bucket.targets.length),
    severity,
    icon: COMMENT_TAG_ICONS[severity],
    ariaLabel: commentTagAriaLabelForBucket(
      severity,
      bucket.panelSeverities,
      bucket.targets.length,
    ),
    targets: bucket.targets,
  }));
}

function withDerivedTags(
  document: ListDocumentItem,
  details: Record<string, AffiliateDocumentDetail> = EVA_MARTINEZ_DOCUMENT_DETAILS,
): ListDocumentItem {
  const tags = deriveDocumentTags(document.id, details);
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
    endDate: '27/12/2025',
    expanded: false,
    documents: [
      {
        id: 'doc-demande-primaire',
        title: 'Demande primaire -',
        titleLine2: 'Régime général',
        status: {
          label: 'En attente',
          severity: 'info',
          icon: 'bi bi-clock',
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
    expanded: false,
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
    titleAccent: 'Demande primaire',
    startDate: '20/01/2026',
    endDate: '12/06/2026',
    expanded: false,
    documents: [
      {
        id: 'doc-cloture-primaire',
        title: 'Demande primaire -',
        titleLine2: 'Régime général',
        status: {
          label: 'En attente',
          severity: 'info',
          icon: 'bi bi-clock',
        },
      },
    ],
  },
] as ListGroup[]).map((group) => ({
  ...group,
  documents: group.documents.map((document) =>
    withDerivedTags(document, EVA_MARTINEZ_DOCUMENT_DETAILS),
  ),
}));

/** Hors-parcours documents — merged into flat list, excluded from journey groups. */
export const EVA_MARTINEZ_STANDALONE_DOCUMENTS: ListDocumentItem[] = [
  {
    id: 'doc-c4',
    title: 'C4',
    titleLine2: 'Attestation C4',
    status: {
      label: 'Reçu',
      severity: 'info',
      icon: 'bi bi-save',
    },
  },
  {
    id: 'doc-attestation-pedicure',
    title: 'Attestation de soin pédicure',
    status: {
      label: 'En traitement',
      severity: 'warn',
      icon: 'bi bi-hourglass-split',
    },
  },
].map((document) =>
  withDerivedTags(document as ListDocumentItem, EVA_MARTINEZ_DOCUMENT_DETAILS),
);

const STANDALONE_DOCUMENT_IDS = new Set(
  EVA_MARTINEZ_STANDALONE_DOCUMENTS.map((document) => document.id),
);

type DocumentSector = SectorOption['value'];

const DOCUMENT_SECTOR_BY_ID = new Map<string, DocumentSector>([
  ['doc-demande-primaire', 'indemnites'],
  ['doc-incapacite', 'indemnites'],
  ['doc-rechute', 'indemnites'],
  ['doc-cloture-primaire', 'indemnites'],
  ['doc-c4', 'indemnites'],
  ['doc-attestation-pedicure', 'front-office'],
  ['doc-jack-certificat', 'medical'],
]);

const STATUS_SORT_PRIORITY: Record<string, number> = {
  'En attente': 0,
  'En traitement': 1,
  Reçu: 2,
  Accepté: 3,
  Clôturé: 4,
};

const JACK_MOTA_DOCUMENTS: ListDocumentItem[] = [
  {
    id: 'doc-jack-certificat',
    title: 'Certificat médical',
    status: {
      label: 'En traitement',
      severity: 'warn',
      icon: 'bi bi-hourglass-split',
    },
  },
];

const DOCUMENT_RECEPTION_DATE_BY_ID = new Map<string, string>([
  ...EVA_MARTINEZ_DOCUMENT_GROUPS.flatMap((group) =>
    group.documents.map((document) => {
      const receptionById: Record<string, string> = {
        'doc-demande-primaire': '24/11/2025',
        'doc-incapacite': '24/11/2025',
        'doc-rechute': '01/01/2026',
        'doc-cloture-primaire': '20/01/2026',
      };
      return [
        document.id,
        receptionById[document.id] ?? group.startDate ?? '',
      ] as const;
    }),
  ),
  ['doc-c4', '16/12/2025'],
  ['doc-attestation-pedicure', '09/06/2026'],
  ['doc-jack-certificat', '01/03/2026'],
]);

function allEvaMartinezDocuments(): ListDocumentItem[] {
  return [
    ...EVA_MARTINEZ_DOCUMENT_GROUPS.flatMap((group) => group.documents),
    ...EVA_MARTINEZ_STANDALONE_DOCUMENTS,
  ];
}

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
    TagModule,
    ToggleSwitchModule,
    TooltipModule,
    ToolbarComponent,
    FormFieldComponent,
    InputClearComponent,
    EmptyStateComponent,
    ListComponent,
    AffiliateDocumentDetailComponent,
    AffiliateDetailDrawerComponent,
    DocumentMoreDetailsDrawerComponent,
    TransactionsCicsModalComponent,
  ],
  templateUrl: './affiliate-details.component.html',
  styleUrl: './affiliate-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-flex__item--grow-1 o-layout--min-h-0 o-layout--min-w-0' },
})
export class AffiliateDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly affiliateHeaderService = inject(AffiliateHeaderService);
  private readonly messageService = inject(MessageService);
  private readonly telemetry = inject(TestingTelemetryService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  /** Searched identifier passed from the home search page (route param). */
  readonly affiliateId = computed(() => this.routeParams().get('id') ?? '');

  readonly affiliateProfile = computed(() =>
    resolveAffiliateProfile(this.affiliateId()),
  );

  readonly isEvaDossier = computed(() =>
    isEvaMartinezAffiliate(this.affiliateId()),
  );

  readonly affiliateName = computed(() => this.affiliateProfile().name);

  private static readonly EVA_INCAPACITY_PAYMENT_STATUS_ACTION: AffiliateOverviewStatusAction =
    {
      label: 'Paiement non versé',
      icon: 'bi bi-exclamation-triangle-fill',
      ariaLabel: 'Voir le détail — paiement non versé',
    };

  private static readonly EVA_INCAPACITY_PAYMENT_DEEP_LINK = {
    documentId: 'doc-incapacite',
    groupId: 'parcours-demande-primaire',
    stepValue: 1,
    panelId: 'paiement-incapacite',
  } as const;

  readonly statusAction = computed((): AffiliateOverviewStatusAction | null =>
    this.isEvaDossier()
      ? AffiliateDetailsComponent.EVA_INCAPACITY_PAYMENT_STATUS_ACTION
      : null,
  );

  readonly documentInfoFilter =
    signal<AffiliateOverviewInfoTagFilterKey | null>(null);

  readonly transactionsCicsDialogVisible = signal(false);

  readonly infoTags = computed<AffiliateOverviewInfoTag[]>(() => {
    const allDocuments = this.allDocumentsForContext();
    const activeCount = allDocuments.filter(isActiveDocument).length;
    const closedCount = allDocuments.filter(isClosedDocument).length;
    const filter = this.documentInfoFilter();
    const tags: AffiliateOverviewInfoTag[] = [];

    const lastActionDate = this.lastActionDateValue(allDocuments);
    if (lastActionDate) {
      tags.push({
        label: 'Dernière action:',
        value: lastActionDate,
        filterKey: 'last-action',
        active: filter === 'last-action',
      });
    }

    if (activeCount > 0) {
      tags.push({
        label: 'Documents actifs:',
        value: String(activeCount),
        filterKey: 'active-documents',
        active: filter === 'active-documents',
      });
    }

    if (closedCount > 0) {
      tags.push({
        label: 'Documents clôturés:',
        value: String(closedCount),
        filterKey: 'closed-documents',
        active: filter === 'closed-documents',
      });
    }

    return tags;
  });

  // The NISS chip echoes the identifier searched on the home page when present.
  readonly identifiers = computed<AffiliateOverviewIdentifier[]>(() => {
    const profile = this.affiliateProfile();

    return [
      { label: 'Territoire', value: '319' },
      { label: 'NSI', value: profile.nsi },
      { label: 'N° de contrat', value: profile.contractNumber },
      { label: 'NISS', value: profile.niss },
    ];
  });

  readonly primaryAction: AffiliateOverviewPrimaryAction = {
    label: 'Voir carte affilié',
    icon: 'bi bi-eye',
    shortcut: 'ALT + A',
  };

  readonly affiliateDetailDrawerVisible = signal(false);

  readonly moreDetailsDrawerVisible = signal(false);
  readonly moreDetailsPanel = signal<DocumentCertificatPanel | null>(null);

  readonly affiliateDetailDrawerData = computed<AffiliateDetailDrawerData>(
    () => {
      const profile = this.affiliateProfile();

      return {
        name: profile.name,
        avatarInitials: profile.avatarInitials,
        avatarGender: profile.avatarGender,
        avatarVariant: profile.avatarVariant,
        generalInfo: profile.generalInfo,
        contactInfo: profile.contactInfo,
        family: familyMembersForDossier(profile.niss),
        notes: [],
        identifiers: this.identifiers().map(({ label, value }) => ({
          label,
          value,
        })),
      };
    },
  );

  // Document filter toolbar — static mock data for Eva Martinez demo (Figma 324:5772).
  readonly sectorOptions: SectorOption[] = [
    { label: 'Tous', value: '' },
    { label: 'indémnités', value: 'indemnites' },
    { label: 'front-office', value: 'front-office' },
    { label: 'médical', value: 'medical' },
    { label: 'population', value: 'population' },
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

  readonly selectedSector = signal<SectorOption | null>(null);
  sectorSuggestions: SectorOption[] = [...this.sectorOptions];
  readonly selectedSort = signal<SortOption | null>(this.sortOptions[1]);
  sortSuggestions: SortOption[] = [...this.sortOptions];
  readonly journeyView = signal(true);
  readonly archivedOnly = signal(false);

  readonly expandedGroupIds = signal<string[]>([]);

  /** Ensures the first journey group is expanded only once on initial load. */
  private defaultJourneyExpansionApplied = false;

  /** Journey groups: `true` = oldest start date first. */
  readonly startDateSortAscending = signal(true);

  /** Flat list: `false` = newest reception date first (default). */
  readonly flatListSortAscending = signal(false);

  readonly isFlatListMode = computed(() => !this.journeyView());

  readonly activeSortAscending = computed(() =>
    this.isFlatListMode()
      ? this.flatListSortAscending()
      : this.startDateSortAscending(),
  );

  readonly startDateSortIcon = computed(() =>
    this.activeSortAscending() ? 'bi bi-sort-up' : 'bi bi-sort-down',
  );

  readonly startDateSortAriaLabel = computed(() =>
    this.activeSortAscending()
      ? 'Trier du plus ancien au plus récent'
      : 'Trier du plus récent au plus ancien',
  );

  readonly standaloneDocumentCount = computed(() =>
    this.isEvaDossier() ? EVA_MARTINEZ_STANDALONE_DOCUMENTS.length : 0,
  );

  readonly showHorsParcoursChip = computed(
    () =>
      this.isEvaDossier() &&
      this.journeyView() &&
      this.standaloneDocumentCount() > 0,
  );

  readonly horsParcoursChipLabel = computed(() => {
    const count = this.standaloneDocumentCount();
    return `+ ${count} hors parcours`;
  });

  readonly journeyViewTooltip = computed(() =>
    this.journeyView()
      ? 'Masque les documents hors parcours'
      : 'Affiche les documents par parcours',
  );

  readonly emptyListTitle = computed(() => {
    const hasDocuments = this.allDocumentsForContext().length > 0;
    const isFilteredEmpty =
      hasDocuments && this.visibleDocuments().length === 0;

    if (!hasDocuments && isKnownFamilyMember(this.affiliateId())) {
      return 'Aucun document actif pour cet affilié';
    }

    return isFilteredEmpty
      ? 'Aucun document trouvé'
      : 'Aucun document actif pour cet affilié';
  });

  readonly emptyListDescription = computed(() => {
    const hasDocuments = this.allDocumentsForContext().length > 0;
    const isFilteredEmpty =
      hasDocuments && this.visibleDocuments().length === 0;

    if (!hasDocuments && isKnownFamilyMember(this.affiliateId())) {
      return 'Aucun document en cours pour cet affilié.';
    }

    return isFilteredEmpty
      ? 'Aucun document ne correspond aux filtres sélectionnés.'
      : 'Aucun document en cours pour cet affilié.';
  });

  // Second-column document detail viewer — Figma iSHARE-Audit node 324:5860.
  // https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1
  readonly selectedDocumentId = signal<string | null>(null);

  // Deep-link target forwarded to the detail card when a row count tag is
  // clicked. Reset to null on a plain row select so a later click does not keep
  // forcing a stale step/panel jump.
  readonly documentFocus = signal<{ stepValue: number; panelId: string } | null>(
    null,
  );

  readonly filteredDocuments = computed(() =>
    this.applyDocumentFilters(this.allDocumentsForContext()),
  );

  readonly visibleDocuments = computed(() =>
    this.sortDocuments(this.filteredDocuments()),
  );

  /**
   * Journey view hides hors-parcours rows in grouped mode. When filters narrow
   * results to standalone documents only, switch the list to flat presentation.
   */
  readonly shouldUseFlatListPresentation = computed(() => {
    if (!this.journeyView() || !this.isEvaDossier()) {
      return !this.journeyView();
    }

    const filtered = this.filteredDocuments();
    const hasStandalone = filtered.some((document) =>
      STANDALONE_DOCUMENT_IDS.has(document.id),
    );
    const hasGrouped = filtered.some(
      (document) => !STANDALONE_DOCUMENT_IDS.has(document.id),
    );

    return hasStandalone && !hasGrouped;
  });

  readonly listGroups = computed((): ListGroup[] | null => {
    if (
      !this.journeyView() ||
      !this.isEvaDossier() ||
      this.shouldUseFlatListPresentation()
    ) {
      return null;
    }

    const visibleIds = new Set(this.filteredDocuments().map((doc) => doc.id));

    let groups = EVA_MARTINEZ_DOCUMENT_GROUPS;

    if (this.documentInfoFilter() === 'last-action') {
      const latestGroupId = this.latestJourneyGroupId();
      groups = groups.filter((group) => group.id === latestGroupId);
    }

    return this.sortGroupsByStartDate(
      groups
        .map((group) => ({
          ...group,
          documents: this.sortDocuments(
            group.documents.filter((document) => visibleIds.has(document.id)),
          ),
        }))
        .filter((group) => group.documents.length > 0),
    );
  });

  readonly listItems = computed((): ListDocumentItem[] => {
    if (
      this.journeyView() &&
      this.isEvaDossier() &&
      !this.shouldUseFlatListPresentation()
    ) {
      return [];
    }

    return this.visibleDocuments();
  });

  readonly hasListResults = computed(() => {
    if (
      this.journeyView() &&
      this.isEvaDossier() &&
      !this.shouldUseFlatListPresentation()
    ) {
      return (this.listGroups() ?? []).length > 0;
    }

    return this.listItems().length > 0;
  });

  readonly documentCount = computed(() => {
    if (
      this.journeyView() &&
      this.isEvaDossier() &&
      !this.shouldUseFlatListPresentation()
    ) {
      return (this.listGroups() ?? []).reduce(
        (sum, group) => sum + group.documents.length,
        0,
      );
    }

    return this.listItems().length;
  });

  /** Documents cycled by detail prev/next — parcours-only when journey view is on. */
  readonly navigableDocuments = computed(() => {
    if (
      this.journeyView() &&
      this.isEvaDossier() &&
      !this.shouldUseFlatListPresentation()
    ) {
      return (this.listGroups() ?? []).flatMap((group) => group.documents);
    }

    return this.visibleDocuments();
  });

  onSectorChange(option: SectorOption | null): void {
    if (!option?.value) {
      this.selectedSector.set(null);
      return;
    }

    this.selectedSector.set(option);
  }

  onSortChange(option: SortOption | null): void {
    this.selectedSort.set(option);
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

  toggleStartDateSort(): void {
    if (this.journeyView()) {
      this.startDateSortAscending.update((ascending) => !ascending);
      return;
    }

    this.flatListSortAscending.update((ascending) => !ascending);
  }

  onJourneyViewChange(
    enabled: boolean,
    source: 'toggle' | 'hors-parcours-hint' = 'toggle',
  ): void {
    if (this.journeyView() === enabled) {
      return;
    }

    this.journeyView.set(enabled);

    if (!enabled) {
      const items = this.listItems();
      if (items.length > 0) {
        this.documentFocus.set(null);
        this.selectedDocumentId.set(items[0].id);
      }

      this.recordTelemetry('journey_view_off', source);
      return;
    }

    this.recordTelemetry('journey_view_on', source);
  }

  disableJourneyView(): void {
    this.onJourneyViewChange(false, 'hors-parcours-hint');
  }

  onCrossReferenceNavigate(reference: DocumentCrossReference): void {
    this.journeyView.set(true);
    this.documentFocus.set({
      stepValue: reference.stepValue,
      panelId: reference.panelId,
    });
    this.selectedDocumentId.set(reference.documentId);
    this.recordTelemetry(
      'cross_reference',
      `${reference.documentId}::${reference.stepValue}::${reference.panelId}`,
    );
  }

  onExpandedGroupIdsChange(expandedGroupIds: string[]): void {
    const previous = this.expandedGroupIds();
    this.expandedGroupIds.set(expandedGroupIds);

    const newlyExpandedId = expandedGroupIds.find((id) => !previous.includes(id));
    if (!newlyExpandedId || !this.journeyView()) {
      return;
    }

    const group = this.listGroups()?.find((item) => item.id === newlyExpandedId);
    if (!group?.documents.length) {
      return;
    }

    const selected = this.selectedDocumentId();
    const selectedAlreadyInGroup =
      selected !== null &&
      group.documents.some((document) => document.id === selected);

    if (selectedAlreadyInGroup) {
      return;
    }

    this.documentFocus.set(null);
    this.selectedDocumentId.set(group.documents[0].id);
  }

  onDocumentClick(document: ListDocumentItem): void {
    // A plain row select clears any prior deep-link focus so the detail card
    // resets to the document defaults instead of re-jumping to the old panel.
    this.documentFocus.set(null);
    this.selectedDocumentId.set(document.id);
    this.recordTelemetry('document_select', document.id);
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
    this.recordTelemetry('deep_link_tag', `${doc.id}::${target.id}`);
  }

  onSelectedDocumentIdChange(documentId: string): void {
    // Prev/next document navigation is a plain selection, so drop any deep-link
    // focus from an earlier tag click.
    this.documentFocus.set(null);
    this.selectedDocumentId.set(documentId);

    if (this.journeyView() && this.isEvaDossier()) {
      const group = this.listGroups()?.find((item) =>
        item.documents.some((document) => document.id === documentId),
      );

      if (group) {
        this.ensureGroupExpanded(group.id);
      }
    }
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
    this.recordTelemetry('drawer_open', 'affiliate-detail');
  }

  onStatusActionClick(): void {
    if (!this.isEvaDossier()) {
      return;
    }

    const { documentId, groupId, stepValue, panelId } =
      AffiliateDetailsComponent.EVA_INCAPACITY_PAYMENT_DEEP_LINK;

    this.journeyView.set(true);
    this.ensureGroupExpanded(groupId);
    this.selectedDocumentId.set(documentId);
    this.documentFocus.set({ stepValue, panelId });
    this.recordTelemetry(
      'deep_link_status_action',
      `${documentId}::${stepValue}::${panelId}`,
    );
  }

  onMoreDetailsOpen(panel: DocumentCertificatPanel): void {
    this.moreDetailsPanel.set(panel);
    this.moreDetailsDrawerVisible.set(true);
    this.recordTelemetry('drawer_open', `more-details:${panel.id}`);
  }

  onTransactionsCicsOpen(): void {
    this.transactionsCicsDialogVisible.set(true);
    this.recordTelemetry('cics_modal_open');
  }

  onFamilyMemberSelect(member: AffiliateDetailDrawerFamilyMember): void {
    const targetNiss = resolveFamilyMemberNiss(member);
    if (!targetNiss || targetNiss === this.affiliateProfile().niss) {
      return;
    }

    this.affiliateDetailDrawerVisible.set(false);
    this.recordTelemetry('family_member_select', member.name);
    void this.router.navigate(['/affiliate', targetNiss]);
  }

  onCicsTransactionLaunch(code: string): void {
    this.recordTelemetry('cics_transaction_launch', code);
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

  private allDocumentsForContext(): ListDocumentItem[] {
    if (this.isEvaDossier()) {
      return allEvaMartinezDocuments();
    }

    if (this.affiliateId() === JACK_MOTA_NISS) {
      return JACK_MOTA_DOCUMENTS;
    }

    return [];
  }

  private receptionDateById(documentId: string): string | undefined {
    return DOCUMENT_RECEPTION_DATE_BY_ID.get(documentId);
  }

  private ensureGroupExpanded(groupId: string): void {
    const current = this.expandedGroupIds();

    if (!current.includes(groupId)) {
      this.expandedGroupIds.set([...current, groupId]);
    }
  }

  private recordTelemetry(event: string, target?: string): void {
    if (environment.enableTestingTelemetry) {
      this.telemetry.record(event, target);
    }
  }

  /** Latest réception date among documents in the current dossier (parcours + hors parcours). */
  private lastActionDateValue(documents: ListDocumentItem[]): string | null {
    let latestReceptionDate = '';

    for (const document of documents) {
      const date = this.receptionDateById(document.id);

      if (
        date &&
        (!latestReceptionDate ||
          parseFrenchDate(date) > parseFrenchDate(latestReceptionDate))
      ) {
        latestReceptionDate = date;
      }
    }

    return latestReceptionDate || null;
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

  private applyDocumentFilters(
    documents: ListDocumentItem[],
  ): ListDocumentItem[] {
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

    const sector = this.selectedSector()?.value;
    if (sector) {
      filtered = filtered.filter(
        (document) => DOCUMENT_SECTOR_BY_ID.get(document.id) === sector,
      );
    }

    const infoFilter = this.documentInfoFilter();
    if (infoFilter === 'active-documents') {
      filtered = filtered.filter(isActiveDocument);
    } else if (infoFilter === 'closed-documents') {
      filtered = filtered.filter(isClosedDocument);
    } else if (infoFilter === 'last-action') {
      const latestDocumentId = this.latestReceptionDocumentId();
      filtered = filtered.filter((document) => document.id === latestDocumentId);
    }

    return filtered;
  }

  private sortDocuments(documents: ListDocumentItem[]): ListDocumentItem[] {
    const sortValue = this.selectedSort()?.value;

    if (sortValue === 'nom-document') {
      return [...documents].sort((left, right) =>
        left.title.localeCompare(right.title),
      );
    }

    if (sortValue === 'actions-en-cours') {
      return [...documents].sort((left, right) => {
        const leftPriority =
          STATUS_SORT_PRIORITY[left.status?.label ?? ''] ?? Number.MAX_SAFE_INTEGER;
        const rightPriority =
          STATUS_SORT_PRIORITY[right.status?.label ?? ''] ?? Number.MAX_SAFE_INTEGER;

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        return compareStartDates(
          this.receptionDateById(left.id),
          this.receptionDateById(right.id),
          false,
        );
      });
    }

    return this.sortDocumentsByReceptionDate(documents);
  }

  private sortGroupsByStartDate(groups: ListGroup[]): ListGroup[] {
    const ascending = this.startDateSortAscending();

    return [...groups].sort((left, right) =>
      compareStartDates(left.startDate, right.startDate, ascending),
    );
  }

  private sortDocumentsByReceptionDate(
    documents: ListDocumentItem[],
  ): ListDocumentItem[] {
    const ascending = this.activeSortAscending();

    return [...documents].sort((left, right) =>
      compareStartDates(
        this.receptionDateById(left.id),
        this.receptionDateById(right.id),
        ascending,
      ),
    );
  }

  private latestReceptionDocumentId(): string {
    const documents = this.allDocumentsForContext();

    return documents.reduce(
      (latest, document) => {
        const date = this.receptionDateById(document.id);

        if (
          date &&
          (!latest.date || parseFrenchDate(date) > parseFrenchDate(latest.date))
        ) {
          return { documentId: document.id, date };
        }

        return latest;
      },
      { documentId: '', date: '' },
    ).documentId;
  }

  constructor() {
    if (environment.enableTestingTelemetry) {
      this.telemetry.enable();
    }

    this.destroyRef.onDestroy(() => {
      this.telemetry.disable();
    });

    let previousAffiliateRouteId: string | null = null;
    effect(() => {
      const routeId = this.affiliateId();
      if (
        previousAffiliateRouteId !== null &&
        previousAffiliateRouteId !== routeId
      ) {
        this.defaultJourneyExpansionApplied = false;
        this.expandedGroupIds.set([]);
        this.selectedDocumentId.set(null);
        this.documentFocus.set(null);
      }
      previousAffiliateRouteId = routeId;
    });

    effect(() => {
      const visible = this.visibleDocuments();
      const selected = this.selectedDocumentId();

      if (
        selected !== null &&
        !visible.some((document) => document.id === selected)
      ) {
        this.selectedDocumentId.set(null);
      }
    });

    effect(() => {
      const filter = this.documentInfoFilter();

      if (!filter) {
        return;
      }

      const availableFilters = new Set(
        this.infoTags()
          .map((tag) => tag.filterKey)
          .filter((key): key is AffiliateOverviewInfoTagFilterKey => !!key),
      );

      if (!availableFilters.has(filter)) {
        this.documentInfoFilter.set(null);
      }
    });

    effect(() => {
      if (this.isEvaDossier() && this.journeyView()) {
        return;
      }

      const visible = this.visibleDocuments();
      if (visible.length === 0 || this.selectedDocumentId() !== null) {
        return;
      }

      this.documentFocus.set(null);
      this.selectedDocumentId.set(visible[0].id);
    });

    effect(() => {
      this.archivedOnly();

      if (!this.journeyView() || !this.archivedOnly()) {
        return;
      }

      const groupIds =
        this.listGroups()
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
      if (this.defaultJourneyExpansionApplied || !this.journeyView()) {
        return;
      }

      // List-shaping signals — re-run when filters/sort change before first expand.
      this.journeyView();
      this.startDateSortAscending();
      this.flatListSortAscending();
      this.archivedOnly();
      this.documentInfoFilter();
      this.documentSearch();
      this.selectedSort();
      this.selectedSector();

      const groups = this.listGroups();
      if (!groups?.length) {
        return;
      }

      const firstGroup = groups[0];
      this.expandedGroupIds.set([firstGroup.id]);

      const firstDocument = firstGroup.documents[0];
      if (firstDocument) {
        this.documentFocus.set(null);
        this.selectedDocumentId.set(firstDocument.id);
      }

      this.defaultJourneyExpansionApplied = true;
    });

    effect(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'iShare' },
        { label: "Recherche d'affilié", routerLink: '/home' },
        { label: this.affiliateName() },
      ]);

      const profile = this.affiliateProfile();

      this.affiliateHeaderService.setHeader({
        title: profile.name,
        variant: profile.headerVariant,
        avatarGender: profile.avatarGender,
        avatarVariant: profile.avatarVariant,
        avatarInitials: profile.avatarInitials,
        statusAction: this.statusAction(),
        infoTags: this.infoTags(),
        identifiers: this.identifiers(),
        primaryAction: this.primaryAction,
        onInfoTagClick: (tag) => this.onInfoTagClick(tag),
        onPrimaryActionClick: () => this.onPrimaryActionClick(),
        onStatusActionClick: () => this.onStatusActionClick(),
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

function compareStartDates(
  left: string | undefined,
  right: string | undefined,
  ascending: boolean,
): number {
  const leftTime = left ? parseFrenchDate(left) : 0;
  const rightTime = right ? parseFrenchDate(right) : 0;

  return ascending ? leftTime - rightTime : rightTime - leftTime;
}
