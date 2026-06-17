/** PrimeNG drawer overlay target — required inside flex / overflow-hidden layouts. */
export const PDS_DRAWER_APPEND_TO = 'body' as const;

/** Content-driven panel width — pairs with `_settings.drawer.scss` tokens. */
export const PDS_DRAWER_CONTENT_STYLE = {
  width: 'max-content',
  minWidth: 'var(--pds-size-drawer-min-width)',
  maxWidth: 'var(--pds-size-drawer-max-width)',
} as const;

/** Panel divider chrome — pair with `u-border-bottom` on owned drawer shell elements. */
export const PDS_PANEL_BORDER_BOTTOM_STYLE = {
  '--pds-border-color': 'var(--pds-color-panel-border)',
} as const;
