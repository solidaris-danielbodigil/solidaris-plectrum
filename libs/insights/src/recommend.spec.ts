import assert from 'node:assert/strict';
import test from 'node:test';
import { INSIGHTS_FIXTURE } from './fixtures';
import type { AgentPoint, CandidateFact, ComponentFact, PlectrumInsights, Provenance, RuleId, Thresholds, UsageFacts } from './insights.types';
import { recommend } from './recommend';
import { localClusters } from './rules/local';
import { score } from './rules/context';

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-10-03T12:00:00.000Z');
const LATER = new Date('2026-11-05T12:00:00.000Z');
const daysAgo = (days: number) => new Date(NOW.getTime() - days * DAY).toISOString();

const emptyUsage = (provenance: Provenance): UsageFacts => ({
  provenance, note: '', staleAfterDays: 14, applications: [], observations: [], agentHistory: [], localComponents: [], similarity: [],
});

function base(): PlectrumInsights {
  return {
    schemaVersion: 1,
    generatedAt: NOW.toISOString(),
    revision: 'a'.repeat(40),
    repository: 'https://github.com/org/repo',
    links: { storybook: 'https://example.test/storybook/', dashboard: 'https://example.test/dashboard/' },
    versions: { runtime: '2.1.0', toolkit: '0.7.1' },
    historyAvailable: true,
    repo: {
      components: [],
      scanHistory: [],
      catalogueHistory: [],
      searchEval: { toolkitVersion: '0.7.1', total: 0, passed: 0, rate: 100, regressions: [], fixed: [], knownMisses: [], results: [], history: [] },
      candidates: [],
      tokens: { names: 0, sync: null, proposals: { count: 0, since: null } },
      releases: { tags: [], pending: [] },
      mcpTools: [],
    },
    usage: { reported: emptyUsage('reported'), demo: emptyUsage('demo') },
  };
}

const component = (id: string, over: Partial<ComponentFact> = {}): ComponentFact => ({
  id, name: id.split(':')[1] ?? id, status: 'core', owner: 'design-system', distribution: 'angular', measurable: true,
  created: daysAgo(100), modified: daysAgo(10), docsUrl: null, usedBy: [], scanUsedIn: [], ...over,
});

const app = (id: string, over: Partial<UsageFacts['applications'][number]> = {}): UsageFacts['applications'][number] => ({
  id, label: id.toUpperCase(), team: id, kind: 'local-demo', reportedAt: daysAgo(1), packageVersion: '2.1.0', reports: 1, ...over,
});

const point = (application: string, over: Partial<AgentPoint> = {}): AgentPoint => ({
  application, observedAt: daysAgo(1), windowDays: 30, activeDays: 5, tools: {}, commands: {}, lookups: {}, emptySearches: 0,
  commits: { total: 0, reuse: 0, scaffold: 0, advice: 0 }, reused: {}, ...over,
});

const local = (id: string, team: string, over: Partial<UsageFacts['localComponents'][number]> = {}): UsageFacts['localComponents'][number] => ({
  id, name: id.split(':')[1] ?? id, description: '', useCases: [], reusePotential: 'possible', team, application: team, ...over,
});

const candidate = (id: string, over: Partial<CandidateFact>): CandidateFact => ({
  id, componentId: `team:${id}`, team: 'team', application: 'team', stage: 'approved', decidedAt: daysAgo(40), reviewCurrent: false, links: {}, ...over,
});

const run = (data: PlectrumInsights, rule: RuleId, source: Provenance = 'demo', now = NOW, t?: Partial<Thresholds>) =>
  recommend(data, source, now, t).filter((item) => item.rule === rule);
const ids = (data: PlectrumInsights, rule: RuleId, source: Provenance = 'demo', now = NOW, t?: Partial<Thresholds>) =>
  run(data, rule, source, now, t).map((item) => item.id);

test('score = severity weight + 5 per application + min(20, log2(1 + count) * 4)', () => {
  assert.equal(score('high', 1, 18), 82);
  assert.equal(score('critical', 0, 0), 100);
  assert.equal(score('low', 2, 1_000_000), 40);
  assert.equal(score('medium', 1, 3), 43);
});

// deprecated-in-use
test('deprecated-in-use fires for an observed deprecated component, high with a replacement', () => {
  const data = base();
  data.repo.components.push(component('p:old', { status: 'deprecated', replacementId: 'p:new' }), component('p:new', { docsUrl: 'https://docs/new' }));
  data.usage.demo.observations.push({ application: 'a', componentId: 'p:old', count: 3, files: 2 }, { application: 'b', componentId: 'p:old', count: 1, files: 1 });
  const [item] = run(data, 'deprecated-in-use');
  assert.equal(item?.id, 'deprecated-in-use:p:old');
  assert.equal(item?.severity, 'high');
  assert.equal(item?.provenance, 'demo');
  assert.deepEqual(item?.target, { section: 'adoption', component: 'p:old' });
  assert.equal(item?.next?.url, 'https://docs/new');
  assert.match(item?.next?.label ?? '', /p:new/);
  data.repo.components[0] = component('p:old', { status: 'deprecated' });
  assert.equal(run(data, 'deprecated-in-use')[0]?.severity, 'medium');
});

test('deprecated-in-use stays silent without observations in the selected source', () => {
  const data = base();
  data.repo.components.push(component('p:old', { status: 'deprecated', replacementId: 'p:new' }));
  data.usage.reported.observations.push({ application: 'a', componentId: 'p:old', count: 3, files: 2 });
  assert.deepEqual(ids(data, 'deprecated-in-use'), []);
});

// retire-deprecated
test('retire-deprecated fires for a deprecated component nobody uses, with a major changeset next step', () => {
  const data = base();
  data.repo.components.push(component('p:old', { status: 'deprecated', replacementId: 'p:new' }));
  data.usage.reported.applications.push(app('external-app', { kind: 'external' }));
  const [item] = run(data, 'retire-deprecated', 'reported');
  assert.equal(item?.id, 'retire-deprecated:p:old');
  assert.equal(item?.severity, 'medium');
  assert.equal(item?.provenance, 'reported');
  assert.equal(item?.next?.command, 'npm run changeset');
  assert.match(item?.next?.label ?? '', /major changeset/);
});

test('retire-deprecated uses the selected source and stays silent for scanned or component usage', () => {
  const observed = base();
  observed.repo.components.push(component('p:old', { status: 'deprecated' }));
  observed.usage.reported.applications.push(app('a', { kind: 'external' }));
  observed.usage.reported.observations.push({ application: 'a', componentId: 'p:old', count: 1, files: 1 });
  assert.deepEqual(ids(observed, 'retire-deprecated', 'reported'), []);
  observed.usage.reported.observations = [];
  observed.usage.demo.observations.push({ application: 'a', componentId: 'p:old', count: 1, files: 1 });
  assert.deepEqual(ids(observed, 'retire-deprecated', 'reported'), ['retire-deprecated:p:old']);
  const usedBy = base();
  usedBy.repo.components.push(component('p:old', { status: 'deprecated', usedBy: ['p:other'] }));
  assert.deepEqual(ids(usedBy, 'retire-deprecated'), []);
  const scanned = base();
  scanned.repo.components.push(component('p:old', { status: 'deprecated', scanUsedIn: ['a'] }));
  assert.deepEqual(ids(scanned, 'retire-deprecated'), []);
});

test('absence recommendations wait for fresh reports from every external application', () => {
  const data = base();
  data.repo.components.push(component('p:old', { status: 'deprecated' }), component('p:unused'));
  assert.deepEqual(ids(data, 'retire-deprecated', 'reported'), []);
  assert.deepEqual(ids(data, 'unused-component', 'reported'), []);
  data.usage.reported.applications.push(app('a', { kind: 'external' }), app('b', { kind: 'external', reportedAt: null, reports: 0 }));
  assert.deepEqual(ids(data, 'retire-deprecated', 'reported'), []);
  data.usage.reported.applications[1].reportedAt = daysAgo(20);
  assert.deepEqual(ids(data, 'retire-deprecated', 'reported'), []);
  data.usage.reported.applications[1].reportedAt = daysAgo(1);
  assert.deepEqual(ids(data, 'retire-deprecated', 'reported'), ['retire-deprecated:p:old']);
  assert.deepEqual(ids(data, 'unused-component', 'reported'), ['unused-component:p:unused']);
});

// deprecated-looked-up
test('deprecated-looked-up fires from 3 lookups of a deprecated id in the latest window', () => {
  const data = base();
  data.repo.components.push(component('p:old', { status: 'deprecated' }));
  data.usage.demo.agentHistory.push(point('a', { lookups: { 'p:old': 3 } }));
  const [item] = run(data, 'deprecated-looked-up');
  assert.equal(item?.id, 'deprecated-looked-up:a/p:old');
  assert.equal(item?.severity, 'low');
  assert.deepEqual(item?.target, { section: 'agent', app: 'a', component: 'p:old' });
});

test('deprecated-looked-up ignores fewer lookups and older windows', () => {
  const data = base();
  data.repo.components.push(component('p:old', { status: 'deprecated' }));
  data.usage.demo.agentHistory.push(point('a', { observedAt: daysAgo(20), lookups: { 'p:old': 9 } }), point('a', { lookups: { 'p:old': 2 } }));
  assert.deepEqual(ids(data, 'deprecated-looked-up'), []);
});

// promote-local
test('promote-local clusters similar local components across teams (union-find, transitive)', () => {
  const data = base();
  data.usage.demo.localComponents.push(local('a:x', 'a'), local('b:y', 'b'), local('c:z', 'c'));
  data.usage.demo.similarity.push(
    { a: 'a:x', b: 'b:y', kind: 'local-local', score: 6, matchedFields: ['name'] },
  );
  const [two] = run(data, 'promote-local');
  assert.equal(two?.id, 'promote-local:a:x+b:y');
  assert.equal(two?.severity, 'medium');
  assert.deepEqual(two?.target, { section: 'local', cluster: 'a:x+b:y' });
  data.usage.demo.similarity.push({ a: 'c:z', b: 'b:y', kind: 'local-local', score: 7, matchedFields: ['description'] });
  const clusters = localClusters(data.usage.demo, 6);
  assert.deepEqual(clusters.map((cluster) => cluster.members), [['a:x', 'b:y', 'c:z']]);
  const [three] = run(data, 'promote-local');
  assert.equal(three?.id, 'promote-local:a:x+b:y+c:z');
  assert.equal(three?.severity, 'high');
});

test('promote-local is high when a member is likely reusable', () => {
  const data = base();
  data.usage.demo.localComponents.push(local('a:x', 'a', { reusePotential: 'likely' }), local('b:y', 'b'));
  data.usage.demo.similarity.push({ a: 'a:x', b: 'b:y', kind: 'local-local', score: 6, matchedFields: ['name'] });
  assert.equal(run(data, 'promote-local')[0]?.severity, 'high');
});

test('promote-local ignores weak pairs and clusters within one team', () => {
  const weak = base();
  weak.usage.demo.localComponents.push(local('a:x', 'a'), local('b:y', 'b'));
  weak.usage.demo.similarity.push({ a: 'a:x', b: 'b:y', kind: 'local-local', score: 5, matchedFields: ['name'] });
  assert.deepEqual(ids(weak, 'promote-local'), []);
  const sameTeam = base();
  sameTeam.usage.demo.localComponents.push(local('a:x', 'a'), local('a:y', 'a'));
  sameTeam.usage.demo.similarity.push({ a: 'a:x', b: 'a:y', kind: 'local-local', score: 9, matchedFields: ['name'] });
  assert.deepEqual(ids(sameTeam, 'promote-local'), []);
});

// local-duplicates-core
test('local-duplicates-core fires for a local-core pair from score 6', () => {
  const data = base();
  data.repo.components.push(component('p:drawer'));
  data.usage.demo.localComponents.push(local('a:x', 'a'));
  data.usage.demo.similarity.push({ a: 'p:drawer', b: 'a:x', kind: 'local-core', score: 6, matchedFields: ['name'] });
  const [item] = run(data, 'local-duplicates-core');
  assert.equal(item?.id, 'local-duplicates-core:a:x/p:drawer');
  assert.deepEqual(item?.target, { section: 'local', app: 'a', component: 'a:x' });
});

test('local-duplicates-core emits one item per local component: the best Core match, others as evidence', () => {
  const data = base();
  data.repo.components.push(component('p:drawer'), component('p:empty-state'), component('p:profile-drawer'), component('p:list'));
  data.usage.demo.localComponents.push(local('a:x', 'a'), local('b:y', 'b'));
  data.usage.demo.similarity.push(
    { a: 'a:x', b: 'p:empty-state', kind: 'local-core', score: 7, matchedFields: ['description'] },
    { a: 'a:x', b: 'p:profile-drawer', kind: 'local-core', score: 14, matchedFields: ['name', 'description'] },
    { a: 'a:x', b: 'p:drawer', kind: 'local-core', score: 14, matchedFields: ['name'] },
    { a: 'a:x', b: 'p:list', kind: 'local-core', score: 5, matchedFields: ['description'] },
    { a: 'b:y', b: 'p:list', kind: 'local-core', score: 6, matchedFields: ['description'] },
  );
  const items = run(data, 'local-duplicates-core');
  // Tie at 14 goes to the lower id; the match below the threshold is not evidence.
  assert.deepEqual(items.map((item) => item.id), ['local-duplicates-core:a:x/p:drawer', 'local-duplicates-core:b:y/p:list']);
  const secondary = items[0]?.evidence.filter((entry) => entry.label === 'Also similar').map((entry) => entry.value);
  assert.deepEqual(secondary, ['profile-drawer (p:profile-drawer, score 14)', 'empty-state (p:empty-state, score 7)']);
  assert.deepEqual(items[1]?.evidence.filter((entry) => entry.label === 'Also similar'), []);
});

test('local-duplicates-core ignores pairs below the score', () => {
  const data = base();
  data.usage.demo.localComponents.push(local('a:x', 'a'));
  data.usage.demo.similarity.push({ a: 'a:x', b: 'p:list', kind: 'local-core', score: 5, matchedFields: ['description'] });
  assert.deepEqual(ids(data, 'local-duplicates-core'), []);
});

// catalogue-gap
test('catalogue-gap fires from 5 empty searches at 20% (medium) and is high from 35%', () => {
  const data = base();
  data.usage.demo.agentHistory.push(point('a', { emptySearches: 5, tools: { search_components: 25 } }));
  const [medium] = run(data, 'catalogue-gap');
  assert.equal(medium?.id, 'catalogue-gap:a');
  assert.equal(medium?.severity, 'medium');
  assert.deepEqual(medium?.target, { section: 'agent', app: 'a' });
  data.usage.demo.agentHistory = [point('a', { emptySearches: 7, tools: { search_components: 20 } })];
  assert.equal(run(data, 'catalogue-gap')[0]?.severity, 'high');
});

test('catalogue-gap needs both the count and the ratio', () => {
  const few = base();
  few.usage.demo.agentHistory.push(point('a', { emptySearches: 4, tools: { search_components: 5 } }));
  assert.deepEqual(ids(few, 'catalogue-gap'), []);
  const low = base();
  low.usage.demo.agentHistory.push(point('a', { emptySearches: 5, tools: { search_components: 30 } }));
  assert.deepEqual(ids(low, 'catalogue-gap'), []);
});

// search-eval-regression
test('search-eval-regression is critical per regressed case', () => {
  const data = base();
  data.repo.searchEval.regressions = ['case-b', 'case-a'];
  data.repo.searchEval.results = [{ id: 'case-a', query: 'q', anyOf: ['p:x'], allOf: [], none: false, results: ['p:y'], pass: false, knownMiss: false }];
  const items = run(data, 'search-eval-regression', 'reported');
  assert.deepEqual(items.map((item) => item.id), ['search-eval-regression:case-a', 'search-eval-regression:case-b']);
  assert.equal(items[0]?.severity, 'critical');
  assert.equal(items[0]?.provenance, 'repository');
  assert.deepEqual(items[0]?.target, { section: 'search', evalCase: 'case-a' });
});

test('search-eval-regression stays silent without regressions', () => {
  assert.deepEqual(ids(base(), 'search-eval-regression'), []);
});

// search-eval-drop
test('search-eval-drop fires when the pass rate is below the previous point', () => {
  const data = base();
  data.repo.searchEval = { ...data.repo.searchEval, total: 17, passed: 15, rate: 88,
    history: [{ at: daysAgo(3), revision: 'r1', passed: 16, total: 17, rate: 94 }, { at: daysAgo(1), revision: 'r2', passed: 15, total: 17, rate: 88 }] };
  const [item] = run(data, 'search-eval-drop');
  assert.equal(item?.id, 'search-eval-drop:pass-rate');
  assert.equal(item?.severity, 'high');
  // The current result counts when the history has not caught up yet.
  data.repo.searchEval.history = [{ at: daysAgo(3), revision: 'r1', passed: 16, total: 17, rate: 94 }];
  assert.deepEqual(ids(data, 'search-eval-drop'), ['search-eval-drop:pass-rate']);
});

test('search-eval-drop stays silent on a stable or rising rate', () => {
  const data = base();
  data.repo.searchEval = { ...data.repo.searchEval, total: 17, passed: 16, rate: 94,
    history: [{ at: daysAgo(3), revision: 'r1', passed: 15, total: 16, rate: 94 }, { at: daysAgo(1), revision: 'r2', passed: 16, total: 17, rate: 94 }] };
  assert.deepEqual(ids(data, 'search-eval-drop'), []);
});

// known-miss-open
test('known-miss-open fires for a known miss older than 30 days', () => {
  const data = base();
  data.repo.searchEval.knownMisses = [{ id: 'case-a', since: daysAgo(31) }];
  const [item] = run(data, 'known-miss-open');
  assert.equal(item?.id, 'known-miss-open:case-a');
  assert.deepEqual(item?.target, { section: 'search', evalCase: 'case-a' });
});

test('known-miss-open ignores recent misses and misses without a date', () => {
  const data = base();
  data.repo.searchEval.knownMisses = [{ id: 'case-a', since: daysAgo(30) }, { id: 'case-b', since: null }];
  assert.deepEqual(ids(data, 'known-miss-open'), []);
});

// stale-report
test('stale-report fires past staleAfterDays from the data', () => {
  const data = base();
  data.usage.demo.applications.push(app('a', { reportedAt: daysAgo(15) }));
  assert.deepEqual(ids(data, 'stale-report'), ['stale-report:a']);
  data.usage.demo.staleAfterDays = 20;
  assert.deepEqual(ids(data, 'stale-report'), []);
});

test('stale-report ignores fresh and missing reports', () => {
  const data = base();
  data.usage.demo.applications.push(app('a', { reportedAt: daysAgo(14) }), app('b', { reportedAt: null, reports: 0 }));
  assert.deepEqual(ids(data, 'stale-report'), []);
});

// missing-report
test('missing-report fires for an external application without a report', () => {
  const data = base();
  data.usage.reported.applications.push(app('ext', { kind: 'external', reportedAt: null, reports: 0, packageVersion: null }));
  const [item] = run(data, 'missing-report', 'reported');
  assert.equal(item?.id, 'missing-report:ext');
  assert.equal(item?.provenance, 'reported');
});

test('missing-report skips local demo applications', () => {
  const data = base();
  data.usage.reported.applications.push(app('a', { reportedAt: null, reports: 0, packageVersion: null }));
  assert.deepEqual(ids(data, 'missing-report', 'reported'), []);
});

// app-no-plectrum
test('app-no-plectrum fires for a reported application with no observation', () => {
  const data = base();
  data.usage.demo.applications.push(app('a'));
  assert.deepEqual(ids(data, 'app-no-plectrum'), ['app-no-plectrum:a']);
});

test('app-no-plectrum ignores applications with usage or without a report', () => {
  const data = base();
  data.usage.demo.applications.push(app('a'), app('b', { reportedAt: null, reports: 0 }));
  data.usage.demo.observations.push({ application: 'a', componentId: 'p:x', count: 1, files: 1 });
  assert.deepEqual(ids(data, 'app-no-plectrum'), []);
});

// unused-component
test('unused-component fires for a measurable Core component unused for over 30 days', () => {
  const data = base();
  data.repo.components.push(component('p:x', { created: daysAgo(31) }));
  data.usage.reported.applications.push(app('external-app', { kind: 'external' }));
  const [item] = run(data, 'unused-component', 'reported');
  assert.equal(item?.id, 'unused-component:p:x');
  assert.equal(item?.provenance, 'reported');
});

test('unused-component excludes usedBy, usage, young, unmeasurable and non-core components', () => {
  const data = base();
  data.repo.components.push(
    component('p:used-by', { usedBy: ['p:other'] }),
    component('p:scanned', { scanUsedIn: ['a'] }),
    component('p:observed'),
    component('p:young', { created: daysAgo(30) }),
    component('p:unmeasurable', { measurable: false }),
    component('p:app', { status: 'app' }),
  );
  data.usage.demo.observations.push({ application: 'a', componentId: 'p:observed', count: 1, files: 1 });
  assert.deepEqual(ids(data, 'unused-component', 'demo'), []);
});

// lookup-not-adopted
test('lookup-not-adopted fires from 5 lookups without an observation in that application', () => {
  const data = base();
  data.repo.components.push(component('p:drawer'));
  data.usage.demo.agentHistory.push(point('a', { lookups: { 'p:drawer': 5 } }));
  data.usage.demo.observations.push({ application: 'b', componentId: 'p:drawer', count: 2, files: 1 });
  const [item] = run(data, 'lookup-not-adopted');
  assert.equal(item?.id, 'lookup-not-adopted:a/p:drawer');
  assert.deepEqual(item?.target, { section: 'agent', app: 'a', component: 'p:drawer' });
});

test('lookup-not-adopted ignores adopted, rare and deprecated lookups', () => {
  const data = base();
  data.repo.components.push(component('p:drawer'), component('p:list'), component('p:old', { status: 'deprecated' }));
  data.usage.demo.agentHistory.push(point('a', { lookups: { 'p:drawer': 9, 'p:list': 4, 'p:old': 9 } }));
  data.usage.demo.observations.push({ application: 'a', componentId: 'p:drawer', count: 1, files: 1 });
  assert.deepEqual(ids(data, 'lookup-not-adopted'), []);
});

// outdated-runtime
test('outdated-runtime is medium a minor behind and high a major behind', () => {
  const data = base();
  data.usage.demo.applications.push(app('a', { packageVersion: '2.0.5' }), app('b', { packageVersion: '1.9.0' }));
  const items = run(data, 'outdated-runtime');
  assert.deepEqual(items.map((item) => [item.id, item.severity]), [['outdated-runtime:b', 'high'], ['outdated-runtime:a', 'medium']]);
});

test('outdated-runtime ignores patch-level differences and unknown versions', () => {
  const data = base();
  data.versions.runtime = '2.1.4';
  data.usage.demo.applications.push(app('a', { packageVersion: '2.1.0' }), app('b', { packageVersion: null }), app('c', { packageVersion: '2.2.0' }));
  assert.deepEqual(ids(data, 'outdated-runtime'), []);
});

// mcp-tool-unused
test('mcp-tool-unused fires for an uncalled tool from 50 calls in the latest windows', () => {
  const data = base();
  data.repo.mcpTools = ['search_components', 'check_tokens'];
  data.usage.demo.agentHistory.push(point('a', { tools: { search_components: 30, check_tokens: 0 } }), point('b', { tools: { search_components: 20 } }));
  const [item] = run(data, 'mcp-tool-unused');
  assert.equal(item?.id, 'mcp-tool-unused:check_tokens');
  assert.deepEqual(item?.target, { section: 'agent' });
});

test('mcp-tool-unused stays silent below 50 calls', () => {
  const data = base();
  data.repo.mcpTools = ['search_components', 'check_tokens'];
  data.usage.demo.agentHistory.push(point('a', { observedAt: daysAgo(30), tools: { search_components: 90 } }), point('a', { tools: { search_components: 49 } }));
  assert.deepEqual(ids(data, 'mcp-tool-unused'), []);
});

// agent-idle
test('agent-idle fires when the latest window has no active day', () => {
  const data = base();
  data.usage.demo.agentHistory.push(point('a', { activeDays: 0 }));
  assert.deepEqual(ids(data, 'agent-idle'), ['agent-idle:a']);
});

test('agent-idle ignores idle windows that are not the latest', () => {
  const data = base();
  data.usage.demo.agentHistory.push(point('a', { observedAt: daysAgo(20), activeDays: 0 }), point('a', { activeDays: 2 }));
  assert.deepEqual(ids(data, 'agent-idle'), []);
});

// review-waiting
test('review-waiting is high after 7 days and critical after 14, with the review command', () => {
  const data = base();
  data.repo.candidates.push(candidate('team-x', { stage: 'submitted', submittedAt: daysAgo(8) }));
  const [high] = run(data, 'review-waiting', 'reported');
  assert.equal(high?.id, 'review-waiting:team-x');
  assert.equal(high?.severity, 'high');
  assert.equal(high?.provenance, 'repository');
  assert.deepEqual(high?.target, { section: 'pipeline', candidate: 'team-x' });
  assert.match(high?.next?.command ?? '', /^npm run candidate:record -- review --id team-x /);
  data.repo.candidates = [candidate('team-x', { stage: 'accepted', submittedAt: daysAgo(15), reviewCurrent: false })];
  assert.equal(run(data, 'review-waiting')[0]?.severity, 'critical');
});

test('review-waiting ignores recent, reviewed and withdrawn submissions', () => {
  const data = base();
  data.repo.candidates.push(
    candidate('recent', { stage: 'submitted', submittedAt: daysAgo(7) }),
    candidate('reviewed', { stage: 'accepted', submittedAt: daysAgo(20), reviewedAt: daysAgo(18), reviewCurrent: true }),
    candidate('withdrawn', { stage: 'withdrawn', submittedAt: daysAgo(20) }),
  );
  assert.deepEqual(ids(data, 'review-waiting'), []);
});

// approved-no-submission
test('approved-no-submission fires 30 days after approval', () => {
  const data = base();
  data.repo.candidates.push(candidate('team-x', { stage: 'approved', decidedAt: daysAgo(31) }));
  assert.deepEqual(ids(data, 'approved-no-submission'), ['approved-no-submission:team-x']);
});

test('approved-no-submission ignores recent approvals', () => {
  const data = base();
  data.repo.candidates.push(candidate('team-x', { stage: 'approved', decidedAt: daysAgo(30) }));
  assert.deepEqual(ids(data, 'approved-no-submission'), []);
});

// accepted-not-promoted
test('accepted-not-promoted fires 21 days after acceptance', () => {
  const data = base();
  data.repo.candidates.push(candidate('team-x', { stage: 'accepted', submittedAt: daysAgo(40), reviewedAt: daysAgo(22), reviewCurrent: true }));
  const [item] = run(data, 'accepted-not-promoted');
  assert.equal(item?.id, 'accepted-not-promoted:team-x');
  assert.equal(item?.severity, 'medium');
});

test('accepted-not-promoted ignores recent acceptances', () => {
  const data = base();
  data.repo.candidates.push(candidate('team-x', { stage: 'accepted', submittedAt: daysAgo(40), reviewedAt: daysAgo(21), reviewCurrent: true }));
  assert.deepEqual(ids(data, 'accepted-not-promoted'), []);
});

// promoted-no-figma
test('promoted-no-figma fires 30 days after promotion', () => {
  const data = base();
  data.repo.candidates.push(candidate('team-x', { stage: 'promoted', promotedAt: daysAgo(31), reviewCurrent: true }));
  assert.deepEqual(ids(data, 'promoted-no-figma'), ['promoted-no-figma:team-x']);
});

test('promoted-no-figma ignores components with a Figma return', () => {
  const data = base();
  data.repo.candidates.push(candidate('team-x', { stage: 'figma-returned', promotedAt: daysAgo(60), figmaReturnedAt: daysAgo(40), reviewCurrent: true }));
  assert.deepEqual(ids(data, 'promoted-no-figma'), []);
});

// token-sync-blocked
test('token-sync-blocked fires on a blocked sync and links the run', () => {
  const data = base();
  data.repo.tokens.sync = { stage: 'blocked', generatedAt: daysAgo(2), runUrl: 'https://github.com/org/repo/actions/runs/1', checks: [{ id: 'audit', name: 'Audit', status: 'failure' }, { id: 'build', name: 'Build', status: 'success' }] };
  const [item] = run(data, 'token-sync-blocked');
  assert.equal(item?.id, 'token-sync-blocked:sync');
  assert.equal(item?.severity, 'high');
  assert.equal(item?.next?.url, 'https://github.com/org/repo/actions/runs/1');
  assert.match(item?.title ?? '', /Audit/);
});

test('token-sync-blocked ignores a merged (proposed on main) sync', () => {
  const data = base();
  data.repo.tokens.sync = { stage: 'merged', generatedAt: daysAgo(2), runUrl: null, checks: [] };
  assert.deepEqual(ids(data, 'token-sync-blocked'), []);
});

// token-proposals-pending
test('token-proposals-pending fires 14 days after the first proposal', () => {
  const data = base();
  data.repo.tokens.proposals = { count: 3, since: daysAgo(15) };
  assert.deepEqual(ids(data, 'token-proposals-pending'), ['token-proposals-pending:code-owned']);
});

test('token-proposals-pending ignores recent or empty proposals', () => {
  const recent = base();
  recent.repo.tokens.proposals = { count: 3, since: daysAgo(14) };
  assert.deepEqual(ids(recent, 'token-proposals-pending'), []);
  const empty = base();
  empty.repo.tokens.proposals = { count: 0, since: daysAgo(40) };
  assert.deepEqual(ids(empty, 'token-proposals-pending'), []);
});

// release-due
test('release-due is low for an old changeset and medium when the last tag is old too', () => {
  const data = base();
  data.repo.releases.pending = [{ id: 'fix', bumps: [{ packageName: '@scope/pds-ui', bump: 'patch' }], since: daysAgo(15) }];
  data.repo.releases.tags = [{ tag: 'plectrum-v2.1.0-devkit-0.7.1', runtime: '2.1.0', toolkit: '0.7.1', at: daysAgo(10) }];
  const [low] = run(data, 'release-due');
  assert.equal(low?.id, 'release-due:pending');
  assert.equal(low?.severity, 'low');
  data.repo.releases.pending = [{ id: 'fix', bumps: [{ packageName: '@scope/pds-ui', bump: 'patch' }], since: daysAgo(3) }];
  data.repo.releases.tags = [{ tag: 'plectrum-v2.1.0-devkit-0.7.1', runtime: '2.1.0', toolkit: '0.7.1', at: daysAgo(31) }];
  assert.equal(run(data, 'release-due')[0]?.severity, 'medium');
});

test('release-due stays silent without pending changesets or while everything is recent', () => {
  const data = base();
  data.repo.releases.tags = [{ tag: 'plectrum-v2.1.0-devkit-0.7.1', runtime: '2.1.0', toolkit: '0.7.1', at: daysAgo(90) }];
  assert.deepEqual(ids(data, 'release-due'), []);
  data.repo.releases.tags = [{ tag: 'plectrum-v2.1.0-devkit-0.7.1', runtime: '2.1.0', toolkit: '0.7.1', at: daysAgo(3) }];
  data.repo.releases.pending = [{ id: 'fix', bumps: [], since: daysAgo(3) }];
  assert.deepEqual(ids(data, 'release-due'), []);
});

// ordering, dedup, thresholds
test('recommendations are deduplicated by id, keeping the highest score', () => {
  const data = base();
  data.usage.demo.localComponents.push(local('a:x', 'a'));
  data.usage.demo.similarity.push(
    { a: 'a:x', b: 'p:drawer', kind: 'local-core', score: 6, matchedFields: ['name'] },
    { a: 'p:drawer', b: 'a:x', kind: 'local-core', score: 9, matchedFields: ['name', 'description'] },
  );
  data.repo.searchEval.regressions = ['case-a', 'case-a'];
  const items = recommend(data, 'demo', NOW);
  assert.deepEqual(items.map((item) => item.id), ['search-eval-regression:case-a', 'local-duplicates-core:a:x/p:drawer']);
  assert.equal(items[1]?.score, score('medium', 1, 9));
  assert.equal(new Set(recommend(INSIGHTS_FIXTURE, 'demo', LATER).map((item) => item.id)).size, recommend(INSIGHTS_FIXTURE, 'demo', LATER).length);
});

test('recommendations are sorted by score, then id', () => {
  for (const source of ['demo', 'reported'] as const) {
    const items = recommend(INSIGHTS_FIXTURE, source, LATER);
    for (let i = 1; i < items.length; i++) {
      const [a, b] = [items[i - 1], items[i]];
      assert.ok(a && b && (a.score > b.score || (a.score === b.score && a.id < b.id)), `${a?.id} before ${b?.id}`);
    }
  }
  const data = base();
  data.usage.demo.applications.push(app('b'), app('a'));
  assert.deepEqual(recommend(data, 'demo', NOW).map((item) => item.id), ['app-no-plectrum:a', 'app-no-plectrum:b']);
});

test('threshold overrides apply; undefined overrides keep the default', () => {
  const data = base();
  data.repo.searchEval.knownMisses = [{ id: 'case-a', since: daysAgo(1) }];
  assert.deepEqual(ids(data, 'known-miss-open', 'demo', NOW, { knownMissMaxAgeDays: 0 }), ['known-miss-open:case-a']);
  assert.deepEqual(ids(data, 'known-miss-open', 'demo', NOW, { knownMissMaxAgeDays: undefined }), []);
});

test('every recommendation has evidence with a source and a drill target', () => {
  for (const source of ['demo', 'reported'] as const) {
    for (const item of recommend(INSIGHTS_FIXTURE, source, LATER)) {
      assert.ok(item.evidence.length > 0, item.id);
      for (const entry of item.evidence) assert.ok(entry.source.length > 0, `${item.id}: ${entry.label}`);
      assert.ok(item.target.section, item.id);
      assert.ok(item.title && item.why, item.id);
    }
  }
});

// The shared fixture fires the rule families it was designed for.
const severities = (source: Provenance, now: Date) =>
  Object.fromEntries(recommend(INSIGHTS_FIXTURE, source, now).map((item) => [item.id, item.severity]));

test('INSIGHTS_FIXTURE demo fires the designed rule families', () => {
  assert.deepEqual(severities('demo', NOW), {
    'catalogue-gap:ishare': 'high',
    'review-waiting:iged-queue-card': 'high',
    'promote-local:icrm:contact-details-drawer+ishare:document-more-details-drawer': 'high',
    'accepted-not-promoted:ishare-document-more-details-drawer': 'medium',
    'local-duplicates-core:ishare:document-more-details-drawer/plectrum:drawer': 'medium',
    'local-duplicates-core:icrm:contact-details-drawer/plectrum:drawer': 'medium',
    'stale-report:icrm': 'medium',
    'lookup-not-adopted:iged/plectrum:drawer': 'medium',
    'mcp-tool-unused:check_tokens': 'low',
    'outdated-runtime:icrm': 'medium',
    'outdated-runtime:iged': 'medium',
    'app-no-plectrum:icrm': 'medium',
    'retire-deprecated:plectrum:profile-card': 'medium',
    'token-proposals-pending:code-owned': 'low',
    'deprecated-looked-up:icrm/plectrum:profile-card': 'low',
  });
});

test('INSIGHTS_FIXTURE demo adds the age-based rules once old enough', () => {
  const later = severities('demo', LATER);
  assert.equal(later['known-miss-open:member-side-panel'], 'low');
  assert.equal(later['unused-component:plectrum:detail-list'], 'low');
  assert.equal(later['review-waiting:iged-queue-card'], 'critical');
  // copyable-text, icon and plectrum-avatar are used by other components.
  for (const id of ['plectrum:copyable-text', 'plectrum:icon', 'plectrum:plectrum-avatar']) assert.equal(later[`unused-component:${id}`], undefined);
});

test('INSIGHTS_FIXTURE reported fires repository rules only, nothing for unreported local demo apps', () => {
  for (const now of [NOW, LATER]) {
    const items = recommend(INSIGHTS_FIXTURE, 'reported', now);
    assert.ok(items.length > 0);
    for (const item of items) assert.equal(item.provenance, 'repository', item.id);
    const demoRepository = recommend(INSIGHTS_FIXTURE, 'demo', now).filter((item) => item.provenance === 'repository');
    assert.deepEqual(items, demoRepository);
  }
  assert.deepEqual(recommend(INSIGHTS_FIXTURE, 'reported', NOW).map((item) => item.id), [
    'review-waiting:iged-queue-card',
    'accepted-not-promoted:ishare-document-more-details-drawer',
    'token-proposals-pending:code-owned',
  ]);
});
