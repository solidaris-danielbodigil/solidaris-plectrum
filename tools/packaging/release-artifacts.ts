#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishedContractSchema, releaseManifestSchema } from '../../.ai/contracts/schema/exchange.schema';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.join(root, 'dist/release');
const read = (relative: string) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const write = (name: string, value: unknown) => fs.writeFileSync(path.join(output, name), `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (data: Buffer) => createHash('sha256').update(data).digest('hex');
const sha512 = (data: Buffer) => `sha512-${createHash('sha512').update(data).digest('base64')}`;

export function releaseArtifacts(revision: string, publishedAt?: string) {
  if (!/^[0-9a-f]{40}$/.test(revision)) throw new Error('Release source revision must be a full commit SHA.');
  const registry = read('.ai/contracts/registry.json');
  const compatibility = read('.ai/contracts/compatibility.json');
  const catalogue = read('tools/devkit/assets/catalogue.json');
  const manifests = [
    read('libs/ui/package.json'),
    read('libs/plectrum/package.json'),
    read('libs/styles/package.json'),
    read('tools/devkit/package.json'),
  ];
  const runtimeVersion = manifests[0].version as string;
  if (manifests.slice(0, 3).some((pkg) => pkg.version !== runtimeVersion)) throw new Error('Runtime versions differ.');
  if (compatibility.toolkitVersion !== manifests[3].version || compatibility.status !== 'verified') throw new Error('Toolkit compatibility is not verified for the packed version.');
  if (catalogue.toolkitVersion !== manifests[3].version) throw new Error('Toolkit catalogue snapshot version differs from the package.');
  const storybook = registry.operations.storybook.replace(/\/$/, '');
  const releaseId = `${runtimeVersion}-devkit-${manifests[3].version}`;
  const documentation = `${storybook}/releases/${releaseId}/`;
  const components = catalogue.components
    .filter((item: any) => item.metadata.governance.status === 'core')
    .map((item: any) => {
      if (!item.docs.versionedUrlTemplate || item.package.version !== runtimeVersion) throw new Error(`${item.id}: missing matching versioned documentation or package.`);
      return {
        id: item.id,
        metadata: item.metadata,
        source: { ...item.source, revision },
        package: item.package,
        docs: { url: item.docs.versionedUrlTemplate.replace('{version}', runtimeVersion).replace('{toolkitVersion}', manifests[3].version), sourcePath: item.docs.sourcePath },
      };
    });
  const contracts = publishedContractSchema.parse({
    schemaVersion: 1,
    version: runtimeVersion,
    repository: registry.repository,
    revision,
    documentation,
    components,
  });
  const contractBytes = Buffer.from(`${JSON.stringify(contracts, null, 2)}\n`);
  const packages = manifests.map((pkg) => {
    if (!pkg.name.startsWith(`${registry.operations.publicationScope}/`) || pkg.repository !== registry.repository || pkg.publishConfig?.registry !== registry.operations.registry) throw new Error(`${pkg.name}: package ownership or registry mismatch.`);
    const filename = `${pkg.name.slice(1).replace('/', '-')}-${pkg.version}.tgz`;
    const archive = path.join(root, 'tools/packaging/.tarballs', filename);
    if (!fs.existsSync(archive)) throw new Error(`Missing packed release artifact: ${filename}`);
    return { name: pkg.name, version: pkg.version, filename, integrity: sha512(fs.readFileSync(archive)) };
  });
  const release = publishedAt ? releaseManifestSchema.parse({
    schemaVersion: 1,
    version: runtimeVersion,
    revision,
    publishedAt,
    registry: registry.operations.registry,
    packages: packages.map(({ name, version, integrity }) => ({ name, version, integrity })),
    contracts: {
      url: `${documentation}contracts.json`,
      sha256: sha256(contractBytes),
      schemaVersion: 1,
      version: runtimeVersion,
    },
    toolkit: compatibility,
    documentation,
  }) : null;
  return { contracts, contractBytes, packages, release, documentation, runtimeVersion, releaseId };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const phase = process.argv[2];
  if (!['prepare', 'finalize'].includes(phase)) throw new Error('Usage: release-artifacts.ts prepare|finalize');
  const revision = process.env['GITHUB_SHA'] ?? execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const publishedAt = phase === 'finalize' ? (process.env['PLECTRUM_PUBLISHED_AT'] ?? new Date().toISOString()) : undefined;
  const artifacts = releaseArtifacts(revision, publishedAt);
  if (process.env['PLECTRUM_RELEASE_ID'] && process.env['PLECTRUM_RELEASE_ID'] !== artifacts.releaseId) {
    throw new Error(`Requested release ${process.env['PLECTRUM_RELEASE_ID']} differs from built ${artifacts.releaseId}.`);
  }
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'contracts.json'), artifacts.contractBytes);
  write('package-artifacts.json', artifacts.packages);
  if (artifacts.release) write('release.json', artifacts.release);
  console.log(`${phase}: ${artifacts.packages.length} packages, ${artifacts.contracts.components.length} Core contracts, source ${revision}, docs ${artifacts.documentation}`);
}
