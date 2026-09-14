// =============================================================================
// libs/ui/src/storybook/changelog.types.ts
// Shapes written by `tools/scripts/changelog-to-ts.mjs` (changelog.generated.ts)
// and the mappers the Docs/What's new figures use.
//
// A changeset is one pending `.changeset/*.md`; a release is one `## version`
// block of a `libs/*/CHANGELOG.md`. Bumps map onto PrimeNG severities so Tag
// paints them with Plectrum's own colours: major → danger, minor → warn,
// patch → info.
// =============================================================================

export type ChangelogBump = 'major' | 'minor' | 'patch';

export type BumpSeverity = 'danger' | 'warn' | 'info';

export interface ChangelogPackageBump {
  packageName: string;
  bump: ChangelogBump;
}

/** One pending `.changeset/{id}.md`. */
export interface ChangelogChangeset {
  id: string;
  bumps: readonly ChangelogPackageBump[];
  summary: string;
}

export interface ChangelogChange {
  bump: ChangelogBump;
  text: string;
}

/** One `## version` block of a package CHANGELOG.md. */
export interface ChangelogRelease {
  packageName: string;
  version: string;
  changes: readonly ChangelogChange[];
  /** Markdown of the block that did not parse into `changes` (empty when everything did). */
  notes: string;
}

/** Releases of the same version across packages, deduplicated for the timeline. */
export interface ChangelogVersion {
  version: string;
  packageNames: readonly string[];
  changes: readonly ChangelogChange[];
  notes: readonly string[];
}

const BUMP_ORDER: Readonly<Record<ChangelogBump, number>> = {
  patch: 0,
  minor: 1,
  major: 2,
};

const BUMP_SEVERITY: Readonly<Record<ChangelogBump, BumpSeverity>> = {
  major: 'danger',
  minor: 'warn',
  patch: 'info',
};

const BUMP_LABEL: Readonly<Record<ChangelogBump, string>> = {
  major: 'Major',
  minor: 'Minor',
  patch: 'Patch',
};

export function bumpSeverity(bump: ChangelogBump): BumpSeverity {
  return BUMP_SEVERITY[bump];
}

export function bumpLabel(bump: ChangelogBump): string {
  return BUMP_LABEL[bump];
}

export function compareBumps(a: ChangelogBump, b: ChangelogBump): number {
  return BUMP_ORDER[a] - BUMP_ORDER[b];
}

/** The highest bump in a list, or `null` when the list is empty. */
export function highestBump(
  bumps: readonly ChangelogBump[],
): ChangelogBump | null {
  return bumps.reduce<ChangelogBump | null>(
    (max, bump) => (max === null || compareBumps(bump, max) > 0 ? bump : max),
    null,
  );
}

/**
 * The bump every package of a changeset shares, or `null` when they differ.
 * Fixed version groups (.changeset/config.json) always share one.
 */
export function uniformBump(changeset: ChangelogChangeset): ChangelogBump | null {
  const [first, ...rest] = changeset.bumps;
  if (!first) return null;
  return rest.every((entry) => entry.bump === first.bump) ? first.bump : null;
}

/** What the next version PR bumps: the highest pending bump per package, in first-seen order. */
export function nextReleaseBumps(
  changesets: readonly ChangelogChangeset[],
): readonly ChangelogPackageBump[] {
  const byPackage = new Map<string, ChangelogBump>();
  for (const changeset of changesets) {
    for (const { packageName, bump } of changeset.bumps) {
      const current = byPackage.get(packageName);
      if (!current || compareBumps(bump, current) > 0) {
        byPackage.set(packageName, bump);
      }
    }
  }
  return [...byPackage].map(([packageName, bump]) => ({ packageName, bump }));
}

/** Semver descending; non-numeric identifiers fall back to a string compare. */
export function compareVersionsDesc(a: string, b: string): number {
  const partsA = a.split(/[.+-]/);
  const partsB = b.split(/[.+-]/);
  const length = Math.max(partsA.length, partsB.length);
  for (let index = 0; index < length; index += 1) {
    const partA = partsA[index] ?? '';
    const partB = partsB[index] ?? '';
    if (partA === partB) continue;
    const numberA = Number(partA);
    const numberB = Number(partB);
    if (Number.isFinite(numberA) && Number.isFinite(numberB)) {
      return numberB - numberA;
    }
    return partB.localeCompare(partA);
  }
  return 0;
}

/**
 * Group releases by version, newest first. Packages in a fixed group publish
 * the same entries into each CHANGELOG.md, so identical changes collapse to one.
 */
export function groupReleasesByVersion(
  releases: readonly ChangelogRelease[],
): readonly ChangelogVersion[] {
  const byVersion = new Map<
    string,
    { packageNames: string[]; changes: ChangelogChange[]; notes: string[] }
  >();

  for (const release of releases) {
    const group = byVersion.get(release.version) ?? {
      packageNames: [],
      changes: [],
      notes: [],
    };
    if (!group.packageNames.includes(release.packageName)) {
      group.packageNames.push(release.packageName);
    }
    for (const change of release.changes) {
      const duplicate = group.changes.some(
        (existing) =>
          existing.bump === change.bump && existing.text === change.text,
      );
      if (!duplicate) group.changes.push(change);
    }
    if (release.notes && !group.notes.includes(release.notes)) {
      group.notes.push(release.notes);
    }
    byVersion.set(release.version, group);
  }

  return [...byVersion]
    .sort(([a], [b]) => compareVersionsDesc(a, b))
    .map(([version, group]) => ({
      version,
      packageNames: group.packageNames,
      changes: [...group.changes].sort((a, b) => compareBumps(b.bump, a.bump)),
      notes: group.notes,
    }));
}
