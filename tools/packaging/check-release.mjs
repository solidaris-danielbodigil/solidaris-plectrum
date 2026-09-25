#!/usr/bin/env node
// Verify the exact local artifacts intended for the first GitHub Packages release.
// This is a read-only gate: it never contacts a registry or publishes a version.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const readJson = (relative) => JSON.parse(readFileSync(join(root, relative), 'utf8'));
const registry = readJson('.ai/contracts/registry.json');
const { publicationScope, registry: registryUrl, visibility } = registry.operations;
if (registryUrl !== 'https://npm.pkg.github.com' || visibility !== 'private') {
  throw new Error('Release target differs from the reviewed private GitHub Packages configuration.');
}
const packages = [
  ['libs/ui/package.json', 'dist/libs/ui/package.json'],
  ['libs/plectrum/package.json', 'dist/libs/plectrum/package.json'],
  ['libs/styles/package.json', 'libs/styles/package.json'],
  ['tools/devkit/package.json', 'tools/devkit/package.json'],
];
const runtimeVersions = new Set();
const artifacts = [];
for (const [sourcePath, packedPath] of packages) {
  const source = readJson(sourcePath);
  const packed = readJson(packedPath);
  if (!source.name.startsWith(`${publicationScope}/`) || packed.name !== source.name || packed.version !== source.version) {
    throw new Error(`${sourcePath}: packed name/version must match the configured publication scope and source manifest.`);
  }
  if (packed.publishConfig?.registry !== registryUrl || packed.publishConfig?.access !== 'restricted' || packed.repository !== registry.repository) {
    throw new Error(`${packedPath}: registry, visibility or source repository linkage differs from the reviewed configuration.`);
  }
  if (sourcePath !== 'tools/devkit/package.json') runtimeVersions.add(source.version);
  const filename = `${source.name.slice(1).replace('/', '-')}-${source.version}.tgz`;
  const archive = join(root, 'tools/packaging/.tarballs', filename);
  if (!existsSync(archive) || !statSync(archive).size || statSync(archive).size >= 256 * 1024 * 1024) {
    throw new Error(`${filename}: missing, empty or above GitHub Packages' 256 MB npm limit.`);
  }
  const integrity = `sha512-${createHash('sha512').update(readFileSync(archive)).digest('base64')}`;
  artifacts.push({ name: source.name, version: source.version, filename, integrity });
}
if (runtimeVersions.size !== 1) throw new Error(`Runtime package versions are not fixed: ${[...runtimeVersions].join(', ')}`);
const compatibility = readJson('.ai/contracts/compatibility.json');
if (compatibility.toolkitVersion !== artifacts[3].version || compatibility.status !== 'verified') {
  throw new Error('Toolkit artifact differs from the verified compatibility declaration.');
}
console.log(`Release artifacts ready for private GitHub Packages: ${artifacts.map(({ name, version }) => `${name}@${version}`).join(', ')}.`);
