import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { adoptionReportSchema } from '../../.ai/contracts/schema/exchange.schema';
import { readAdoptionReports, validateAdoptionReport } from '../adoption/records';
import { inventory } from '../contracts/inventory';
import { readRegistry } from '../contracts/validate';
import { catalogueByStatus, changesetBumps, normalizeUsedIn, parseEvalModule, readJson, syncStage, FILES } from './collect';
import { demoReports, readSeed, seedLocalIds } from './demo';
import { buildInsights, renderModule } from './generate';
import { head, history, historyAvailable } from './history';
import type { Catalogue } from './similarity';

const root = path.resolve(__dirname, '../..');
const DAY_MS = 24 * 60 * 60 * 1000;

test('demo isolation: no seeded local component reaches .ai/adoption or the shipped local-components asset', () => {
  const seeded = new Set(seedLocalIds(readSeed(root)));
  assert.ok(seeded.size > 0);
  for (const report of readAdoptionReports(root).values()) {
    for (const local of report.localComponents ?? []) assert.ok(!seeded.has(local.id), `${local.id} from the demo seed is in .ai/adoption`);
  }
  const asset = fs.readFileSync(path.join(root, 'tools/devkit/assets/local-components.json'), 'utf8');
  for (const id of seeded) assert.ok(!asset.includes(id), `${id} from the demo seed is in local-components.json`);
});

test('demo reports pass the adoption schema and the central validation, in observation order', async () => {
  const registry = readRegistry(root);
  const knownIds = new Set((await inventory(root)).map((item) => item.metadata.component.id));
  const reports = await demoReports(root, { registry, head: head(root), catalogue: readJson<Catalogue>(root, FILES.catalogue), knownIds });
  assert.deepEqual([...reports.keys()].sort(), registry.applications.filter((app) => app.kind === 'local-demo').map((app) => app.id).sort());
  for (const history of reports.values()) {
    assert.ok(history.length > 0);
    history.forEach((report, index) => {
      adoptionReportSchema.parse(report);
      validateAdoptionReport(report, registry, knownIds, history[index - 1]);
      assert.ok(report.limitations.some((line) => line.startsWith('DEMO:')));
    });
  }
});

test('the seed makes the demo rule families fire', async () => {
  const insights = await buildInsights(root);
  const demo = insights.usage.demo;
  const latest = (app: string) => demo.agentHistory.filter((point) => point.application === app).at(-1)!;
  const ishare = latest('ishare');
  assert.ok(ishare.emptySearches / ishare.tools['search_components']! >= 0.35, 'catalogue gap');
  const icrm = demo.applications.find((app) => app.id === 'icrm')!;
  assert.ok(Date.parse(insights.generatedAt) - Date.parse(icrm.reportedAt!) > demo.staleAfterDays * DAY_MS, 'stale report');
  assert.ok((latest('icrm').lookups['plectrum:profile-card'] ?? 0) >= 3, 'deprecated looked up');
  assert.ok(!demo.observations.some((item) => item.application === 'icrm'), 'app without Plectrum');
  assert.ok(demo.agentHistory.every((point) => point.tools['check_tokens'] === 0), 'MCP tool unused');
  const crossTeam = demo.similarity.find((pair) => pair.kind === 'local-local' && pair.score >= 6);
  assert.deepEqual([crossTeam?.a, crossTeam?.b], ['icrm:contact-details-drawer', 'ishare:document-more-details-drawer']);
  assert.ok(demo.similarity.some((pair) => pair.kind === 'local-core' && pair.score >= 6), 'local duplicates core');
  assert.deepEqual(insights.usage.reported.observations, []);
});

test('the generated module is deterministic for a given HEAD', async () => {
  const first = renderModule(await buildInsights(root));
  const second = renderModule(await buildInsights(root));
  assert.equal(first, second);
  assert.match(first, new RegExp(`"generatedAt": "${head(root).at}"`));
  assert.match(first, /^import type \{ PlectrumInsights \} from '@pds-internal\/insights';$/m);
});

test('index usedIn keyed by old component names or labels maps to ids', () => {
  const names = new Map([['ProfileCard', 'plectrum:profile-card']]);
  const apps = new Map([['ishare', 'ishare'], ['iged', 'iged']]);
  assert.deepEqual(normalizeUsedIn({ ProfileCard: ['iSHARE'], SubNavShell: ['iGED', 'iSHARE'], 'plectrum:list': [] }, names, apps), {
    'plectrum:profile-card': ['ishare'],
    'plectrum:sub-nav-shell': ['iged', 'ishare'],
  });
  assert.equal(normalizeUsedIn(undefined, names, apps), null);
});

test('tolerant readers of the search evaluation, catalogue and changesets', () => {
  const module = `// Generated\nexport const AGENT_SEARCH_EVAL = {"toolkitVersion":"0.7.1","results":[{"id":"a","query":"q = x","anyOf":["plectrum:list"],"pass":true},{"id":"b","query":"q","pass":false,"knownMiss":true}]} as const;\n`;
  const parsed = parseEvalModule(module)!;
  assert.deepEqual([parsed.total, parsed.passed, parsed.rate], [2, 1, 50]);
  assert.deepEqual(parsed.results[1], { id: 'b', query: 'q', anyOf: [], allOf: [], none: false, results: [], pass: false, knownMiss: true });
  assert.equal(parseEvalModule('export const X = 1;'), null);
  assert.deepEqual(catalogueByStatus(JSON.stringify({ components: [{ metadata: { governance: { status: 'core' } } }, { status: 'deprecated' }] })), { core: 1, app: 0, deprecated: 1, candidate: 0 });
  assert.equal(catalogueByStatus('{"components":{}}'), null);
  assert.deepEqual(changesetBumps('---\n"@scope/b": minor\n\'@scope/a\': patch\n---\n\nText: major'), [
    { packageName: '@scope/a', bump: 'patch' },
    { packageName: '@scope/b', bump: 'minor' },
  ]);
});

test('a committed proposed token sync is merged on main; only blocked stays blocked', () => {
  assert.equal(syncStage({ stage: 'proposed', result: 'promote' }), 'merged');
  assert.equal(syncStage({ stage: 'blocked', result: 'blocked' }), 'blocked');
  assert.equal(syncStage({ stage: 'released' }), 'released');
  assert.equal(syncStage({ result: 'preview' }), null);
});

test('a checkout without git history yields no history points', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'insights-'));
  try {
    assert.equal(historyAvailable(directory), false);
    assert.deepEqual(history(directory, FILES.index, () => 1), []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
