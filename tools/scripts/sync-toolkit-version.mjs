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
const runtime = ['pds-ui', 'pds-plectrum', 'pds-styles'];
const runtimeVersions = [read('libs/ui/package.json').version, read('libs/plectrum/package.json').version, read('libs/styles/package.json').version];
if (new Set(runtimeVersions).size !== 1) throw new Error(`Runtime packages must share one version: ${runtimeVersions.join(', ')}.`);
const runtimeVersion = runtimeVersions[0];
for (const path of ['.ai/contracts/compatibility.json', 'tools/devkit/assets/compatibility.json']) {
  const contract = read(path);
  if (contract.toolkitVersion === version) continue;
  if (check) throw new Error(`${path} declares toolkit ${contract.toolkitVersion}; package is ${version}. Run npm run changeset:version or sync-toolkit-version.mjs.`);
  contract.toolkitVersion = version;
  writeFileSync(resolve(root, path), `${JSON.stringify(contract, null, 2)}\n`);
  console.log(`Updated ${path} to toolkit ${version}.`);
}
const starterPath = 'tools/consumers/starter/package.json';
const starter = read(starterPath);
let starterChanged = false;
for (const name of runtime) {
  const dependency = `@solidaris-danielbodigil/${name}`;
  if (starter.dependencies[dependency] === runtimeVersion) continue;
  if (check) throw new Error(`${starterPath} declares ${dependency}@${starter.dependencies[dependency]}; runtime is ${runtimeVersion}. Run npm run changeset:version or sync-toolkit-version.mjs.`);
  starter.dependencies[dependency] = runtimeVersion;
  starterChanged = true;
}
if (starter.devDependencies['@solidaris-danielbodigil/pds-devkit'] !== version) {
  if (check) throw new Error(`${starterPath} declares devkit ${starter.devDependencies['@solidaris-danielbodigil/pds-devkit']}; package is ${version}. Run npm run changeset:version or sync-toolkit-version.mjs.`);
  starter.devDependencies['@solidaris-danielbodigil/pds-devkit'] = version;
  starterChanged = true;
}
if (starterChanged) {
  writeFileSync(resolve(root, starterPath), `${JSON.stringify(starter, null, 2)}\n`);
  console.log(`Updated ${starterPath} to runtime ${runtimeVersion} and toolkit ${version}.`);
}
console.log(`Toolkit compatibility snapshots match ${version}.`);
