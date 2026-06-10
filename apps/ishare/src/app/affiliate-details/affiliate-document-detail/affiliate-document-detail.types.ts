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

/** Filled Bootstrap icons for comment / warning severities (list tags, accordion, p-message). */
export const COMMENT_ICONS = {
  info: 'bi bi-chat-right-text-fill',
  warn: 'bi bi-exclamation-triangle-fill',
} as const satisfies Record<'info' | 'warn', string>;

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
  markerTone: 'info' | 'warn' | 'success';
  rows: DocumentAuditRow[];
}

export interface DocumentMoreDetails {
  events: DocumentTimelineEvent[];
}

export interface DocumentCertificatPanel {
  id: string;
  title: string;
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

export interface AffiliateDocumentDetail {
  documentId: string;
  title: string;
  activeStep: number;
  steps: DocumentStep[];
}

export function isDocumentDetailPeriod(
  value: DocumentDetailField['value'],
): value is DocumentDetailPeriod {
  return typeof value === 'object' && value !== null && 'from' in value && 'to' in value;
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
