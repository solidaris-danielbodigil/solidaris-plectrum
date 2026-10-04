// Deprecated components: still in use, ready to retire, still looked up.
import type { Recommendation } from '../insights.types';
import {
  appLabel,
  componentMap,
  componentName,
  completeExternalReporting,
  latestAgent,
  plural,
  recommendation,
  SOURCES,
  usageSource,
  type RuleContext,
} from './context';

function migrationHint(ctx: RuleContext, replacementId: string | undefined): Recommendation['next'] {
  if (!replacementId) return undefined;
  const replacement = componentMap(ctx.data).get(replacementId);
  const next: NonNullable<Recommendation['next']> = { label: `Migrate to ${replacement?.name ?? replacementId} (${replacementId})` };
  if (replacement?.docsUrl) next.url = replacement.docsUrl;
  return next;
}

/** deprecated-in-use: an application still renders a deprecated component. */
export function deprecatedInUse(ctx: RuleContext): Recommendation[] {
  const components = componentMap(ctx.data);
  const out: Recommendation[] = [];
  for (const component of ctx.data.repo.components) {
    if (component.status !== 'deprecated') continue;
    const uses = ctx.usage.observations.filter((o) => o.componentId === component.id && o.count > 0);
    if (uses.length === 0) continue;
    const apps = [...new Set(uses.map((o) => o.application))].sort();
    const count = uses.reduce((sum, o) => sum + o.count, 0);
    const replacement = component.replacementId ? componentName(components, component.replacementId) : null;
    out.push(recommendation({
      rule: 'deprecated-in-use',
      subject: component.id,
      severity: component.replacementId ? 'high' : 'medium',
      apps: apps.length,
      count,
      title: `Migrate ${apps.map((app) => appLabel(ctx.usage, app)).join(', ')} off deprecated ${component.name}`,
      why: replacement
        ? `${component.name} is deprecated and will be removed in a major release; ${replacement} replaces it.`
        : `${component.name} is deprecated and has no replacement yet; agree a migration path with the teams.`,
      evidence: [
        ...uses.map((o) => ({ label: `${appLabel(ctx.usage, o.application)} usages`, value: `${o.count} in ${plural(o.files, 'file')}`, source: usageSource(ctx, o.application, 'observations') })),
        { label: 'Replacement', value: component.replacementId ?? 'none', source: SOURCES.index },
        { label: 'Last modified', value: component.modified, source: SOURCES.index },
      ],
      target: { section: 'adoption', component: component.id },
      next: migrationHint(ctx, component.replacementId),
      provenance: ctx.source,
    }));
  }
  return out;
}

/** retire-deprecated: a deprecated component nobody uses any more can be deleted. */
export function retireDeprecated(ctx: RuleContext): Recommendation[] {
  if (ctx.source === 'reported' && !completeExternalReporting(ctx)) return [];
  const out: Recommendation[] = [];
  for (const component of ctx.data.repo.components) {
    if (component.status !== 'deprecated') continue;
    if (ctx.usage.observations.some((o) => o.componentId === component.id && o.count > 0) || component.scanUsedIn.length > 0 || component.usedBy.length > 0) continue;
    const pkg = component.distribution === 'styles' ? '@solidaris-danielbodigil/pds-styles' : '@solidaris-danielbodigil/pds-ui';
    out.push(recommendation({
      rule: 'retire-deprecated',
      subject: component.id,
      severity: 'medium',
      apps: 0,
      count: 0,
      title: `Retire deprecated ${component.name}`,
      why: ctx.source === 'demo'
        ? `No usage appears in the demo scenario or repository scan; check real application reports before deleting ${component.name}.`
        : `Fresh reports from every registered external application and the repository scan find no usage of ${component.name}; review removal in the next major release.`,
      evidence: [
        { label: 'Usages in selected source', value: 0, source: ctx.source === 'demo' ? 'demo reports' : '.ai/adoption/*.json' },
        { label: 'Repository scan', value: 'not found', source: `${SOURCES.index} (usedIn)` },
        { label: 'Used by components', value: 'none', source: `${SOURCES.index} (relationships.usedBy)` },
        { label: 'Replacement', value: component.replacementId ?? 'none', source: SOURCES.index },
        { label: 'Deprecated since (last modified)', value: component.modified, source: SOURCES.index },
      ],
      target: { section: 'adoption', component: component.id },
      next: { label: `Delete ${component.name} and add a major changeset for ${pkg}`, command: 'npm run changeset' },
      provenance: ctx.source,
    }));
  }
  return out;
}

/** deprecated-looked-up: agents still look up a deprecated component. */
export function deprecatedLookedUp(ctx: RuleContext): Recommendation[] {
  const components = componentMap(ctx.data);
  const out: Recommendation[] = [];
  for (const point of latestAgent(ctx.usage)) {
    for (const [id, lookups] of Object.entries(point.lookups).sort(([a], [b]) => a.localeCompare(b))) {
      const component = components.get(id);
      if (component?.status !== 'deprecated' || lookups < ctx.t.deprecatedLookupMin) continue;
      const app = appLabel(ctx.usage, point.application);
      const replacement = component.replacementId ? componentName(components, component.replacementId) : null;
      out.push(recommendation({
        rule: 'deprecated-looked-up',
        subject: `${point.application}/${id}`,
        severity: 'low',
        apps: 1,
        count: lookups,
        title: `${app} agents still look up deprecated ${component.name}`,
        why: replacement
          ? `Point the ${app} team to ${replacement} before new code depends on ${component.name}.`
          : `Tell the ${app} team ${component.name} is deprecated before new code depends on it.`,
        evidence: [
          { label: 'Lookups', value: lookups, source: usageSource(ctx, point.application, 'agent') },
          { label: 'Window', value: `${point.windowDays} days to ${point.observedAt.slice(0, 10)}`, source: usageSource(ctx, point.application, 'agent') },
          { label: 'Replacement', value: component.replacementId ?? 'none', source: SOURCES.index },
        ],
        target: { section: 'agent', app: point.application, component: id },
        next: migrationHint(ctx, component.replacementId),
        provenance: ctx.source,
      }));
    }
  }
  return out;
}
