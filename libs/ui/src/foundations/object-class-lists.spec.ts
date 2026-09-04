// =============================================================================
// Validates the documented ArgTypes variant lists against the classes the
// stylesheet actually generates.
//
// These lists cannot be derived at render time (Storybook reads argTypes at
// module load), so this spec is what makes them non-drifting: rename or add an
// o-flex modifier and the corresponding assertion fails.
// See .ai/rules/10-css-ssot.md §5.
// =============================================================================

import { readClassRules } from '../storybook/cssom';
import { FLEX, RESPONSIVE, type ClassList } from './object-class-lists';

/** Variants the stylesheet emits for a list's pattern (base classes only). */
function generatedValues(list: ClassList): string[] {
  return readClassRules(list.pattern)
    .filter(
      (rule) =>
        !list.declares ||
        list.declares.some((prop) => rule.properties.includes(prop)),
    )
    .map((rule) => rule.suffix)
    .sort();
}

function documentedValues(list: ClassList): string[] {
  return [...list.values].sort();
}

describe('object class lists match the stylesheet', () => {
  it('finds generated classes at all (guards against an empty stylesheet)', () => {
    expect(generatedValues(FLEX['span']).length).toBeGreaterThan(0);
  });

  for (const [group, lists] of Object.entries({ FLEX })) {
    for (const [name, list] of Object.entries(lists)) {
      it(`${group}.${name} — ${list.label}`, () => {
        expect(documentedValues(list)).toEqual(generatedValues(list));
      });
    }
  }

  it(`RESPONSIVE — ${RESPONSIVE.label}`, () => {
    expect(documentedValues(RESPONSIVE)).toEqual(generatedValues(RESPONSIVE));
  });
});
