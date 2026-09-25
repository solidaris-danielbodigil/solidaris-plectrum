import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import semver from 'semver';
import {
  proposalSchema,
  candidateSubmissionSchema,
  candidateReviewSchema,
  candidatePromotionSchema,
  candidateFigmaReturnSchema,
  type Registry,
} from '../../.ai/contracts/schema/exchange.schema';
import { readRegistry, validateMetadata } from '../contracts/validate';

export type Proposal = z.infer<typeof proposalSchema>;
export type Submission = z.infer<typeof candidateSubmissionSchema>;
export type CandidateReview = z.infer<typeof candidateReviewSchema>;
export type CandidatePromotion = z.infer<typeof candidatePromotionSchema>;
export type CandidateFigmaReturn = z.infer<typeof candidateFigmaReturnSchema>;

function records<T>(root: string, folder: string, schema: z.ZodType<T>): Map<string, T> {
  const directory = path.join(root, '.ai/candidates', folder);
  const result = new Map<string, T>();
  if (!fs.existsSync(directory)) return result;
  for (const name of fs.readdirSync(directory).filter((file) => file.endsWith('.json')).sort()) {
    const record = schema.parse(JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')));
    const id = (record as { id: string }).id;
    if (name !== `${id}.json` || result.has(id)) throw new Error(`${folder}/${name}: filename must match stable record ID`);
    result.set(id, record);
  }
  return result;
}

function centralUrl(url: string, registry: Registry): boolean {
  return url.startsWith(`${registry.repository}/issues/`) || url.startsWith(`${registry.repository}/pull/`);
}

export function validateProposal(proposal: Proposal, registry: Registry): void {
  const app = registry.applications.find((item) => item.id === proposal.application && item.team === proposal.team);
  if (!app) throw new Error(`${proposal.id}: application/team not in registry`);
  if (proposal.componentId.split(':')[0] !== proposal.team) throw new Error(`${proposal.id}: component namespace must match team`);
  if (proposal.id !== `${proposal.application}-${proposal.componentId.split(':')[1]}`) throw new Error(`${proposal.id}: proposal ID must be application-component slug`);
  if (!centralUrl(proposal.issueUrl, registry) || !centralUrl(proposal.decisionUrl, registry)) throw new Error(`${proposal.id}: proposal/decision links must belong to central repository`);
  if (proposal.owner !== proposal.team && proposal.owner !== 'design-system') throw new Error(`${proposal.id}: owner must be requesting team or design-system`);
  if (proposal.decision === 'approved-candidate' && proposal.owner !== proposal.team) throw new Error(`${proposal.id}: candidate implementation owner must be the requesting team`);
  const core = registry.teams.find((team) => team.id === 'design-system');
  const reviewers = [core?.reviewer, ...(core?.alternateReviewers ?? [])].filter(Boolean);
  if (reviewers.length && !reviewers.includes(proposal.decidedBy)) throw new Error(`${proposal.id}: decision author differs from configured Core reviewers`);
}

export function validateSubmission(submission: Submission, proposal: Proposal, registry: Registry, compatibility: { toolkitVersion: string; dsVersionRange: string; processVersionRange: string }): void {
  const app = registry.applications.find((item) => item.id === submission.application && item.team === submission.team);
  if (!app || app.repository !== submission.origin.repository) throw new Error(`${submission.id}: origin does not match registered application`);
  if (proposal.decision !== 'approved-candidate' || submission.proposalId !== proposal.id || submission.id !== proposal.id || submission.componentId !== proposal.componentId || submission.team !== proposal.team || submission.application !== proposal.application) throw new Error(`${submission.id}: no matching approved central proposal`);
  validateMetadata(submission.metadata, registry);
  if (submission.metadata.component.id !== submission.componentId || submission.metadata.governance.status !== 'candidate' || submission.metadata.governance.owner !== submission.team || submission.metadata.distribution.kind !== 'local') throw new Error(`${submission.id}: metadata identity/governance differs from candidate`);
  if (submission.preview.revision !== submission.origin.revision || submission.checks.revision !== submission.origin.revision) throw new Error(`${submission.id}: preview and checks must point to source revision`);
  if (new URL(submission.preview.url).protocol !== 'https:' || new URL(submission.checks.url).protocol !== 'https:') throw new Error(`${submission.id}: preview and checks must use HTTPS`);
  if (!submission.origin.path.endsWith('.metadata.json') || submission.origin.path.includes('..')) throw new Error(`${submission.id}: unsafe metadata path`);
  if (!semver.satisfies(submission.toolkitVersion, `^${compatibility.toolkitVersion}`) || !semver.satisfies(submission.processVersion, compatibility.processVersionRange)) throw new Error(`${submission.id}: incompatible toolkit/process version`);
  const required = ['@solidaris/ui', '@solidaris/plectrum', '@solidaris/styles'];
  if (submission.packages.length !== required.length || new Set(submission.packages.map((pkg) => pkg.name)).size !== required.length || required.some((name) => !submission.packages.some((pkg) => pkg.name === name))) throw new Error(`${submission.id}: incomplete DS package set`);
  const versions = new Set(submission.packages.map((pkg) => pkg.version));
  if (versions.size !== 1 || [...versions].some((version) => !semver.satisfies(version, compatibility.dsVersionRange))) throw new Error(`${submission.id}: incompatible DS package versions`);
  if (submission.operation === 'withdraw' && !submission.withdrawalReason) throw new Error(`${submission.id}: withdrawal requires a reason`);
  if (submission.operation !== 'withdraw' && submission.withdrawalReason) throw new Error(`${submission.id}: withdrawal reason without withdrawal`);
}

export function readCandidateRecords(root: string) {
  const registry = readRegistry(root);
  const compatibility = JSON.parse(fs.readFileSync(path.join(root, '.ai/contracts/compatibility.json'), 'utf8'));
  const proposals = records(root, 'proposals', proposalSchema);
  const submissions = records(root, 'submissions', candidateSubmissionSchema);
  const reviews = records(root, 'reviews', candidateReviewSchema);
  const promotions = records(root, 'promotions', candidatePromotionSchema);
  const figmaReturns = records(root, 'figma-returns', candidateFigmaReturnSchema);
  for (const proposal of proposals.values()) validateProposal(proposal, registry);
  for (const submission of submissions.values()) {
    const proposal = proposals.get(submission.proposalId);
    if (!proposal) throw new Error(`${submission.id}: unknown central proposal ${submission.proposalId}`);
    validateSubmission(submission, proposal, registry, compatibility);
  }
  for (const review of reviews.values()) {
    const submission = submissions.get(review.id);
    if (!submission || !review.pullRequestUrl.startsWith(`${registry.repository}/pull/`)) throw new Error(`${review.id}: review does not match a central submission`);
    const core = registry.teams.find((team) => team.id === 'design-system');
    const reviewers = [core?.reviewer, ...(core?.alternateReviewers ?? [])].filter(Boolean);
    if (reviewers.length && !reviewers.includes(review.reviewedBy)) throw new Error(`${review.id}: review actor differs from configured Core reviewers`);
  }
  for (const promotion of promotions.values()) {
    const submission = submissions.get(promotion.id);
    const review = reviews.get(promotion.id);
    if (!submission || !review || review.decision !== 'accepted' || submission.operation === 'withdraw' || review.sourceRevision !== submission.origin.revision || promotion.sourceRevision !== submission.origin.revision || promotion.sourceComponentId !== submission.componentId || promotion.coreComponentId !== submission.componentId || !promotion.integrationPullRequestUrl.startsWith(`${registry.repository}/pull/`)) throw new Error(`${promotion.id}: promotion does not match accepted submission or stable component ID`);
  }
  for (const handoff of figmaReturns.values()) {
    const promotion = promotions.get(handoff.id);
    if (!promotion || handoff.sourceRevision !== promotion.sourceRevision) throw new Error(`${handoff.id}: Figma return does not match a promotion and its source revision`);
    if (handoff.branch.mainFileKey !== registry.operations.figma.tokenLibrary || [registry.operations.figma.tokenLibrary, registry.operations.figma.componentLibrary].includes(handoff.branch.branchFileKey) || !handoff.branch.name.startsWith(registry.operations.figma.proposalCollectionPrefix)) throw new Error(`${handoff.id}: Figma return must target a verified proposal branch, not a main library`);
    const componentUrl = new URL(handoff.componentNodeUrl);
    if (!['figma.com', 'www.figma.com'].includes(componentUrl.hostname) || !componentUrl.pathname.includes(`/branch/${handoff.branch.branchFileKey}/`) || !componentUrl.searchParams.has('node-id')) throw new Error(`${handoff.id}: component URL must identify a node in the proposal branch`);
    for (const url of [handoff.designReviewUrl, handoff.branchMergeUrl, handoff.publicationUrl]) {
      if (!['figma.com', 'www.figma.com'].includes(new URL(url).hostname)) throw new Error(`${handoff.id}: design review, merge and publication evidence must be Figma URLs`);
    }
    if (!handoff.returnExport.url.startsWith(`${registry.repository}/pull/`)) throw new Error(`${handoff.id}: return export must link a central sync PR`);
    const cssVars = handoff.tokenMappings.map((entry) => entry.cssVar);
    const variableIds = handoff.tokenMappings.map((entry) => entry.variableId);
    if (new Set(cssVars).size !== cssVars.length || new Set(variableIds).size !== variableIds.length) throw new Error(`${handoff.id}: duplicate token mapping`);
  }
  return { proposals, submissions, reviews, promotions, figmaReturns, registry };
}
