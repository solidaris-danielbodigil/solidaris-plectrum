import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { asset } from './common.mjs';
import { adoptionSubmit, localComponents, similarLocalComponents, usageReportStatus } from './workflows.mjs';

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
