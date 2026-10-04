// Agent search quality: the reference requests replayed on every change.
import type { Recommendation } from '../insights.types';
import { ageDays, recommendation, SOURCES, type RuleContext } from './context';

/** search-eval-regression: a reference request that passed before now fails. */
export function searchEvalRegression(ctx: RuleContext): Recommendation[] {
  const { searchEval } = ctx.data.repo;
  return [...new Set(searchEval.regressions)].sort().map((id) => {
    const result = searchEval.results.find((item) => item.id === id);
    const expected = result ? [...result.allOf, ...result.anyOf] : [];
    return recommendation({
      rule: 'search-eval-regression',
      subject: id,
      severity: 'critical',
      apps: 0,
      count: 1,
      title: `Agent search regressed on "${id}"`,
      why: 'A reference request that passed before now returns the wrong components. Fix the metadata or the search before the next release.',
      evidence: [
        ...(result ? [{ label: 'Request', value: result.query, source: SOURCES.searchEval }] : []),
        { label: 'Expected', value: result?.none ? 'no match' : expected.join(', ') || 'unknown', source: SOURCES.searchEval },
        { label: 'Returned', value: result?.results.join(', ') || 'nothing', source: SOURCES.searchEval },
        { label: 'Toolkit', value: searchEval.toolkitVersion, source: SOURCES.searchEval },
      ],
      target: { section: 'search', evalCase: id },
      provenance: 'repository',
    });
  });
}

/** search-eval-drop: the pass rate is lower than at the previous change of the eval. */
export function searchEvalDrop(ctx: RuleContext): Recommendation[] {
  const { searchEval } = ctx.data.repo;
  const series = searchEval.history.map((point) => ({ rate: point.rate, passed: point.passed, total: point.total, label: `${point.revision} (${point.at.slice(0, 10)})` }));
  const last = series.at(-1);
  // The history ends at the last commit of the eval file; the current result counts when it differs.
  if (!last || last.rate !== searchEval.rate) series.push({ rate: searchEval.rate, passed: searchEval.passed, total: searchEval.total, label: 'current' });
  const current = series.at(-1);
  const previous = series.at(-2);
  if (!current || !previous || current.rate >= previous.rate) return [];
  return [recommendation({
    rule: 'search-eval-drop',
    subject: 'pass-rate',
    severity: 'high',
    apps: 0,
    count: previous.rate - current.rate,
    title: `Agent search pass rate dropped from ${previous.rate}% to ${current.rate}%`,
    why: 'Fewer reference requests find the right components than before. Check which cases changed.',
    evidence: [
      { label: 'Current', value: `${current.passed}/${current.total} (${current.rate}%)`, source: SOURCES.searchEval },
      { label: `Previous, ${previous.label}`, value: `${previous.passed}/${previous.total} (${previous.rate}%)`, source: `${SOURCES.searchEval} (git history)` },
    ],
    target: { section: 'search' },
    provenance: 'repository',
  })];
}

/** known-miss-open: a known miss stays open for too long. */
export function knownMissOpen(ctx: RuleContext): Recommendation[] {
  const { searchEval } = ctx.data.repo;
  const out: Recommendation[] = [];
  for (const miss of searchEval.knownMisses) {
    const age = ageDays(ctx.now, miss.since);
    if (age === null || age <= ctx.t.knownMissMaxAgeDays) continue;
    const result = searchEval.results.find((item) => item.id === miss.id);
    out.push(recommendation({
      rule: 'known-miss-open',
      subject: miss.id,
      severity: 'low',
      apps: 0,
      count: age,
      title: `Known search miss "${miss.id}" open for ${age} days`,
      why: 'Agents asking this request still get the wrong components. Improve the metadata or record why it stays a miss.',
      evidence: [
        ...(result ? [{ label: 'Request', value: result.query, source: SOURCES.searchEval }] : []),
        ...(result ? [{ label: 'Returned', value: result.results.join(', ') || 'nothing', source: SOURCES.searchEval }] : []),
        { label: 'Known miss since', value: miss.since?.slice(0, 10) ?? 'unknown', source: `${SOURCES.searchEval} (git history)` },
      ],
      target: { section: 'search', evalCase: miss.id },
      provenance: 'repository',
    }));
  }
  return out;
}
