import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { inventory } from '../contracts/inventory';
import { readCandidateRecords } from './records';

export async function checkCandidates(root = process.cwd(), base?: string): Promise<void> {
  const records = readCandidateRecords(root);
  const core = await inventory(root);
  const coreIds = new Set(core.map((entry) => entry.metadata.component.id));
  for (const promotion of records.promotions.values()) {
    const entry = core.find((item) => item.metadata.component.id === promotion.coreComponentId);
    if (!entry || entry.metadata.governance.status !== 'core' || entry.metadata.distribution.kind === 'local') throw new Error(`${promotion.id}: promotion needs integrated, package-eligible Core metadata and source`);
    const stories = path.join(root, entry.metadataPath.replace(/\.metadata\.ts$/, '.stories.ts'));
    if (!fs.existsSync(stories)) throw new Error(`${promotion.id}: integrated Core component needs colocated stories`);
    if (entry.metadata.distribution.kind === 'angular') {
      const source = path.join(root, entry.metadata.component.path);
      const stem = source.replace(/\.component\.ts$/, '');
      if (!fs.existsSync(`${stem}.component.spec.ts`) && !fs.existsSync(`${stem}.spec.ts`)) throw new Error(`${promotion.id}: integrated Angular component needs unit tests`);
    }
    for (const [kind, reference] of Object.entries(promotion.review)) {
      if (!reference.url.startsWith('https://') || reference.revision !== promotion.sourceRevision) throw new Error(`${promotion.id}: ${kind} review must point at submitted source revision`);
    }
  }
  for (const submission of records.submissions.values()) {
    if (submission.operation !== 'withdraw' && coreIds.has(submission.componentId) && !records.promotions.has(submission.id)) throw new Error(`${submission.id}: Core identity is integrated without promotion record`);
  }
  if (base) {
    const changed = new Set(execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/));
    for (const promotion of records.promotions.values()) {
      if (!changed.has(`.ai/candidates/promotions/${promotion.id}.json`)) continue;
      const entry = core.find((item) => item.metadata.component.id === promotion.coreComponentId)!;
      if (!changed.has(entry.metadataPath) || !changed.has(entry.metadata.component.path) || ![...changed].some((file) => /^\.changeset\/[^/]+\.md$/.test(file))) throw new Error(`${promotion.id}: promotion PR must integrate Core source/metadata and a changeset`);
    }
    for (const submission of records.submissions.values()) {
      const relative = `.ai/candidates/submissions/${submission.id}.json`;
      if (!changed.has(relative)) continue;
      let previous: typeof submission | undefined;
      try { previous = JSON.parse(execFileSync('git', ['show', `${base}:${relative}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })); }
      catch { /* A new record has no base counterpart. */ }
      if (!previous && submission.operation !== 'submit') throw new Error(`${submission.id}: new submission must use submit`);
      if (previous && submission.operation === 'submit') throw new Error(`${submission.id}: use revise or withdraw for an existing submission`);
      if (previous?.operation === 'withdraw' && JSON.stringify(previous) !== JSON.stringify(submission)) throw new Error(`${submission.id}: withdrawn IDs cannot be reused`);
      if (previous && (previous.id !== submission.id || previous.team !== submission.team || previous.application !== submission.application || previous.componentId !== submission.componentId || previous.origin.repository !== submission.origin.repository || previous.proposalId !== submission.proposalId)) throw new Error(`${submission.id}: immutable candidate identity changed`);
    }
  }
  console.log(`Candidate records valid: ${records.proposals.size} proposals, ${records.submissions.size} submissions, ${records.reviews.size} reviews, ${records.promotions.size} promotions.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkCandidates(process.cwd(), process.argv.includes('--base') ? process.argv[process.argv.indexOf('--base') + 1] : undefined).catch((error) => { console.error(error); process.exitCode = 1; });
}
