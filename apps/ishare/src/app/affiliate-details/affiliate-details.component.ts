import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
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
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollTop } from 'primeng/scrolltop';
import { Skeleton } from 'primeng/skeleton';
import {
  AffiliateDetailDrawerComponent,
  EmptyStateComponent,
  FormFieldComponent,
  InputClearComponent,
  ListComponent,
  PdsTelemetryLabelDirective,
  SIMULATED_LOADING_MS,
  TestingTelemetryService,
  TESTING_TELEMETRY_ENABLED,
  ToolbarComponent,
  TransactionsCicsModalComponent,
  type AffiliateDetailDrawerData,
  type AffiliateDetailDrawerFamilyMember,
  type AffiliateDetailDrawerView,
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
import { isSimulatedAffiliateLoadingEnabled } from '../layout/is-simulated-affiliate-loading-enabled';
import { BreadcrumbService } from '../layout/breadcrumb.service';
import { AffiliateDocumentDetailComponent } from './affiliate-document-detail/affiliate-document-detail.component';
import {
  EVA_MARTINEZ_DOCUMENT_DETAILS,
  getDocumentDetailsForAffiliate,
} from './affiliate-document-detail/affiliate-document-detail.mock';
import { DocumentMoreDetailsDrawerComponent } from './affiliate-document-detail/document-more-details-drawer/document-more-details-drawer.component';
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
  details: Record<
    string,
    AffiliateDocumentDetail
  > = EVA_MARTINEZ_DOCUMENT_DETAILS,
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
      if (!panel.workerComment || panel.disabled) {
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
  details: Record<
    string,
    AffiliateDocumentDetail
  > = EVA_MARTINEZ_DOCUMENT_DETAILS,
): ListDocumentItem {
  const tags = deriveDocumentTags(document.id, details);
  return tags.length > 0 ? { ...document, tags } : document;
}

// Row count tags are derived from the detail mock (see `withDerivedTags`) so the
// badge counts and the deep-link jump targets always stay in sync.
const EVA_MARTINEZ_DOCUMENT_GROUPS: ListGroup[] = (
  [
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
            severity: 'warn',
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
      startDate: '20/05/2026',
      endDate: '12/06/2026',
      expanded: false,
      documents: [
        {
          id: 'doc-cloture-primaire',
          title: 'Demande primaire -',
          titleLine2: 'Régime général',
          status: {
            label: 'En attente',
            severity: 'warn',
            icon: 'bi bi-clock',
          },
        },
      ],
    },
  ] as ListGroup[]
).map((group) => ({
  ...group,
  documents: group.documents.map((document) =>
    withDerivedTags(document, EVA_MARTINEZ_DOCUMENT_DETAILS),
  ),
}));

/** Hors-parcours documents — merged into flat list, excluded from journey groups. */
export const EVA_MARTINEZ_STANDALONE_DOCUMENTS: ListDocumentItem[] = [
  {
    id: 'doc-c4',
    title: 'Attestation C4',
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

/** Archived documents — flat Archivés category, excluded from parcours groups. */
export const EVA_MARTINEZ_ARCHIVED_DOCUMENTS: ListDocumentItem[] = [
  {
    id: 'doc-archive-changement-adresse',
    title: "Changement d'adresse",
    status: {
      label: 'Clôturé',
      severity: 'secondary',
      icon: 'bi bi-clock-history',
    },
  },
].map((document) =>
  withDerivedTags(document as ListDocumentItem, EVA_MARTINEZ_DOCUMENT_DETAILS),
);

const STANDALONE_DOCUMENT_IDS = new Set(
  EVA_MARTINEZ_STANDALONE_DOCUMENTS.map((document) => document.id),
);

const ARCHIVED_DOCUMENT_IDS = new Set(
  EVA_MARTINEZ_ARCHIVED_DOCUMENTS.map((document) => document.id),
);

type DocCategoryId = 'parcours' | 'isoles' | 'archives';

interface DocCategory {
  id: DocCategoryId;
  label: string;
  icon: string;
  count: number;
  enabled: boolean;
  kind: 'journey' | 'flat';
  groups?: ListGroup[];
  items?: ListDocumentItem[];
}

const DOC_CATEGORY_SPECS: ReadonlyArray<
  Pick<DocCategory, 'id' | 'label' | 'icon' | 'kind'>
> = [
  {
    id: 'parcours',
    label: 'Parcours',
    icon: 'bi bi-diagram-3',
    kind: 'journey',
  },
  { id: 'isoles', label: 'Isolés', icon: 'bi bi-file-earmark', kind: 'flat' },
  { id: 'archives', label: 'Archivés', icon: 'bi bi-archive', kind: 'flat' },
];

const CATEGORY_EMPTY_FILTER_MESSAGE =
  'Aucun document ne correspond à ce filtre.';

type DocumentSector = SectorOption['value'];

const DOCUMENT_SECTOR_BY_ID = new Map<string, DocumentSector>([
  ['doc-demande-primaire', 'indemnites'],
  ['doc-incapacite', 'indemnites'],
  ['doc-rechute', 'indemnites'],
  ['doc-cloture-primaire', 'indemnites'],
  ['doc-c4', 'indemnites'],
  ['doc-attestation-pedicure', 'front-office'],
  ['doc-archive-changement-adresse', 'population'],
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
        'doc-cloture-primaire': '20/05/2026',
      };
      return [
        document.id,
        receptionById[document.id] ?? group.startDate ?? '',
      ] as const;
    }),
  ),
  ['doc-c4', '16/12/2025'],
  ['doc-attestation-pedicure', '09/06/2026'],
  ['doc-archive-changement-adresse', '15/06/2024'],
  ['doc-jack-certificat', '01/03/2026'],
]);

function allEvaMartinezDocuments(): ListDocumentItem[] {
  return [
    ...EVA_MARTINEZ_DOCUMENT_GROUPS.flatMap((group) => group.documents),
    ...EVA_MARTINEZ_STANDALONE_DOCUMENTS,
    ...EVA_MARTINEZ_ARCHIVED_DOCUMENTS,
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
    AccordionModule,
    BadgeModule,
    TabsModule,
    TooltipModule,
    ToolbarComponent,
    FormFieldComponent,
    InputClearComponent,
    EmptyStateComponent,
    ListComponent,
    PdsTelemetryLabelDirective,
    AffiliateDocumentDetailComponent,
    AffiliateDetailDrawerComponent,
    DocumentMoreDetailsDrawerComponent,
    TransactionsCicsModalComponent,
    ScrollTop,
    Skeleton,
  ],
  templateUrl: './affiliate-details.component.html',
  styleUrl: './affiliate-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'o-flex o-flex--y o-flex__item--grow-1 o-layout--min-h-0 o-layout--min-w-0',
  },
})
export class AffiliateDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly affiliateHeaderService = inject(AffiliateHeaderService);
  private readonly messageService = inject(MessageService);
  private readonly telemetry = inject(TestingTelemetryService);
  private readonly testingTelemetryEnabled = inject(TESTING_TELEMETRY_ENABLED);
  private readonly destroyRef = inject(DestroyRef);

  private loadingTimerId: ReturnType<typeof setTimeout> | null = null;

  /** Brief skeleton flash for header + document lists (dev / demo). */
  readonly pageLoading = signal(isSimulatedAffiliateLoadingEnabled());

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

  private static readonly EVA_C4_MISSING_STATUS_ACTION: AffiliateOverviewStatusAction =
    {
      label: 'C4 non reçu',
      tagValue: 'C4',
      icon: 'bi bi-exclamation-triangle-fill',
      severity: 'warn',
      ariaLabel: 'Voir le détail — C4 non reçu',
    };

  private static readonly EVA_C4_MISSING_DEEP_LINK = {
    documentId: 'doc-demande-primaire',
    groupId: 'parcours-demande-primaire',
    stepValue: 3,
    panelId: 'calcul',
  } as const;

  readonly statusAction = computed((): AffiliateOverviewStatusAction | null =>
    this.isEvaDossier()
      ? AffiliateDetailsComponent.EVA_C4_MISSING_STATUS_ACTION
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
    { label: 'Tous', value: 'tous' },
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

  readonly openCategories = signal<DocCategoryId[]>(['parcours', 'isoles']);
  readonly activeCategory = signal<DocCategoryId>('parcours');

  readonly expandedGroupIds = signal<string[]>([]);

  /** Ensures the first journey group is expanded only once on initial load. */
  private defaultJourneyExpansionApplied = false;

  /** Skips auto-select in onExpandedGroupIdsChange after reveal-driven expansion. */
  private readonly programmaticGroupExpansions = new Set<string>();

  /** Ignores accordion echo when openCategories is updated from component code. */
  private suppressAccordionSync = false;

  /** Tracks filter inputs so category visibility syncs only on filter changes. */
  private categoryFilterSnapshot = '';

  private categoryFilterSnapshotReady = false;

  /** Prevents journey auto-select while prev/next navigation is in flight. */
  private isNavigatingDocuments = false;

  /** Invalidates in-flight list scroll timers when filters or navigation change. */
  private viewportScrollGeneration = 0;

  /** Journey groups: `true` = oldest start date first. */
  readonly startDateSortAscending = signal(true);

  /** Flat list: `false` = newest reception date first (default). */
  readonly flatListSortAscending = signal(false);

  readonly activeSortAscending = computed(() =>
    this.activeCategory() === 'parcours'
      ? this.startDateSortAscending()
      : this.flatListSortAscending(),
  );

  readonly startDateSortIcon = computed(() =>
    this.activeSortAscending() ? 'bi bi-sort-up' : 'bi bi-sort-down',
  );

  readonly startDateSortAriaLabel = computed(() =>
    this.activeSortAscending()
      ? 'Trier du plus ancien au plus récent'
      : 'Trier du plus récent au plus ancien',
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
  readonly documentFocus = signal<{
    stepValue: number;
    panelId: string;
  } | null>(null);

  readonly filteredDocuments = computed(() =>
    this.applyDocumentFilters(this.allDocumentsForContext()),
  );

  readonly visibleDocuments = computed(() =>
    this.sortDocuments(this.filteredDocuments()),
  );

  readonly parcoursGroups = computed((): ListGroup[] => {
    if (!this.isEvaDossier()) {
      return [];
    }

    const visibleIds = new Set(this.filteredDocuments().map((doc) => doc.id));

    let groups = EVA_MARTINEZ_DOCUMENT_GROUPS;

    if (this.documentInfoFilter() === 'last-action') {
      const latestGroupId = this.latestJourneyGroupId();
      groups = groups.filter((group) => group.id === latestGroupId);
    }

    const filteredGroups = groups
      .map((group) => ({
        ...group,
        documents: this.sortDocumentsForCategory(
          group.documents.filter((document) => visibleIds.has(document.id)),
          'parcours',
        ),
      }))
      .filter((group) => group.documents.length > 0);

    return this.sortGroups(filteredGroups);
  });

  readonly isolesItems = computed((): ListDocumentItem[] => {
    const filtered = this.filteredDocuments();

    if (this.isEvaDossier()) {
      return this.sortDocumentsForCategory(
        filtered.filter((document) => STANDALONE_DOCUMENT_IDS.has(document.id)),
        'flat',
      );
    }

    return this.sortDocumentsForCategory(
      filtered.filter((document) => !ARCHIVED_DOCUMENT_IDS.has(document.id)),
      'flat',
    );
  });

  readonly archivesItems = computed((): ListDocumentItem[] =>
    this.sortDocumentsForCategory(
      this.filteredDocuments().filter((document) =>
        ARCHIVED_DOCUMENT_IDS.has(document.id),
      ),
      'flat',
    ),
  );

  readonly categories = computed((): DocCategory[] => {
    const parcours = this.parcoursGroups();
    const isoles = this.isolesItems();
    const archives = this.archivesItems();
    const parcoursCount = parcours.reduce(
      (sum, group) => sum + group.documents.length,
      0,
    );

    return DOC_CATEGORY_SPECS.map((spec) => {
      if (spec.id === 'parcours') {
        return {
          ...spec,
          count: parcoursCount,
          enabled: parcoursCount > 0,
          groups: parcours,
        };
      }

      if (spec.id === 'isoles') {
        return {
          ...spec,
          count: isoles.length,
          enabled: isoles.length > 0,
          items: isoles,
        };
      }

      return {
        ...spec,
        count: archives.length,
        enabled: archives.length > 0,
        items: archives,
      };
    });
  });

  readonly showCategoryTabs = computed(
    () => this.allDocumentsForContext().length > 0,
  );

  readonly categoryTabDisabledHint = CATEGORY_EMPTY_FILTER_MESSAGE;

  readonly categoryEmptyFilterMessage = CATEGORY_EMPTY_FILTER_MESSAGE;

  readonly selectedCategoryTab = computed((): DocCategoryId => {
    const categories = this.categories();
    const active = this.activeCategory();
    const current = categories.find((category) => category.id === active);

    if (current?.enabled) {
      return active;
    }

    return categories.find((category) => category.enabled)?.id ?? active;
  });

  readonly hasListResults = computed(() => this.documentCount() > 0);

  readonly documentCount = computed(() =>
    this.categories().reduce((sum, category) => sum + category.count, 0),
  );

  /**
   * Documents cycled by detail prev/next — parcours group order, then isolés,
   * then archivés.
   */
  readonly navigableDocuments = computed(() => {
    const documents: ListDocumentItem[] = [];

    for (const category of this.categories()) {
      if (!category.enabled) {
        continue;
      }

      if (category.kind === 'journey' && category.groups) {
        documents.push(...category.groups.flatMap((group) => group.documents));
      } else if (category.items) {
        documents.push(...category.items);
      }
    }

    return documents;
  });

  readonly selectedDocumentDetail = computed(
    (): AffiliateDocumentDetail | null => {
      const id = this.selectedDocumentId();
      if (!id) {
        return null;
      }

      return getDocumentDetailsForAffiliate(this.affiliateId())[id] ?? null;
    },
  );

  readonly selectedDocumentTitle = computed(
    () => this.selectedDocumentDetail()?.title ?? '',
  );

  readonly canGoToPreviousDocument = computed(() => {
    const selectedId = this.selectedDocumentId();
    if (!selectedId) {
      return false;
    }

    const index = this.navigableDocuments().findIndex(
      (document) => document.id === selectedId,
    );

    return index > 0;
  });

  readonly canGoToNextDocument = computed(() => {
    const selectedId = this.selectedDocumentId();
    if (!selectedId) {
      return false;
    }

    const documents = this.navigableDocuments();
    const index = documents.findIndex((document) => document.id === selectedId);

    return index >= 0 && index < documents.length - 1;
  });

  onSectorChange(option: SectorOption | string | null): void {
    const resolved = this.resolveSectorOption(option);
    this.selectedSector.set(resolved);
  }

  onSortChange(option: SortOption | string | null): void {
    this.selectedSort.set(
      this.resolveSortOption(option) ?? this.defaultSortOption,
    );
  }

  private get defaultSortOption(): SortOption {
    return this.sortOptions[1];
  }

  /** PrimeNG AutoComplete ngModelChange emits option.value (primitive), not the full option. */
  private resolveSectorOption(
    option: SectorOption | string | null,
  ): SectorOption | null {
    if (option == null) {
      return null;
    }

    if (typeof option === 'string') {
      return this.sectorOptions.find((item) => item.value === option) ?? null;
    }

    return option;
  }

  private resolveSortOption(
    option: SortOption | string | null,
  ): SortOption | null {
    if (option == null) {
      return null;
    }

    if (typeof option === 'string') {
      return this.sortOptions.find((item) => item.value === option) ?? null;
    }

    return option;
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
    if (this.activeCategory() === 'parcours') {
      this.startDateSortAscending.update((ascending) => !ascending);
      return;
    }

    this.flatListSortAscending.update((ascending) => !ascending);
  }

  isCategoryOpen(id: DocCategoryId): boolean {
    return this.openCategories().includes(id);
  }

  isCategoryEnabled(id: DocCategoryId): boolean {
    return (
      this.categories().find((category) => category.id === id)?.enabled ?? false
    );
  }

  toggleCategoryVisibility(id: DocCategoryId): void {
    if (!this.isCategoryEnabled(id)) {
      return;
    }

    const current = this.openCategories();

    if (current.includes(id)) {
      this.syncOpenCategories(
        current.filter((categoryId) => categoryId !== id),
      );
      return;
    }

    this.syncOpenCategories([...current, id]);
  }

  onAccordionValueChange(
    value: DocCategoryId | DocCategoryId[] | null | undefined,
  ): void {
    if (this.suppressAccordionSync) {
      return;
    }

    const ids = Array.isArray(value) ? value : value != null ? [value] : [];
    this.openCategories.set(ids);
  }

  onCategoryTabChange(id: DocCategoryId | string | number | undefined): void {
    if (id === 'parcours' || id === 'isoles' || id === 'archives') {
      if (!this.isCategoryEnabled(id)) {
        return;
      }

      this.scrollToCategory(id);
    }
  }

  scrollToCategory(id: DocCategoryId): void {
    if (!this.isCategoryEnabled(id)) {
      return;
    }

    if (!this.openCategories().includes(id)) {
      this.syncOpenCategories([...this.openCategories(), id]);
    }

    this.activeCategory.set(id);

    queueMicrotask(() => {
      const panel = document.getElementById(`category-panel-${id}`);
      if (panel) {
        this.scrollElementIntoViewWithInset(panel);
      }
    });
  }

  private ensureParcoursVisible(): void {
    this.ensureCategoryVisible('parcours');
  }

  private ensureArchivesVisible(): void {
    this.ensureCategoryVisible('archives');
  }

  private ensureCategoryVisible(id: DocCategoryId): void {
    if (!this.isCategoryEnabled(id)) {
      return;
    }

    if (!this.openCategories().includes(id)) {
      this.syncOpenCategories([...this.openCategories(), id]);
    }

    this.activeCategory.set(id);
  }

  private syncOpenCategories(ids: DocCategoryId[]): void {
    this.suppressAccordionSync = true;
    this.openCategories.set(ids);
    queueMicrotask(() => {
      this.suppressAccordionSync = false;
    });
  }

  onCrossReferenceNavigate(reference: DocumentCrossReference): void {
    this.ensureParcoursVisible();
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

    const newlyExpandedId = expandedGroupIds.find(
      (id) => !previous.includes(id),
    );
    if (!newlyExpandedId) {
      return;
    }

    if (this.programmaticGroupExpansions.delete(newlyExpandedId)) {
      return;
    }

    if (this.isNavigatingDocuments) {
      return;
    }

    const group = this.parcoursGroups().find(
      (item) => item.id === newlyExpandedId,
    );
    if (!group?.documents.length) {
      return;
    }

    const selected = this.selectedDocumentId();
    if (selected !== null) {
      if (group.documents.some((document) => document.id === selected)) {
        return;
      }

      if (
        this.visibleDocuments().some((document) => document.id === selected)
      ) {
        return;
      }
    }

    this.documentFocus.set(null);
    this.selectedDocumentId.set(group.documents[0].id);
  }

  onDocumentClick(document: ListDocumentItem): void {
    this.navigateToDocument(document.id, { scroll: false });
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

  goToPreviousDocument(): void {
    const documents = this.navigableDocuments();
    const selectedId = this.selectedDocumentId();
    if (!selectedId) {
      return;
    }

    const index = documents.findIndex((document) => document.id === selectedId);
    if (index <= 0) {
      return;
    }

    this.navigateToDocument(documents[index - 1].id);
  }

  goToNextDocument(): void {
    const documents = this.navigableDocuments();
    const selectedId = this.selectedDocumentId();
    if (!selectedId) {
      return;
    }

    const index = documents.findIndex((document) => document.id === selectedId);
    if (index < 0 || index >= documents.length - 1) {
      return;
    }

    this.navigateToDocument(documents[index + 1].id);
  }

  onSelectedDocumentIdChange(documentId: string): void {
    this.navigateToDocument(documentId);
  }

  private navigateToDocument(
    documentId: string,
    options: { scroll?: boolean } = { scroll: true },
  ): void {
    // Prev/next document navigation is a plain selection, so drop any deep-link
    // focus from an earlier tag click.
    this.isNavigatingDocuments = true;
    this.documentFocus.set(null);

    const categoryId = this.categoryForDocumentId(documentId);
    if (categoryId) {
      this.ensureCategoryVisible(categoryId);

      if (categoryId === 'parcours') {
        const group = this.parcoursGroups().find((item) =>
          item.documents.some((document) => document.id === documentId),
        );

        if (group) {
          this.ensureGroupExpanded(group.id);
        }
      }
    }

    this.selectedDocumentId.set(documentId);

    if (options.scroll !== false && categoryId) {
      this.scheduleScrollToDocument(documentId);
      return;
    }

    this.endDocumentNavigationGuard();
  }

  onInfoTagClick(tag: AffiliateOverviewInfoTag): void {
    if (!tag.filterKey) {
      return;
    }

    const current = this.documentInfoFilter();
    const nextFilter = current === tag.filterKey ? null : tag.filterKey;
    this.documentInfoFilter.set(nextFilter);

    if (nextFilter === 'last-action') {
      queueMicrotask(() => {
        const latestId = this.latestReceptionDocumentId();

        if (
          latestId &&
          !this.selectedDocumentId() &&
          this.visibleDocuments().some((document) => document.id === latestId)
        ) {
          this.selectedDocumentId.set(latestId);
          this.scheduleFilterViewportRestore({ documentId: latestId });
        }
      });
    }
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
      AffiliateDetailsComponent.EVA_C4_MISSING_DEEP_LINK;

    this.ensureParcoursVisible();
    this.ensureGroupExpanded(groupId);
    this.scrollToCategory('parcours');
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
    this.showDrawerFeatureComingSoonToast();
  }

  onDrawerQuickActionsClick(): void {
    this.showDrawerFeatureComingSoonToast();
  }

  onDrawerCallClick(): void {
    this.showDrawerFeatureComingSoonToast();
  }

  onDrawerEmailClick(): void {
    this.showDrawerFeatureComingSoonToast();
  }

  onDrawerViewChange(view: AffiliateDetailDrawerView): void {
    if (view === 'documents') {
      this.showDrawerFeatureComingSoonToast();
    }
  }

  onDrawerIdentifierCopy(identifier: { label: string; value: string }): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Copié !',
      detail: `${identifier.label}: ${identifier.value}`,
    });
  }

  private showDrawerFeatureComingSoonToast(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Bientôt disponible',
      detail: 'Cette fonctionnalité sera disponible prochainement.',
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
      this.programmaticGroupExpansions.add(groupId);
      this.onExpandedGroupIdsChange([...current, groupId]);
    }
  }

  private categoryForDocumentId(documentId: string): DocCategoryId | null {
    if (ARCHIVED_DOCUMENT_IDS.has(documentId)) {
      return 'archives';
    }

    if (this.isEvaDossier()) {
      if (STANDALONE_DOCUMENT_IDS.has(documentId)) {
        return 'isoles';
      }

      if (
        this.parcoursGroups().some((group) =>
          group.documents.some((document) => document.id === documentId),
        )
      ) {
        return 'parcours';
      }

      return null;
    }

    return this.visibleDocuments().some(
      (document) => document.id === documentId,
    )
      ? 'isoles'
      : null;
  }

  private endDocumentNavigationGuard(): void {
    globalThis.setTimeout(() => {
      this.isNavigatingDocuments = false;
    }, 0);
  }

  private scheduleScrollToDocument(documentId: string): void {
    const generation = this.bumpViewportScrollGeneration();
    this.scrollToDocumentRowWhenReady(documentId, 0, generation);
  }

  private bumpViewportScrollGeneration(): number {
    this.viewportScrollGeneration += 1;
    return this.viewportScrollGeneration;
  }

  private isViewportScrollCurrent(generation: number): boolean {
    return generation === this.viewportScrollGeneration;
  }

  /** Re-expands category/group chrome and scrolls after filter-driven list reflows. */
  private restoreSelectedDocumentViewport(): void {
    const selected = this.selectedDocumentId();

    if (
      selected &&
      this.visibleDocuments().some((document) => document.id === selected)
    ) {
      this.scheduleFilterViewportRestore({ documentId: selected });
      return;
    }

    const active = this.activeCategory();

    if (this.isCategoryEnabled(active)) {
      this.scheduleFilterViewportRestore({ categoryId: active });
    }
  }

  private scheduleFilterViewportRestore(target: {
    documentId?: string;
    categoryId?: DocCategoryId;
  }): void {
    const generation = this.bumpViewportScrollGeneration();
    this.isNavigatingDocuments = true;
    this.settleFilterViewport(target, 0, generation);
  }

  private settleFilterViewport(
    target: { documentId?: string; categoryId?: DocCategoryId },
    attempt: number,
    generation: number,
  ): void {
    const maxAttempts = 24;
    const delay = attempt === 0 ? 80 : 50;

    globalThis.setTimeout(() => {
      if (!this.isViewportScrollCurrent(generation)) {
        return;
      }

      const documentId = target.documentId;
      const categoryId =
        target.categoryId ??
        (documentId ? this.categoryForDocumentId(documentId) : null);

      if (!categoryId) {
        this.isNavigatingDocuments = false;
        return;
      }

      this.ensureCategoryVisible(categoryId);

      if (categoryId === 'parcours' && documentId) {
        const group = this.parcoursGroups().find((item) =>
          item.documents.some((document) => document.id === documentId),
        );

        if (group) {
          this.ensureGroupExpanded(group.id);
        }
      }

      this.activeCategory.set(categoryId);

      if (documentId) {
        const row = document.querySelector(
          `[data-telemetry-id="document-row-${documentId}"]`,
        );

        if (row instanceof HTMLElement) {
          this.scrollElementIntoViewWithInset(row, 'auto');
          this.isNavigatingDocuments = false;
          return;
        }
      }

      const panel = document.getElementById(`category-panel-${categoryId}`);

      if (panel instanceof HTMLElement) {
        this.scrollElementIntoViewWithInset(panel, 'auto');
      }

      if (attempt < maxAttempts) {
        this.settleFilterViewport(target, attempt + 1, generation);
        return;
      }

      this.isNavigatingDocuments = false;
    }, delay);
  }

  private isFirstNavigableDocument(documentId: string): boolean {
    const documents = this.navigableDocuments();
    return documents.length > 0 && documents[0].id === documentId;
  }

  private isLastNavigableDocument(documentId: string): boolean {
    const documents = this.navigableDocuments();
    return documents.length > 0 && documents.at(-1)?.id === documentId;
  }

  /** Waits for journey group content to render before scrolling the document row. */
  private scrollToDocumentRowWhenReady(
    documentId: string,
    attempt: number,
    generation: number,
  ): void {
    globalThis.setTimeout(
      () => {
        if (!this.isViewportScrollCurrent(generation)) {
          return;
        }

        if (this.isFirstNavigableDocument(documentId)) {
          const scroller = this.getDocumentsScroller();
          if (scroller) {
            this.scrollDocumentsScrollerTo(scroller, 'top');
            this.isNavigatingDocuments = false;
            return;
          }
        }

        const row = document.querySelector(
          `[data-telemetry-id="document-row-${documentId}"]`,
        );

        if (row instanceof HTMLElement) {
          if (this.isLastNavigableDocument(documentId)) {
            this.settleDocumentsScrollerAtBottom(row, 0);
            return;
          }

          if (this.isFirstNavigableDocument(documentId)) {
            const scroller = this.getDocumentsScroller();
            if (scroller) {
              this.scrollDocumentsScrollerTo(scroller, 'top');
            } else {
              this.scrollElementIntoViewWithInset(row);
            }
          } else {
            this.scrollElementIntoViewWithInset(row);
          }

          this.isNavigatingDocuments = false;
          return;
        }

        if (attempt < 5) {
          this.scrollToDocumentRowWhenReady(
            documentId,
            attempt + 1,
            generation,
          );
          return;
        }

        if (this.isLastNavigableDocument(documentId)) {
          const row = document.querySelector(
            `[data-telemetry-id="document-row-${documentId}"]`,
          );
          if (row instanceof HTMLElement) {
            this.settleDocumentsScrollerAtBottom(row, 0);
            return;
          }

          const scroller = this.getDocumentsScroller();
          if (scroller) {
            this.scrollDocumentsScrollerTo(scroller, 'bottom');
          }
        }

        this.isNavigatingDocuments = false;
      },
      attempt === 0 ? 0 : 16,
    );
  }

  private getDocumentsScroller(): HTMLElement | null {
    const scroller = document.querySelector(
      '.c-affiliate-details__documents-scroll',
    );

    return scroller instanceof HTMLElement ? scroller : null;
  }

  private scrollDocumentsScrollerTo(
    scroller: HTMLElement,
    edge: 'top' | 'bottom',
  ): void {
    const top =
      edge === 'top' ? 0 : scroller.scrollHeight - scroller.clientHeight;

    scroller.scrollTo({ top, behavior: 'smooth' });
  }

  /**
   * Snaps the documents scroller to the bottom while accordion content settles,
   * then fine-tunes so the last row is fully visible with scroll inset.
   */
  private settleDocumentsScrollerAtBottom(
    row: HTMLElement,
    attempt: number,
  ): void {
    const maxAttempts = 10;
    const delay = attempt === 0 ? 0 : 32;

    globalThis.setTimeout(() => {
      const scroller = this.getDocumentsScroller();
      const scrollHeightBefore = scroller?.scrollHeight ?? 0;

      if (scroller) {
        scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
      }

      this.scrollElementIntoViewWithInset(row);

      const scrollHeightAfter = scroller?.scrollHeight ?? 0;
      const needsAnotherPass =
        attempt < maxAttempts - 1 &&
        (scrollHeightAfter > scrollHeightBefore || attempt < 3);

      if (needsAnotherPass) {
        this.settleDocumentsScrollerAtBottom(row, attempt + 1);
        return;
      }

      this.isNavigatingDocuments = false;
    }, delay);
  }

  /**
   * Scrolls so the full element fits inside the documents card scroller with inset.
   * Unlike `scrollIntoView({ block: 'nearest' })`, also scrolls when only the bottom
   * edge is clipped.
   */
  private scrollElementIntoViewWithInset(
    element: HTMLElement,
    behavior: ScrollBehavior = 'smooth',
  ): void {
    const inset = this.listScrollInset();
    const scrollParent = this.findScrollableParent(element);

    if (!scrollParent) {
      element.scrollIntoView({ behavior, block: 'nearest' });
      return;
    }

    const parentRect = scrollParent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const overflowTop = elementRect.top - parentRect.top - inset.blockStart;
    const overflowBottom =
      elementRect.bottom - parentRect.bottom + inset.blockEnd;

    if (overflowTop < 0) {
      scrollParent.scrollBy({ top: overflowTop, behavior });
      return;
    }

    if (overflowBottom > 0) {
      scrollParent.scrollBy({ top: overflowBottom, behavior });
    }
  }

  private listScrollInset(): { blockStart: number; blockEnd: number } {
    const scroller = this.getDocumentsScroller();

    if (scroller) {
      const style = globalThis.getComputedStyle(scroller);
      const blockStart = Number.parseFloat(style.scrollPaddingTop);
      const blockEnd = Number.parseFloat(style.scrollPaddingBottom);

      if (!Number.isNaN(blockStart) && !Number.isNaN(blockEnd)) {
        return { blockStart, blockEnd };
      }
    }

    return { blockStart: 21, blockEnd: 21 };
  }

  private findScrollableParent(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;

    while (parent) {
      const style = globalThis.getComputedStyle(parent);
      const overflowY = style.overflowY;

      if (
        (overflowY === 'auto' || overflowY === 'scroll') &&
        parent.scrollHeight > parent.clientHeight
      ) {
        return parent;
      }

      parent = parent.parentElement;
    }

    return null;
  }

  private recordTelemetry(event: string, target?: string): void {
    if (this.testingTelemetryEnabled) {
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
      EVA_MARTINEZ_DOCUMENT_GROUPS.find(
        (group) => group.id === latestGroupId,
      ) ?? null
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
    const query = this.documentSearch().trim().toLowerCase();
    let filtered = query
      ? documents.filter(
          (document) =>
            document.title.toLowerCase().includes(query) ||
            document.titleLine2?.toLowerCase().includes(query),
        )
      : [...documents];

    const sector = this.selectedSector()?.value;
    if (sector && sector !== 'tous') {
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
      filtered = filtered.filter(
        (document) => document.id === latestDocumentId,
      );
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
          STATUS_SORT_PRIORITY[left.status?.label ?? ''] ??
          Number.MAX_SAFE_INTEGER;
        const rightPriority =
          STATUS_SORT_PRIORITY[right.status?.label ?? ''] ??
          Number.MAX_SAFE_INTEGER;

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

    const ascending = this.activeSortAscending();

    return [...documents].sort((left, right) =>
      compareStartDates(
        this.receptionDateById(left.id),
        this.receptionDateById(right.id),
        ascending,
      ),
    );
  }

  private sortDocumentsForCategory(
    documents: ListDocumentItem[],
    category: 'parcours' | 'flat',
  ): ListDocumentItem[] {
    const sortValue = this.selectedSort()?.value;

    if (sortValue === 'nom-document') {
      return [...documents].sort((left, right) =>
        left.title.localeCompare(right.title),
      );
    }

    if (sortValue === 'actions-en-cours') {
      return [...documents].sort((left, right) => {
        const leftPriority =
          STATUS_SORT_PRIORITY[left.status?.label ?? ''] ??
          Number.MAX_SAFE_INTEGER;
        const rightPriority =
          STATUS_SORT_PRIORITY[right.status?.label ?? ''] ??
          Number.MAX_SAFE_INTEGER;

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        return compareStartDates(
          this.receptionDateById(left.id),
          this.receptionDateById(right.id),
          category === 'parcours'
            ? this.startDateSortAscending()
            : this.flatListSortAscending(),
        );
      });
    }

    const ascending =
      category === 'parcours'
        ? this.startDateSortAscending()
        : this.flatListSortAscending();

    return [...documents].sort((left, right) =>
      compareStartDates(
        this.receptionDateById(left.id),
        this.receptionDateById(right.id),
        ascending,
      ),
    );
  }

  private sortGroups(groups: ListGroup[]): ListGroup[] {
    const sortValue = this.selectedSort()?.value ?? 'date-reception';

    if (sortValue === 'nom-document') {
      return [...groups].sort((left, right) => {
        const byTitle = (left.documents[0]?.title ?? '').localeCompare(
          right.documents[0]?.title ?? '',
        );

        if (byTitle !== 0) {
          return byTitle;
        }

        return compareStartDates(left.startDate, right.startDate, true);
      });
    }

    if (sortValue === 'actions-en-cours') {
      return [...groups].sort((left, right) => {
        const leftPriority = this.groupStatusSortPriority(left);
        const rightPriority = this.groupStatusSortPriority(right);

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        return compareStartDates(left.startDate, right.startDate, true);
      });
    }

    return this.sortGroupsByStartDate(groups);
  }

  private groupStatusSortPriority(group: ListGroup): number {
    return Math.min(
      ...group.documents.map(
        (document) =>
          STATUS_SORT_PRIORITY[document.status?.label ?? ''] ??
          Number.MAX_SAFE_INTEGER,
      ),
    );
  }

  private sortGroupsByStartDate(groups: ListGroup[]): ListGroup[] {
    const ascending = this.startDateSortAscending();

    return [...groups].sort((left, right) =>
      compareStartDates(left.startDate, right.startDate, ascending),
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
    if (isSimulatedAffiliateLoadingEnabled()) {
      this.affiliateHeaderService.setHeaderLoading(true);
    }

    this.destroyRef.onDestroy(() => {
      this.telemetry.disable();
      this.clearAffiliatePageLoadingTimer();
    });

    effect(() => {
      const routeId = this.affiliateId();
      if (!routeId) {
        return;
      }

      this.scheduleAffiliatePageLoading();
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
      const categories = this.categories();
      const active = this.activeCategory();
      const current = categories.find((category) => category.id === active);

      if (current?.enabled) {
        return;
      }

      const firstEnabled = categories.find((category) => category.enabled);
      if (firstEnabled) {
        this.activeCategory.set(firstEnabled.id);
      }
    });

    effect(() => {
      const search = this.documentSearch();
      const sector = this.selectedSector()?.value ?? '';
      const info = this.documentInfoFilter() ?? '';
      const filterSnapshot = [search, sector, info].join('\u0000');

      const categories = this.categories();
      const open = untracked(() => this.openCategories());
      const enabledIds = categories
        .filter((category) => category.enabled)
        .map((category) => category.id);
      const enabledSet = new Set(enabledIds);

      const previousSnapshot = this.categoryFilterSnapshot;
      const filterChanged =
        this.categoryFilterSnapshotReady && filterSnapshot !== previousSnapshot;

      const [prevSearch = '', prevSector = '', prevInfo = ''] =
        previousSnapshot.split('\u0000');
      const filterCleared =
        filterChanged &&
        ((prevInfo !== '' && info === '') ||
          (prevSector !== '' && sector === '') ||
          (prevSearch !== '' && search === ''));

      this.categoryFilterSnapshot = filterSnapshot;
      this.categoryFilterSnapshotReady = true;

      const next =
        filterChanged && filterCleared
          ? open.filter((id) => enabledSet.has(id))
          : filterChanged
            ? [
                ...open.filter((id) => enabledSet.has(id)),
                ...enabledIds.filter((id) => !open.includes(id)),
              ]
            : open.filter((id) => enabledSet.has(id));

      const changed =
        next.length !== open.length || next.some((id) => !open.includes(id));

      if (changed) {
        this.syncOpenCategories(next);
      }

      if (filterChanged) {
        untracked(() => {
          this.restoreSelectedDocumentViewport();
        });
      }
    });

    effect(() => {
      const visible = this.visibleDocuments();
      const selected = this.selectedDocumentId();

      if (visible.length === 0 || selected !== null || this.isEvaDossier()) {
        return;
      }

      this.documentFocus.set(null);
      this.selectedDocumentId.set(visible[0].id);
    });

    effect(() => {
      if (this.defaultJourneyExpansionApplied) {
        return;
      }

      this.startDateSortAscending();
      this.flatListSortAscending();
      this.documentInfoFilter();
      this.documentSearch();
      this.selectedSort();
      this.selectedSector();

      const groups = this.parcoursGroups();
      if (!groups.length) {
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
        variant: 'default',
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

  private scheduleAffiliatePageLoading(): void {
    this.clearAffiliatePageLoadingTimer();

    if (!isSimulatedAffiliateLoadingEnabled()) {
      this.pageLoading.set(false);
      this.affiliateHeaderService.setHeaderLoading(false);
      return;
    }

    this.pageLoading.set(true);
    this.affiliateHeaderService.setHeaderLoading(true);

    this.loadingTimerId = setTimeout(() => {
      this.pageLoading.set(false);
      this.affiliateHeaderService.setHeaderLoading(false);
      this.loadingTimerId = null;
    }, SIMULATED_LOADING_MS);
  }

  private clearAffiliatePageLoadingTimer(): void {
    if (this.loadingTimerId !== null) {
      clearTimeout(this.loadingTimerId);
      this.loadingTimerId = null;
    }
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
