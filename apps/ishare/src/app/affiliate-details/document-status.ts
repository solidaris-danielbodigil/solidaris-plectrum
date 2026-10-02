// iSHARE document status tags — single source of truth.
// Figma iSHARE-Audit node 794:18611 ("Tag"): 8 `tag` instances (Code Connect → `p-tag`),
// all with `showIcon`, `rounded=False`, icon 10.5px on the left of the label.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=794-18611

import type { ListEntryStatus } from '@solidaris-danielbodigil/pds-ui';
import type { DocumentCertificatPanelStatusSeverity } from './affiliate-document-detail/affiliate-document-detail.types';

export type DocumentStatus =
  | 'accepte'
  | 'accepte-auto'
  | 'cloture'
  | 'en-attente'
  | 'en-traitement'
  | 'recu'
  | 'non-recu'
  | 'refuse';

export interface DocumentStatusTag {
  label: string;
  severity: DocumentCertificatPanelStatusSeverity;
  icon: string;
}

export const DOCUMENT_STATUS_TAGS = {
  accepte: { label: 'Accepté', severity: 'success', icon: 'bi bi-check-lg' },
  'accepte-auto': {
    label: 'Accepté - Auto',
    severity: 'success',
    icon: 'bi bi-check-lg',
  },
  cloture: { label: 'Clôturé', severity: 'contrast', icon: 'bi bi-check-lg' },
  'en-attente': { label: 'En attente', severity: 'warn', icon: 'bi bi-clock' },
  'en-traitement': {
    label: 'En traitement',
    severity: 'warn',
    icon: 'bi bi-hourglass-split',
  },
  recu: { label: 'Reçu', severity: 'info', icon: 'bi bi-envelope' },
  'non-recu': {
    label: 'Non reçu',
    severity: 'secondary',
    icon: 'bi bi-envelope',
  },
  // Figma uses the PrimeNG `close-primeng` (times) glyph; Bootstrap equivalent.
  refuse: { label: 'Refusé', severity: 'danger', icon: 'bi bi-x-lg' },
} as const satisfies Record<DocumentStatus, DocumentStatusTag>;

/** Fresh tag object for a status (safe to spread or override, e.g. a flux code prefix). */
export function documentStatusTag(status: DocumentStatus): DocumentStatusTag {
  return { ...DOCUMENT_STATUS_TAGS[status] };
}

const DOCUMENT_STATUS_BY_LABEL = new Map<string, DocumentStatus>(
  (Object.keys(DOCUMENT_STATUS_TAGS) as DocumentStatus[]).map((status) => [
    DOCUMENT_STATUS_TAGS[status].label,
    status,
  ]),
);

/** Reverse lookup from a rendered tag label; `undefined` for non-document statuses. */
export function documentStatusFromLabel(
  label: string | undefined,
): DocumentStatus | undefined {
  return label === undefined ? undefined : DOCUMENT_STATUS_BY_LABEL.get(label);
}

/** Status tag for `pds-list` rows. */
export function documentListStatus(status: DocumentStatus): ListEntryStatus {
  return documentStatusTag(status);
}
