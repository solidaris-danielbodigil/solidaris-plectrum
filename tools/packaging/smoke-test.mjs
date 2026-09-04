#!/usr/bin/env node
/**
 * Pack libs and `ng build` a throwaway Angular app with no path aliases.
 * The consumer is copied outside the workspace so tsconfig paths cannot leak.
 */

import { execSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TARBALLS = join(ROOT, 'tools/packaging/.tarballs');
const FIXTURE = join(ROOT, 'tools/packaging/consumer-app');

function run(cmd, cwd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

run('node tools/packaging/pack.mjs', ROOT);

const tgz = readdirSync(TARBALLS).filter((name) => name.endsWith('.tgz'));
const fileDeps = {};
for (const name of tgz) {
  const match = name.match(/^solidaris-(.+)-(\d+\.\d+\.\d+)\.tgz$/);
  if (!match) continue;
  fileDeps[`@solidaris/${match[1]}`] = `file:${join(TARBALLS, name)}`;
}

const dest = mkdtempSync(join(tmpdir(), 'pds-pack-smoke-'));
cpSync(FIXTURE, dest, { recursive: true });

const pkg = JSON.parse(readFileSync(join(dest, 'package.json'), 'utf8'));
pkg.dependencies = { ...pkg.dependencies, ...fileDeps };
writeFileSync(join(dest, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);

run('npm install --legacy-peer-deps', dest);
run('npx ng build', dest);

console.log(`pack:smoke succeeded in ${dest}`);
