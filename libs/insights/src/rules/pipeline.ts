// Candidate pipeline: items waiting at a step longer than agreed.
import type { CandidateFact, Recommendation, Severity } from '../insights.types';
import { ageDays, recommendation, type RuleContext } from './context';

const record = (folder: string, candidate: CandidateFact) => `.ai/candidates/${folder}/${candidate.id}.json`;

function candidateRecommendation(
  rule: 'review-waiting' | 'approved-no-submission' | 'accepted-not-promoted' | 'promoted-no-figma',
  candidate: CandidateFact,
  age: number,
  severity: Severity,
  title: string,
  why: string,
  evidence: Recommendation['evidence'],
  next?: Recommendation['next'],
): Recommendation {
  return recommendation({
    rule,
    subject: candidate.id,
    severity,
    apps: 1,
    count: age,
    title,
    why,
    evidence: [
      { label: 'Candidate', value: `${candidate.componentId} (${candidate.team})`, source: record('proposals', candidate) },
      ...evidence,
      ...(candidate.links['issue'] ? [{ label: 'Issue', value: candidate.links['issue'], source: record('proposals', candidate) }] : []),
    ],
    target: { section: 'pipeline', candidate: candidate.id },
    next,
    provenance: 'repository',
  });
}

/** review-waiting: a submission without a current review (high after 7 days, critical after 14). */
export function reviewWaiting(ctx: RuleContext): Recommendation[] {
  const out: Recommendation[] = [];
  for (const candidate of ctx.data.repo.candidates) {
    const waiting = candidate.stage === 'submitted' || ((candidate.stage === 'accepted' || candidate.stage === 'kept-local') && !candidate.reviewCurrent);
    const age = ageDays(ctx.now, candidate.submittedAt);
    if (!waiting || age === null || age <= ctx.t.reviewWaitingDays) continue;
    const stale = candidate.stage !== 'submitted';
    out.push(candidateRecommendation(
      'review-waiting', candidate, age,
      age > ctx.t.reviewWaitingCriticalDays ? 'critical' : 'high',
      `Review ${candidate.componentId}: submitted ${age} days ago`,
      stale
        ? `The ${candidate.team} team changed the submission after the last review. Review the current revision.`
        : `The ${candidate.team} team is waiting for a Core decision before they can go on.`,
      [
        { label: 'Submitted', value: candidate.submittedAt?.slice(0, 10) ?? 'unknown', source: record('submissions', candidate) },
        { label: 'Current review', value: stale ? 'outdated' : 'none', source: record('reviews', candidate) },
      ],
      {
        label: 'Record the review',
        command: `npm run candidate:record -- review --id ${candidate.id} --decision <accepted|kept-local> --pull-request <submission-pr-url> --reviewed-by @<reviewer> --note "<what was reviewed>"`,
      },
    ));
  }
  return out;
}

/** approved-no-submission: an approved candidate never submitted. */
export function approvedNoSubmission(ctx: RuleContext): Recommendation[] {
  const out: Recommendation[] = [];
  for (const candidate of ctx.data.repo.candidates) {
    if (candidate.stage !== 'approved' || candidate.submittedAt) continue;
    const age = ageDays(ctx.now, candidate.decidedAt);
    if (age === null || age <= ctx.t.approvedNoSubmissionDays) continue;
    out.push(candidateRecommendation(
      'approved-no-submission', candidate, age, 'low',
      `${candidate.componentId} approved ${age} days ago, not submitted`,
      `Ask the ${candidate.team} team whether the candidate is still coming or should be withdrawn.`,
      [{ label: 'Approved', value: candidate.decidedAt.slice(0, 10), source: record('proposals', candidate) }],
    ));
  }
  return out;
}

/** accepted-not-promoted: an accepted candidate not yet promoted to Core. */
export function acceptedNotPromoted(ctx: RuleContext): Recommendation[] {
  const out: Recommendation[] = [];
  for (const candidate of ctx.data.repo.candidates) {
    if (candidate.stage !== 'accepted' || candidate.promotedAt) continue;
    const accepted = candidate.reviewedAt ?? candidate.submittedAt ?? candidate.decidedAt;
    const age = ageDays(ctx.now, accepted);
    if (age === null || age <= ctx.t.acceptedNotPromotedDays) continue;
    out.push(candidateRecommendation(
      'accepted-not-promoted', candidate, age, 'medium',
      `Promote ${candidate.componentId}: accepted ${age} days ago`,
      'Core accepted the candidate but has not integrated it. Plan the integration PR and promotion record.',
      [{ label: 'Accepted', value: accepted.slice(0, 10), source: record('reviews', candidate) }],
    ));
  }
  return out;
}

/** promoted-no-figma: a promoted component without its Figma return. */
export function promotedNoFigma(ctx: RuleContext): Recommendation[] {
  const out: Recommendation[] = [];
  for (const candidate of ctx.data.repo.candidates) {
    if (candidate.stage !== 'promoted' || candidate.figmaReturnedAt) continue;
    const age = ageDays(ctx.now, candidate.promotedAt);
    if (age === null || age <= ctx.t.promotedNoFigmaDays) continue;
    out.push(candidateRecommendation(
      'promoted-no-figma', candidate, age, 'low',
      `${candidate.componentId} promoted ${age} days ago, no Figma return`,
      'Designers cannot use the component until it is in the Figma library. Schedule the attended Figma session.',
      [{ label: 'Promoted', value: candidate.promotedAt?.slice(0, 10) ?? 'unknown', source: record('promotions', candidate) }],
    ));
  }
  return out;
}
