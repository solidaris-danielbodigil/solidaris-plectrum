// Which documentation is this? The answer comes from the recorded release, never from
// manifest versions or a build flag: a verified release deploys `release.json` beside
// its versioned Storybook (tools/pages/assemble-releases.mjs). Without it, this is the
// development preview of main.
import toolkitPackage from '../../../../tools/devkit/package.json';
import registry from '../../../../.ai/contracts/registry.json';
import { PACKAGE_VERSION, RELEASE_PACKAGES } from './release-state';

export interface ReleaseManifest {
  schemaVersion: number;
  version: string;
  revision: string;
  publishedAt: string;
  registry: string;
  packages: readonly { name: string; version: string; integrity: string }[];
  contracts: { url: string; sha256: string; schemaVersion: number; version: string };
  toolkit: { toolkitVersion: string; status: string };
  documentation: string;
}

export type ReleaseContext =
  | { kind: 'release'; manifest: ReleaseManifest }
  | { kind: 'development'; reason: 'no-release-record' | 'mismatch'; manifest?: ReleaseManifest };

const storybookBase = registry.operations.storybook.replace(/\/$/, '');

export const DOCS_LINKS = {
  latest: `${storybookBase}/latest/`,
  development: `${storybookBase}/`,
  release: (runtime: string, toolkit: string) => `${storybookBase}/releases/${runtime}-devkit-${toolkit}/`,
} as const;

function isManifest(value: unknown): value is ReleaseManifest {
  const data = value as Partial<ReleaseManifest> | null;
  return (
    !!data &&
    data.schemaVersion === 1 &&
    typeof data.version === 'string' &&
    typeof data.revision === 'string' && /^[0-9a-f]{40}$/.test(data.revision) &&
    typeof data.publishedAt === 'string' && !Number.isNaN(Date.parse(data.publishedAt)) &&
    typeof data.registry === 'string' &&
    typeof data.documentation === 'string' &&
    typeof data.toolkit?.toolkitVersion === 'string' &&
    data.toolkit.status === 'verified' &&
    typeof data.contracts?.url === 'string' &&
    typeof data.contracts?.sha256 === 'string' && /^[0-9a-f]{64}$/.test(data.contracts.sha256) &&
    data.contracts.schemaVersion === 1 &&
    typeof data.contracts.version === 'string' &&
    Array.isArray(data.packages) &&
    data.packages.every((pkg) =>
      pkg !== null && typeof pkg === 'object' &&
      typeof pkg.name === 'string' &&
      typeof pkg.version === 'string' &&
      typeof pkg.integrity === 'string' && /^sha512-[A-Za-z0-9+/]{86}==$/.test(pkg.integrity),
    )
  );
}

/** A release record only counts when it describes the versions this Storybook was built from. */
export function releaseContextFrom(value: unknown, built = { runtime: PACKAGE_VERSION, toolkit: toolkitPackage.version }): ReleaseContext {
  if (!isManifest(value)) return { kind: 'development', reason: 'no-release-record' };
  const documentation = DOCS_LINKS.release(built.runtime, built.toolkit);
  const expected = new Map([
    ...RELEASE_PACKAGES.map((pkg) => [pkg.name, built.runtime] as const),
    [toolkitPackage.name, built.toolkit] as const,
  ]);
  const actual = new Map(value.packages.map((pkg) => [pkg.name, pkg.version] as const));
  if (
    value.version !== built.runtime ||
    value.toolkit.toolkitVersion !== built.toolkit ||
    value.registry !== registry.operations.registry ||
    value.documentation !== documentation ||
    value.contracts.url !== `${documentation}contracts.json` ||
    value.contracts.version !== built.runtime ||
    value.packages.length !== expected.size ||
    actual.size !== expected.size ||
    [...expected].some(([name, version]) => actual.get(name) !== version)
  ) {
    return { kind: 'development', reason: 'mismatch', manifest: value };
  }
  return { kind: 'release', manifest: value };
}

export async function loadReleaseContext(fetcher: typeof fetch | undefined = globalThis.fetch): Promise<ReleaseContext> {
  if (typeof fetcher !== 'function') return { kind: 'development', reason: 'no-release-record' };
  try {
    const response = await fetcher('./release.json', { cache: 'no-store' });
    if (!response.ok) return { kind: 'development', reason: 'no-release-record' };
    return releaseContextFrom(await response.json());
  } catch {
    return { kind: 'development', reason: 'no-release-record' };
  }
}
