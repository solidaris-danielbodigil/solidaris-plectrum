import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { asset } from './common.mjs';
import { adoptionSubmit, localComponents, scanObservations, similarLocalComponents, usageReportStatus } from './workflows.mjs';

function projectWith(team, application) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-adoption-'));
  fs.mkdirSync(path.join(root, '.plectrum'));
  fs.writeFileSync(path.join(root, '.plectrum/config.json'), JSON.stringify({
    schemaVersion: 1, team, application, repository: 'https://github.com/example/app',
    paths: { source: ['src'], styles: ['src/styles'], candidates: 'src/plectrum-candidates', candidateStyles: 'src/styles/06-components', localTokenFiles: [] },
    dependencies: ['@solidaris-danielbodigil/pds-ui', '@solidaris-danielbodigil/pds-plectrum', '@solidaris-danielbodigil/pds-styles'],
    mcp: { primeNg: null, figma: null, storybook: null },
    reporting: { output: '.plectrum/reports/adoption.json', enabled: true },
  }));
  return root;
}

const untouched = () => new Proxy({}, { get: (_, key) => (key === 'token' ? 'token' : () => assert.fail(`client.${String(key)} called`)) });

test('default-on reporting skips an application that is not registered yet', async () => {
  assert.equal(await adoptionSubmit(projectWith('unregistered', 'unregistered-app'), ['adoption-submit'], untouched()), undefined);
});

test('default-on reporting skips a registered application when CI has no token', async () => {
  const app = asset('registry.json').applications[0];
  const client = new Proxy({}, { get: (_, key) => (key === 'token' ? undefined : () => assert.fail(`client.${String(key)} called`)) });
  assert.equal(await adoptionSubmit(projectWith(app.team, app.id), ['adoption-submit'], client), undefined);
});

test('a skipped submission is a GitHub Actions warning annotation in CI', async (t) => {
  const lines = [];
  t.mock.method(console, 'log', (line) => lines.push(line));
  process.env.GITHUB_ACTIONS = 'true';
  try {
    await adoptionSubmit(projectWith('unregistered', 'unregistered-app'), ['adoption-submit'], untouched());
  } finally {
    delete process.env.GITHUB_ACTIONS;
  }
  assert.match(lines.join(' '), /::warning title=Plectrum usage report::.*not in the Plectrum registry/);
});

test('usage report status names what is missing', () => {
  const app = asset('registry.json').applications[0];
  const base = { reporting: { enabled: true } };
  assert.match(usageReportStatus({ ...base, team: 'nobody', application: 'nobody' }).join(' '), /not in the Plectrum registry/);
  assert.match(usageReportStatus({ ...base, team: app.team, application: app.id }).join(' '), /is registered/);
  assert.match(usageReportStatus({ team: app.team, application: app.id, reporting: { enabled: false } }).join(' '), /off/);
});

test('local components carry the reuse estimate from evidence.md', () => {
  const root = projectWith('claims', 'claims-portal');
  const folder = path.join(root, 'src/plectrum-candidates/claim-card');
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'claim-card.metadata.json'), JSON.stringify({ component: { id: 'claims:claim-card', name: 'ClaimCard', description: 'Claim summary card.' }, usage: { useCases: ['Claim lists'] } }));
  fs.writeFileSync(path.join(folder, 'evidence.md'), '# Evidence\n\nReuse potential (none / possible / likely) and why: Likely — every claims screen needs it.\n');
  const config = JSON.parse(fs.readFileSync(path.join(root, '.plectrum/config.json'), 'utf8'));
  assert.deepEqual(localComponents(root, config), [{ id: 'claims:claim-card', name: 'ClaimCard', description: 'Claim summary card.', useCases: ['Claim lists'], reusePotential: 'likely', reuseNote: 'every claims screen needs it.' }]);
  fs.writeFileSync(path.join(folder, 'evidence.md'), '# Evidence\n');
  assert.equal(localComponents(root, config)[0].reusePotential, 'unknown');
});

test('scaffold flags near-duplicates built by other teams, not by the same team', () => {
  const snapshot = { components: [
    { id: 'claims:claim-card', name: 'ClaimCard', description: 'Claim summary card.', team: 'claims', application: 'claims-portal' },
    { id: 'members:member-card', name: 'MemberCard', description: 'Member card.', team: 'members', application: 'members-app' },
  ] };
  assert.deepEqual(similarLocalComponents('summary-card', 'members', snapshot).map((item) => item.id), ['claims:claim-card']);
  assert.deepEqual(similarLocalComponents('claim-card', 'claims', snapshot).map((item) => item.id), ['members:member-card']);
  assert.deepEqual(similarLocalComponents('date-filter', 'claims', snapshot), []);
});

const scanCatalogue = { components: [
  { id: 'plectrum:empty-state', metadata: { component: { bemBlock: 'c-empty-state' }, distribution: { kind: 'angular', entryPoint: '.', exportName: 'EmptyStateComponent' } }, package: { importPath: '@solidaris-danielbodigil/pds-ui', exportName: 'EmptyStateComponent' }, selector: 'pds-empty-state' },
  { id: 'plectrum:accordion', metadata: { component: { bemBlock: 'c-accordion' }, distribution: { kind: 'styles' } }, package: { name: '@solidaris-danielbodigil/pds-styles' }, selector: null },
  { id: 'plectrum:drawer', metadata: { component: { bemBlock: 'c-drawer' }, distribution: { kind: 'styles' } }, package: { name: '@solidaris-danielbodigil/pds-styles' }, selector: null },
] };

function sourceTree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-scan-'));
  for (const [file, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), body);
  }
  return { root, files: Object.keys(files).map((file) => path.join(root, file)) };
}

test('scanObservations keeps the import and selector matches of Angular components', () => {
  const { root, files } = sourceTree({
    'src/a.ts': "import { EmptyStateComponent } from '@solidaris-danielbodigil/pds-ui';\n",
    'src/b.html': '<pds-empty-state heading="None"></pds-empty-state>\n',
    'src/c.ts': "import { EmptyStateComponent } from './local';\n",
    'src/d.html': '<pds-empty-state-x></pds-empty-state-x><div class="c-empty-state"></div>\n',
    'src/e.html': '<!-- <pds-empty-state></pds-empty-state> -->\n',
    'src/f.ts': "// import { EmptyStateComponent } from '@solidaris-danielbodigil/pds-ui';\n",
  });
  assert.deepEqual(scanObservations(root, files, scanCatalogue), [
    { componentId: 'plectrum:empty-state', kind: 'source-reference', count: 2, files: ['src/a.ts', 'src/b.html'] },
  ]);
});

test('scanObservations finds styles-only components by their BEM block, element or modifier class', () => {
  const { root, files } = sourceTree({
    'src/panel.html': '<p-accordion class="c-accordion c-accordion--bordered"></p-accordion>\n',
    'src/modifier.html': '<p-accordion styleClass="o-layout c-accordion--bordered"></p-accordion>\n',
    'src/host.ts': "@Component({ host: { class: 'c-drawer' } })\nexport class A {}\n",
    'src/element.html': '<div [class.c-drawer__header--sticky]="sticky"></div>\n',
  });
  assert.deepEqual(scanObservations(root, files, scanCatalogue), [
    { componentId: 'plectrum:accordion', kind: 'source-reference', count: 2, files: ['src/panel.html', 'src/modifier.html'] },
    { componentId: 'plectrum:drawer', kind: 'source-reference', count: 2, files: ['src/host.ts', 'src/element.html'] },
  ]);
});

test('scanObservations ignores other blocks sharing the prefix and commented-out classes', () => {
  const { root, files } = sourceTree({
    'src/other.html': '<div class="c-accordion-x xc-accordion c-drawers my-c-drawer"></div>\n',
    'src/comment.html': '<!-- <p-accordion class="c-accordion"></p-accordion> -->\n',
    'src/comment.ts': "// host: { class: 'c-drawer' }\n/* c-accordion */\nexport const a = 1;\n",
  });
  assert.deepEqual(scanObservations(root, files, scanCatalogue), []);
});

test('scanObservations counts files once and takes paths relative to the root', () => {
  const { root } = sourceTree({
    'src/a.html': '<div class="c-accordion"></div><div class="c-accordion c-accordion__item"></div>\n',
    'src/b.html': '<div class="c-accordion"></div>\n',
    'src/c.html': '<div class="c-drawer"></div>\n',
  });
  const observations = scanObservations(root, ['src/a.html', path.join(root, 'src/b.html'), 'src/c.html'], scanCatalogue);
  assert.deepEqual(observations.map(({ componentId, count, files }) => ({ componentId, count, files })), [
    { componentId: 'plectrum:accordion', count: 2, files: ['src/a.html', 'src/b.html'] },
    { componentId: 'plectrum:drawer', count: 1, files: ['src/c.html'] },
  ]);
});
