// =============================================================================
// libs/ui/src/lib/icon/icon.types.ts
// Shared types for the SDS icon system.
// =============================================================================

/** Visual size variant for <sds-icon>. Maps to --sds-icon-size-* tokens. */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Source type for an icon.
 * - 'class'  → Bootstrap Icons CSS class string, e.g. 'bi bi-house'
 * - 'svg'    → SVG markup string (inline, typically from the registry)
 */
export type IconSource = 'class' | 'svg';

/** Shape of a registered SVG icon entry. */
export interface SvgIconEntry {
  /** Raw SVG markup — must NOT contain width/height attributes so it scales via CSS. */
  svg: string;
}
