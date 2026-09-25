import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  previewValue,
  toFigmaValue,
  valuesMatch,
  type ProposalToken,
} from './values';

const color: ProposalToken = {
  $type: 'color',
  $value: '#ffffff',
  $extensions: { 'com.solidaris.pds': { cssVar: '--pds-color-surface-0' } },
};

describe('toFigmaValue', () => {
  it('maps color, dimension, number, fontWeight and fontFamily', () => {
    assert.deepEqual(toFigmaValue(color), {
      resolvedType: 'COLOR',
      value: { r: 1, g: 1, b: 1, a: 1 },
      preview: '#ffffff',
    });
    assert.deepEqual(
      toFigmaValue({ $type: 'dimension', $value: { value: 17, unit: 'px' } }),
      { resolvedType: 'FLOAT', value: 17, preview: '17px' },
    );
    assert.deepEqual(toFigmaValue({ $type: 'number', $value: 0.5 }), {
      resolvedType: 'FLOAT',
      value: 0.5,
      preview: '0.5',
    });
    assert.deepEqual(toFigmaValue({ $type: 'fontWeight', $value: 600 }), {
      resolvedType: 'FLOAT',
      value: 600,
      preview: '600',
    });
    assert.deepEqual(
      toFigmaValue({
        $type: 'fontFamily',
        $value: ['Open Sans', 'sans-serif'],
      }),
      {
        resolvedType: 'STRING',
        value: 'Open Sans, sans-serif',
        preview: 'Open Sans, sans-serif',
      },
    );
  });

  it('skips other tokens with their reason', () => {
    const skipped = toFigmaValue({
      $type: 'other',
      $value: '700ms',
      $extensions: { 'com.solidaris.pds': { reason: 'unsupported:duration' } },
    });
    assert.deepEqual(skipped, { skip: true, reason: 'unsupported:duration' });
  });
});

describe('valuesMatch', () => {
  it('compares colors with an 8-bit epsilon and floats exactly enough', () => {
    assert.equal(
      valuesMatch(
        'COLOR',
        { r: 1, g: 1, b: 1, a: 1 },
        { r: 1, g: 1, b: 1, a: 1 },
      ),
      true,
    );
    assert.equal(valuesMatch('FLOAT', 17, 17), true);
    assert.equal(valuesMatch('FLOAT', 17, 16), false);
    assert.equal(
      valuesMatch('STRING', 'Open Sans, sans-serif', 'Open Sans, sans-serif'),
      true,
    );
  });
});

describe('previewValue', () => {
  it('renders dimension objects and arrays', () => {
    assert.equal(previewValue({ $value: { value: 14, unit: 'px' } }), '14px');
    assert.equal(
      previewValue({ $value: ['Agenda', 'sans-serif'] }),
      'Agenda, sans-serif',
    );
  });
});
