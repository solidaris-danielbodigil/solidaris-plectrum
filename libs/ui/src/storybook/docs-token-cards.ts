// =============================================================================
// libs/ui/src/storybook/docs-token-cards.ts
// Card model for foundation utility galleries (Elevation, Borders).
// Rendered by <pds-docs-token-gallery> — same chrome as <pds-token-explorer>.
// =============================================================================

export interface DocsTokenCard {
  name: string;
  value?: string;
  tag?: string;
  /** Extra classes on the preview tile — usually a u-* utility. */
  previewClass?: string;
  /** Inline custom properties the preview modifiers read. */
  previewStyle?: string;
  /** Clipboard payload. Defaults to `name`. */
  copyText?: string;
  /** Edge / corner glyph — used when the class is a direction, not a swatch. */
  direction?: { kind: 'border' | 'radius'; target: string };
}
