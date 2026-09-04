// =============================================================================
// libs/ui/src/storybook/token-taxonomy.ts
// Classifies a --pds-* token name by convention.
//
// The stylesheet decides which tokens exist (see cssom.ts). This file only
// decides where a token belongs on a page — taxonomy, which CSS cannot express
// and which .ai/rules/10-css-ssot.md therefore allows as metadata.
//
// Foundation group names are read from TOKEN_SECTIONS keys, so there is
// no second list: documenting a group and recognising it are the same edit.
// =============================================================================

import { TOKEN_SECTIONS } from './token-sections';

export type TokenCategory =
  | 'color'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'shadow'
  | 'motion'
  | 'focus'
  | 'icon';

/** Tokens outside a known group land here — one section per page. */
export const COMPONENT_GROUP = 'component';

export interface TokenTaxon {
  /** Page the token belongs on, or null when it is not a foundation concern. */
  category: TokenCategory | null;
  group: string;
  scope: 'foundation' | 'component';
}

/**
 * Category by name prefix. Order matters: `letter-spacing-*` must be tested
 * before `spacing-*`, and `transition-*` before the bare `duration-*`.
 */
const CATEGORY_PREFIXES: ReadonlyArray<[RegExp, TokenCategory]> = [
  [/^color-/, 'color'],
  [/^(font-|text-|line-height-|letter-spacing-|paragraph-spacing-)/, 'typography'],
  [/^focus-/, 'focus'],
  [/^radius-/, 'radius'],
  [/^shadow-/, 'shadow'],
  [/^(transition-|duration-|ease-)/, 'motion'],
  [/^(spacing-|space-|base-unit$|spacing-unit$)/, 'spacing'],
  [/^icon-size/, 'icon'],
];

/**
 * A foundation scale step is a single word or a numeric run: `md`, `2xl`,
 * `pill`, `0-25`, `1-5`. Anything with a further word segment
 * (`overlay-modal`, `nav-shell-item-px`) is component-specific.
 *
 * Shape-based rather than a list of stops, so a new `radius-3xl` is recognised
 * without touching this file.
 */
const SCALE_STEP = /^[a-z0-9]+(-\d+)*$/;

function categoryOf(name: string): TokenCategory | null {
  for (const [pattern, category] of CATEGORY_PREFIXES) {
    if (pattern.test(name)) return category;
  }
  return null;
}

/** Section keys for a category, longest first for greedy matching. */
function groupKeys(category: TokenCategory): string[] {
  return TOKEN_SECTIONS[category].sections
    .map((section) => section.key)
    .sort((a, b) => b.length - a.length);
}

/** Longest guidance group that prefixes `remainder`, e.g. `primary` before `prim`. */
function matchGroup(category: TokenCategory, remainder: string): string | null {
  for (const key of groupKeys(category)) {
    if (remainder === key || remainder.startsWith(`${key}-`)) return key;
  }
  return null;
}

function typographyGroup(name: string): string | null {
  const semantic = /^text-([a-z]+)-/.exec(name);
  if (semantic) return matchGroup('typography', semantic[1]);

  if (/^font-family-/.test(name) || name === 'font-agenda' || name === 'font-open-sans') {
    return 'family';
  }
  if (/^font-size-/.test(name)) return 'size';
  if (/^font-weight-/.test(name)) return 'weight';
  if (/^line-height-/.test(name)) return 'line-height';
  if (/^(letter-spacing-|paragraph-spacing-)/.test(name)) return 'spacing';
  return null;
}

/**
 * Maps a `color-*` remainder onto a Figma Colors group.
 * Numbered hues stay Primitive; named roles and `primary` / `surface` scales
 * stay Semantic Common — same split as the Plectrum DS v21 Colors page.
 */
function colorTaxon(name: string): TokenTaxon | null {
  const remainder = name.replace(/^color-/, '');
  const scale = /^([a-z]+)-(\d+)$/.exec(remainder);
  if (scale) {
    return { category: 'color', group: scale[1], scope: 'foundation' };
  }

  if (/^brand(-|$)/.test(remainder)) {
    return { category: 'color', group: 'primary', scope: 'foundation' };
  }
  if (/^nav(-|$)/.test(remainder)) {
    return { category: 'color', group: 'navigation', scope: 'foundation' };
  }

  const group = matchGroup('color', remainder);
  return group ? { category: 'color', group, scope: 'foundation' } : null;
}

/** Category prefixes whose remainder is a scale step, e.g. `radius-md` → `md`. */
const SCALE_CATEGORIES: Partial<Record<TokenCategory, [RegExp, string]>> = {
  radius: [/^radius-/, 'radius'],
  shadow: [/^shadow-/, 'elevation'],
  spacing: [/^spacing-/, 'spacing'],
  icon: [/^icon-size-/, 'size'],
};

export function classifyToken(name: string): TokenTaxon {
  const category = categoryOf(name);
  if (!category) {
    return { category: null, group: COMPONENT_GROUP, scope: 'component' };
  }

  const component: TokenTaxon = { category, group: COMPONENT_GROUP, scope: 'component' };

  if (category === 'typography') {
    const group = typographyGroup(name);
    return group ? { category, group, scope: 'foundation' } : component;
  }

  if (category === 'spacing' && (name === 'base-unit' || name === 'spacing-unit')) {
    return { category, group: 'spacing', scope: 'foundation' };
  }

  if (category === 'icon' && name === 'icon-size') {
    return { category, group: 'size', scope: 'foundation' };
  }

  if (category === 'motion') {
    if (/^ease-/.test(name)) return { category, group: 'easing', scope: 'foundation' };
    if (/^transition-duration/.test(name)) {
      return { category, group: 'duration', scope: 'foundation' };
    }
    return component;
  }

  if (category === 'focus') {
    const group = matchGroup('focus', name.replace(/^focus-/, ''));
    return group ? { category, group, scope: 'foundation' } : component;
  }

  if (category === 'color') {
    return colorTaxon(name) ?? component;
  }

  const scale = SCALE_CATEGORIES[category];
  if (scale) {
    const [prefix, group] = scale;
    const remainder = name.replace(prefix, '');
    if (SCALE_STEP.test(remainder)) return { category, group, scope: 'foundation' };
  }

  return component;
}
