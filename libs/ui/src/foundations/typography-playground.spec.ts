// =============================================================================
// Typography playground — the token references it prints are read from the
// compiled stylesheet (.ai/rules/10-css-ssot.md), so each one must resolve.
// Karma loads libs/styles/src/main.scss.
// =============================================================================

import { resolveToken } from '../storybook/cssom';
import { textStyles, textStyleTokens } from './typography-playground';

const DEFAULT_STYLE = 'body-md';

describe('typography playground tokens', () => {
  it('offers the default style from the generated u-text-* classes', () => {
    expect(textStyles()).toContain(DEFAULT_STYLE);
  });

  it('lists every declared --pds-text-{style}-* token for the default style', () => {
    const tokens = textStyleTokens(DEFAULT_STYLE);
    expect(tokens).toContain('--pds-text-body-md-line-height');
    expect(tokens).toContain('--pds-text-body-md-family');
    expect(tokens).toContain('--pds-text-body-md-size');
    expect(tokens).toContain('--pds-text-body-md-weight');
    // The former hand-written `-line` suffix was never a declared token.
    expect(tokens).not.toContain('--pds-text-body-md-line');
    expect(tokens.every((cssVar) => cssVar.startsWith('--pds-text-body-md-'))).toBe(true);
  });

  it('resolves every displayed reference for the default style to a non-empty value', () => {
    const tokens = textStyleTokens(DEFAULT_STYLE);
    expect(tokens.length).toBeGreaterThan(0);
    for (const cssVar of tokens) {
      expect(resolveToken(document.documentElement, cssVar))
        .withContext(cssVar)
        .not.toBe('');
    }
  });

  it('resolves every reference for every generated style', () => {
    for (const style of textStyles()) {
      const tokens = textStyleTokens(style);
      expect(tokens.length).withContext(style).toBeGreaterThan(0);
      for (const cssVar of tokens) {
        expect(resolveToken(document.documentElement, cssVar))
          .withContext(cssVar)
          .not.toBe('');
      }
    }
  });
});
