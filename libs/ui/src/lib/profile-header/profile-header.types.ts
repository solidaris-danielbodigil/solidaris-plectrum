import type { MenuItem } from 'primeng/api';

/** Background treatment — the fallback when `statusAction.severity` is not set. */
export type ProfileHeaderVariant = 'default' | 'in-order' | 'warning' | 'danger';

/** Consumer-defined key of a quick-filter info tag (e.g. `'active-documents'`). */
export type ProfileHeaderInfoTagFilterKey = string;

export interface ProfileHeaderInfoTag {
  label: string;
  value: string;
  /** Makes the tag a quick filter (PrimeNG ToggleButton); a display-only Tag when omitted. */
  filterKey?: ProfileHeaderInfoTagFilterKey;
  /** Initial pressed state of a filterable tag. */
  active?: boolean;
}

export interface ProfileHeaderIdentifier {
  label: string;
  value: string;
}

export type ProfileHeaderStatusSeverity = 'success' | 'warn' | 'danger';

export interface ProfileHeaderStatusAction {
  label: string;
  /** Short code shown in the status badge (e.g. « C4 »). */
  tagValue?: string;
  /** Overrides the severity icon (check-lg / exclamation-triangle / exclamation-octagon). */
  icon?: string;
  /** Drives the header gradient, the button severity and the default icon. */
  severity?: ProfileHeaderStatusSeverity;
  /**
   * Accessible name override — must start with the visible text (WCAG 2.5.3).
   * Defaults to « {prefix}{tagValue} — {label} », {@link label}, or « Actions à réaliser ({count}) ».
   */
  ariaLabel?: string;
  /** Renders the status action disabled (no click, no menu). */
  disabled?: boolean;
  /**
   * More than one entry turns the action into a SplitButton menu; a single entry
   * is run by the plain Button (its command + statusMenuSelect).
   */
  menuItems?: MenuItem[];
}

export interface ProfileHeaderPrimaryAction {
  /** Action name — accessible name suffix and tooltip (e.g. « Voir carte affilié »). */
  label: string;
  /** Right icon of the name button; defaults to `bi bi-person-square`. */
  icon?: string;
  /** Document-level shortcut written as « ALT + A ». */
  shortcut?: string;
}
