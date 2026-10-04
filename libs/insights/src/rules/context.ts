// Shared input and helpers of the recommendation rules. Pure: no node or
// Angular imports.
import type {
  AgentPoint,
  ComponentFact,
  DrillTarget,
  PlectrumInsights,
  Provenance,
  Recommendation,
  RuleId,
  Severity,
  Thresholds,
  UsageFacts,
} from '../insights.types';

export interface RuleContext {
  data: PlectrumInsights;
  source: Provenance;
  usage: UsageFacts;
  now: Date;
  t: Thresholds;
}

export type Rule = (ctx: RuleContext) => Recommendation[];

export const SEVERITY_WEIGHT: Record<Severity, number> = { critical: 100, high: 60, medium: 30, low: 10 };

const DAY_MS = 24 * 60 * 60 * 1000;

/** severityWeight + 5·appsAffected + min(20, log2(1 + count)·4), one decimal. */
export function score(severity: Severity, appsAffected: number, count: number): number {
  const raw = SEVERITY_WEIGHT[severity] + 5 * Math.max(0, appsAffected) + Math.min(20, Math.log2(1 + Math.max(0, count)) * 4);
  return Math.round(raw * 10) / 10;
}

export interface Draft {
  rule: RuleId;
  /** Stable subject; the id is `${rule}:${subject}`. */
  subject: string;
  severity: Severity;
  /** Applications affected, for the score. */
  apps: number;
  /** Size of the finding (occurrences, lookups, age in days…), for the score. */
  count: number;
  title: string;
  why: string;
  evidence: Recommendation['evidence'];
  target: DrillTarget;
  next?: Recommendation['next'];
  provenance: Recommendation['provenance'];
}

export function recommendation(draft: Draft): Recommendation {
  const result: Recommendation = {
    id: `${draft.rule}:${draft.subject}`,
    rule: draft.rule,
    severity: draft.severity,
    score: score(draft.severity, draft.apps, draft.count),
    title: draft.title,
    why: draft.why,
    evidence: draft.evidence,
    target: draft.target,
    provenance: draft.provenance,
  };
  if (draft.next) result.next = draft.next;
  return result;
}

/** Whole days between `iso` and `now`; null when the date is missing or invalid. */
export function ageDays(now: Date, iso: string | null | undefined): number | null {
  if (!iso) return null;
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return null;
  return Math.floor((now.getTime() - at) / DAY_MS);
}

/** Latest agent point per application, sorted by application id. */
export function latestAgent(usage: UsageFacts): AgentPoint[] {
  const latest = new Map<string, AgentPoint>();
  for (const point of usage.agentHistory) {
    const current = latest.get(point.application);
    if (!current || Date.parse(point.observedAt) > Date.parse(current.observedAt)) latest.set(point.application, point);
  }
  return [...latest.values()].sort((a, b) => a.application.localeCompare(b.application));
}

export function componentMap(data: PlectrumInsights): Map<string, ComponentFact> {
  return new Map(data.repo.components.map((component) => [component.id, component]));
}

export function isObserved(usage: UsageFacts, application: string, componentId: string): boolean {
  return usage.observations.some((o) => o.application === application && o.componentId === componentId && o.count > 0);
}

/** Absence of usage is actionable only after every external app has a fresh report. */
export function completeExternalReporting(ctx: RuleContext): boolean {
  const external = ctx.data.usage.reported.applications.filter((app) => app.kind === 'external');
  return external.length > 0 && external.every((app) => {
    const age = ageDays(ctx.now, app.reportedAt);
    return age !== null && age >= 0 && age <= ctx.data.usage.reported.staleAfterDays;
  });
}

export function appLabel(usage: UsageFacts, application: string): string {
  return usage.applications.find((app) => app.id === application)?.label ?? application;
}

export function componentName(components: Map<string, ComponentFact>, id: string): string {
  return components.get(id)?.name ?? id;
}

type UsageRecord = 'observations' | 'agent' | 'local' | 'report';

/** File or record a usage value comes from, per provenance. */
export function usageSource(ctx: RuleContext, application: string, record: UsageRecord): string {
  if (ctx.source === 'reported') return `.ai/adoption/${application}.json`;
  if (record === 'agent' || record === 'local') return 'tools/insights/demo/seed.json';
  if (record === 'observations') return `demo report ${application}: repository scan (scanObservations)`;
  return `demo report ${application} (tools/insights/demo.ts)`;
}

export const SOURCES = {
  index: '.ai/contracts/index.json',
  catalogue: 'tools/devkit/assets/catalogue.json',
  process: '.ai/contracts/process.json',
  searchEval: 'libs/ui/src/storybook/agent-eval.generated.ts',
  syncReport: 'libs/ui/src/storybook/sync-report.generated.ts',
  proposals: 'tools/tokens/proposed.dtcg.json',
  runtime: 'libs/ui/package.json',
  tags: 'git tags plectrum-v*',
  similarity: 'tools/insights/similarity.ts (searchComponents)',
} as const;

export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
