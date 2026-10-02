import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { adoptionReportSchema, type Registry } from '../../.ai/contracts/schema/exchange.schema';
import { readRegistry } from '../contracts/validate';
import { inventory } from '../contracts/inventory';

export const STALE_AFTER_DAYS = 14;
const requiredPackages = ['@solidaris-danielbodigil/pds-ui', '@solidaris-danielbodigil/pds-plectrum', '@solidaris-danielbodigil/pds-styles'];

export type AdoptionReport = ReturnType<typeof adoptionReportSchema.parse>;

export interface UsageSighting {
  application: string;
  label: string;
  kind: 'local-demo' | 'external';
  freshness: 'current' | 'stale';
  observedAt: string;
  packageVersion: string;
}

export interface LocalComponentSighting {
  id: string;
  name: string;
  description: string;
  useCases: string[];
  reusePotential: 'none' | 'possible' | 'likely' | 'unknown';
  reuseNote?: string;
  team: string;
  application: string;
  label: string;
  freshness: 'current' | 'stale';
}

/** One application's Plectrum agent counts, as reported; counts only, never request text. */
export interface AgentUsage {
  application: string;
  label: string;
  freshness: 'current' | 'stale';
  observedAt: string;
  windowDays: number;
  activeDays: number;
  toolCalls: number;
  searches: number;
  emptySearches: number;
  lookups: Record<string, number>;
  commits: { total: number; reuse: number; scaffold: number; advice: number };
  reused: Record<string, number>;
}

export interface AdoptionAggregate {
  staleAfterDays: number;
  agent: AgentUsage[];
  localComponents: LocalComponentSighting[];
  usedIn: Record<string, UsageSighting[]>;
  missing: { id: string; label: string; kind: 'local-demo' | 'external' }[];
  reported: { id: string; label: string }[];
  retired: { id: string; observedAt: string }[];
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function readAdoptionReports(root: string): Map<string, AdoptionReport> {
  const directory = path.join(root, '.ai/adoption');
  const reports = new Map<string, AdoptionReport>();
  if (!fs.existsSync(directory)) return reports;
  for (const name of fs.readdirSync(directory).filter((file) => file.endsWith('.json')).sort()) {
    const report = adoptionReportSchema.parse(readJson(path.join(directory, name)));
    if (name !== `${report.application}.json` || reports.has(report.application)) {
      throw new Error(`${name}: filename must match the application id`);
    }
    reports.set(report.application, report);
  }
  return reports;
}

export function validateAdoptionReport(report: AdoptionReport, registry: Registry, knownIds: ReadonlySet<string>, previous?: AdoptionReport): void {
  const app = registry.applications.find((item) => item.id === report.application);
  if (!app) throw new Error(`${report.application}: retired or unknown application`);
  if (app.team !== report.team || app.repository !== report.source.repository) {
    throw new Error(`${report.application}: report identity does not match the registry`);
  }
  if (report.source.path !== '.') throw new Error(`${report.application}: report must describe the whole application`);
  const installed = new Set(report.packages.map((pkg) => pkg.name));
  if (requiredPackages.some((name) => !installed.has(name))) throw new Error(`${report.application}: report must list the installed DS packages separately from usage`);
  for (const observation of report.observations) {
    if (!knownIds.has(observation.componentId)) throw new Error(`${report.application}: unknown component ${observation.componentId}`);
    if (observation.count < 1 || observation.files.length < 1) throw new Error(`${report.application}: usage needs a positive count and a file`);
  }
  const localIds = new Set<string>();
  for (const local of report.localComponents ?? []) {
    if (!local.id.startsWith(`${report.team}:`)) throw new Error(`${report.application}: local component ${local.id} must use the team prefix ${report.team}:`);
    if (localIds.has(local.id)) throw new Error(`${report.application}: duplicate local component ${local.id}`);
    localIds.add(local.id);
  }
  if (previous && report.observedAt < previous.observedAt) throw new Error(`${report.application}: older report cannot replace a newer observation`);
  if (previous && report.observedAt === previous.observedAt && JSON.stringify(report) !== JSON.stringify(previous)) {
    throw new Error(`${report.application}: duplicate observation time with different content`);
  }
}

export function aggregateAdoption(reports: Iterable<AdoptionReport>, registry: Registry, now = new Date()): AdoptionAggregate {
  const byId = new Map([...reports].map((report) => [report.application, report]));
  const usedIn: Record<string, UsageSighting[]> = {};
  const missing: AdoptionAggregate['missing'] = [];
  const reported: AdoptionAggregate['reported'] = [];
  const retired: AdoptionAggregate['retired'] = [];
  const localComponents: LocalComponentSighting[] = [];
  const agent: AgentUsage[] = [];
  const staleMs = STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;
  for (const app of registry.applications) {
    const report = byId.get(app.id);
    if (!report) {
      missing.push({ id: app.id, label: app.label, kind: app.kind });
      continue;
    }
    const versions = [...new Set(report.packages.map((pkg) => pkg.version))];
    const packageVersion = versions.length === 1 ? versions[0] : versions.sort().join(', ');
    reported.push({ id: app.id, label: app.label });
    const freshness = now.getTime() - Date.parse(report.observedAt) > staleMs ? 'stale' : 'current';
    if (report.agent) {
      const { agent: usage } = report;
      agent.push({
        application: app.id,
        label: app.label,
        freshness,
        observedAt: report.observedAt,
        windowDays: usage.window.days,
        activeDays: usage.activeDays,
        toolCalls: Object.values(usage.tools).reduce((sum, count) => sum + count, 0),
        searches: usage.tools['search_components'] ?? 0,
        emptySearches: usage.emptySearches,
        lookups: usage.lookups,
        commits: { total: usage.commits.total, reuse: usage.commits.reuse, scaffold: usage.commits.scaffold, advice: usage.commits.advice },
        reused: usage.commits.reused,
      });
    }
    for (const local of report.localComponents ?? []) {
      localComponents.push({ ...local, team: report.team, application: app.id, label: app.label, freshness });
    }
    for (const observation of report.observations) {
      const sightings = usedIn[observation.componentId] ?? [];
      sightings.push({ application: app.id, label: app.label, kind: app.kind, freshness, observedAt: report.observedAt, packageVersion });
      usedIn[observation.componentId] = sightings.sort((a, b) => a.label.localeCompare(b.label));
    }
  }
  for (const [id, report] of byId) {
    if (!registry.applications.some((app) => app.id === id)) retired.push({ id, observedAt: report.observedAt });
  }
  return { staleAfterDays: STALE_AFTER_DAYS, agent: agent.sort((a, b) => a.label.localeCompare(b.label)), localComponents: localComponents.sort((a, b) => a.label.localeCompare(b.label) || a.name.localeCompare(b.name)), usedIn, missing, reported: reported.sort((a, b) => a.label.localeCompare(b.label)), retired: retired.sort((a, b) => a.id.localeCompare(b.id)) };
}

export async function checkAdoption(root = process.cwd(), base?: string): Promise<AdoptionAggregate> {
  const registry = readRegistry(root);
  const knownIds = new Set((await inventory(root)).map((item) => item.metadata.component.id));
  const reports = readAdoptionReports(root);
  for (const report of reports.values()) {
    let previous: AdoptionReport | undefined;
    if (base) {
      try {
        previous = adoptionReportSchema.parse(JSON.parse(execFileSync('git', ['show', `${base}:.ai/adoption/${report.application}.json`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })));
      } catch { /* A first report has no base counterpart. */ }
    }
    validateAdoptionReport(report, registry, knownIds, previous);
  }
  const aggregate = aggregateAdoption(reports.values(), registry);
  if (aggregate.retired.length) throw new Error(`Retired adoption reports must be removed with the application: ${aggregate.retired.map((item) => item.id).join(', ')}`);
  console.log(`Adoption reports valid: ${reports.size} current, ${aggregate.missing.length} missing, ${aggregate.localComponents.length} local component(s). Missing is not non-adoption.`);
  return aggregate;
}
