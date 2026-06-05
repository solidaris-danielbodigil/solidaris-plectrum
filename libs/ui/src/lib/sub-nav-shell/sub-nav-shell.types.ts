export interface SubNavShellItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional router link */
  routerLink?: string | string[];
  /** Optional numeric badge count */
  count?: number;
  /** Badge severity — maps to PrimeNG Badge severity ('danger' renders red) */
  countSeverity?: 'danger' | 'success' | 'info' | 'warn' | 'secondary' | 'contrast';
  /** Optional Bootstrap Icon class for a leading icon (e.g. 'bi-person-fill') */
  icon?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
}

export interface SubNavShellSection {
  /** Unique identifier */
  id: string;
  /**
   * Section heading (uppercase in the UI).
   * When empty, items render as standalone featured items above the accordion.
   */
  label: string;
  /** Menu items in this section */
  items: SubNavShellItem[];
  /** Whether the section starts collapsed (default: false = expanded) */
  collapsed?: boolean;
}
