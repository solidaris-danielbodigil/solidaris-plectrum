// Adoption: applications without Plectrum, Core components nobody uses.
import type { Recommendation } from '../insights.types';
import { ageDays, completeExternalReporting, recommendation, SOURCES, usageSource, type RuleContext } from './context';

/** app-no-plectrum: a reported or scanned application uses no Plectrum component. */
export function appNoPlectrum(ctx: RuleContext): Recommendation[] {
  const out: Recommendation[] = [];
  for (const app of ctx.usage.applications) {
    if (!app.reportedAt && app.reports === 0) continue;
    if (ctx.usage.observations.some((o) => o.application === app.id && o.count > 0)) continue;
    out.push(recommendation({
      rule: 'app-no-plectrum',
      subject: app.id,
      severity: 'medium',
      apps: 1,
      count: 0,
      title: `${app.label} uses no Plectrum component`,
      why: `The ${app.label} report finds no Plectrum component in the code. Offer the ${app.team} team an onboarding session.`,
      evidence: [
        { label: 'Components found', value: 0, source: usageSource(ctx, app.id, 'observations') },
        { label: 'Last report', value: app.reportedAt?.slice(0, 10) ?? 'unknown', source: usageSource(ctx, app.id, 'report') },
        { label: 'Plectrum version', value: app.packageVersion ?? 'not installed', source: usageSource(ctx, app.id, 'report') },
      ],
      target: { section: 'adoption', app: app.id },
      provenance: ctx.source,
    }));
  }
  return out;
}

/** unused-component: a measurable Core component no application or component uses, past its first month. */
export function unusedComponent(ctx: RuleContext): Recommendation[] {
  if (ctx.source === 'reported' && !completeExternalReporting(ctx)) return [];
  const out: Recommendation[] = [];
  for (const component of ctx.data.repo.components) {
    if (component.status !== 'core' || !component.measurable) continue;
    if (component.usedBy.length > 0 || component.scanUsedIn.length > 0 || ctx.usage.observations.some((o) => o.componentId === component.id && o.count > 0)) continue;
    const age = ageDays(ctx.now, component.created);
    if (age === null || age <= ctx.t.unusedMinAgeDays) continue;
    out.push(recommendation({
      rule: 'unused-component',
      subject: component.id,
      severity: 'low',
      apps: 0,
      count: age,
      title: `No application uses ${component.name}`,
      why: ctx.source === 'demo'
        ? `${component.name} has no usage in the demo scenario or repository scan. Check real application reports before deciding what to change.`
        : `${component.name} has been in Core for ${age} days without usage in fresh external reports or the repository scan. Check whether teams know it exists.`,
      evidence: [
        { label: 'Usages in selected source', value: 0, source: ctx.source === 'demo' ? 'demo reports' : '.ai/adoption/*.json' },
        { label: 'Repository scan', value: 'not found', source: `${SOURCES.index} (usedIn)` },
        { label: 'Used by components', value: 'none', source: `${SOURCES.index} (relationships.usedBy)` },
        { label: 'Created', value: component.created, source: SOURCES.index },
      ],
      target: { section: 'adoption', component: component.id },
      provenance: ctx.source,
    }));
  }
  return out;
}
