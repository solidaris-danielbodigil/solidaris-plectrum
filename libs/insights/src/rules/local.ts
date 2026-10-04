// Local components: similar ones across teams (worth promoting) and ones that
// duplicate a Core component.
import type { Recommendation, UsageFacts } from '../insights.types';
import { componentMap, plural, recommendation, SOURCES, usageSource, type RuleContext } from './context';

export interface LocalCluster {
  /** Sorted member ids joined with `+`; the `cluster` drill key. */
  id: string;
  members: string[];
  teams: string[];
  applications: string[];
  pairs: UsageFacts['similarity'];
}

/** Union-find clusters of local-local pairs scoring at least `minScore`; singletons are dropped. */
export function localClusters(usage: UsageFacts, minScore: number): LocalCluster[] {
  const locals = new Map(usage.localComponents.map((local) => [local.id, local]));
  const parent = new Map<string, string>();
  const find = (id: string): string => {
    let root = id;
    for (let up = parent.get(root); up !== undefined && up !== root; up = parent.get(root)) root = up;
    for (let node = id; node !== root; ) {
      const up = parent.get(node) ?? root;
      parent.set(node, root);
      node = up;
    }
    return root;
  };
  const pairs = usage.similarity.filter((pair) => pair.kind === 'local-local' && pair.score >= minScore && pair.a !== pair.b && locals.has(pair.a) && locals.has(pair.b));
  for (const pair of pairs) {
    for (const id of [pair.a, pair.b]) if (!parent.has(id)) parent.set(id, id);
    const ra = find(pair.a);
    const rb = find(pair.b);
    // The smaller id stays the root, so clusters do not depend on pair order.
    if (ra < rb) parent.set(rb, ra);
    else if (rb < ra) parent.set(ra, rb);
  }
  const groups = new Map<string, string[]>();
  for (const id of parent.keys()) {
    const root = find(id);
    groups.set(root, [...(groups.get(root) ?? []), id]);
  }
  return [...groups.values()]
    .map((ids) => {
      const members = [...new Set(ids)].sort();
      const set = new Set(members);
      const entries = members.map((id) => locals.get(id)).filter((local) => local !== undefined);
      return {
        id: members.join('+'),
        members,
        teams: [...new Set(entries.map((local) => local.team))].sort(),
        applications: [...new Set(entries.map((local) => local.application))].sort(),
        pairs: pairs.filter((pair) => set.has(pair.a) && set.has(pair.b)),
      };
    })
    .filter((cluster) => cluster.members.length > 1)
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** promote-local: similar local components in at least two teams are worth sharing. */
export function promoteLocal(ctx: RuleContext): Recommendation[] {
  const locals = new Map(ctx.usage.localComponents.map((local) => [local.id, local]));
  const components = componentMap(ctx.data);
  const out: Recommendation[] = [];
  for (const cluster of localClusters(ctx.usage, ctx.t.similarityMinScore)) {
    if (cluster.teams.length < 2) continue;
    const members = cluster.members.map((id) => locals.get(id)).filter((local) => local !== undefined);
    const likely = members.some((local) => local.reusePotential === 'likely');
    const best = Math.max(...cluster.pairs.map((pair) => pair.score));
    const fields = [...new Set(cluster.pairs.flatMap((pair) => pair.matchedFields))].sort();
    const memberSet = new Set(cluster.members);
    const core = [...new Set(ctx.usage.similarity
      .filter((pair) => pair.kind === 'local-core' && pair.score >= ctx.t.similarityMinScore && (memberSet.has(pair.a) || memberSet.has(pair.b)))
      .map((pair) => (memberSet.has(pair.a) ? pair.b : pair.a)))].sort();
    out.push(recommendation({
      rule: 'promote-local',
      subject: cluster.id,
      severity: cluster.teams.length >= ctx.t.promoteHighTeams || likely ? 'high' : 'medium',
      apps: cluster.applications.length,
      count: cluster.members.length,
      title: `${plural(cluster.teams.length, 'team')} built similar components: ${members.map((local) => local.name).join(', ')}`,
      why: core.length
        ? `${members.map((local) => local.name).join(', ')} overlap; check whether ${core.map((id) => components.get(id)?.name ?? id).join(', ')} covers them before promoting one.`
        : `${members.map((local) => local.name).join(', ')} overlap; one shared component would replace them.`,
      evidence: [
        ...members.map((local) => ({ label: `${local.name} (${local.team})`, value: `reuse potential ${local.reusePotential}`, source: usageSource(ctx, local.application, 'local') })),
        { label: 'Best pair score', value: best, source: SOURCES.similarity },
        { label: 'Matched fields', value: fields.join(', '), source: SOURCES.similarity },
        { label: 'Core near-duplicates', value: core.join(', ') || 'none', source: SOURCES.similarity },
      ],
      target: { section: 'local', cluster: cluster.id },
      provenance: ctx.source,
    }));
  }
  return out;
}

/**
 * local-duplicates-core: a local component looks like an existing Core component.
 * At most one per local component: the best-scoring Core match (ties: lower id);
 * other matches at or above the threshold are secondary evidence.
 */
export function localDuplicatesCore(ctx: RuleContext): Recommendation[] {
  const locals = new Map(ctx.usage.localComponents.map((local) => [local.id, local]));
  const components = componentMap(ctx.data);
  const matches = new Map<string, Map<string, UsageFacts['similarity'][number]>>();
  for (const pair of ctx.usage.similarity) {
    if (pair.kind !== 'local-core' || pair.score < ctx.t.similarityMinScore) continue;
    const [localId, coreId] = locals.has(pair.a) ? [pair.a, pair.b] : [pair.b, pair.a];
    if (!locals.has(localId)) continue;
    const byCore = matches.get(localId) ?? new Map<string, UsageFacts['similarity'][number]>();
    const seen = byCore.get(coreId);
    if (!seen || pair.score > seen.score) byCore.set(coreId, pair);
    matches.set(localId, byCore);
  }
  const out: Recommendation[] = [];
  for (const [localId, byCore] of [...matches].sort(([a], [b]) => a.localeCompare(b))) {
    const local = locals.get(localId);
    const ranked = [...byCore].sort(([coreA, a], [coreB, b]) => b.score - a.score || coreA.localeCompare(coreB));
    const [best, ...others] = ranked;
    if (!local || !best) continue;
    const [coreId, pair] = best;
    const coreName = components.get(coreId)?.name ?? coreId;
    out.push(recommendation({
      rule: 'local-duplicates-core',
      subject: `${localId}/${coreId}`,
      severity: 'medium',
      apps: 1,
      count: pair.score,
      title: `${local.name} (${local.team}) duplicates ${coreName}`,
      why: `Check with the ${local.team} team whether ${coreName} covers ${local.name}; if not, the gap belongs in ${coreName}.`,
      evidence: [
        { label: 'Similarity score', value: pair.score, source: SOURCES.similarity },
        { label: 'Matched fields', value: pair.matchedFields.join(', '), source: SOURCES.similarity },
        { label: 'Reuse potential', value: local.reusePotential, source: usageSource(ctx, local.application, 'local') },
        { label: 'Core component', value: coreId, source: SOURCES.index },
        ...others.map(([otherId, other]) => ({ label: 'Also similar', value: `${components.get(otherId)?.name ?? otherId} (${otherId}, score ${other.score})`, source: SOURCES.similarity })),
      ],
      target: { section: 'local', app: local.application, component: localId },
      provenance: ctx.source,
    }));
  }
  return out;
}
