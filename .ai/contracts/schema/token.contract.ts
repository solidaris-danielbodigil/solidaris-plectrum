// =============================================================================
// Token Contract Schema — Solidaris/Plectrum
//
// Defines the structure for token-level governance metadata.
// Used by validation scripts to detect drift between Figma, code, and docs.
// =============================================================================

export interface TokenContract {
  /** Token identity */
  name: string;
  /** CSS custom property name (e.g. --pds-color-brand) */
  cssProperty: string;
  /** primitive | semantic | component */
  layer: 'primitive' | 'semantic' | 'component';
  /** Category group */
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'transition' | 'focus' | 'global';
  /** Current value */
  value: string;
  /** If semantic/component, what it resolves to */
  resolvedFrom?: string;
  /** Figma variable name (dot notation) */
  figmaVariable?: string;
  /** PrimeNG variable it maps to */
  primeNgMapping?: string;
  /** Description of intent */
  description: string;
  /** Components that consume this token */
  consumedBy: string[];
  /** Risk level if changed */
  changeRisk: 'low' | 'medium' | 'high';
  /** WCAG contrast requirements (for color tokens) */
  contrastRequirement?: string;
  /** Deprecation info */
  deprecated?: {
    since: string;
    replacement: string;
    removalTarget: string;
  };
}

export interface TokenCollection {
  /** File this collection maps to */
  sourceFile: string;
  /** Last sync with Figma */
  figmaSyncDate?: string;
  /** Token entries */
  tokens: TokenContract[];
}
