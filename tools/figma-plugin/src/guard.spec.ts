import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MAIN_FILE_KEY } from '../../tokens/figma-values.mjs';
import { refuseWrite } from './guard';

describe('refuseWrite', () => {
  it('blocks the main UI Kit file', () => {
    const result = refuseWrite(MAIN_FILE_KEY);
    assert.equal(result.blocked, true);
    assert.match(result.reason ?? '', /main file/);
  });

  it('blocks a missing file key', () => {
    assert.equal(refuseWrite(undefined).blocked, true);
    assert.equal(refuseWrite(null).blocked, true);
  });

  it('allows a branch file key', () => {
    assert.deepEqual(refuseWrite('BranchKeyNotMain'), {
      blocked: false,
      reason: null,
    });
  });
});
