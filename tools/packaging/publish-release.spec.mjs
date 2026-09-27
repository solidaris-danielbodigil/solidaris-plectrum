import assert from 'node:assert/strict';
import test from 'node:test';
import { publicationDecision } from './publish-release.mjs';
import { selectPackageVisibility } from './private-package-visibility.mjs';

test('a missing immutable version publishes and an identical retry skips', () => {
  assert.equal(publicationDecision(null, 'sha512-local'), 'publish');
  assert.equal(publicationDecision('sha512-local', 'sha512-local'), 'skip');
});

test('a version collision with different bytes fails before continuing', () => {
  assert.throws(() => publicationDecision('sha512-remote', 'sha512-local'), /different integrity/);
});

test('actual package visibility is selected by the exact scoped npm identity', () => {
  const records = [
    { package_type: 'npm', name: 'pds-ui', visibility: 'private' },
    { package_type: 'npm', name: 'pds-styles', visibility: 'public' },
  ];
  assert.equal(selectPackageVisibility(records, '@solidaris-danielbodigil/pds-ui'), 'private');
  assert.equal(selectPackageVisibility(records, '@solidaris-danielbodigil/pds-styles'), 'public');
  assert.equal(selectPackageVisibility(records, '@solidaris-danielbodigil/pds-plectrum'), null);
});
