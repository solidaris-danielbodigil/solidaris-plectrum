// Similar local components, scored with the devkit search the agent uses
// (tools/devkit/src/search.mjs), so the dashboard and `search_components` agree
// on what "similar" means. Precomputed here so libs/insights stays free of
// devkit and node imports.
import type { LocalComponent, UsageFacts } from '../../libs/insights/src/insights.types';

export interface CatalogueEntry {
  id: string;
  selector?: string;
  package?: { importPath?: string; exportName?: string };
  docs?: { previewUrl?: string };
  metadata: {
    component: { id: string; name: string; description: string; bemBlock?: string; created?: string; modified?: string };
    distribution: { kind: string };
    governance: { status: string; owner: string; replacementId?: string };
    usage?: { useCases?: string[] };
  };
}

export interface Catalogue {
  toolkitVersion?: string;
  components: CatalogueEntry[];
}

type Local = LocalComponent & { team: string; application: string };
type SearchResult = { id: string; origin: 'catalogue' | 'local'; score: number; matchedFields: string[] };
type SearchComponents = (
  request: string,
  data: { catalogue: { components: unknown[] }; localComponents?: unknown[] },
  options?: { limit?: number; threshold?: number },
) => SearchResult[];

/** devkit field keys → the metadata fields a reader knows. */
const FIELD_NAMES: Record<string, string> = {
  name: 'name',
  keyword: 'keywords',
  selection: 'selectionCriteria',
  useCase: 'useCases',
  pattern: 'commonPatterns',
  description: 'description',
};

/** What a team wrote about its component, as one plain-words request. */
export const queryOf = (local: Pick<LocalComponent, 'name' | 'description' | 'useCases'>) => [local.name, local.description, ...local.useCases].join('. ');

const fields = (matched: string[]) => [...new Set(matched.map((field) => FIELD_NAMES[field] ?? field))].sort();

/**
 * Pairs of similar components. `local-local` pairs only across teams (the
 * higher score of both directions, `a` < `b`); `local-core` pairs are the top 3
 * catalogue matches of each local component. Pairs from the devkit match
 * threshold up; the rules apply their own minimum.
 */
export async function similarity(locals: readonly Local[], catalogue: Catalogue): Promise<UsageFacts['similarity']> {
  const { searchComponents, MATCH_THRESHOLD } = (await import('../devkit/src/search.mjs')) as { searchComponents: SearchComponents; MATCH_THRESHOLD: number };
  const options = { limit: 50, threshold: MATCH_THRESHOLD };
  // Core near-duplicates: the top 3, as the agent reads search_components results.
  const coreOptions = { limit: 3, threshold: MATCH_THRESHOLD };
  const pairs = new Map<string, UsageFacts['similarity'][number]>();
  for (const local of locals) {
    const others = locals.filter((other) => other.team !== local.team);
    for (const hit of searchComponents(queryOf(local), { catalogue: { components: [] }, localComponents: others }, options)) {
      const [a, b] = [local.id, hit.id].sort();
      const key = `local-local|${a}|${b}`;
      const previous = pairs.get(key);
      if (!previous || hit.score > previous.score) pairs.set(key, { a, b, kind: 'local-local', score: hit.score, matchedFields: fields(hit.matchedFields) });
    }
    for (const hit of searchComponents(queryOf(local), { catalogue, localComponents: [] }, coreOptions)) {
      pairs.set(`local-core|${local.id}|${hit.id}`, { a: local.id, b: hit.id, kind: 'local-core', score: hit.score, matchedFields: fields(hit.matchedFields) });
    }
  }
  return [...pairs.values()].sort((x, y) => x.a.localeCompare(y.a) || x.b.localeCompare(y.b) || x.kind.localeCompare(y.kind));
}
