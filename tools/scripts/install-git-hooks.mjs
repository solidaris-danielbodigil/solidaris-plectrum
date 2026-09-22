#!/usr/bin/env node
// Copies tools/githooks/* into .git/hooks. Does not change git config.
// npm install runs this via the prepare script, so a fresh clone gets the hook.
import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const gitDir = resolve(root, '.git');
if (!existsSync(gitDir)) {
  console.log('install-git-hooks: no .git directory, skipping');
  process.exit(0);
}

const hooksDir = resolve(gitDir, 'hooks');
mkdirSync(hooksDir, { recursive: true });

const name = 'pre-commit';
const source = resolve(root, 'tools/githooks', name);
const dest = resolve(hooksDir, name);
const marker = 'npm run check:commit';

if (existsSync(dest) && !readFileSync(dest, 'utf8').includes(marker)) {
  console.warn(`install-git-hooks: leaving existing ${dest} (it is not ours)`);
  process.exit(0);
}

copyFileSync(source, dest);
chmodSync(dest, 0o755);
console.log('install-git-hooks: pre-commit runs npm run check:commit');
