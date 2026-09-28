#!/usr/bin/env node
// Run by changeset:version. Consumer install commands and filenames are rendered from the
// manifests (libs/ui/src/storybook/release-state.ts, process-docs.ts), so a version bump
// needs no docs edit. This only verifies that the runtime versions still agree.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const packages = ['libs/ui', 'libs/plectrum', 'libs/styles'].map((dir) => JSON.parse(read(`${dir}/package.json`)));
const versions = new Set(packages.map(({ version }) => version));
if (versions.size !== 1) {
  throw new Error(`Runtime package versions differ: ${packages.map(({ name, version }) => `${name}@${version}`).join(', ')}`);
}
const releaseState = read('libs/ui/src/storybook/release-state.ts');
if (!releaseState.includes('RELEASE_PACKAGES.map') || !releaseState.includes('tarballName(')) {
  throw new Error('release-state.ts must derive tarball install commands from the manifests.');
}
console.log(`Consumer install commands derive from runtime ${[...versions][0]} and the toolkit manifest.`);
