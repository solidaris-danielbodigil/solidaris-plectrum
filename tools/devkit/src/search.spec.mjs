import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asset, packageRoot, readJson } from './common.mjs';
import path from 'node:path';
import { evaluateSearch, findTokens, searchComponents, terms } from './search.mjs';

const evals = readJson(path.join(packageRoot, 'evals/search.json'));
const data = { catalogue: asset('catalogue.json'), localComponents: [] };

test('the catalogue search does not regress on the reference requests', () => {
  const report = evaluateSearch(evals.cases, data, evals.knownMisses);
  const describe = (id) => {
    const item = report.results.find((result) => result.id === id);
    return `  ${id}: "${item.query}" → ${item.results.join(', ') || 'nothing'}`;
  };
  assert.deepEqual(report.regressions, [], [
    'The catalogue search no longer finds what it found before:',
    ...report.regressions.map(describe),
    'Fix the metadata or the search, or accept the regression by adding the case to knownMisses in tools/devkit/evals/search.json.',
  ].join('\n'));
  // Improvements never fail: they only ask for the list to be updated.
  if (report.fixed.length) console.log(`Known misses that now pass — remove them from knownMisses: ${report.fixed.join(', ')}`);
});

test('every known miss names a reference request', () => {
  const ids = new Set(evals.cases.map((item) => item.id));
  assert.deepEqual(evals.knownMisses.filter((id) => !ids.has(id)), []);
});

test('a case that used to pass and stops passing is a regression', () => {
  const cases = [{ id: 'clear', query: 'Search input with a button to clear the text', anyOf: ['plectrum:input-clear'] }];
  const withoutInputClear = { catalogue: { components: data.catalogue.components.filter((item) => item.id !== 'plectrum:input-clear') }, localComponents: [] };
  assert.deepEqual(evaluateSearch(cases, withoutInputClear).regressions, ['clear']);
  assert.deepEqual(evaluateSearch(cases, withoutInputClear, ['clear']).regressions, []);
  assert.deepEqual(evaluateSearch(cases, data, ['clear']).fixed, ['clear']);
});

test('terms split camel case, drop stopwords and stem plurals', () => {
  assert.deepEqual(terms('Show the CopyableText for members'), ['copyable', 'text', 'member']);
});

test('app-specific and deprecated components rank below an importable match', () => {
  // Profile Card is deprecated in favour of Profile Header; its keywords match the request better,
  // yet both core profile components (Header and Drawer) rank above it.
  const [first, second, third] = searchComponents('profile summary card', data);
  assert.deepEqual(
    [first, second].map((item) => [item.id, item.status]).sort(),
    [['plectrum:profile-drawer', 'core'], ['plectrum:profile-header', 'core']],
  );
  assert.deepEqual([third.id, third.status], ['plectrum:profile-card', 'deprecated']);
});

test('token search needs every word', () => {
  const names = ['--pds-color-border-warning', '--pds-color-text-warning', '--pds-border-width-default'];
  assert.deepEqual(findTokens('warning border', names), ['--pds-color-border-warning']);
  assert.deepEqual(findTokens('', names), []);
});
