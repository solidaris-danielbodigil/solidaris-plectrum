import { loadReleaseContext, releaseContextFrom, type ReleaseManifest } from './release-context';
import registry from '../../../../.ai/contracts/registry.json';
import toolkitPackage from '../../../../tools/devkit/package.json';
import { RELEASE_PACKAGES } from './release-state';

const built = { runtime: '9.9.9', toolkit: '1.2.3' };
const documentation = `${registry.operations.storybook.replace(/\/$/, '')}/releases/${built.runtime}-devkit-${built.toolkit}/`;
const integrity = `sha512-${'A'.repeat(86)}==`;

const manifest: ReleaseManifest = {
  schemaVersion: 1,
  version: built.runtime,
  revision: 'a'.repeat(40),
  publishedAt: '2026-09-28T10:00:00.000Z',
  registry: registry.operations.registry,
  packages: [
    ...RELEASE_PACKAGES.map(({ name }) => ({ name, version: built.runtime, integrity })),
    { name: toolkitPackage.name, version: built.toolkit, integrity },
  ],
  contracts: { url: `${documentation}contracts.json`, sha256: 'b'.repeat(64), schemaVersion: 1, version: built.runtime },
  toolkit: { toolkitVersion: built.toolkit, status: 'verified' },
  documentation,
};

describe('release context', () => {
  it('is a release only when the record describes the built versions', () => {
    expect(releaseContextFrom(manifest, built).kind).toBe('release');
    expect(releaseContextFrom({ ...manifest, version: '9.9.8' }, built)).toMatchObject({ kind: 'development', reason: 'mismatch' });
    expect(releaseContextFrom({ ...manifest, toolkit: { ...manifest.toolkit, toolkitVersion: '1.2.4' } }, built)).toMatchObject({ kind: 'development', reason: 'mismatch' });
  });

  it('rejects a release record with missing, duplicate or mismatched packages', () => {
    expect(releaseContextFrom({ ...manifest, packages: [] }, built).kind).toBe('development');
    expect(releaseContextFrom({ ...manifest, packages: [...manifest.packages.slice(0, -1), manifest.packages[0]] }, built).kind).toBe('development');
    expect(releaseContextFrom({ ...manifest, packages: [{ ...manifest.packages[0], version: '9.9.8' }, ...manifest.packages.slice(1)] }, built).kind).toBe('development');
    expect(releaseContextFrom({ ...manifest, packages: [{ ...manifest.packages[0], integrity: '' }, ...manifest.packages.slice(1)] }, built).kind).toBe('development');
  });

  it('rejects a record for another registry or documentation route', () => {
    expect(releaseContextFrom({ ...manifest, registry: 'https://registry.npmjs.org' }, built).kind).toBe('development');
    expect(releaseContextFrom({ ...manifest, documentation: 'https://example.test/other/' }, built).kind).toBe('development');
    expect(releaseContextFrom({ ...manifest, contracts: { ...manifest.contracts, version: '9.9.8' } }, built).kind).toBe('development');
  });

  it('treats a missing or malformed record as the development preview', async () => {
    expect(releaseContextFrom(null, built)).toEqual({ kind: 'development', reason: 'no-release-record' });
    expect(releaseContextFrom({ version: '9.9.9' }, built).kind).toBe('development');
    expect(releaseContextFrom({ ...manifest, registry: undefined }, built).kind).toBe('development');
    expect(releaseContextFrom({ ...manifest, revision: 'not-a-sha' }, built).kind).toBe('development');
    const missing = (async () => new Response('', { status: 404 })) as typeof fetch;
    expect(await loadReleaseContext(missing)).toEqual({ kind: 'development', reason: 'no-release-record' });
    const broken = (async () => { throw new Error('offline'); }) as typeof fetch;
    expect((await loadReleaseContext(broken)).kind).toBe('development');
  });
});
