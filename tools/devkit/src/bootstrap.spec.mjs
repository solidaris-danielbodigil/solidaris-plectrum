import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { bootstrap } from './bootstrap.mjs';
import { scaffold } from './workflows.mjs';
import { candidateCheck } from './checks.mjs';
import { configAt, packageRoot, readJson } from './common.mjs';
import { primeNgServer } from './managed.mjs';

const repository = path.resolve(packageRoot, '../..');
const starter = path.join(repository, 'tools/consumers/starter');

test('starter bootstraps once, composes SCSS and scaffolds an autonomous local component', async (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-devkit-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(starter, root, { recursive: true });
  fs.symlinkSync(path.join(repository, 'node_modules'), path.join(root, 'node_modules'), 'dir');

  bootstrap(root, { ci: false });
  const generated = fs.readFileSync(path.join(root, 'src/styles/main.scss'), 'utf8');
  assert.match(generated, /@use '06-components' as \*;/);
  assert.equal((generated.match(/components\.core/g) ?? []).length, 1);
  assert.equal(bootstrap(root, { ci: false }).length, 0);
  bootstrap(root, { ci: true });
  assert.ok(readJson(path.join(root, 'angular.json')).projects.application.architect.storybook);
  assert.ok(fs.existsSync(path.join(root, '.ai/skills/plectrum-component/SKILL.md')));
  assert.match(fs.readFileSync(path.join(root, '.github/workflows/plectrum-checks.yml'), 'utf8'), /NODE_AUTH_TOKEN: \$\{\{ secrets\.GITHUB_TOKEN \}\}/);
  const preview = fs.readFileSync(path.join(root, '.storybook/preview.ts'), 'utf8');
  assert.match(preview, /providePlectrum\(version\)/);
  assert.match(preview, /providePdsLocale\(locale\)/);
  assert.match(preview, /Preset v0\.6 \(deprecated\)/);
  assert.match(fs.readFileSync(path.join(root, '.storybook/main.ts'), 'utf8'), /pds-styles\/assets\/fonts/);
  assert.ok(readJson(path.join(root, 'angular.json')).projects.application.architect.build.options.assets.some((asset) => asset.input === 'node_modules/@solidaris-danielbodigil/pds-styles/assets/fonts'));

  await scaffold(root, ['--name', 'local-card']);
  const config = configAt(root);
  const metadata = readJson(path.join(root, config.paths.candidates, 'local-card/local-card.metadata.json'));
  assert.equal(metadata.component.scssPath, 'src/styles/06-components/_components.local-card.scss');
  assert.ok(fs.existsSync(path.join(root, config.paths.candidates, 'local-card/local-card.component.spec.ts')));
  assert.match(fs.readFileSync(path.join(root, 'src/styles/06-components/_index.scss'), 'utf8'), /@use 'components\.local-card';/);
  assert.equal(candidateCheck(root, config).errors.some((item) => /proposal/.test(item)), false);
  const css = path.join(root, 'compiled.css');
  execFileSync(process.execPath, [path.join(repository, 'node_modules/sass/sass.js'), `--load-path=${path.join(root, 'node_modules/@solidaris-danielbodigil/pds-styles/src')}`, path.join(root, 'src/styles.scss'), css]);
  assert.match(fs.readFileSync(css, 'utf8'), /\.c-local-card/);
});

test('bootstrap refuses an incomplete Angular application before generating files', (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-devkit-preflight-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(starter, root, { recursive: true });
  fs.symlinkSync(path.join(repository, 'node_modules'), path.join(root, 'node_modules'), 'dir');
  fs.rmSync(path.join(root, 'angular.json'));

  assert.throws(() => bootstrap(root, { ci: false }), /Missing angular\.json/);
  assert.equal(fs.existsSync(path.join(root, '.plectrum/config.json')), false);
  assert.equal(fs.existsSync(path.join(root, 'src/styles/main.scss')), false);
});

test('bootstrap rejects a styles package without shipped Agenda assets', (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-devkit-fonts-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(starter, root, { recursive: true });

  assert.throws(() => bootstrap(root, { ci: false }), /pds-styles package lacks Agenda assets/);
  assert.equal(fs.existsSync(path.join(root, '.plectrum/config.json')), false);
});

test('bootstrap configures the offline Plectrum MCP server, Figma and the application Storybook MCP', async (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-mcp-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(starter, root, { recursive: true });
  fs.symlinkSync(path.join(repository, 'node_modules'), path.join(root, 'node_modules'), 'dir');
  bootstrap(root, { ci: false });

  const server = ['${workspaceFolder}/node_modules/@solidaris-danielbodigil/pds-devkit/bin/plectrum.mjs', 'mcp', '--root', '${workspaceFolder}'];
  const cursor = readJson(path.join(root, '.cursor/mcp.json')).mcpServers;
  const vscode = readJson(path.join(root, '.vscode/mcp.json')).servers;
  assert.deepEqual(cursor.plectrum, { command: 'node', args: server });
  assert.deepEqual(vscode.plectrum, { type: 'stdio', command: 'node', args: server });
  assert.equal(readJson(path.join(root, '.plectrum/config.json')).mcp.primeNg, true);
  assert.deepEqual(cursor['plectrum-primeng'], primeNgServer);
  assert.deepEqual(vscode['plectrum-primeng'], { type: 'stdio', ...primeNgServer });
  assert.deepEqual(cursor['plectrum-figma'], { url: 'https://mcp.figma.com/mcp' });
  assert.deepEqual(vscode['plectrum-storybook'], { type: 'http', url: 'http://localhost:6006/mcp' });
  const main = fs.readFileSync(path.join(root, '.storybook/main.ts'), 'utf8');
  assert.match(main, /'@storybook\/addon-mcp'/);
  assert.match(main, /componentsManifest: true/);

  // The editor starts the installed binary; answer a real search over stdio and record one event.
  const cli = path.join(packageRoot, 'bin/plectrum.mjs');
  const input = [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } } },
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'search_components', arguments: { request: 'copy a reference number to the clipboard' } } },
  ].map((message) => JSON.stringify(message)).join('\n') + '\n';
  const output = execFileSync(process.execPath, [cli, 'mcp', '--root', root], { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  const [init, search] = output.trim().split('\n').map((line) => JSON.parse(line));
  assert.equal(init.result.serverInfo.name, 'plectrum');
  assert.equal(JSON.parse(search.result.content[0].text).results[0].id, 'plectrum:copyable-text');
  const events = fs.readFileSync(path.join(root, '.plectrum/telemetry/events.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
  assert.deepEqual(events.map(({ source, name, outcome }) => ({ source, name, outcome })), [{ source: 'mcp', name: 'search_components', outcome: 'ok' }]);
  assert.doesNotMatch(JSON.stringify(events), /clipboard/);
});
