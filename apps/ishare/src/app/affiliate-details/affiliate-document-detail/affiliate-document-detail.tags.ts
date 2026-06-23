import type {
  ListDocumentTag,
  ListDocumentTagTarget,
} from '@solidaris/ui';
import { EVA_MARTINEZ_DOCUMENT_DETAILS } from './affiliate-document-detail.mock';
import {
  COMMENT_ICONS,
  commentCountTagSeverity,
  type AffiliateDocumentDetail,
  type AffiliateDocumentDetailLayout,
  type DocumentCertificatPanel,
  type DocumentCertificatPanelStatusSeverity,
  type DocumentStep,
} from './affiliate-document-detail.types';

type ListTagSeverity = ListDocumentTag['severity'];

/** Lower value = higher workflow priority (matches document list sort). */
export const PANEL_STATUS_SORT_PRIORITY: Record<string, number> = {
  'Non reçu': -2,
  'Non démarré': -1,
  'En attente': 0,
  'En traitement': 1,
  Reçu: 2,
  Accepté: 3,
  Clôturé: 4,
};

const LIST_TAG_SEVERITIES: readonly ListTagSeverity[] = [
  'info',
  'warn',
  'success',
  'danger',
  'secondary',
];

const COMMENT_TAG_ICONS: Record<ListTagSeverity, string> = {
  info: COMMENT_ICONS.info,
  warn: COMMENT_ICONS.warn,
  success: 'bi bi-check-circle-fill',
  danger: 'bi bi-exclamation-octagon-fill',
  secondary: COMMENT_ICONS.info,
};

const COMMENT_TAG_NOUNS: Record<ListTagSeverity, string> = {
  info: 'commentaire',
  warn: 'avertissement',
  success: 'confirmation',
  danger: 'alerte',
  secondary: 'note',
};

export interface DocumentStepSummary {
  status: DocumentCertificatPanel['status'] | null;
  tags: ListDocumentTag[];
}

function toListTagSeverity(
  severity: DocumentCertificatPanelStatusSeverity,
): ListTagSeverity {
  return LIST_TAG_SEVERITIES.includes(severity as ListTagSeverity)
    ? (severity as ListTagSeverity)
    : 'secondary';
}

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

export function panelStatusSortPriority(label: string): number {
  return PANEL_STATUS_SORT_PRIORITY[label] ?? Number.MAX_SAFE_INTEGER;
}

/** Picks the highest-priority panel status across a step's child accordions. */
export function aggregateStepStatus(
  panels: DocumentCertificatPanel[] | undefined,
): DocumentCertificatPanel['status'] | null {
  if (!panels?.length) {
    return null;
  }

  return panels.reduce((best, panel) => {
    if (
      panelStatusSortPriority(panel.status.label) <
      panelStatusSortPriority(best.label)
    ) {
      return panel.status;
    }

    return best;
  }, panels[0].status);
}

function buildCommentTagsForPanels(
  panels: DocumentCertificatPanel[],
  resolveTargetLabel: (panel: DocumentCertificatPanel) => string,
  resolveTargetId: (panel: DocumentCertificatPanel) => string,
): ListDocumentTag[] {
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

  for (const panel of panels) {
    if (!panel.workerComment || panel.disabled) {
      continue;
    }

    addTarget(
      commentCountListTagSeverity(panel.workerComment.severity),
      panel.workerComment.severity,
      {
        id: resolveTargetId(panel),
        label: resolveTargetLabel(panel),
      },
    );
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

/** Comment / warning count tags for a single stepper step. */
export function deriveStepCommentTags(
  step: DocumentStep,
  options: {
    layout?: AffiliateDocumentDetailLayout;
    stepLabel?: string;
  } = {},
): ListDocumentTag[] {
  const stepLabel = options.stepLabel ?? step.label;
  const layout = options.layout;

  return buildCommentTagsForPanels(
    step.panels ?? [],
    (panel) =>
      layout === 'standalone'
        ? panel.title
        : `${stepLabel} - ${panel.title}`,
    (panel) => `${step.value}::${panel.id}`,
  );
}

export function summarizeDocumentStep(
  step: DocumentStep,
  layout?: AffiliateDocumentDetailLayout,
): DocumentStepSummary {
  return {
    status: aggregateStepStatus(step.panels),
    tags: deriveStepCommentTags(step, { layout }),
  };
}

/**
 * Derives a document's count tags from detail panels so list row badges and
 * deep-link jump targets share one source of truth.
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
