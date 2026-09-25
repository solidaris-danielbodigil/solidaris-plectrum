#!/usr/bin/env node
// Keep the copyable tarball install command in step with Changesets versions.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const packages = [
  JSON.parse(read('libs/ui/package.json')),
  JSON.parse(read('libs/plectrum/package.json')),
  JSON.parse(read('libs/styles/package.json')),
];
const toolkit = JSON.parse(read('tools/devkit/package.json'));
const [runtimeVersion] = [...new Set(packages.map(({ version }) => version))];
if (packages.some(({ version }) => version !== runtimeVersion)) {
  throw new Error('Runtime package versions differ; cannot update consumer install instructions.');
}

const path = 'libs/ui/src/docs/get-started-consume.mdx';
const current = read(path);
const updates = [
  [
    /The runtime packages currently declare [^;\r\n]+; the toolkit declares [^.\r\n]+\.[^.\r\n]+\.[^.\r\n]+\./,
    `The runtime packages currently declare ${runtimeVersion}; the toolkit declares ${toolkit.version}.`,
  ],
  ...packages.map(({ name, version }) => [
    new RegExp(`${name.replace(/^@/, '').replace('/', '-')}-[^\s/]+\\.tgz`),
    `${name.replace(/^@/, '').replace('/', '-')}-${version}.tgz`,
  ]),
  [
    /solidaris-plectrum-devkit-[^\s/]+\.tgz/,
    `solidaris-plectrum-devkit-${toolkit.version}.tgz`,
  ],
];

let next = current;
for (const [pattern, replacement] of updates) {
  if (!pattern.test(next)) throw new Error(`Missing consumer docs marker: ${pattern}`);
  next = next.replace(pattern, replacement);
}

if (process.argv.includes('--check')) {
  if (next !== current) {
    console.error(`${path} has stale package versions; run npm run docs:sync-release.`);
    process.exitCode = 1;
  }
} else if (next !== current) {
  writeFileSync(resolve(root, path), next);
  console.log(`Updated ${path} for runtime ${runtimeVersion} and toolkit ${toolkit.version}.`);
}
