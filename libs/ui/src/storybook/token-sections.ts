// =============================================================================
// libs/ui/src/storybook/token-sections.ts
// Section ordering and labels for <pds-token-explorer>.
//
// Prose lives in the foundation MDX pages. This file is the metadata CSS
// cannot express — which groups exist and in what order
// (.ai/rules/10-css-ssot.md). token-taxonomy.ts reads the same keys so
// documenting a group and recognising it stay one edit.
// =============================================================================

export interface TokenSection {
  key: string;
  label: string;
}

export interface TokenCategorySections {
  label: string;
  sections: TokenSection[];
}

/** Primitive hue ramps — Figma Colors / Primitive, in file order. */
export const COLOR_PRIMITIVE_GROUPS = [
  'amber',
  'blue',
  'cyan',
  'emerald',
  'fuchsia',
  'gray',
  'green',
  'indigo',
  'lime',
  'neutral',
  'orange',
  'pink',
  'purple',
  'red',
  'rose',
  'sky',
  'slate',
  'stone',
  'teal',
  'violet',
  'yellow',
  'zinc',
] as const;

/**
 * Semantic Common groups — Figma Colors / Semantic Common, in file order.
 * `primary` and `surface` include both numbered steps and named roles, as in Figma.
 */
export const COLOR_SEMANTIC_GROUPS = [
  'focus',
  'form',
  'primary',
  'content',
  'highlight',
  'list',
  'mask',
  'navigation',
  'overlay',
  'surface',
  'text',
] as const;

function labeled(keys: readonly string[]): TokenSection[] {
  return keys.map((key) => ({ key, label: key }));
}

export const TOKEN_SECTIONS: Record<string, TokenCategorySections> = {
  color: {
    label: 'Color',
    sections: [...labeled(COLOR_PRIMITIVE_GROUPS), ...labeled(COLOR_SEMANTIC_GROUPS)],
  },

  typography: {
    label: 'Typography',
    sections: [
      { key: 'display', label: 'Display' },
      { key: 'heading', label: 'Heading' },
      { key: 'label', label: 'Label' },
      { key: 'body', label: 'Body' },
      { key: 'family', label: 'Font family' },
      { key: 'size', label: 'Font size' },
      { key: 'weight', label: 'Font weight' },
      { key: 'line-height', label: 'Line height' },
      { key: 'spacing', label: 'Letter spacing' },
    ],
  },

  spacing: {
    label: 'Spacing',
    sections: [{ key: 'spacing', label: 'Scale' }],
  },

  radius: {
    label: 'Radius',
    sections: [{ key: 'radius', label: 'Stops' }],
  },

  shadow: {
    label: 'Elevation',
    sections: [
      { key: 'elevation', label: 'Elevation scale' },
      { key: 'overlay', label: 'Overlay' },
      { key: 'form', label: 'Form' },
    ],
  },

  motion: {
    label: 'Motion',
    sections: [
      { key: 'duration', label: 'Duration' },
      { key: 'easing', label: 'Easing' },
    ],
  },

  focus: {
    label: 'Focus',
    sections: [{ key: 'ring', label: 'Ring' }],
  },

  icon: {
    label: 'Icon',
    sections: [{ key: 'size', label: 'Sizes' }],
  },
};

