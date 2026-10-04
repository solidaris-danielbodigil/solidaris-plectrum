// Recommendations for Plectrum Core, derived from the insights facts. Pure:
// runs in the browser with `new Date()` and in node tests with a fixed date.
import type { PlectrumInsights, Provenance, Recommendation, Thresholds } from './insights.types';
import { DEFAULT_THRESHOLDS } from './thresholds';
import type { Rule, RuleContext } from './rules/context';
import { appNoPlectrum, unusedComponent } from './rules/adoption';
import { agentIdle, catalogueGap, lookupNotAdopted, mcpToolUnused } from './rules/agent';
import { deprecatedInUse, deprecatedLookedUp, retireDeprecated } from './rules/deprecation';
import { localDuplicatesCore, promoteLocal } from './rules/local';
import { acceptedNotPromoted, approvedNoSubmission, promotedNoFigma, reviewWaiting } from './rules/pipeline';
import { releaseDue } from './rules/releases';
import { missingReport, outdatedRuntime, staleReport } from './rules/reports';
import { knownMissOpen, searchEvalDrop, searchEvalRegression } from './rules/search';
import { tokenProposalsPending, tokenSyncBlocked } from './rules/tokens';

const RULES: Rule[] = [
  deprecatedInUse,
  retireDeprecated,
  deprecatedLookedUp,
  promoteLocal,
  localDuplicatesCore,
  catalogueGap,
  searchEvalRegression,
  searchEvalDrop,
  knownMissOpen,
  staleReport,
  missingReport,
  appNoPlectrum,
  unusedComponent,
  lookupNotAdopted,
  outdatedRuntime,
  mcpToolUnused,
  agentIdle,
  reviewWaiting,
  approvedNoSubmission,
  acceptedNotPromoted,
  promotedNoFigma,
  tokenSyncBlocked,
  tokenProposalsPending,
  releaseDue,
];

/**
 * Every recommendation for one usage source, deduplicated by id (`rule:subject`,
 * the highest score wins) and sorted by score, then id. Repository rules give
 * the same results for both sources.
 */
export function recommend(data: PlectrumInsights, source: Provenance, now: Date, t?: Partial<Thresholds>): Recommendation[] {
  const thresholds: Thresholds = { ...DEFAULT_THRESHOLDS };
  for (const [key, value] of Object.entries(t ?? {}) as [keyof Thresholds, number | undefined][]) {
    if (typeof value === 'number' && Number.isFinite(value)) thresholds[key] = value;
  }
  const ctx: RuleContext = { data, source, usage: data.usage[source], now, t: thresholds };
  const byId = new Map<string, Recommendation>();
  for (const rule of RULES) {
    for (const item of rule(ctx)) {
      const seen = byId.get(item.id);
      if (!seen || item.score > seen.score) byId.set(item.id, item);
    }
  }
  return [...byId.values()].sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
