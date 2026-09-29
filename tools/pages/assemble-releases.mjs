#!/usr/bin/env node
// Assemble verified GitHub Release bundles into one atomic Pages artifact.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { latestRedirectHtml } from './latest-redirect.mjs';

const root = resolve(import.meta.dirname, '../..');
const pages = join(root, 'dist/pages/storybook');
const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repository || !token || process.env.GITHUB_ACTIONS !== 'true') throw new Error('Versioned Pages assembly requires repository read access in Actions.');
const registry = JSON.parse(readFileSync(join(root, '.ai/contracts/registry.json'), 'utf8'));
const digest = (data) => createHash('sha256').update(data).digest('hex');
const releases = [];
for (let page = 1; ; page++) {
  const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  if (!response.ok) throw new Error(`Release listing failed: HTTP ${response.status}`);
  const batch = await response.json();
  releases.push(...batch.filter((release) => !release.draft && /^plectrum-v\d+\.\d+\.\d+-devkit-\d+\.\d+\.\d+$/.test(release.tag_name)));
  if (batch.length < 100) break;
}
let latest = null;
for (const release of releases) {
  const id = release.tag_name.slice('plectrum-v'.length);
  const expected = ['storybook.tar.gz', 'storybook.sha256', 'release.json', 'contracts.json'];
  if (expected.some((name) => !release.assets.some((asset) => asset.name === name))) throw new Error(`${release.tag_name}: incomplete public release assets.`);
  const temp = mkdtempSync(join(tmpdir(), 'plectrum-pages-release-'));
  for (const name of expected) {
    execFileSync('gh', ['release', 'download', release.tag_name, '--repo', repository, '--pattern', name, '--dir', temp], { cwd: root, stdio: 'pipe', env: { ...process.env, GH_TOKEN: token } });
  }
  const archive = readFileSync(join(temp, 'storybook.tar.gz'));
  if (readFileSync(join(temp, 'storybook.sha256'), 'utf8') !== `${digest(archive)}  storybook.tar.gz\n`) throw new Error(`${release.tag_name}: Storybook archive checksum differs.`);
  const manifest = JSON.parse(readFileSync(join(temp, 'release.json'), 'utf8'));
  const contracts = readFileSync(join(temp, 'contracts.json'));
  if (manifest.version + '-devkit-' + manifest.toolkit.toolkitVersion !== id || manifest.contracts.sha256 !== digest(contracts) || manifest.documentation !== `${registry.operations.storybook.replace(/\/$/, '')}/releases/${id}/`) {
    throw new Error(`${release.tag_name}: release manifest, contracts or documentation route differs.`);
  }
  const contractData = JSON.parse(contracts.toString());
  if (contractData.revision !== manifest.revision || contractData.version !== manifest.version) throw new Error(`${release.tag_name}: contract provenance differs.`);
  const entries = execFileSync('tar', ['-tzf', join(temp, 'storybook.tar.gz')], { encoding: 'utf8' }).trim().split(/\r?\n/);
  if (entries.some((entry) => entry.startsWith('/') || entry.split('/').includes('..') || entry.includes('\\'))) throw new Error(`${release.tag_name}: unsafe archive path.`);
  const target = resolve(pages, 'releases', id);
  if (!target.startsWith(resolve(pages) + sep)) throw new Error('Versioned Storybook path escaped Pages root.');
  mkdirSync(target, { recursive: true });
  execFileSync('tar', ['-xzf', join(temp, 'storybook.tar.gz'), '-C', target], { stdio: 'pipe' });
  cpSync(join(temp, 'release.json'), join(target, 'release.json'));
  cpSync(join(temp, 'contracts.json'), join(target, 'contracts.json'));
  if (!latest || Date.parse(manifest.publishedAt) > Date.parse(latest.publishedAt)) latest = { id, publishedAt: manifest.publishedAt };
}
if (latest) {
  const target = join(pages, 'latest');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'index.html'), latestRedirectHtml(latest.id));
  console.log(`Released latest points to ${latest.id}; ${releases.length} versioned Storybook bundle(s) verified.`);
} else console.log('No published Plectrum release yet; deploying the labelled development preview only.');
