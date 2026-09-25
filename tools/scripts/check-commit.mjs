#!/usr/bin/env node
// Fast gates from .github/workflows/ci.yml, run before git creates a commit.
// Builds, unit tests, pack:smoke and Storybook stay on CI — they need a
// browser and take minutes. This script fails the commit when the working
// tree would fail those fast steps.
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');

const generatedScss = readdirSync(resolve(root, 'libs/styles/src/01-settings'))
  .filter((name) => name.endsWith('.generated.scss'))
  .map((name) => `libs/styles/src/01-settings/${name}`);

const steps = [
  ['docs:check', 'npm', ['run', 'docs:check']],
  ['contracts:check', 'npm', ['run', 'contracts:check']],
  ['tokens:check-prefix', 'npm', ['run', 'tokens:check-prefix']],
  ['tokens:lint', 'npm', ['run', 'tokens:lint']],
  ['lint:styles', 'npm', ['run', 'lint:styles']],
  ['generated contracts and exports', 'npm', ['run', 'contracts:generate', '--', '--check']],
  [
    'contracts index is committed',
    'git',
    ['diff', '--exit-code', '--', '.ai/contracts/index.json'],
  ],
  ['changelog:build', 'npm', ['run', 'changelog:build']],
  [
    'changelog feed is committed',
    'git',
    ['diff', '--exit-code', '--', 'libs/ui/src/storybook/changelog.generated.ts'],
  ],
  ['tokens:build', 'npm', ['run', 'tokens:build']],
  [
    'generated tokens are committed',
    'git',
    ['diff', '--exit-code', '--', ...generatedScss, 'libs/ui/src/storybook/tokens.generated.ts'],
  ],
];

for (const [name, command, args] of steps) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' && command === 'npm' });
  if (result.status !== 0) {
    console.error(`\nCommit blocked: ${name} failed.`);
    if (name.endsWith('committed')) {
      console.error('The file was regenerated. Stage it and commit again.');
    }
    process.exit(result.status ?? 1);
  }
}

console.log('check:commit ok');
