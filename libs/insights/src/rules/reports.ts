// Usage reports: stale, missing, and the Plectrum version they declare.
import type { Recommendation } from '../insights.types';
import { ageDays, recommendation, SOURCES, usageSource, type RuleContext } from './context';

/** stale-report: the latest report of an application is older than staleAfterDays. */
export function staleReport(ctx: RuleContext): Recommendation[] {
  const out: Recommendation[] = [];
  for (const app of ctx.usage.applications) {
    const age = ageDays(ctx.now, app.reportedAt);
    if (age === null || age <= ctx.usage.staleAfterDays) continue;
    out.push(recommendation({
      rule: 'stale-report',
      subject: app.id,
      severity: 'medium',
      apps: 1,
      count: age - ctx.usage.staleAfterDays,
      title: `${app.label} usage report is ${age} days old`,
      why: `Figures for ${app.label} are out of date. Ask the ${app.team} team to run the adoption report in CI again.`,
      evidence: [
        { label: 'Last report', value: app.reportedAt?.slice(0, 10) ?? 'never', source: usageSource(ctx, app.id, 'report') },
        { label: 'Stale after', value: `${ctx.usage.staleAfterDays} days`, source: 'tools/adoption/records.ts (STALE_AFTER_DAYS)' },
      ],
      target: { section: 'adoption', app: app.id },
      provenance: ctx.source,
    }));
  }
  return out;
}

/** missing-report: an external application never sent a report (local demo apps are scanned instead). */
export function missingReport(ctx: RuleContext): Recommendation[] {
  return ctx.usage.applications.filter((app) => app.kind === 'external' && !app.reportedAt && app.reports === 0).map((app) => recommendation({
    rule: 'missing-report',
    subject: app.id,
    severity: 'low',
    apps: 1,
    count: 0,
    title: `${app.label} has not sent a usage report`,
    why: `Core cannot see how ${app.label} uses Plectrum. Help the ${app.team} team add the adoption report to CI.`,
    evidence: [
      { label: 'Reports', value: 0, source: `.ai/adoption/${app.id}.json` },
      { label: 'Application', value: `${app.label} (${app.team})`, source: '.ai/contracts/registry.json' },
    ],
    target: { section: 'adoption', app: app.id },
    provenance: ctx.source,
  }));
}

function parseVersion(version: string | null | undefined): [number, number, number] | null {
  const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(version ?? '');
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
}

/** outdated-runtime: an application runs a Plectrum minor (medium) or major (high) behind. */
export function outdatedRuntime(ctx: RuleContext): Recommendation[] {
  const current = parseVersion(ctx.data.versions.runtime);
  if (!current) return [];
  const out: Recommendation[] = [];
  for (const app of ctx.usage.applications) {
    const used = parseVersion(app.packageVersion);
    if (!used) continue;
    const majorBehind = current[0] - used[0];
    const minorBehind = majorBehind === 0 ? current[1] - used[1] : 0;
    if (majorBehind < 0 || (majorBehind === 0 && minorBehind <= 0)) continue;
    out.push(recommendation({
      rule: 'outdated-runtime',
      subject: app.id,
      severity: majorBehind > 0 ? 'high' : 'medium',
      apps: 1,
      count: majorBehind > 0 ? majorBehind * 10 : minorBehind,
      title: `${app.label} runs Plectrum ${app.packageVersion}, current is ${ctx.data.versions.runtime}`,
      why: majorBehind > 0
        ? `${app.label} is a major version behind and misses breaking-change migrations. Plan the upgrade with the ${app.team} team.`
        : `${app.label} misses ${minorBehind === 1 ? 'a minor release' : `${minorBehind} minor releases`} of fixes and components. Upgrading is non-breaking.`,
      evidence: [
        { label: `${app.label} version`, value: app.packageVersion ?? 'unknown', source: usageSource(ctx, app.id, 'report') },
        { label: 'Current runtime', value: ctx.data.versions.runtime, source: SOURCES.runtime },
      ],
      target: { section: 'adoption', app: app.id },
      provenance: ctx.source,
    }));
  }
  return out;
}
