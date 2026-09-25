import assert from 'node:assert/strict';
import test from 'node:test';
import { assessStaging, stampProvenance } from './staging-gate.mjs';

const pinned = {
  source: 'primeui-figma-plugin-v4',
  provenance: { fileKey: 'wjMnb8GsK8bVKA7UreOJ4L', revision: '123:4', schemaVersion: '1' },
  color: { background: { $type: 'color', $value: '#fff' } },
};

test('a pinned staging dump is accepted', () => {
  assert.deepEqual(assessStaging(pinned), []);
});

test('ingestion pins a plugin dump from the export commit and the configured file', () => {
  const stamped = stampProvenance(
    { source: 'primeui-figma-plugin-v4', color: { bg: { $type: 'color', $value: '#fff' } } },
    { fileKey: 'wjMnb8GsK8bVKA7UreOJ4L', revision: 'a'.repeat(40), schemaVersion: '1' },
  );
  assert.equal(stamped.provenance.recordedBy, 'ingestion');
  assert.deepEqual(assessStaging(stamped), []);
});

test('a dump without provenance or tokens is rejected', () => {
  const errors = assessStaging({ source: 'primeui-figma-plugin-v4' });
  assert.match(errors.join('\n'), /Missing provenance/);
  assert.match(errors.join('\n'), /no tokens/);
});
