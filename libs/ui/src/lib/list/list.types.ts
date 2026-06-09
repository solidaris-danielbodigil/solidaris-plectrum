/** Status tag shown on document row headers (Figma: warn "En traitement"). */
export interface ListDocumentStatus {
  label: string;
  severity: 'warn' | 'info' | 'success' | 'danger' | 'secondary';
  icon?: string;
}

/** Opaque deep-link target a count tag can jump to (consumer-resolved). */
export interface ListDocumentTagTarget {
  id: string;
  label: string;
}

/** Footer count tag on document rows (comments, warnings, …). */
export interface ListDocumentTag {
  label: string;
  severity: 'info' | 'warn' | 'success' | 'danger' | 'secondary';
  icon?: string;
  ariaLabel?: string;
  targets?: ListDocumentTagTarget[];
}

/** Single document row in flat or journey mode. */
export interface ListDocumentItem {
  id: string;
  title: string;
  titleLine2?: string;
  status?: ListDocumentStatus;
  tags?: ListDocumentTag[];
  selected?: boolean;
}

/** Journey-mode group header with optional child documents. */
export interface ListGroup {
  id: string;
  title: string;
  titleAccent?: string;
  startDate?: string;
  endDate?: string;
  expanded?: boolean;
  documents: ListDocumentItem[];
}

/** Union of row types rendered by sds-list. */
export type ListItem = ListGroup | ListDocumentItem;

export function isListGroup(item: ListItem): item is ListGroup {
  return 'documents' in item;
}
