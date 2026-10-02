// Ranks installed catalogue entries and other teams' local components against a
// need written in plain words. Pure functions: no file access, so the CLI, the
// MCP server and the evaluation share one implementation.

const stopwords = new Set(('a an the and or of for to in on at by with without from into onto over under this that these those it its is are be '
  + 'i we you he she they my our your their me us them need needs want wants show shows display let lets user users some any all '
  + 'what which when where how does do can could should would will while than then there here has have had not no one two').split(' '));

/** Lowercase words of at least two letters, without stopwords, with a light plural/verb stem. */
export function terms(text) {
  return String(text ?? '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !stopwords.has(word))
    .map(stem);
}

function stem(word) {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && /(ches|shes|sses|xes)$/.test(word)) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  return word;
}

// Field weights: what a component says about itself (keywords, use cases) counts
// more than incidental words in a long description.
const weights = { name: 3, keyword: 3, selection: 2, useCase: 2, pattern: 1.5, description: 1 };

function catalogueFields(entry) {
  const m = entry.metadata;
  return {
    name: [m.component.name, entry.id.split(':')[1]],
    keyword: m.aiHints?.keywords ?? [],
    selection: Object.keys(m.aiHints?.selectionCriteria ?? {}),
    useCase: m.usage?.useCases ?? [],
    pattern: (m.usage?.commonPatterns ?? []).map((item) => `${item.name} ${item.description}`),
    description: [m.component.description],
  };
}

function localFields(entry) {
  return { name: [entry.name, entry.id.split(':')[1]], keyword: [], selection: [], useCase: entry.useCases ?? [], pattern: [], description: [entry.description] };
}

function matches(fieldTerm, queryTerm) {
  if (fieldTerm === queryTerm) return true;
  const [short, long] = fieldTerm.length < queryTerm.length ? [fieldTerm, queryTerm] : [queryTerm, fieldTerm];
  return short.length >= 4 && long.startsWith(short);
}

/** Score one entry: each query term counts once, at the weight of the best field it appears in. */
function score(fields, queryTerms, queryText) {
  let total = 0;
  const matched = new Set();
  for (const queryTerm of new Set(queryTerms)) {
    let best = 0;
    let bestField = null;
    for (const [field, values] of Object.entries(fields)) {
      if (weights[field] <= best) continue;
      if (values.some((value) => terms(value).some((fieldTerm) => matches(fieldTerm, queryTerm)))) {
        best = weights[field];
        bestField = field;
      }
    }
    if (bestField) {
      total += best;
      matched.add(bestField);
    }
  }
  // A multi-word keyword found verbatim in the request ("side panel", "label value") is a strong signal.
  const normalized = terms(queryText).join(' ');
  for (const keyword of fields.keyword) {
    const phrase = terms(keyword).join(' ');
    if (phrase.includes(' ') && normalized.includes(phrase)) total += 2;
  }
  return { total, matched: [...matched] };
}

/** Minimum score for a result to count as a match rather than noise. */
export const MATCH_THRESHOLD = 4;

/**
 * Rank catalogue and local components for a request.
 * @returns {{ id: string, name: string, origin: 'catalogue' | 'local', status: string, score: number, matchedFields: string[] }[]}
 */
export function searchComponents(request, { catalogue, localComponents = [] }, { limit = 5, threshold = MATCH_THRESHOLD } = {}) {
  const queryTerms = terms(request);
  if (!queryTerms.length) return [];
  const ranked = [
    ...catalogue.components.map((entry) => ({ entry, origin: 'catalogue', fields: catalogueFields(entry) })),
    ...localComponents.map((entry) => ({ entry, origin: 'local', fields: localFields(entry) })),
  ].map(({ entry, origin, fields }) => {
    const { total: raw, matched } = score(fields, queryTerms, request);
    // Governance: an app-specific component cannot be imported by another team, and a
    // deprecated one takes no new usages, so both rank below an importable Core match.
    const status = origin === 'catalogue' ? entry.metadata.governance?.status : 'local';
    const total = status === 'app' || status === 'deprecated' ? raw / 2 : raw;
    return { id: entry.id, name: origin === 'catalogue' ? entry.metadata.component.name : entry.name, origin, status, score: Math.round(total * 10) / 10, matchedFields: matched };
  });
  return ranked
    .filter((item) => item.score >= threshold)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

/** Run the reference requests and report each case, regressions and fixed known misses; used by tests and the Storybook report. */
export function evaluateSearch(cases, data, knownMisses = []) {
  const known = new Set(knownMisses);
  const results = cases.map((item) => {
    const found = searchComponents(item.query, data, { limit: 5 });
    const ids = found.map((result) => result.id);
    const top3 = ids.slice(0, 3);
    const pass = item.none
      ? ids.length === 0
      : (item.anyOf ?? []).some((id) => top3.includes(id)) && (item.allOf ?? []).every((id) => ids.includes(id));
    return { id: item.id, query: item.query, anyOf: item.anyOf ?? [], allOf: item.allOf ?? [], none: Boolean(item.none), results: ids, pass, knownMiss: known.has(item.id) };
  });
  const passed = results.filter((item) => item.pass).length;
  // A regression is a case that is expected to pass and does not; a known miss that now passes is an improvement.
  const regressions = results.filter((item) => !item.pass && !item.knownMiss).map((item) => item.id);
  const fixed = results.filter((item) => item.pass && item.knownMiss).map((item) => item.id);
  return { total: results.length, passed, rate: results.length ? Math.round((passed / results.length) * 100) : 0, regressions, fixed, results };
}

/** Token names matching every word of the request, most specific (shortest) first. */
export function findTokens(request, names, limit = 30) {
  const words = String(request ?? '').toLowerCase().replace(/^--pds-/, '').split(/[^a-z0-9]+/).filter(Boolean);
  if (!words.length) return [];
  return names
    .filter((name) => words.every((word) => name.toLowerCase().includes(word)))
    .sort((a, b) => a.length - b.length || a.localeCompare(b))
    .slice(0, limit);
}
