/** PrimeNG drawer overlay target — required inside flex / overflow-hidden layouts. */
export const SDS_DRAWER_APPEND_TO = 'body' as const;

/** Content-driven panel width — pairs with `_settings.drawer.scss` tokens. */
export const SDS_DRAWER_CONTENT_STYLE = {
  width: 'max-content',
  minWidth: 'var(--sds-size-drawer-min-width)',
  maxWidth: 'var(--sds-size-drawer-max-width)',
} as const;

/** Panel divider chrome — pair with `u-border-bottom` on owned drawer shell elements. */
export const SDS_PANEL_BORDER_BOTTOM_STYLE = {
  '--sds-border-color': 'var(--sds-color-panel-border)',
} as const;
