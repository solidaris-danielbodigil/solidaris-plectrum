// Document detail viewer types — Figma iSHARE-Audit node 324:5860.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1

export interface DocumentDetailField {
  label: string;
  value: string | DocumentDetailPeriod;
}

export interface DocumentDetailPeriod {
  from: string;
  to: string;
}

export interface DocumentCertificatAction {
  label: string;
  icon: string;
  href?: string;
}

export type DocumentCertificatPanelStatusSeverity =
  | 'success'
  | 'warn'
  | 'danger'
  | 'info'
  | 'secondary'
  | 'contrast';

/** Shared label for accordion panel “more details” drawers (moderated testing `data-test`). */
export const MORE_DETAILS_LABEL = 'Voir plus de détails';

/** Filled Bootstrap icons for comment / warning severities (list tags, accordion, p-message). */
export const COMMENT_ICONS = {
  info: 'bi bi-chat-right-text-fill',
  warn: 'bi bi-exclamation-triangle-fill',
} as const satisfies Record<'info' | 'warn', string>;

/**
 * Maps a worker-comment severity onto the comment-count tag severity. Info
 * comments display as `secondary` so they do not clash with blue `info`
 * status tags (e.g. "Reçu"); every other severity (notably `warn`) is kept
 * as-is. Shared by the document list row tags and the detail panel/accordion
 * header tags so both stay visually aligned.
 */
export function commentCountTagSeverity(
  severity: DocumentCertificatPanelStatusSeverity,
): DocumentCertificatPanelStatusSeverity {
  return severity === 'info' ? 'secondary' : severity;
}

/** Audit table description — plain text, status tag, or multiline block. */
export type DocumentAuditDescription =
  | string
  | {
      kind: 'tag';
      label: string;
      severity: DocumentCertificatPanelStatusSeverity;
      icon?: string;
    }
  | { kind: 'multiline'; lines: string[] };

export interface DocumentAuditRow {
  date: string;
  description: DocumentAuditDescription;
  application: string;
  source: string;
}

export interface DocumentTimelineEvent {
  id: string;
  /** Date tag shown in the accordion header. */
  dateLabel: string;
  status: DocumentCertificatPanel['status'];
  markerIcon: string;
  markerTone: 'info' | 'warn' | 'success' | 'secondary';
  rows: DocumentAuditRow[];
}

export interface DocumentMoreDetails {
  events: DocumentTimelineEvent[];
}

/** Deep-link to another document panel (e.g. incapacité → primaire Calcul). */
export interface DocumentCrossReference {
  label: string;
  documentId: string;
  stepValue: number;
  panelId: string;
}

export interface DocumentCertificatPanel {
  id: string;
  title: string;
  /** When true, accordion header is grayed and cannot expand (e.g. required doc not yet received). */
  disabled?: boolean;
  status: {
    label: string;
    severity: DocumentCertificatPanelStatusSeverity;
    icon?: string;
  };
  workerComment?: {
    severity: DocumentCertificatPanelStatusSeverity;
    text: string;
    icon?: string;
  };
  crossReference?: DocumentCrossReference;
  actions: DocumentCertificatAction[];
  details: DocumentDetailField[];
  moreDetailsLabel: string;
  moreDetails?: DocumentMoreDetails;
}

export interface DocumentStep {
  value: number;
  label: string;
  panels?: DocumentCertificatPanel[];
}

export type AffiliateDocumentDetailLayout = 'stepper' | 'standalone';

export interface AffiliateDocumentDetail {
  documentId: string;
  title: string;
  activeStep: number;
  /** When false, stepper hides step numbers. Defaults to true. */
  stepNumbered?: boolean;
  /**
   * Defaults to `stepper`. Use `standalone` for hors-parcours isolated documents
   * that render a single accordion panel without stepper chrome.
   */
  layout?: AffiliateDocumentDetailLayout;
  /** Optional banner above panel content (e.g. hors-parcours C4). */
  banner?: {
    severity: DocumentCertificatPanelStatusSeverity;
    text: string;
    icon?: string;
  };
  steps: DocumentStep[];
}

export function isDocumentDetailPeriod(
  value: DocumentDetailField['value'],
): value is DocumentDetailPeriod {
  return (
    typeof value === 'object' &&
    value !== null &&
    'from' in value &&
    'to' in value
  );
}

export function isDocumentAuditTag(
  description: DocumentAuditDescription,
): description is Extract<DocumentAuditDescription, { kind: 'tag' }> {
  return (
    typeof description === 'object' &&
    description !== null &&
    'kind' in description &&
    description.kind === 'tag'
  );
}

export function isDocumentAuditMultiline(
  description: DocumentAuditDescription,
): description is Extract<DocumentAuditDescription, { kind: 'multiline' }> {
  return (
    typeof description === 'object' &&
    description !== null &&
    'kind' in description &&
    description.kind === 'multiline'
  );
}
