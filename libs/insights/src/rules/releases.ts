// Releases: pending changesets waiting for a release.
import type { Recommendation } from '../insights.types';
import { ageDays, plural, recommendation, SOURCES, type RuleContext } from './context';

const BUMP_ORDER = { major: 3, minor: 2, patch: 1 } as const;

/** release-due: changesets pending for too long (low), or no tag for too long while changesets are pending (medium). */
export function releaseDue(ctx: RuleContext): Recommendation[] {
  const { pending, tags } = ctx.data.repo.releases;
  if (pending.length === 0) return [];
  const oldest = pending.map((item) => item.since).filter((since) => !Number.isNaN(Date.parse(since))).sort()[0] ?? null;
  const pendingAge = ageDays(ctx.now, oldest);
  const lastTag = [...tags].sort((a, b) => Date.parse(a.at) - Date.parse(b.at)).at(-1);
  const tagAge = lastTag ? ageDays(ctx.now, lastTag.at) : null;
  const tagOverdue = !lastTag || (tagAge !== null && tagAge > ctx.t.releaseLastTagDays);
  const pendingOverdue = pendingAge !== null && pendingAge > ctx.t.releasePendingDays;
  if (!tagOverdue && !pendingOverdue) return [];
  const bump = pending.flatMap((item) => item.bumps).reduce<'major' | 'minor' | 'patch' | null>(
    (max, item) => (max === null || BUMP_ORDER[item.bump] > BUMP_ORDER[max] ? item.bump : max), null);
  return [recommendation({
    rule: 'release-due',
    subject: 'pending',
    severity: tagOverdue ? 'medium' : 'low',
    apps: 0,
    count: pending.length,
    title: `Release ${plural(pending.length, 'pending changeset')}`,
    why: tagOverdue
      ? `No release for ${lastTag ? `${tagAge} days` : 'ever'} while changes wait; teams do not get the fixes.`
      : `The oldest changeset waits for ${pendingAge} days; release so teams get the changes.`,
    evidence: [
      ...pending.map((item) => ({ label: item.id, value: item.bumps.map((b) => `${b.packageName} ${b.bump}`).join(', ') || 'no bump', source: `.changeset/${item.id}.md` })),
      { label: 'Highest bump', value: bump ?? 'none', source: '.changeset/*.md' },
      { label: 'Oldest pending', value: oldest ? `${oldest.slice(0, 10)} (${pendingAge} days)` : 'unknown', source: '.changeset/*.md (git history)' },
      { label: 'Last tag', value: lastTag ? `${lastTag.tag} (${tagAge} days)` : 'none', source: SOURCES.tags },
    ],
    target: { section: 'tokens-releases' },
    provenance: 'repository',
  })];
}
