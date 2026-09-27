#!/usr/bin/env node
// Publish the already smoke-tested tarballs. A retry skips a version only when
// the registry returns the same immutable tarball integrity.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPackageVisibility } from './private-package-visibility.mjs';

const root = resolve(import.meta.dirname, '../..');
const registry = JSON.parse(readFileSync(resolve(root, '.ai/contracts/registry.json'), 'utf8'));
const artifacts = JSON.parse(readFileSync(resolve(root, 'dist/release/package-artifacts.json'), 'utf8'));
const expectedRepo = new URL(registry.repository).pathname.slice(1);
const owner = registry.operations.publicationScope.slice(1);

export function publicationDecision(remote, local) {
  if (remote === null) return 'publish';
  if (remote === local) return 'skip';
  throw new Error('Registry version exists with different integrity; immutable release cannot be retried.');
}

function npm(args) {
  const result = spawnSync('npm', args, { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' });
  return { status: result.status, stdout: result.stdout ?? '', output: `${result.stdout ?? ''}\n${result.stderr ?? ''}` };
}

function remoteIntegrity(pkg) {
  const result = npm(['view', `${pkg.name}@${pkg.version}`, 'dist.integrity', '--registry', registry.operations.registry, '--json']);
  if (result.status === 0) {
    const value = JSON.parse(result.stdout.trim());
    if (typeof value !== 'string') throw new Error(`${pkg.name}: unexpected registry integrity response.`);
    return value;
  }
  if (/\bE404\b|404 Not Found/.test(result.output)) return null;
  throw new Error(`${pkg.name}: registry lookup failed before publication. ${result.output.trim()}`);
}

async function main() {
  if (process.argv[2] !== '--publish' || process.env['GITHUB_ACTIONS'] !== 'true' || process.env['GITHUB_REF'] !== 'refs/heads/main' || process.env['GITHUB_REPOSITORY'] !== expectedRepo || owner !== 'solidaris-danielbodigil' || registry.operations.visibility !== 'private' || !process.env['NODE_AUTH_TOKEN'] || process.env['NODE_AUTH_TOKEN'] !== process.env['PLECTRUM_PACKAGE_PUBLISH_TOKEN'] || process.env['NODE_AUTH_TOKEN'] === process.env['GITHUB_TOKEN']) {
    throw new Error('Private publication requires --publish on protected main with the separate personal-account package PAT.');
  }
  for (const pkg of artifacts) {
    const decision = publicationDecision(remoteIntegrity(pkg), pkg.integrity);
    if (decision === 'publish') {
      const archive = resolve(root, 'tools/packaging/.tarballs', pkg.filename);
      const result = npm(['publish', archive, '--registry', registry.operations.registry, '--access', 'restricted', '--ignore-scripts']);
      if (result.status !== 0) throw new Error(`${pkg.name}@${pkg.version}: publication failed. ${result.output.trim()}`);
      console.log(`Published ${pkg.name}@${pkg.version}.`);
    } else {
      console.log(`Verified existing ${pkg.name}@${pkg.version}; skipping immutable version.`);
    }
    let confirmed = false;
    for (let attempt = 0; attempt < 8; attempt++) {
      if (remoteIntegrity(pkg) === pkg.integrity) { confirmed = true; break; }
      await new Promise((done) => setTimeout(done, 2000));
    }
    if (!confirmed) throw new Error(`${pkg.name}@${pkg.version}: published artifact integrity did not match the packed archive.`);
    let visibility = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      visibility = await readPackageVisibility(pkg.name, owner, process.env['PLECTRUM_PACKAGE_PUBLISH_TOKEN']);
      if (visibility) break;
      await new Promise((done) => setTimeout(done, 2000));
    }
    if (visibility !== 'private') throw new Error(`${pkg.name}: expected private GitHub Packages visibility, received ${visibility ?? 'no package record'}. Stopping before the next package.`);
    console.log(`Verified ${pkg.name} is private.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
