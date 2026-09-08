/** Status tag shown on entry row headers. */
export interface ListEntryStatus {
  label: string;
  severity: 'warn' | 'info' | 'success' | 'danger' | 'secondary';
  icon?: string;
}

/** Opaque deep-link target a count tag can jump to (consumer-resolved). */
export interface ListEntryTagTarget {
  id: string;
  label: string;
}

/** Footer count tag on document rows (comments, warnings, …). */
export interface ListEntryTag {
  label: string;
  severity: 'info' | 'warn' | 'success' | 'danger' | 'secondary';
  icon?: string;
  ariaLabel?: string;
  targets?: ListEntryTagTarget[];
}

/** Single entry row in flat or journey mode. */
export interface ListEntryItem {
  id: string;
  title: string;
  titleLine2?: string;
  /** Bootstrap Icons class(es) for the row header icon (e.g. `bi bi-bandaid`). */
  icon?: string;
  status?: ListEntryStatus;
  tags?: ListEntryTag[];
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
  documents: ListEntryItem[];
}

/** Union of row types rendered by pds-list. */
export type ListItem = ListGroup | ListEntryItem;

export function isListGroup(item: ListItem): item is ListGroup {
  return 'documents' in item;
}
