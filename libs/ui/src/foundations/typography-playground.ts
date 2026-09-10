// =============================================================================
// libs/ui/src/foundations/typography-playground.ts
// Helpers behind Foundations/Typography → Playground. Kept out of the CSF file
// so Storybook does not index them as stories; the spec imports them from here.
// Everything is read from the compiled stylesheet (rule 10-css-ssot).
// =============================================================================

import { readClassSuffixes, readTokenDeclarations } from '../storybook/cssom';

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
