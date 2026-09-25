import assert from 'node:assert/strict';
import test from 'node:test';
import { releaseFromReport } from './sync-release.mjs';

test('value changes become a patch changeset for the fixed packages', () => {
  const intent = releaseFromReport({ diff: { changed: [{}], added: [], removed: [], reordered: [] }, sha: 'abc' });
  assert.equal(intent.classification, 'changeset');
  assert.match(intent.changeset, /"@solidaris\/ui": patch/);
  assert.match(intent.changeset, /1 values changed/);
});

test('reorders alone stay a no-release', () => {
  const intent = releaseFromReport({ diff: { changed: [], added: [], removed: [], reordered: [{}] } });
  assert.equal(intent.classification, 'no-release');
});
