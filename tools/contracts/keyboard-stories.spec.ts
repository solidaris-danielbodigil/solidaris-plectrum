import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { inventory } from './inventory';
import { interactiveSource, missingKeyboardStories } from './keyboard-stories';

test('interactive components are read from the source and each has a keyboard story', async () => {
  const root = process.cwd();
  const items = await inventory(root);
  const interactive = items
    .filter((item) => item.metadata.distribution.kind === 'angular' && item.metadata.governance.status !== 'deprecated')
    .filter((item) => interactiveSource(path.join(root, item.metadata.component.path)))
    .map((item) => item.metadata.component.id)
    .sort();
  assert.deepEqual(interactive, [
    'plectrum:copyable-text',
    'plectrum:delay-prediction-card',
    'plectrum:input-clear',
    'plectrum:list',
    'plectrum:nav-shell',
    'plectrum:plectrum-avatar',
    'plectrum:profile-drawer',
    'plectrum:sub-nav-shell',
    'plectrum:top-nav',
    'plectrum:transactions-cics-modal',
  ]);
  assert.deepEqual(missingKeyboardStories(root, items), []);
});
