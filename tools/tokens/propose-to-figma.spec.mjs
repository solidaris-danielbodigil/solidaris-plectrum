import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { cssToFigmaColor } from './figma-values.mjs';
import {
  buildLookup,
  classifyResolved,
  classifyToken,
  collapseWhitespace,
  evaluatePxExpression,
  parseFontFamily,
  resolveCalcs,
} from './propose-to-figma.mjs';

describe('collapseWhitespace', () => {
  it('collapses CRLF and runs of space', () => {
    assert.equal(collapseWhitespace('a\r\n  b\n\tc'), 'a b c');
  });
});

describe('evaluatePxExpression', () => {
  it('evaluates + - * / and parentheses', () => {
    assert.equal(evaluatePxExpression('17 / 14 * 14'), 17);
    assert.equal(evaluatePxExpression('(14 * 2) + 3.5'), 31.5);
    assert.equal(evaluatePxExpression('0.25 * 7'), 1.75);
  });

  it('rejects leftover units or empty input', () => {
    assert.equal(evaluatePxExpression('17px'), null);
    assert.equal(evaluatePxExpression(''), null);
  });
});

describe('resolveCalcs', () => {
  it('reduces rem and px calc to a px literal', () => {
    assert.equal(resolveCalcs('calc(17 / 14 * 14px)'), '17px');
    assert.equal(resolveCalcs('calc(1rem / 2)'), '7px');
  });
});

describe('classifyResolved', () => {
  it('types colors, including transparent, and rejects Sass interpolation', () => {
    assert.equal(classifyResolved('#edf1f4').$type, 'color');
    assert.equal(classifyResolved('rgba(0, 0, 0, 0.05)').$type, 'color');
    assert.equal(classifyResolved('transparent').$type, 'color');
    assert.deepEqual(classifyResolved('#{$grid-cols}'), {
      $type: 'other',
      $value: '#{$grid-cols}',
      reason: 'sass:interpolation',
    });
  });

  it('types dimensions, numbers, font weights and families', () => {
    assert.deepEqual(classifyResolved('16px'), {
      $type: 'dimension',
      $value: { value: 16, unit: 'px' },
    });
    assert.deepEqual(classifyResolved('1rem'), {
      $type: 'dimension',
      $value: { value: 14, unit: 'px' },
    });
    assert.deepEqual(classifyResolved('0'), {
      $type: 'dimension',
      $value: { value: 0, unit: 'px' },
    });
    assert.deepEqual(classifyResolved('0.5'), { $type: 'number', $value: 0.5 });
    assert.deepEqual(classifyResolved('10'), { $type: 'number', $value: 10 });
    assert.deepEqual(classifyResolved('400'), { $type: 'fontWeight', $value: 400 });
    assert.deepEqual(classifyResolved("'Open Sans', sans-serif", 'font-family-body'), {
      $type: 'fontFamily',
      $value: ['Open Sans', 'sans-serif'],
    });
  });

  it('records skip reasons for unsupported values', () => {
    assert.equal(
      classifyResolved('0 1px 2px rgba(0, 0, 0, 0.05)', 'shadow-sm').reason,
      'unsupported:shadow',
    );
    assert.equal(
      classifyResolved('linear-gradient(88deg, #fff 0%, #000 100%)').reason,
      'unsupported:gradient',
    );
    assert.equal(classifyResolved('700ms').reason, 'unsupported:duration');
    assert.equal(classifyResolved('23.21%').reason, 'unit:%');
    assert.equal(classifyResolved('100vw').reason, 'unit:viewport');
    assert.equal(classifyResolved('auto').reason, 'unsupported:keyword');
    assert.equal(classifyResolved('cubic-bezier(0.4, 0, 0.2, 1)').reason, 'unsupported:easing');
  });
});

describe('classifyToken', () => {
  it('skips whole-value aliases', () => {
    const result = classifyToken('var(--pds-spacing-unit)');
    assert.equal(result.skip, true);
    assert.equal(result.reason, 'alias');
  });

  it('resolves calc against a lookup of --pds-* declarations', () => {
    const lookup = buildLookup([
      { cssVar: '--pds-base-unit', value: '1rem' },
      { cssVar: '--pds-spacing-unit', value: 'calc(var(--pds-base-unit) / 2)' },
      { cssVar: '--pds-spacing-2', value: 'calc(2 * var(--pds-spacing-unit))' },
    ]);
    const result = classifyToken(
      'calc(17 / 14 * var(--#{$pds-prefix}-base-unit))',
      { lookup, cssName: 'space-accordion-bordered-padding' },
    );
    assert.deepEqual(result, {
      $type: 'dimension',
      $value: { value: 17, unit: 'px' },
    });

    const composed = classifyToken(
      'calc(var(--pds-spacing-2) + var(--pds-spacing-unit))',
      { lookup },
    );
    assert.equal(composed.$type, 'dimension');
    assert.equal(composed.$value.value, 21);
  });

  it('keeps unresolved var() references as other', () => {
    const result = classifyToken(
      '0 0 0 1px var(--pds-color-card-border), var(--pds-shadow-sm)',
      { cssName: 'shadow-affiliate-details-panel', lookup: new Map() },
    );
    assert.equal(result.$type, 'other');
    assert.match(result.reason, /unresolved:var\(--pds-/);
  });
});

describe('parseFontFamily', () => {
  it('splits quoted and generic families', () => {
    assert.deepEqual(parseFontFamily("'Agenda', sans-serif"), ['Agenda', 'sans-serif']);
  });
});

describe('cssToFigmaColor', () => {
  it('parses hex, rgba and transparent; ignores Sass interpolation', () => {
    assert.deepEqual(cssToFigmaColor('#ffffff'), { r: 1, g: 1, b: 1, a: 1 });
    assert.deepEqual(cssToFigmaColor('transparent'), { r: 0, g: 0, b: 0, a: 0 });
    assert.equal(cssToFigmaColor('#{$grid-cols}'), null);
    const rgba = cssToFigmaColor('rgba(0, 0, 0, 0.2)');
    assert.equal(rgba.r, 0);
    assert.equal(rgba.a, 0.2);
  });
});

describe('determinism', () => {
  it('normalizes Windows newlines before classifying', () => {
    const a = classifyToken('#edf1f4\r\n');
    const b = classifyToken('#edf1f4\n');
    assert.deepEqual(a, b);
  });
});
