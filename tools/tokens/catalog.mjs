/**
 * Tokens the Style Dictionary hybrid emitter is allowed to write.
 * Spacing / typography stay code-owned — see foundations-phase-0.md.
 */

const RAMP = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

function colorRamp(palette, { includeZero = false, shades = RAMP } = {}) {
  const rows = [];
  if (includeZero) {
    rows.push({
      cssName: `color-${palette}-0`,
      path: `${palette}.0`,
      file: 'colors-primitive',
      category: 'color',
      group: palette,
      figmaRef: `${palette}/0`,
    });
  }
  for (const shade of shades) {
    rows.push({
      cssName: `color-${palette}-${shade}`,
      path: `${palette}.${shade}`,
      file: 'colors-primitive',
      category: 'color',
      group: palette,
      figmaRef: `${palette}/${shade}`,
    });
  }
  return rows;
}

function semantic(cssName, { path = null, ref = null, group, figmaRef = null } = {}) {
  return {
    cssName,
    path,
    ref,
    file: 'colors-semantic',
    category: 'color',
    group,
    figmaRef: figmaRef ?? group,
  };
}

export function listCatalog() {
  return [
    ...colorRamp('primary'),
    ...colorRamp('surface', { includeZero: true }),
    ...colorRamp('green'),
    ...colorRamp('orange'),
    ...colorRamp('red'),
    ...colorRamp('rose'),
    ...colorRamp('blue'),
    ...colorRamp('yellow'),
    ...colorRamp('gray'),
    ...colorRamp('neutral'),
    {
      cssName: 'color-solidaris-red-500',
      path: 'basic.solidaris.500',
      file: 'colors-primitive',
      category: 'color',
      group: 'solidaris',
      figmaRef: 'basic/solidaris/500',
    },

    semantic('color-brand', { path: 'primary.color', ref: 'color-primary-600', group: 'brand' }),
    semantic('color-brand-hover', { path: 'primary.hover.color', ref: 'color-primary-700', group: 'brand' }),
    semantic('color-brand-active', { path: 'primary.active.color', ref: 'color-primary-800', group: 'brand' }),
    semantic('color-brand-subtle', { ref: 'color-primary-50', group: 'brand' }),

    semantic('color-success', { path: 'green.500', ref: 'color-green-500', group: 'feedback' }),
    semantic('color-success-subtle', { path: 'green.50', ref: 'color-green-50', group: 'feedback' }),
    semantic('color-warning', { path: 'orange.600', ref: 'color-orange-600', group: 'feedback' }),
    semantic('color-warning-subtle', { path: 'orange.100', ref: 'color-orange-100', group: 'feedback' }),
    semantic('color-danger', { path: 'red.600', ref: 'color-red-600', group: 'feedback' }),
    semantic('color-danger-subtle', { path: 'red.100', ref: 'color-red-100', group: 'feedback' }),
    semantic('color-danger-emphasis', { path: 'red.700', ref: 'color-red-700', group: 'feedback' }),
    semantic('color-error', { ref: 'color-danger', group: 'feedback' }),
    semantic('color-info', { path: 'blue.500', ref: 'color-blue-500', group: 'feedback' }),
    semantic('color-info-subtle', { path: 'blue.300', ref: 'color-blue-300', group: 'feedback' }),

    semantic('color-surface', { path: 'surface.0', ref: 'color-surface-0', group: 'surface' }),
    semantic('color-surface-default', { path: 'surface.0', ref: 'color-surface-0', group: 'surface' }),
    semantic('color-surface-subtle', { path: 'surface.50', ref: 'color-surface-50', group: 'surface' }),
    semantic('color-surface-muted', { ref: 'color-surface-75', group: 'surface' }),
    semantic('color-surface-border', { path: 'surface.100', ref: 'color-surface-100', group: 'surface' }),
    semantic('color-panel-border', { ref: 'color-surface-border-drawer', group: 'surface' }),
    semantic('color-card-border', { path: 'surface.200', ref: 'color-surface-200', group: 'surface' }),
    semantic('color-divider', { path: 'surface.200', ref: 'color-surface-200', group: 'surface' }),

    semantic('color-text', { path: 'text.color', ref: 'color-surface-900', group: 'text' }),
    semantic('color-text-hover', { path: 'text.hover.color', ref: 'color-surface-950', group: 'text' }),
    semantic('color-text-muted', { path: 'text.muted.color', ref: 'color-surface-600', group: 'text' }),
    semantic('color-text-muted-hover', { path: 'text.hover.muted.color', ref: 'color-surface-600', group: 'text' }),
    semantic('color-text-inverse', { path: 'surface.0', ref: 'color-surface-0', group: 'text' }),
    semantic('color-text-link', { ref: 'color-brand', group: 'text' }),
    semantic('color-text-link-hover', { ref: 'color-brand-hover', group: 'text' }),
    semantic('color-text-link-visited', { ref: 'color-brand-active', group: 'text' }),

    semantic('color-highlight', { path: 'highlight.background', ref: 'color-primary-50', group: 'highlight' }),
    semantic('color-highlight-focus', { path: 'highlight.focus.background', ref: 'color-primary-100', group: 'highlight' }),
    semantic('color-highlight-text', { path: 'highlight.color', ref: 'color-text', group: 'highlight' }),
    semantic('color-highlight-focus-text', { path: 'highlight.focus.color', ref: 'color-text', group: 'highlight' }),

    semantic('color-focus', { path: 'focus.ring.color', ref: 'color-blue-300', group: 'focus' }),

    semantic('color-overlay-modal-border', { path: 'overlay.modal.border.color', ref: 'color-surface-0', group: 'overlay' }),
    semantic('color-overlay-select-border', { path: 'overlay.select.border.color', ref: 'color-surface-0', group: 'overlay' }),
    semantic('color-overlay-popover-border', { path: 'overlay.popover.border.color', ref: 'color-surface-200', group: 'overlay' }),

    semantic('color-content', { path: 'content.color', ref: 'color-text', group: 'content' }),
    semantic('color-content-bg', { path: 'surface.0', ref: 'color-surface-0', group: 'content' }),
    semantic('color-content-hover', { path: 'content.hover.color', ref: 'color-text-hover', group: 'content' }),
    semantic('color-content-hover-bg', { path: 'content.hover.background', ref: 'color-surface-75', group: 'content' }),
    semantic('color-content-border', { path: 'content.border.color', ref: 'color-black-alpha-100', group: 'content' }),

    semantic('color-primary-interactive', { path: 'primary.color', ref: 'color-primary-500', group: 'primary-interactive' }),
    semantic('color-primary-interactive-hover', { path: 'primary.hover.color', ref: 'color-primary-700', group: 'primary-interactive' }),
    semantic('color-primary-interactive-active', { path: 'primary.active.color', ref: 'color-primary-800', group: 'primary-interactive' }),
    semantic('color-primary-interactive-contrast', { path: 'primary.contrast.color', ref: 'color-surface-0', group: 'primary-interactive' }),

    semantic('color-form-text', { ref: 'color-surface-900', group: 'form' }),
    semantic('color-form-bg', { path: 'surface.0', ref: 'color-surface-0', group: 'form' }),
    semantic('color-form-border', { ref: 'color-black-alpha-200', group: 'form' }),
    semantic('color-form-border-hover', { ref: 'color-black-alpha-400', group: 'form' }),
    semantic('color-form-border-focus', { ref: 'color-primary-interactive', group: 'form' }),
    semantic('color-form-border-invalid', { ref: 'color-danger', group: 'form' }),
    semantic('color-form-icon', { path: 'form.field.icon.color', ref: 'color-surface-500', group: 'form' }),
    semantic('color-form-placeholder', { ref: 'color-surface-500', group: 'form' }),
    semantic('color-form-disabled-text', { path: 'form.field.disabled.color', ref: 'color-surface-500', group: 'form' }),
    semantic('color-form-disabled-bg', { path: 'form.field.disabled.background', ref: 'color-surface-100', group: 'form' }),
    semantic('color-form-filled-bg', { path: 'form.field.filled.background', ref: 'color-surface-50', group: 'form' }),
    semantic('color-form-float-label', { ref: 'color-surface-500', group: 'form' }),
    semantic('color-form-float-label-focus', { path: 'form.field.float.label.focus.color', ref: 'color-primary-600', group: 'form' }),
    semantic('color-form-float-label-active', { path: 'form.field.float.label.active.color', ref: 'color-surface-500', group: 'form' }),
    semantic('color-form-float-label-invalid', { path: 'form.field.float.label.invalid.color', ref: 'color-danger-emphasis', group: 'form' }),
    semantic('color-form-invalid-placeholder', { path: 'form.field.invalid.placeholder.color', ref: 'color-danger-emphasis', group: 'form' }),

    semantic('color-mask', { path: 'mask.color', ref: 'color-surface-200', group: 'mask' }),
    semantic('color-mask-bg', { path: 'mask.background', ref: 'color-black-alpha-400', group: 'mask' }),

    semantic('color-nav-item', { path: 'navigation.item.color', ref: 'color-text', group: 'navigation' }),
    semantic('color-nav-item-focus', { path: 'navigation.item.focus.color', ref: 'color-text-hover', group: 'navigation' }),
    semantic('color-nav-item-active', { path: 'navigation.item.active.color', ref: 'color-text-hover', group: 'navigation' }),
    semantic('color-nav-item-focus-bg', { path: 'navigation.item.focus.background', ref: 'color-surface-100', group: 'navigation' }),
    semantic('color-nav-item-active-bg', { path: 'navigation.item.active.background', ref: 'color-surface-100', group: 'navigation' }),
    semantic('color-nav-item-icon', { path: 'navigation.item.icon.color', ref: 'color-surface-400', group: 'navigation' }),
    semantic('color-nav-item-icon-focus', { path: 'navigation.item.icon.focus.color', ref: 'color-surface-500', group: 'navigation' }),
    semantic('color-nav-item-icon-active', { path: 'navigation.item.icon.active.color', ref: 'color-surface-500', group: 'navigation' }),
    semantic('color-nav-submenu-icon', { path: 'navigation.submenu.icon.color', ref: 'color-surface-400', group: 'navigation' }),
    semantic('color-nav-submenu-label', { path: 'navigation.submenu.label.color', ref: 'color-text-muted', group: 'navigation' }),

    ...['none', 'xs', 'sm', 'md', 'lg', 'xl'].map((stop) => ({
      cssName: `radius-${stop}`,
      path: `border.radius.${stop}`,
      file: 'radius',
      category: 'radius',
      group: 'radius',
      figmaRef: `border/radius/${stop}`,
    })),

    {
      cssName: 'shadow-overlay-modal',
      path: 'overlay.modal.shadow',
      compose: 'shadow',
      file: 'shadows',
      category: 'shadow',
      group: 'overlay',
      figmaRef: 'overlay/modal/shadow',
    },
    {
      cssName: 'shadow-overlay-select',
      path: 'overlay.select.shadow',
      compose: 'shadow',
      file: 'shadows',
      category: 'shadow',
      group: 'overlay',
      figmaRef: 'overlay/select/shadow',
    },
    {
      cssName: 'shadow-overlay-popover',
      path: 'overlay.popover.shadow',
      compose: 'shadow',
      file: 'shadows',
      category: 'shadow',
      group: 'overlay',
      figmaRef: 'overlay/popover/shadow',
    },
    {
      cssName: 'shadow-overlay-navigation',
      path: 'overlay.navigation.shadow',
      compose: 'shadow',
      file: 'shadows',
      category: 'shadow',
      group: 'overlay',
      figmaRef: 'overlay/navigation/shadow',
    },
    {
      cssName: 'shadow-form-field',
      path: 'form.field.shadow',
      compose: 'shadow',
      file: 'shadows',
      category: 'shadow',
      group: 'form',
      figmaRef: 'form/field/shadow',
    },

    {
      cssName: 'transition-duration',
      path: null,
      literal: '0.2s',
      file: 'transitions',
      category: 'motion',
      group: 'duration',
      figmaRef: null,
    },
    {
      cssName: 'transition-duration-mask',
      path: null,
      literal: '0.15s',
      file: 'transitions',
      category: 'motion',
      group: 'duration',
      figmaRef: null,
    },

    {
      cssName: 'focus-ring-color',
      path: 'focus.ring.color',
      ref: 'color-blue-300',
      file: 'focus',
      category: 'focus',
      group: 'ring',
      figmaRef: 'focus/ring/color',
    },
    {
      cssName: 'focus-ring-width',
      path: 'focus.ring.width',
      file: 'focus',
      category: 'focus',
      group: 'ring',
      figmaRef: 'focus/ring/width',
    },
    {
      cssName: 'focus-ring-offset',
      path: 'focus.ring.offset',
      file: 'focus',
      category: 'focus',
      group: 'ring',
      figmaRef: 'focus/ring/offset',
    },
    {
      cssName: 'focus-ring-style',
      path: null,
      literal: 'solid',
      file: 'focus',
      category: 'focus',
      group: 'ring',
      figmaRef: null,
    },
    {
      cssName: 'focus-ring-shadow',
      path: null,
      literal: 'none',
      file: 'focus',
      category: 'focus',
      group: 'ring',
      figmaRef: null,
    },
  ].map((token) => ({
    ...token,
    cssVar: `--pds-${token.cssName}`,
  }));
}

export const GENERATED_FILES = [
  'colors-primitive',
  'colors-semantic',
  'radius',
  'shadows',
  'transitions',
  'focus',
];
