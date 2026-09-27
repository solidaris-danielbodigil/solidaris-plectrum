#!/usr/bin/env node
// Verify the consumer instructions derive install filenames from manifests.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const packages = [
  JSON.parse(read('libs/ui/package.json')),
  JSON.parse(read('libs/plectrum/package.json')),
  JSON.parse(read('libs/styles/package.json')),
];
const [runtimeVersion] = [...new Set(packages.map(({ version }) => version))];
if (packages.some(({ version }) => version !== runtimeVersion)) {
  throw new Error('Runtime package versions differ; cannot update consumer install instructions.');
}

const path = 'libs/ui/src/docs/get-started-consume.mdx';
const current = read(path);
if (!current.includes('TARBALL_INSTALL') || !current.includes('tarballName(toolkitPackage.name, toolkitPackage.version)')) {
  throw new Error(`${path} must render package filenames from the manifests.`);
}
console.log(`Consumer install commands derive from runtime ${runtimeVersion} and the toolkit manifest.`);
