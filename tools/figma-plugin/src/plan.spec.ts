import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildPlan } from './plan';

const proposal = {
  codeOwned: {
    'color/surface/75': {
      $type: 'color',
      $value: '#ededed',
      $extensions: {
        'com.solidaris.pds': { cssVar: '--pds-color-surface-75' },
      },
    },
    'spacing/2': {
      $type: 'dimension',
      $value: { value: 16, unit: 'px' },
      $extensions: { 'com.solidaris.pds': { cssVar: '--pds-spacing-2' } },
    },
    'shadow/sm': {
      $type: 'other',
      $value: '0 1px 2px rgba(0,0,0,0.04)',
      $extensions: { 'com.solidaris.pds': { reason: 'unsupported:shadow' } },
    },
  },
};

describe('buildPlan', () => {
  it('creates, updates, leaves unchanged, and never retypes', () => {
    const plan = buildPlan(
      proposal,
      ['color/surface/75', 'spacing/2', 'shadow/sm', 'missing/token'],
      [
        {
          name: 'color/surface/75',
          resolvedType: 'COLOR',
          value: { r: 1, g: 1, b: 1, a: 1 },
        },
        {
          name: 'spacing/2',
          resolvedType: 'STRING',
          value: '16px',
        },
      ],
    );

    assert.equal(plan.create.length, 0);
    assert.equal(plan.update[0]?.name, 'color/surface/75');
    assert.equal(
      plan.skip.find((row) => row.name === 'spacing/2')?.reason,
      'type-mismatch:STRING→FLOAT',
    );
    assert.equal(
      plan.skip.find((row) => row.name === 'shadow/sm')?.reason,
      'unsupported:shadow',
    );
    assert.equal(
      plan.skip.find((row) => row.name === 'missing/token')?.reason,
      'not-in-proposal',
    );
  });

  it('marks an identical existing color as unchanged', () => {
    const plan = buildPlan(
      proposal,
      ['color/surface/75'],
      [
        {
          name: 'color/surface/75',
          resolvedType: 'COLOR',
          value: { r: 237 / 255, g: 237 / 255, b: 237 / 255, a: 1 },
        },
      ],
    );
    assert.equal(plan.unchanged[0]?.name, 'color/surface/75');
    assert.equal(plan.update.length, 0);
  });

  it('creates when the collection has no matching variable', () => {
    const plan = buildPlan(proposal, ['spacing/2'], []);
    assert.equal(plan.create[0]?.name, 'spacing/2');
    assert.equal(plan.create[0]?.resolvedType, 'FLOAT');
    assert.equal(plan.create[0]?.value, 16);
  });
});
