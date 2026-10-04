// Agent and MCP telemetry: catalogue gaps, lookups that never turn into use,
// unused tools, idle agents. Always the latest window per application.
import type { Recommendation } from '../insights.types';
import { appLabel, componentMap, isObserved, latestAgent, recommendation, SOURCES, usageSource, type RuleContext } from './context';

const percent = (ratio: number) => `${Math.round(ratio * 100)}%`;

/** catalogue-gap: many agent searches find nothing in the catalogue. */
export function catalogueGap(ctx: RuleContext): Recommendation[] {
  const out: Recommendation[] = [];
  for (const point of latestAgent(ctx.usage)) {
    const empty = point.emptySearches;
    const searches = point.tools['search_components'] ?? 0;
    const ratio = searches > 0 ? empty / searches : empty > 0 ? 1 : 0;
    if (empty < ctx.t.catalogueGapMinEmpty || ratio < ctx.t.catalogueGapRatio) continue;
    const app = appLabel(ctx.usage, point.application);
    const source = usageSource(ctx, point.application, 'agent');
    out.push(recommendation({
      rule: 'catalogue-gap',
      subject: point.application,
      severity: ratio >= ctx.t.catalogueGapHighRatio ? 'high' : 'medium',
      apps: 1,
      count: empty,
      title: `${percent(ratio)} of ${app} component searches find nothing`,
      why: `The ${app} team asks for components the catalogue does not have. Ask them what they were looking for; queries are not recorded.`,
      evidence: [
        { label: 'Searches without a match', value: empty, source },
        { label: 'search_components calls', value: searches, source },
        { label: 'Empty-search ratio', value: percent(ratio), source },
        { label: 'Window', value: `${point.windowDays} days to ${point.observedAt.slice(0, 10)}`, source },
      ],
      target: { section: 'agent', app: point.application },
      provenance: ctx.source,
    }));
  }
  return out;
}

/** lookup-not-adopted: an application keeps looking up a component it never uses. */
export function lookupNotAdopted(ctx: RuleContext): Recommendation[] {
  const components = componentMap(ctx.data);
  const out: Recommendation[] = [];
  for (const point of latestAgent(ctx.usage)) {
    for (const [id, lookups] of Object.entries(point.lookups).sort(([a], [b]) => a.localeCompare(b))) {
      const component = components.get(id);
      // Deprecated lookups have their own rule; unmeasurable components cannot be observed.
      if (!component || component.status === 'deprecated' || !component.measurable) continue;
      if (lookups < ctx.t.lookupNotAdoptedMin || isObserved(ctx.usage, point.application, id)) continue;
      const app = appLabel(ctx.usage, point.application);
      out.push(recommendation({
        rule: 'lookup-not-adopted',
        subject: `${point.application}/${id}`,
        severity: 'medium',
        apps: 1,
        count: lookups,
        title: `${app} looks up ${component.name} but does not use it`,
        why: `Agents in ${app} read ${component.name} ${lookups} times without the component appearing in the code. Ask what stopped them.`,
        evidence: [
          { label: 'Lookups', value: lookups, source: usageSource(ctx, point.application, 'agent') },
          { label: `Usages in ${app}`, value: 0, source: usageSource(ctx, point.application, 'observations') },
          { label: 'Window', value: `${point.windowDays} days to ${point.observedAt.slice(0, 10)}`, source: usageSource(ctx, point.application, 'agent') },
        ],
        target: { section: 'agent', app: point.application, component: id },
        provenance: ctx.source,
      }));
    }
  }
  return out;
}

/** mcp-tool-unused: an MCP tool nobody calls while the agent is used a lot. */
export function mcpToolUnused(ctx: RuleContext): Recommendation[] {
  const points = latestAgent(ctx.usage);
  const callsOf = (tool: string) => points.reduce((sum, point) => sum + (point.tools[tool] ?? 0), 0);
  const total = points.reduce((sum, point) => sum + Object.values(point.tools).reduce((a, b) => a + b, 0), 0);
  if (total < ctx.t.mcpToolUnusedMinCalls) return [];
  const source = ctx.source === 'reported' ? '.ai/adoption/*.json' : 'tools/insights/demo/seed.json';
  return [...new Set(ctx.data.repo.mcpTools)].sort().filter((tool) => callsOf(tool) === 0).map((tool) => recommendation({
    rule: 'mcp-tool-unused',
    subject: tool,
    severity: 'low',
    apps: points.length,
    count: total,
    title: `No agent calls the ${tool} MCP tool`,
    why: `Agents made ${total} Plectrum MCP calls but none to ${tool}. Make its purpose clearer in the agent instructions, or drop it.`,
    evidence: [
      { label: `${tool} calls`, value: 0, source },
      { label: 'All tool calls', value: total, source },
      { label: 'Applications', value: points.map((point) => point.application).join(', '), source },
      { label: 'Declared tool', value: tool, source: SOURCES.process },
    ],
    target: { section: 'agent' },
    provenance: ctx.source,
  }));
}

/** agent-idle: an application reports an agent block with no active day. */
export function agentIdle(ctx: RuleContext): Recommendation[] {
  return latestAgent(ctx.usage).filter((point) => point.activeDays === 0).map((point) => {
    const app = appLabel(ctx.usage, point.application);
    const source = usageSource(ctx, point.application, 'agent');
    return recommendation({
      rule: 'agent-idle',
      subject: point.application,
      severity: 'low',
      apps: 1,
      count: point.windowDays,
      title: `The Plectrum agent was idle in ${app}`,
      why: `${app} has the agent set up but did not use it in the last ${point.windowDays} days. Check the setup with the team.`,
      evidence: [
        { label: 'Active days', value: 0, source },
        { label: 'Window', value: `${point.windowDays} days to ${point.observedAt.slice(0, 10)}`, source },
      ],
      target: { section: 'agent', app: point.application },
      provenance: ctx.source,
    });
  });
}
