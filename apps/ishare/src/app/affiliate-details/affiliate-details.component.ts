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
import { isEvaMartinezAffiliate } from './affiliate-mock.constants';
import {
  COMMENT_ICONS,
  commentCountTagSeverity,
  type AffiliateDocumentDetail,
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
    ToggleSwitchModule,
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

  readonly statusAction: AffiliateOverviewStatusAction = {
    label: 'Action requise',
    icon: 'bi bi-exclamation-triangle-fill',
  };

  readonly documentInfoFilter =
    signal<AffiliateOverviewInfoTagFilterKey | null>(null);

  readonly transactionsCicsDialogVisible = signal(false);

  readonly infoTags = computed<AffiliateOverviewInfoTag[]>(() => {
    const allDocuments = this.allDocumentsForContext();
    const activeCount = allDocuments.filter(isActiveDocument).length;
    const closedCount = allDocuments.filter(isClosedDocument).length;
    const filter = this.documentInfoFilter();
    const tags: AffiliateOverviewInfoTag[] = [];

    tags.push(
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
    );

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

  selectedSector: SectorOption | null = this.sectorOptions[0];
  sectorSuggestions: SectorOption[] = [...this.sectorOptions];
  readonly selectedSort = signal<SortOption | null>(this.sortOptions[0]);
  sortSuggestions: SortOption[] = [...this.sortOptions];
  journeyView = true;
  readonly archivedOnly = signal(false);

  readonly expandedGroupIds = signal<string[]>([]);

  /** Ensures the first journey group is expanded only once on initial load. */
  private defaultJourneyExpansionApplied = false;

  /** `false` = newest start date first; `true` = oldest start date first. */
  readonly startDateSortAscending = signal(true);

  readonly startDateSortIcon = computed(() =>
    this.startDateSortAscending() ? 'bi bi-sort-up' : 'bi bi-sort-down',
  );

  readonly startDateSortAriaLabel = computed(() =>
    this.startDateSortAscending()
      ? 'Trier du plus ancien au plus récent'
      : 'Trier du plus récent au plus ancien',
  );

  // Second-column document detail viewer — Figma iSHARE-Audit node 324:5860.
  // https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1
  readonly selectedDocumentId = signal<string | null>(null);

  // Deep-link target forwarded to the detail card when a row count tag is
  // clicked. Reset to null on a plain row select so a later click does not keep
  // forcing a stale step/panel jump.
  readonly documentFocus = signal<{ stepValue: number; panelId: string } | null>(
    null,
  );

  readonly visibleDocuments = computed(() =>
    this.filterDocuments(this.allDocumentsForContext()),
  );

  get listGroups(): ListGroup[] | null {
    if (!this.journeyView) {
      return null;
    }

    let groups = this.isEvaDossier()
      ? EVA_MARTINEZ_DOCUMENT_GROUPS
      : [];

    if (this.documentInfoFilter() === 'last-action') {
      const latestGroupId = this.latestJourneyGroupId();
      groups = groups.filter((group) => group.id === latestGroupId);
    }

    return this.sortGroupsByStartDate(
      groups
        .map((group) => ({
          ...group,
          documents: this.filterDocuments(group.documents),
        }))
        .filter((group) => group.documents.length > 0),
    );
  }

  get listItems(): ListDocumentItem[] {
    if (this.journeyView) {
      return [];
    }

    return this.sortDocumentsByReceptionDate(
      this.filterDocuments(this.allDocumentsForContext()),
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

  toggleStartDateSort(): void {
    this.startDateSortAscending.update((ascending) => !ascending);
  }

  onExpandedGroupIdsChange(expandedGroupIds: string[]): void {
    const previous = this.expandedGroupIds();
    this.expandedGroupIds.set(expandedGroupIds);

    const newlyExpandedId = expandedGroupIds.find((id) => !previous.includes(id));
    if (!newlyExpandedId || !this.journeyView) {
      return;
    }

    const group = this.listGroups?.find((item) => item.id === newlyExpandedId);
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
    return this.isEvaDossier() ? allEvaMartinezDocuments() : [];
  }

  private receptionDateById(documentId: string): string | undefined {
    return DOCUMENT_RECEPTION_DATE_BY_ID.get(documentId);
  }

  private recordTelemetry(event: string, target?: string): void {
    if (environment.enableTestingTelemetry) {
      this.telemetry.record(event, target);
    }
  }

  private lastActionLabel(): string {
    if (!this.isEvaDossier()) {
      return '—';
    }

    let latestReceptionDate = '';
    for (const date of DOCUMENT_RECEPTION_DATE_BY_ID.values()) {
      if (
        !latestReceptionDate ||
        parseFrenchDate(date) > parseFrenchDate(latestReceptionDate)
      ) {
        latestReceptionDate = date;
      }
    }

    if (!latestReceptionDate) {
      return '—';
    }

    return `Document reçu ${latestReceptionDate}`;
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
      const latestDocumentId = this.latestReceptionDocumentId();
      filtered = filtered.filter((document) => document.id === latestDocumentId);
    }

    if (this.selectedSort()?.value === 'nom-document') {
      filtered = [...filtered].sort((left, right) =>
        left.title.localeCompare(right.title),
      );
    } else {
      filtered = this.sortDocumentsByReceptionDate(filtered);
    }

    return filtered;
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
    const ascending = this.startDateSortAscending();

    return [...documents].sort((left, right) =>
      compareStartDates(
        this.receptionDateById(left.id),
        this.receptionDateById(right.id),
        ascending,
      ),
    );
  }

  private latestReceptionDocumentId(): string {
    return [...DOCUMENT_RECEPTION_DATE_BY_ID.entries()].reduce(
      (latest, [documentId, date]) =>
        parseFrenchDate(date) > parseFrenchDate(latest.date)
          ? { documentId, date }
          : latest,
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
      if (this.defaultJourneyExpansionApplied || !this.journeyView) {
        return;
      }

      // List-shaping signals — re-run when filters/sort change before first expand.
      this.startDateSortAscending();
      this.archivedOnly();
      this.documentInfoFilter();
      this.documentSearch();
      this.selectedSort();

      const groups = this.listGroups;
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

function compareStartDates(
  left: string | undefined,
  right: string | undefined,
  ascending: boolean,
): number {
  const leftTime = left ? parseFrenchDate(left) : 0;
  const rightTime = right ? parseFrenchDate(right) : 0;

  return ascending ? leftTime - rightTime : rightTime - leftTime;
}
