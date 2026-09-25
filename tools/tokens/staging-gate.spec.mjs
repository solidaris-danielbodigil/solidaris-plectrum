import assert from 'node:assert/strict';
import test from 'node:test';
import { assessStaging } from './staging-gate.mjs';

const pinned = {
  source: 'primeui-figma-plugin-v4',
  provenance: { fileKey: 'wjMnb8GsK8bVKA7UreOJ4L', revision: '123:4', schemaVersion: '1' },
  color: { background: { $type: 'color', $value: '#fff' } },
};

test('a pinned staging dump is accepted', () => {
  assert.deepEqual(assessStaging(pinned), []);
});

test('a dump without provenance or tokens is rejected', () => {
  const errors = assessStaging({ source: 'primeui-figma-plugin-v4' });
  assert.match(errors.join('\n'), /Missing provenance/);
  assert.match(errors.join('\n'), /no tokens/);
});
