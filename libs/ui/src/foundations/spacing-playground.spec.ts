// =============================================================================
// Spacing playground — the stop options are derived from the compiled
// stylesheet (.ai/rules/10-css-ssot.md), so these tests run against the real
// CSSOM, not a copied list. Karma loads libs/styles/src/main.scss.
// =============================================================================

import { readClassNames, readTokenDeclarations } from '../storybook/cssom';
import {
  acceptsStop,
  compareStops,
  SPACING_PROPERTIES,
  spacingStops,
  spacingTokenVar,
} from './spacing-playground';

describe('spacing playground stops', () => {
  it('finds generated stops for every property (guards against an empty stylesheet)', () => {
    for (const property of SPACING_PROPERTIES) {
      expect(spacingStops(property).length)
        .withContext(property)
        .toBeGreaterThan(1);
    }
  });

  it('never offers auto for gap or padding, even though the stylesheet generates the class', () => {
    // The scale map is applied to every spacing key, so the class exists…
    expect(readClassNames(/^o-layout--gap-auto$/)).toEqual(['o-layout--gap-auto']);
    expect(readClassNames(/^o-layout--padding-auto$/)).toEqual([
      'o-layout--padding-auto',
    ]);
    // …but the property rejects the value, so the playground must not offer it.
    expect(spacingStops('gap')).not.toContain('auto');
    expect(spacingStops('padding')).not.toContain('auto');
    expect(acceptsStop('gap', 'auto')).toBe(false);
    expect(acceptsStop('padding', 'auto')).toBe(false);
  });

  it('keeps auto for margin when the stylesheet generates it', () => {
    const generated = readClassNames(/^o-layout--margin-auto$/).length > 0;
    expect(spacingStops('margin').includes('auto')).toBe(generated);
  });

  it('only offers stops backed by a --pds-spacing-* token the property accepts', () => {
    const tokens = readTokenDeclarations();
    for (const property of SPACING_PROPERTIES) {
      for (const stop of spacingStops(property)) {
        expect(tokens.has(spacingTokenVar(stop)))
          .withContext(`${property} ${stop}`)
          .toBe(true);
        expect(acceptsStop(property, stop))
          .withContext(`${property} ${stop}`)
          .toBe(true);
        // Sub-property classes (o-layout--padding-top-2) are not stops.
        expect(readClassNames(new RegExp(`^o-layout--${property}-${stop}$`)))
          .withContext(`${property} ${stop}`)
          .toEqual([`o-layout--${property}-${stop}`]);
      }
    }
  });

  it('sorts stops numerically, not lexically', () => {
    expect(
      ['2', '0-5', '1', '0-75', '10', '0-25', '1-5', '0', 'auto'].sort(compareStops),
    ).toEqual(['0', '0-25', '0-5', '0-75', '1', '1-5', '2', '10', 'auto']);

    const gap = spacingStops('gap');
    const numeric = gap.map((stop) => Number(stop.replace(/^(\d+)-(\d+)$/, '$1.$2')));
    expect(numeric.every((value) => !Number.isNaN(value))).toBe(true);
    expect(numeric).toEqual([...numeric].sort((a, b) => a - b));
  });
});
