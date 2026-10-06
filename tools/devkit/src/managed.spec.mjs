import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { format, hash, readJson } from './common.mjs';
import { primeNgServer, primeNgSetting, update } from './managed.mjs';

function projectWith(mcp) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-managed-'));
  fs.mkdirSync(path.join(root, '.plectrum'));
  fs.writeFileSync(path.join(root, '.plectrum/config.json'), JSON.stringify({
    schemaVersion: 1, team: 'team', application: 'app', repository: 'https://github.com/example/app',
    paths: { source: ['src'], styles: ['src/styles'], candidates: 'src/plectrum-candidates', candidateStyles: 'src/styles/06-components', localTokenFiles: [] },
    dependencies: ['@solidaris-danielbodigil/pds-ui', '@solidaris-danielbodigil/pds-plectrum', '@solidaris-danielbodigil/pds-styles'],
    mcp,
    reporting: { output: '.plectrum/reports/adoption.json', enabled: true },
  }));
  return root;
}

const servers = (root) => ({ cursor: readJson(path.join(root, '.cursor/mcp.json')).mcpServers, vscode: readJson(path.join(root, '.vscode/mcp.json')).servers });

test('primeNg setting: true and the legacy URL mean the stdio package, another URL stays remote', () => {
  assert.equal(primeNgSetting(true), 'stdio');
  assert.equal(primeNgSetting('https://primeng.org/mcp'), 'stdio');
  assert.equal(primeNgSetting('https://mcp.example.com/primeng'), 'https://mcp.example.com/primeng');
  assert.equal(primeNgSetting(null), null);
  assert.equal(primeNgSetting(false), null);
});

test('update replaces the legacy PrimeNG URL server it wrote with the stdio package', (context) => {
  const root = projectWith({ primeNg: 'https://primeng.org/mcp', figma: null, storybook: null });
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  // What 0.7.1 wrote: URL servers, recorded in the manifest as managed.
  const legacy = { cursor: { url: 'https://primeng.org/mcp' }, vscode: { type: 'http', url: 'https://primeng.org/mcp' } };
  for (const [editor, key] of [['cursor', 'mcpServers'], ['vscode', 'servers']]) {
    fs.mkdirSync(path.join(root, `.${editor}`));
    fs.writeFileSync(path.join(root, `.${editor}/mcp.json`), format({ [key]: { 'plectrum-primeng': legacy[editor] } }));
  }
  fs.writeFileSync(path.join(root, '.plectrum/managed.json'), format({
    schemaVersion: 1, toolkitVersion: '0.7.1', files: {},
    servers: { '.cursor/mcp.json:plectrum-primeng': hash(format(legacy.cursor)), '.vscode/mcp.json:plectrum-primeng': hash(format(legacy.vscode)) },
  }));
  update(root);
  const { cursor, vscode } = servers(root);
  assert.deepEqual(cursor['plectrum-primeng'], primeNgServer);
  assert.deepEqual(vscode['plectrum-primeng'], { type: 'stdio', ...primeNgServer });
});

test('a custom PrimeNG URL stays an http server; null configures none', (context) => {
  const custom = projectWith({ primeNg: 'https://mcp.example.com/primeng', figma: null, storybook: null });
  const none = projectWith({ primeNg: null, figma: null, storybook: null });
  context.after(() => [custom, none].forEach((root) => fs.rmSync(root, { recursive: true, force: true })));
  update(custom);
  update(none);
  assert.deepEqual(servers(custom).vscode['plectrum-primeng'], { type: 'http', url: 'https://mcp.example.com/primeng' });
  assert.equal(servers(none).cursor['plectrum-primeng'], undefined);
});
