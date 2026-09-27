#!/usr/bin/env node
// Stage a draft GitHub Release, verify/reuse existing assets on retry, then
// publish it and request a Pages rebuild. Never overwrite an existing asset.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const revision = process.env.GITHUB_SHA;
const configuredRepository = new URL(JSON.parse(readFileSync(resolve(root, '.ai/contracts/registry.json'), 'utf8')).repository).pathname.slice(1);
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REF !== 'refs/heads/main' || !token || repository !== configuredRepository || !revision) {
  throw new Error('GitHub Release publication requires the authenticated protected-main workflow.');
}
const releaseFile = resolve(root, 'dist/release/release.json');
const contractsFile = resolve(root, 'dist/release/contracts.json');
const archiveFile = resolve(root, 'dist/release/storybook.tar.gz');
const manifest = JSON.parse(readFileSync(releaseFile, 'utf8'));
const contracts = readFileSync(contractsFile);
const archive = readFileSync(archiveFile);
const digest = (data) => createHash('sha256').update(data).digest('hex');
const releaseId = `${manifest.version}-devkit-${manifest.toolkit.toolkitVersion}`;
const tag = `plectrum-v${releaseId}`;
if (manifest.revision !== revision || manifest.contracts.sha256 !== digest(contracts) || !manifest.documentation.endsWith(`/releases/${releaseId}/`)) {
  throw new Error('Release manifest, contract snapshot and source revision disagree.');
}
const api = async (endpoint, method = 'GET', body) => {
  const response = await fetch(`https://api.github.com/repos/${repository}/${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 404 && method === 'GET') return null;
  if (!response.ok) throw new Error(`GitHub ${method} ${endpoint}: HTTP ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
};
let ref = await api(`git/ref/tags/${encodeURIComponent(tag)}`);
if (!ref) {
  ref = await api('git/refs', 'POST', { ref: `refs/tags/${tag}`, sha: revision });
}
if (ref.object.type !== 'commit' || ref.object.sha !== revision) throw new Error(`${tag} does not point to the verified release revision.`);
let release = null;
for (let page = 1; !release; page++) {
  const batch = await api(`releases?per_page=100&page=${page}`);
  release = batch.find((item) => item.tag_name === tag) ?? null;
  if (batch.length < 100) break;
}
if (!release) {
  release = await api('releases', 'POST', {
    tag_name: tag,
    target_commitish: revision,
    name: `Plectrum ${manifest.version} · toolkit ${manifest.toolkit.toolkitVersion}`,
    body: `Verified packages and Storybook from ${revision}. See release.json for provenance and checksums.`,
    draft: true,
    prerelease: false,
  });
}
const existing = new Map(release.assets.map((asset) => [asset.name, asset]));
const temp = mkdtempSync(join(tmpdir(), 'plectrum-release-assets-'));
const download = (name) => {
  execFileSync('gh', ['release', 'download', tag, '--repo', repository, '--pattern', name, '--dir', temp, '--clobber'], { cwd: root, stdio: 'pipe', env: { ...process.env, GH_TOKEN: token } });
  return readFileSync(join(temp, name));
};
const upload = async (name, bytes) => {
  if (!release.draft) throw new Error(`${tag} is already public but lacks ${name}; published releases cannot be patched automatically.`);
  const url = `${release.upload_url.split('{')[0]}?name=${encodeURIComponent(name)}`;
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/octet-stream', 'X-GitHub-Api-Version': '2022-11-28' }, body: bytes });
  if (!response.ok) throw new Error(`Upload ${name}: HTTP ${response.status} ${await response.text()}`);
  console.log(`Uploaded ${name}.`);
};
const verifyOrUpload = async (name, bytes, compatible) => {
  if (existing.has(name)) {
    const remote = download(name);
    if (!compatible(remote, bytes)) throw new Error(`${tag}/${name} differs from this verified release; refusing overwrite.`);
    console.log(`Verified existing ${name}.`);
  } else await upload(name, bytes);
};
const sameBytes = (left, right) => digest(left) === digest(right);
await verifyOrUpload('contracts.json', contracts, sameBytes);
const storybook = existing.has('storybook.tar.gz') ? download('storybook.tar.gz') : archive;
await verifyOrUpload('storybook.tar.gz', storybook, sameBytes);
await verifyOrUpload('storybook.sha256', Buffer.from(`${digest(storybook)}  storybook.tar.gz\n`), sameBytes);
await verifyOrUpload('release.json', readFileSync(releaseFile), (remote, local) => {
  const old = JSON.parse(remote.toString());
  const next = JSON.parse(local.toString());
  const { publishedAt: oldDate, ...oldFacts } = old;
  const { publishedAt: nextDate, ...nextFacts } = next;
  if (!oldDate || !nextDate) return false;
  if (JSON.stringify(oldFacts) !== JSON.stringify(nextFacts)) return false;
  writeFileSync(releaseFile, remote);
  return true;
});
if (release.draft) {
  release = await api(`releases/${release.id}`, 'PATCH', { draft: false });
  console.log(`Published verified GitHub Release ${tag}.`);
}
await api('dispatches', 'POST', { event_type: 'PLECTRUM_RELEASED', client_payload: { revision, releaseId } });
console.log(`Requested Pages deployment for ${tag}.`);
