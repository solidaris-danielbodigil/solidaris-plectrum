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

  await scaffold(root, ['--name', 'local-card']);
  const config = configAt(root);
  const metadata = readJson(path.join(root, config.paths.candidates, 'local-card/local-card.metadata.json'));
  assert.equal(metadata.component.scssPath, 'src/styles/06-components/_components.local-card.scss');
  assert.ok(fs.existsSync(path.join(root, config.paths.candidates, 'local-card/local-card.component.spec.ts')));
  assert.match(fs.readFileSync(path.join(root, 'src/styles/06-components/_index.scss'), 'utf8'), /@use 'components\.local-card';/);
  assert.equal(candidateCheck(root, config).errors.some((item) => /proposal/.test(item)), false);
  const css = path.join(root, 'compiled.css');
  execFileSync(path.join(repository, 'node_modules/.bin/sass'), [`--load-path=${path.join(root, 'node_modules/@solidaris-danielbodigil/pds-styles/src')}`, path.join(root, 'src/styles.scss'), css]);
  assert.match(fs.readFileSync(css, 'utf8'), /\.c-local-card/);
});

test('bootstrap refuses an incomplete Angular application before generating files', (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-devkit-preflight-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(starter, root, { recursive: true });
  fs.rmSync(path.join(root, 'angular.json'));

  assert.throws(() => bootstrap(root, { ci: false }), /Missing angular\.json/);
  assert.equal(fs.existsSync(path.join(root, '.plectrum/config.json')), false);
  assert.equal(fs.existsSync(path.join(root, 'src/styles/main.scss')), false);
});
