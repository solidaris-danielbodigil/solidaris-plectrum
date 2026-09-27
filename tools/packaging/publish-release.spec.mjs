import assert from 'node:assert/strict';
import test from 'node:test';
import { publicationDecision } from './publish-release.mjs';

test('a missing immutable version publishes and an identical retry skips', () => {
  assert.equal(publicationDecision(null, 'sha512-local'), 'publish');
  assert.equal(publicationDecision('sha512-local', 'sha512-local'), 'skip');
});

test('a version collision with different bytes fails before continuing', () => {
  assert.throws(() => publicationDecision('sha512-remote', 'sha512-local'), /different integrity/);
});
