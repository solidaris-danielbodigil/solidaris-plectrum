#!/usr/bin/env node
// Keep the central compatibility contract and distributed toolkit snapshot
// aligned with the version produced by Changesets.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const check = process.argv.length === 3 && process.argv[2] === '--check';
if (process.argv.length > (check ? 3 : 2)) {
  throw new Error('Usage: sync-toolkit-version.mjs [--check]');
}

const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const version = read('tools/devkit/package.json').version;
for (const path of ['.ai/contracts/compatibility.json', 'tools/devkit/assets/compatibility.json']) {
  const contract = read(path);
  if (contract.toolkitVersion === version) continue;
  if (check) throw new Error(`${path} declares toolkit ${contract.toolkitVersion}; package is ${version}. Run npm run changeset:version or sync-toolkit-version.mjs.`);
  contract.toolkitVersion = version;
  writeFileSync(resolve(root, path), `${JSON.stringify(contract, null, 2)}\n`);
  console.log(`Updated ${path} to toolkit ${version}.`);
}
console.log(`Toolkit compatibility snapshots match ${version}.`);
