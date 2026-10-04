import type { Thresholds } from './insights.types';

/** Rule thresholds of recommend(). Ages in days, ratios in 0–1. staleAfterDays comes from UsageFacts. */
export const DEFAULT_THRESHOLDS: Thresholds = {
  similarityMinScore: 6,
  promoteHighTeams: 3,
  deprecatedLookupMin: 3,
  lookupNotAdoptedMin: 5,
  catalogueGapMinEmpty: 5,
  catalogueGapRatio: 0.2,
  catalogueGapHighRatio: 0.35,
  knownMissMaxAgeDays: 30,
  unusedMinAgeDays: 30,
  mcpToolUnusedMinCalls: 50,
  reviewWaitingDays: 7,
  reviewWaitingCriticalDays: 14,
  approvedNoSubmissionDays: 30,
  acceptedNotPromotedDays: 21,
  promotedNoFigmaDays: 30,
  tokenProposalsPendingDays: 14,
  releasePendingDays: 14,
  releaseLastTagDays: 30,
};
