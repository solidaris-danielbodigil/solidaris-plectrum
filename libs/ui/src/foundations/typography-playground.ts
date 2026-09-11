// =============================================================================
// libs/ui/src/foundations/typography-playground.ts
// Helpers behind Foundations/Typography → Playground. Kept out of the CSF file
// so Storybook does not index them as stories; the spec imports them from here.
// Everything is read from the compiled stylesheet (rule 10-css-ssot).
// =============================================================================

import {
  readClassSuffixes,
  readTokenDeclarations,
  resolveToken,
} from '../storybook/cssom';

/** Role intent already stated on Foundations / Typography Usage — do not invent more. */
const TEXT_ROLE_HINTS: Record<string, string> = {
  display: 'Hero figures.',
  heading: 'Titles.',
  label: 'UI chrome.',
  body: 'Prose.',
};

export interface TextStyleMetric {
  property: string;
  cssVar: string;
  value: string;
}

const METRIC_LABELS: Record<string, string> = {
  family: 'Family',
  size: 'Size',
  weight: 'Weight',
  'line-height': 'Line height',
  spacing: 'Letter spacing',
};

/** Generated .u-text-{role}-{size} classes, from the compiled stylesheet. */
export const textStyles = (): string[] =>
  readClassSuffixes(/^u-text-([a-z0-9-]+)$/).filter((style) => !style.includes('@'));

/**
 * Every `--pds-text-{style}-*` token declared for a style, in stylesheet order
 * (family, size, weight, line-height, spacing…). Read from the CSSOM so each
 * displayed reference is one that actually resolves.
 */
export function textStyleTokens(style: string): string[] {
  const prefix = `--pds-text-${style}-`;
  return [...readTokenDeclarations().keys()].filter((cssVar) =>
    cssVar.startsWith(prefix),
  );
}

/** Hint for the role prefix (`body-md` → body). Empty when the system has no guidance. */
export function textRoleHint(style: string): string {
  const role = style.replace(/-(xl|lg|md|sm|xs)$/, '');
  return TEXT_ROLE_HINTS[role] ?? '';
}

export function textStyleMetrics(style: string): TextStyleMetric[] {
  const prefix = `--pds-text-${style}-`;
  return textStyleTokens(style).map((cssVar) => {
    const property = cssVar.slice(prefix.length);
    return {
      property: METRIC_LABELS[property] ?? property,
      cssVar,
      value:
        typeof document === 'undefined'
          ? ''
          : resolveToken(document.documentElement, cssVar),
    };
  });
}
