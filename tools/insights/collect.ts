// Repository facts of the Core dashboard: catalogue, index scan, search
// evaluation, candidates, tokens, releases and reported usage. Facts only;
// recommendations are derived in libs/insights. Deterministic for a checkout:
// no wall-clock time, sorted output, dates from git.
import fs from 'node:fs';
import path from 'node:path';
import { adoptionReportSchema, type Registry } from '../../.ai/contracts/schema/exchange.schema';
import { readCandidateRecords } from '../candidates/records';
import { readAdoptionReports, type AdoptionReport } from '../adoption/records';
import type { AgentPoint, CandidateFact, ComponentFact, EvalCase, Provenance, RepositoryFacts, UsageFacts } from '../../libs/insights/src/insights.types';
import { fileCommits, firstAddedAt, history, showFile, tags, type Commit } from './history';
import { similarity, type Catalogue } from './similarity';

export const FILES = {
  index: '.ai/contracts/index.json',
  catalogue: 'tools/devkit/assets/catalogue.json',
  process: '.ai/contracts/process.json',
  searchEval: 'libs/ui/src/storybook/agent-eval.generated.ts',
  syncReport: 'libs/ui/src/storybook/sync-report.generated.ts',
  tokenNames: 'tools/devkit/assets/tokens.json',
  proposals: 'tools/tokens/proposed.dtcg.json',
  changesets: '.changeset',
  adoption: '.ai/adoption',
} as const;

export const REPORTED_NOTE_EMPTY = 'No application has sent a usage report yet.';

type Json = Record<string, unknown>;

export function readJson<T = Json>(root: string, file: string): T {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')) as T;
}

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const sortRecord = <T>(record: Record<string, T>): Record<string, T> =>
  Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));

/** Lower-case registry ids by id and label (index.json lists labels such as iSHARE). */
export function applicationIds(registry: Pick<Registry, 'applications'>): Map<string, string> {
  const ids = new Map<string, string>();
  for (const app of registry.applications) {
    ids.set(app.id.toLowerCase(), app.id);
    ids.set(app.label.toLowerCase(), app.id);
  }
  return ids;
}

/**
 * Index `usedIn` with component ids as keys and application ids as values. Old
 * indexes keyed the map by component name (`ProfileCard`); `names` maps those
 * to ids, else the name becomes `plectrum:{kebab-name}`.
 */
export function normalizeUsedIn(usedIn: unknown, names: ReadonlyMap<string, string>, apps: ReadonlyMap<string, string>): Record<string, string[]> | null {
  if (!usedIn || typeof usedIn !== 'object' || Array.isArray(usedIn)) return null;
  const result: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(usedIn as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue;
    const id = key.includes(':') ? key : names.get(key) ?? `plectrum:${kebab(key)}`;
    const ids = [...new Set(value.filter((item): item is string => typeof item === 'string').map((item) => apps.get(item.toLowerCase()) ?? item.toLowerCase()))].sort();
    if (ids.length) result[id] = ids;
  }
  return sortRecord(result);
}

const STATUSES = ['core', 'app', 'deprecated', 'candidate'] as const;

/** Components by governance status of one catalogue.json version; null for an unknown shape. */
export function catalogueByStatus(text: string): Record<string, number> | null {
  const catalogue = JSON.parse(text) as { components?: unknown };
  if (!Array.isArray(catalogue.components)) return null;
  const counts: Record<string, number> = Object.fromEntries(STATUSES.map((status) => [status, 0]));
  for (const entry of catalogue.components as { status?: string; metadata?: { governance?: { status?: string } } }[]) {
    const status = entry.metadata?.governance?.status ?? entry.status;
    if (status) counts[status] = (counts[status] ?? 0) + 1;
  }
  return counts;
}

export interface EvalModule {
  toolkitVersion: string;
  total: number;
  passed: number;
  rate: number;
  regressions: string[];
  fixed: string[];
  results: EvalCase[];
}

const strings = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);

/** AGENT_SEARCH_EVAL of one agent-eval.generated.ts version; null when the file holds no readable object. */
export function parseEvalModule(text: string): EvalModule | null {
  const match = /=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;?\s*$/.exec(text.trim());
  if (!match) return null;
  const raw = JSON.parse(match[1]) as Json;
  const results: EvalCase[] = (Array.isArray(raw['results']) ? (raw['results'] as Json[]) : []).map((item) => ({
    id: String(item['id']),
    query: String(item['query'] ?? ''),
    anyOf: strings(item['anyOf']),
    allOf: strings(item['allOf']),
    none: Boolean(item['none']),
    results: strings(item['results']),
    pass: Boolean(item['pass'] ?? item['passed']),
    knownMiss: Boolean(item['knownMiss']),
  }));
  const total = typeof raw['total'] === 'number' ? raw['total'] : results.length;
  const passed = typeof raw['passed'] === 'number' ? raw['passed'] : results.filter((item) => item.pass).length;
  if (!total) return null;
  return {
    toolkitVersion: String(raw['toolkitVersion'] ?? ''),
    total,
    passed,
    rate: typeof raw['rate'] === 'number' ? raw['rate'] : Math.round((passed / total) * 100),
    regressions: strings(raw['regressions']),
    fixed: strings(raw['fixed']),
    results,
  };
}

interface IndexEntry {
  name: string;
  status: ComponentFact['status'];
  owner: string;
  distribution?: { kind?: string };
}

interface IndexFile {
  components: Record<string, IndexEntry>;
  usedIn?: unknown;
  relationships?: Record<string, { usedBy?: string[] }>;
}

export function components(root: string, registry: Registry, catalogue: Catalogue): ComponentFact[] {
  const index = readJson<IndexFile>(root, FILES.index);
  const usedIn = normalizeUsedIn(index.usedIn, componentNames(index), applicationIds(registry)) ?? {};
  const entries = new Map(catalogue.components.map((entry) => [entry.id, entry]));
  return Object.entries(index.components)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, item]) => {
      const entry = entries.get(id);
      const metadata = entry?.metadata;
      const kind = (item.distribution?.kind ?? metadata?.distribution?.kind ?? 'local') as ComponentFact['distribution'];
      const angular = Boolean(entry?.package?.importPath && entry?.package?.exportName);
      const styles = metadata?.distribution?.kind === 'styles' && Boolean(metadata.component.bemBlock);
      const fact: ComponentFact = {
        id,
        name: item.name,
        status: item.status,
        owner: item.owner,
        distribution: kind,
        measurable: angular || styles,
        created: metadata?.component.created ?? '',
        modified: metadata?.component.modified ?? '',
        docsUrl: entry?.docs?.previewUrl ?? null,
        usedBy: [...(index.relationships?.[id]?.usedBy ?? [])].sort(),
        scanUsedIn: usedIn[id] ?? [],
      };
      const replacementId = metadata?.governance.replacementId;
      if (replacementId) fact.replacementId = replacementId;
      return fact;
    });
}

function componentNames(index: { components?: Record<string, { name?: string }> }): Map<string, string> {
  const names = new Map<string, string>();
  for (const [id, item] of Object.entries(index.components ?? {})) if (item.name && id.includes(':')) names.set(item.name, id);
  return names;
}

export function scanHistory(root: string, registry: Registry): RepositoryFacts['scanHistory'] {
  const apps = applicationIds(registry);
  const names = componentNames(readJson<IndexFile>(root, FILES.index));
  return history(root, FILES.index, (text) => {
    const index = JSON.parse(text) as IndexFile;
    const known = new Map([...names, ...componentNames(index)]);
    return normalizeUsedIn(index.usedIn, known, apps);
  }).map(({ at, revision, value }) => ({ at, revision, usedIn: value }));
}

export function catalogueHistory(root: string): RepositoryFacts['catalogueHistory'] {
  return history(root, FILES.catalogue, catalogueByStatus).map(({ at, revision, value }) => ({ at, revision, byStatus: value }));
}

export function searchEval(root: string, withHistory: boolean): RepositoryFacts['searchEval'] {
  const current = parseEvalModule(fs.readFileSync(path.join(root, FILES.searchEval), 'utf8'));
  if (!current) throw new Error(`${FILES.searchEval}: no AGENT_SEARCH_EVAL object`);
  const points = withHistory ? history(root, FILES.searchEval, parseEvalModule) : [];
  // A known miss is open since the oldest point of its latest uninterrupted run as a known miss.
  const knownMisses = current.results.filter((item) => item.knownMiss).map((item) => {
    let since: string | null = null;
    for (let i = points.length - 1; i >= 0; i--) {
      if (!points[i].value.results.some((result) => result.id === item.id && result.knownMiss)) break;
      since = points[i].at;
    }
    return { id: item.id, since };
  });
  return {
    toolkitVersion: current.toolkitVersion,
    total: current.total,
    passed: current.passed,
    rate: current.rate,
    regressions: current.regressions,
    fixed: current.fixed,
    knownMisses,
    results: current.results,
    history: points.map(({ at, revision, value }) => ({ at, revision, passed: value.passed, total: value.total, rate: value.rate })),
  };
}

export function candidates(root: string, withHistory: boolean): CandidateFact[] {
  const records = readCandidateRecords(root);
  const blob = (folder: string, id: string) => `${records.registry.repository}/blob/main/.ai/candidates/${folder}/${id}.json`;
  return [...records.proposals.values()]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((proposal) => {
      const submission = records.submissions.get(proposal.id);
      const review = records.reviews.get(proposal.id);
      const promotion = records.promotions.get(proposal.id);
      const figmaReturn = records.figmaReturns.get(proposal.id);
      const reviewCurrent = Boolean(submission && review && review.sourceRevision === submission.origin.revision);
      let stage: CandidateFact['stage'];
      if (proposal.decision !== 'approved-candidate') stage = proposal.decision;
      else if (!submission) stage = 'approved';
      else if (submission.operation === 'withdraw') stage = 'withdrawn';
      else if (figmaReturn) stage = 'figma-returned';
      else if (promotion) stage = 'promoted';
      else if (reviewCurrent && review) stage = review.decision;
      else stage = 'submitted';
      const links: Record<string, string> = { issue: proposal.issueUrl };
      if (proposal.decisionUrl !== proposal.issueUrl) links['decision'] = proposal.decisionUrl;
      links['proposal'] = blob('proposals', proposal.id);
      if (submission) links['submission'] = blob('submissions', proposal.id);
      if (review) links['review'] = review.pullRequestUrl;
      if (promotion) links['promotion'] = promotion.integrationPullRequestUrl;
      if (figmaReturn) links['figma'] = figmaReturn.componentNodeUrl;
      const fact: CandidateFact = {
        id: proposal.id,
        componentId: proposal.componentId,
        team: proposal.team,
        application: proposal.application,
        stage,
        decidedAt: proposal.decidedAt,
        reviewCurrent,
        links,
      };
      if (submission) fact.submittedAt = submission.submittedAt;
      if (review) fact.reviewedAt = review.reviewedAt;
      // Promotion records carry no date: the commit that added the record is the promotion.
      const promotedAt = promotion && withHistory ? firstAddedAt(root, `.ai/candidates/promotions/${proposal.id}.json`) : null;
      if (promotedAt) fact.promotedAt = promotedAt;
      if (figmaReturn) fact.figmaReturnedAt = figmaReturn.recordedAt;
      return fact;
    });
}

interface SyncReportLike {
  generatedAt: string;
  runUrl: string | null;
  stage?: string;
  result?: string;
  checks: readonly { id: string; name: string; status: string }[];
}

/**
 * Dashboard stage of the recorded token sync. On main a `proposed` record means
 * its promotion PR was merged (mark-sync-merged.mjs rewrites it only at the Pages
 * build), so only `blocked` stays blocked. A preview without a stage is no sync.
 */
export function syncStage(report: Pick<SyncReportLike, 'stage' | 'result'>): 'merged' | 'blocked' | 'released' | null {
  if (report.stage === 'blocked') return 'blocked';
  if (report.stage === 'released') return 'released';
  if (report.stage === 'proposed' || report.stage === 'merged') return 'merged';
  if (report.result === 'blocked') return 'blocked';
  if (report.result === 'promote') return 'merged';
  return null;
}

export async function tokens(root: string, withHistory: boolean): Promise<RepositoryFacts['tokens']> {
  const names = readJson<{ names: string[] }>(root, FILES.tokenNames).names.length;
  const { SYNC_REPORT } = (await import('../../libs/ui/src/storybook/sync-report.generated')) as { SYNC_REPORT: SyncReportLike };
  const stage = syncStage(SYNC_REPORT);
  const sync = stage
    ? { stage, generatedAt: SYNC_REPORT.generatedAt, runUrl: SYNC_REPORT.runUrl ?? null, checks: SYNC_REPORT.checks.map(({ id, name, status }) => ({ id, name, status })) }
    : null;
  const proposed = readJson<{ codeOwned?: Record<string, unknown> }>(root, FILES.proposals);
  const count = Object.keys(proposed.codeOwned ?? {}).length;
  return { names, sync, proposals: { count, since: count && withHistory ? firstAddedAt(root, FILES.proposals) : null } };
}

const TAG = /^plectrum-v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)-devkit-(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)$/;

/** Pending changeset front matter: `"@scope/name": minor` lines. */
export function changesetBumps(text: string): { packageName: string; bump: 'major' | 'minor' | 'patch' }[] {
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? '';
  return [...front.matchAll(/^\s*["']?([^"':\s][^"':]*)["']?\s*:\s*(major|minor|patch)\s*$/gm)]
    .map((match) => ({ packageName: match[1].trim(), bump: match[2] as 'major' | 'minor' | 'patch' }))
    .sort((a, b) => a.packageName.localeCompare(b.packageName));
}

export function releases(root: string, head: Commit, withHistory: boolean): RepositoryFacts['releases'] {
  const tagged = tags(root, 'plectrum-v*').flatMap(({ tag, at }) => {
    const match = TAG.exec(tag);
    return match ? [{ tag, runtime: match[1], toolkit: match[2], at }] : [];
  });
  const directory = path.join(root, FILES.changesets);
  const pending = (fs.existsSync(directory) ? fs.readdirSync(directory) : [])
    .filter((name) => name.endsWith('.md') && name.toLowerCase() !== 'readme.md')
    .sort()
    .map((name) => ({
      id: name.replace(/\.md$/, ''),
      bumps: changesetBumps(fs.readFileSync(path.join(directory, name), 'utf8')),
      // An uncommitted changeset is pending since this checkout.
      since: (withHistory ? firstAddedAt(root, `${FILES.changesets}/${name}`) : null) ?? head.at,
    }))
    .filter((item) => item.bumps.length);
  return { tags: tagged, pending };
}

export function mcpTools(root: string): string[] {
  const process = readJson<{ capabilities?: { plectrumMcp?: { tools?: string[] } } }>(root, FILES.process);
  return [...(process.capabilities?.plectrumMcp?.tools ?? [])];
}

/** Every committed version of each reported `.ai/adoption/{app}.json` plus the working copy, oldest first. */
export function reportedHistory(root: string, registry: Registry, withHistory: boolean): Map<string, AdoptionReport[]> {
  const current = readAdoptionReports(root);
  const result = new Map<string, AdoptionReport[]>();
  for (const app of registry.applications) {
    const file = `${FILES.adoption}/${app.id}.json`;
    const versions = new Map<string, AdoptionReport>();
    if (withHistory) {
      for (const commit of fileCommits(root, file)) {
        const text = showFile(root, commit.sha, file);
        if (!text) continue;
        try {
          const parsed = adoptionReportSchema.safeParse(JSON.parse(text));
          if (parsed.success && parsed.data.application === app.id) versions.set(parsed.data.observedAt, parsed.data);
        } catch { /* An unreadable old version is skipped. */ }
      }
    }
    const latest = current.get(app.id);
    if (latest) versions.set(latest.observedAt, latest);
    if (versions.size) result.set(app.id, [...versions.values()].sort((a, b) => a.observedAt.localeCompare(b.observedAt)));
  }
  return result;
}

function packageVersion(report: AdoptionReport): string | null {
  const versions = [...new Set(report.packages.map((pkg) => pkg.version))].sort();
  return versions.length ? versions.join(', ') : null;
}

function agentPoint(report: AdoptionReport): AgentPoint | null {
  if (!report.agent) return null;
  const { agent } = report;
  return {
    application: report.application,
    observedAt: report.observedAt,
    windowDays: agent.window.days,
    activeDays: agent.activeDays,
    tools: sortRecord(agent.tools),
    commands: sortRecord(agent.commands),
    lookups: sortRecord(agent.lookups),
    emptySearches: agent.emptySearches,
    commits: { total: agent.commits.total, reuse: agent.commits.reuse, scaffold: agent.commits.scaffold, advice: agent.commits.advice },
    reused: sortRecord(agent.commits.reused),
  };
}

/** Usage facts of one provenance from each application's reports (oldest first). */
export async function usageFacts(provenance: Provenance, note: string, staleAfterDays: number, registry: Registry, reports: ReadonlyMap<string, AdoptionReport[]>, catalogue: Catalogue): Promise<UsageFacts> {
  const apps = [...registry.applications].sort((a, b) => a.id.localeCompare(b.id));
  const latest = apps.flatMap((app) => {
    const report = reports.get(app.id)?.at(-1);
    return report ? [report] : [];
  });
  const localComponents = latest
    .flatMap((report) => (report.localComponents ?? []).map((local) => ({ ...local, useCases: [...local.useCases], team: report.team, application: report.application })))
    .sort((a, b) => a.application.localeCompare(b.application) || a.id.localeCompare(b.id));
  return {
    provenance,
    note,
    staleAfterDays,
    applications: apps.map((app) => {
      const history = reports.get(app.id) ?? [];
      const report = history.at(-1);
      return { id: app.id, label: app.label, team: app.team, kind: app.kind, reportedAt: report?.observedAt ?? null, packageVersion: report ? packageVersion(report) : null, reports: history.length };
    }),
    observations: latest
      .flatMap((report) => report.observations.map((item) => ({ application: report.application, componentId: item.componentId, count: item.count, files: item.files.length })))
      .sort((a, b) => a.application.localeCompare(b.application) || a.componentId.localeCompare(b.componentId)),
    agentHistory: apps.flatMap((app) => (reports.get(app.id) ?? []).flatMap((report) => agentPoint(report) ?? [])),
    localComponents,
    similarity: await similarity(localComponents, catalogue),
  };
}
