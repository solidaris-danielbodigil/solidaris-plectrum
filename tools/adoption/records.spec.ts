import assert from 'node:assert/strict';
import test from 'node:test';
import { aggregateAdoption, validateAdoptionReport, type AdoptionReport } from './records';
import type { Registry } from '../../.ai/contracts/schema/exchange.schema';

const registry = {
  schemaVersion: 1,
  repository: 'https://github.com/example/plectrum',
  teams: [
    { id: 'design-system', label: 'Design-system', kind: 'core', reviewer: '@owner' },
    { id: 'external', label: 'External', kind: 'application', reviewer: null },
  ],
  applications: [
    { id: 'external', team: 'external', label: 'External', repository: 'https://github.com/external/app', kind: 'external' },
    { id: 'quiet', team: 'external', label: 'Quiet', repository: 'https://github.com/external/quiet', kind: 'external' },
  ],
  operations: {
    registry: 'https://npm.pkg.github.com', publicationScope: '@example', visibility: 'private', publicationEnabled: false,
    reportTransport: 'reviewed-pull-request', reportIngestionEnabled: false, editors: ['cursor'], storybook: 'https://example.org/storybook/',
    figma: { componentLibrary: 'a', tokenLibrary: 'b', proposalCollectionPrefix: 'proposals/', identitiesVerifiedForPublication: false },
    pending: [],
  },
} as Registry;

const known = new Set(['plectrum:empty-state']);
const sha = 'a'.repeat(40);

function report(observations: AdoptionReport['observations'], observedAt = '2026-09-25T00:00:00.000Z'): AdoptionReport {
  return {
    schemaVersion: 1, application: 'external', team: 'external',
    source: { repository: 'https://github.com/external/app', revision: sha, path: '.' },
    observedAt, reporterVersion: '0.2.0',
    packages: ['ui', 'plectrum', 'styles'].map((name) => ({ name: `@solidaris/${name}`, version: '2.0.0' })),
    observations, limitations: ['Static source references can include unused imports.'],
  };
}

const usage = { componentId: 'plectrum:empty-state', kind: 'source-reference' as const, count: 1, files: ['src/app.html'] };

test('an external report supplies catalogue usage without editing catalogue code', () => {
  validateAdoptionReport(report([usage]), registry, known);
  const aggregate = aggregateAdoption([report([usage])], registry, new Date('2026-09-25T12:00:00.000Z'));
  assert.deepEqual(aggregate.usedIn['plectrum:empty-state'], [expectSighting('current')]);
  assert.deepEqual(aggregate.missing, [{ id: 'quiet', label: 'Quiet', kind: 'external' }]);
});

test('a newer complete report removes usage and an older one cannot overwrite it', () => {
  const first = report([usage], '2026-09-20T00:00:00.000Z');
  const next = report([], '2026-09-25T00:00:00.000Z');
  validateAdoptionReport(next, registry, known, first);
  assert.equal(aggregateAdoption([next], registry, new Date('2026-09-25T12:00:00.000Z')).usedIn['plectrum:empty-state'], undefined);
  assert.throws(() => validateAdoptionReport(first, registry, known, next), /older report/);
});

test('a stale report stays visible as stale', () => {
  const aggregate = aggregateAdoption([report([usage], '2026-08-01T00:00:00.000Z')], registry, new Date('2026-09-25T00:00:00.000Z'));
  assert.equal(aggregate.usedIn['plectrum:empty-state'][0].freshness, 'stale');
});

function expectSighting(freshness: 'current' | 'stale') {
  return { application: 'external', label: 'External', kind: 'external', freshness, observedAt: freshness === 'current' ? '2026-09-25T00:00:00.000Z' : '2026-08-01T00:00:00.000Z', packageVersion: '2.0.0' };
}
