export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Accessible label (always rendered; visually hidden in collapsed mode) */
  label: string;
  /**
   * Icon identifier passed to <(pds|app|lib)-icon [icon]="...">.
   * - For iconSource="class": Bootstrap Icons class string, e.g. `'bi bi-house'`
   * - For iconSource="svg":   Registry key registered via IconRegistry.register()
   */
  icon: string;
  /**
   * How the icon value should be interpreted by <(pds|app|lib)-icon>.
   * Defaults to 'svg' (custom brand-mark SVG via IconRegistry).
   */
  iconSource?: 'class' | 'svg';
  /** Optional in-app router link */
  routerLink?: string | string[];
  /**
   * Optional absolute or root-relative URL for a sibling app.
   * When set, Nav Shell renders a plain `<a href>` (RouterLink is not applied).
   */
  href?: string;
  /** Optional badge count */
  badge?: number;
  /** Show an external-link trailing icon in expanded mode (Figma: box-arrow-up-right) */
  trailingIcon?: boolean;
}
