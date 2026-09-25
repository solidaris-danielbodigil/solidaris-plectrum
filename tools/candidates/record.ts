import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exchangeSchemas } from '../../.ai/contracts/schema/exchange.schema';
import { readRegistry } from '../contracts/validate';
import { checkCandidates } from './check';
import { readCandidateRecords } from './records';

const kinds = { proposal: ['proposals', exchangeSchemas.proposal], review: ['reviews', exchangeSchemas.candidateReview], promotion: ['promotions', exchangeSchemas.candidatePromotion] } as const;

function option(args: string[], key: string): string {
  const index = args.indexOf(`--${key}`);
  const value = args[index + 1];
  if (index < 0 || !value || value.startsWith('--')) throw new Error(`Missing --${key}`);
  return value;
}

export function candidateRecordFromFlags(root: string, kind: keyof typeof kinds, args: string[]): unknown {
  const registry = readRegistry(root);
  if (!registry.teams.find((team) => team.id === 'design-system')?.reviewer) throw new Error('Configure the Core reviewer first.');
  const now = new Date().toISOString();
  if (kind === 'proposal') {
    const team = option(args, 'team');
    const application = option(args, 'application');
    const component = option(args, 'component');
    const decision = option(args, 'decision');
    return { schemaVersion: 1, id: `${application}-${component}`, componentId: `${team}:${component}`, team, application, issueUrl: option(args, 'issue'), decision, owner: decision === 'approved-candidate' ? team : 'design-system', decidedBy: option(args, 'decided-by'), decidedAt: now, decisionUrl: option(args, 'decision-url'), note: option(args, 'note') };
  }
  const id = option(args, 'id');
  const records = readCandidateRecords(root);
  const submission = records.submissions.get(id);
  if (!submission || submission.operation === 'withdraw') throw new Error(`${id}: no active central submission`);
  if (kind === 'review') return { schemaVersion: 1, id, decision: option(args, 'decision'), pullRequestUrl: option(args, 'pull-request'), reviewedBy: option(args, 'reviewed-by'), reviewedAt: now, sourceRevision: submission.origin.revision, note: option(args, 'note') };
  const evidence = Object.fromEntries(['api', 'tokens', 'dependencies', 'i18n', 'accessibility', 'figma'].map((name) => [name, { url: option(args, name), revision: submission.origin.revision }]));
  return { schemaVersion: 1, id, sourceComponentId: submission.componentId, coreComponentId: submission.componentId, integrationPullRequestUrl: option(args, 'integration-pr'), sourceRevision: submission.origin.revision, review: evidence };
}

export async function recordCandidate(root: string, kind: keyof typeof kinds, input: unknown): Promise<string> {
  const [folder, schema] = kinds[kind];
  const data = typeof input === 'string' ? JSON.parse(fs.readFileSync(path.resolve(input), 'utf8')) : input;
  const parsed = schema.parse(data);
  const target = path.join(root, '.ai/candidates', folder, `${parsed.id}.json`);
  if (fs.existsSync(target)) throw new Error(`${kind} ${parsed.id} already exists; revise it in a reviewed PR.`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(parsed, null, 2)}\n`);
  try { await checkCandidates(root); }
  catch (error) { fs.rmSync(target); throw error; }
  return target;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const kind = process.argv[2] as keyof typeof kinds;
  if (!Object.hasOwn(kinds, kind)) throw new Error('Usage: npm run candidate:record -- <proposal|review|promotion> [--file record.json | flags]');
  const args = process.argv.slice(3);
  const input = args.includes('--file') ? option(args, 'file') : candidateRecordFromFlags(process.cwd(), kind, args);
  recordCandidate(process.cwd(), kind, input).then((target) => console.log(`Recorded ${target}; commit with the review or integration PR.`)).catch((error) => { console.error(error); process.exitCode = 1; });
}
