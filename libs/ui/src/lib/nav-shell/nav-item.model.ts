export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Accessible label (always rendered; visually hidden in collapsed mode) */
  label: string;
  /**
   * Icon identifier passed to <sds-icon [icon]="...">.
   * - For iconSource="class": Bootstrap Icons class string, e.g. `'bi bi-house'`
   * - For iconSource="svg":   Registry key registered via IconRegistry.register()
   */
  icon: string;
  /**
   * How the icon value should be interpreted by <sds-icon>.
   * Defaults to 'svg' (custom brand-mark SVG via IconRegistry).
   */
  iconSource?: 'class' | 'svg';
  /** Optional router link */
  routerLink?: string | string[];
  /** Optional badge count */
  badge?: number;
  /** Show an external-link trailing icon in expanded mode (Figma: box-arrow-up-right) */
  trailingIcon?: boolean;
}
