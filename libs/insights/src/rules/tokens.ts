// Token pipeline: blocked Figma sync, code-owned proposals waiting for Figma.
import type { Recommendation } from '../insights.types';
import { ageDays, recommendation, SOURCES, type RuleContext } from './context';

/** token-sync-blocked: the Figma → code token sync is blocked. On main a proposed sync is merged, so only `blocked` fires. */
export function tokenSyncBlocked(ctx: RuleContext): Recommendation[] {
  const sync = ctx.data.repo.tokens.sync;
  if (sync?.stage !== 'blocked') return [];
  const failing = sync.checks.filter((check) => check.status !== 'success');
  const next: Recommendation['next'] = sync.runUrl ? { label: 'Open the sync run', url: sync.runUrl } : undefined;
  return [recommendation({
    rule: 'token-sync-blocked',
    subject: 'sync',
    severity: 'high',
    apps: 0,
    count: failing.length,
    title: failing.length ? `Token sync blocked by ${failing.map((check) => check.name).join(', ')}` : 'Token sync blocked',
    why: 'Figma token changes cannot reach the code until the failing checks are fixed.',
    evidence: [
      ...failing.map((check) => ({ label: check.name, value: check.status, source: SOURCES.syncReport })),
      { label: 'Sync run', value: sync.generatedAt.slice(0, 10), source: SOURCES.syncReport },
    ],
    target: { section: 'tokens-releases' },
    next,
    provenance: 'repository',
  })];
}

/** token-proposals-pending: code-owned token proposals not applied to Figma for too long. */
export function tokenProposalsPending(ctx: RuleContext): Recommendation[] {
  const { proposals } = ctx.data.repo.tokens;
  const age = ageDays(ctx.now, proposals.since);
  if (proposals.count <= 0 || age === null || age <= ctx.t.tokenProposalsPendingDays) return [];
  return [recommendation({
    rule: 'token-proposals-pending',
    subject: 'code-owned',
    severity: 'low',
    apps: 0,
    count: proposals.count,
    title: `${proposals.count} code-owned tokens have waited ${age} days for Figma`,
    why: 'These tokens exist only in code until the proposal is applied to a PrimeNG 21 Figma branch and reviewed.',
    evidence: [
      { label: 'Proposed tokens', value: proposals.count, source: SOURCES.proposals },
      { label: 'Pending since', value: proposals.since?.slice(0, 10) ?? 'unknown', source: `${SOURCES.proposals} (git history)` },
    ],
    target: { section: 'tokens-releases' },
    provenance: 'repository',
  })];
}
