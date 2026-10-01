import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { asset } from './common.mjs';
import { adoptionSubmit, usageReportStatus } from './workflows.mjs';

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
