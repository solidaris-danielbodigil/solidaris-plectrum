// Demo usage reports of the Core dashboard. Component usage is the real devkit
// scan of each local-demo application in this repository; agent counts and
// local components come from tools/insights/demo/seed.json and are invented.
// Reports live in memory only: never write them to .ai/adoption, because
// contracts:generate ships local components from there to every consumer.
import fs from 'node:fs';
import path from 'node:path';
import { adoptionReportSchema, type Registry } from '../../.ai/contracts/schema/exchange.schema';
import { validateAdoptionReport, type AdoptionReport } from '../adoption/records';
import type { Commit } from './history';
import type { Catalogue } from './similarity';

export const SEED_FILE = 'tools/insights/demo/seed.json';
export const DEMO_NOTE = 'Demo data: component usage is scanned from this repository; agent counts and local components are invented.';
const DAY_MS = 24 * 60 * 60 * 1000;
const PACKAGES = ['libs/ui', 'libs/plectrum', 'libs/styles'];

// Scanner limitations as written by the devkit adoption report
// (tools/devkit/src/workflows.mjs adoptionReport), plus the demo disclaimer.
export const DEMO_LIMITATIONS = [
  'Static source references can include unused imports.',
  'Styles-only components are detected by their BEM block class (block, element or modifier) in templates and class strings; class names built at runtime are missed.',
  'Runtime rendering and dynamic composition are not measured.',
  'PrimeNG controls are omitted until a reliable selector mapping is packed with the toolkit.',
  'Installed package versions are not usage.',
  'A missing central report is not proof of non-adoption.',
  `DEMO: agent counts and local components are seeded (${SEED_FILE}).`,
];

type Agent = NonNullable<AdoptionReport['agent']>;

export interface SeedSnapshot {
  weeksBeforeHead: number;
  agent?: Omit<Agent, 'window'> & { days: number };
}

export interface SeedApplication {
  /** DS package version the demo application pins; defaults to the workspace version. */
  packageVersion?: string;
  snapshots: SeedSnapshot[];
  localComponents?: NonNullable<AdoptionReport['localComponents']>;
}

export interface Seed {
  schemaVersion: 1;
  provenance: 'demo';
  note: string;
  applications: Record<string, SeedApplication>;
}

export function readSeed(root: string): Seed {
  return JSON.parse(fs.readFileSync(path.join(root, SEED_FILE), 'utf8')) as Seed;
}

/** Ids of every local component the seed invents; they must never reach a shipped asset. */
export function seedLocalIds(seed: Seed): string[] {
  return Object.values(seed.applications).flatMap((app) => (app.localComponents ?? []).map((local) => local.id)).sort();
}

export interface DemoContext {
  registry: Registry;
  head: Commit;
  catalogue: Catalogue;
  knownIds: ReadonlySet<string>;
}

/**
 * One validated demo report per seed snapshot (oldest first) for each
 * local-demo application. Every snapshot carries the scan of HEAD; only the
 * seeded agent block and observation time differ.
 */
export async function demoReports(root: string, { registry, head, catalogue, knownIds }: DemoContext, seed = readSeed(root)): Promise<Map<string, AdoptionReport[]>> {
  const { scanObservations } = (await import('../devkit/src/workflows.mjs')) as {
    scanObservations: (root: string, files: string[], catalogue: Catalogue) => AdoptionReport['observations'];
  };
  const { filesUnder, packageJson } = (await import('../devkit/src/common.mjs')) as { filesUnder: (directory: string) => string[]; packageJson: { version: string } };
  const result = new Map<string, AdoptionReport[]>();
  const headTime = Date.parse(head.at);
  for (const app of registry.applications.filter((item) => item.kind === 'local-demo' && item.path)) {
    const sourceFiles = filesUnder(path.join(root, app.path!, 'src'))
      .filter((file) => /\.(ts|html)$/.test(file) && !/\.(spec|stories|metadata)\.ts$/.test(file))
      .sort();
    const observations = scanObservations(root, sourceFiles, catalogue);
    const seeded = seed.applications[app.id] ?? { snapshots: [{ weeksBeforeHead: 0 }] };
    const packages = PACKAGES.map((folder) => {
      const pkg = JSON.parse(fs.readFileSync(path.join(root, folder, 'package.json'), 'utf8')) as { name: string; version: string };
      return { name: pkg.name, version: seeded.packageVersion ?? pkg.version };
    });
    const reports: AdoptionReport[] = [];
    for (const snapshot of [...seeded.snapshots].sort((a, b) => b.weeksBeforeHead - a.weeksBeforeHead)) {
      const observedAt = new Date(headTime - snapshot.weeksBeforeHead * 7 * DAY_MS).toISOString();
      const report: AdoptionReport = {
        schemaVersion: 1,
        application: app.id,
        team: app.team,
        source: { repository: app.repository, revision: head.sha, path: '.' },
        observedAt,
        reporterVersion: packageJson.version,
        packages,
        observations,
        limitations: DEMO_LIMITATIONS,
        localComponents: seeded.localComponents ?? [],
      };
      if (snapshot.agent) {
        const { days, ...counts } = snapshot.agent;
        report.agent = { window: { from: new Date(Date.parse(observedAt) - days * DAY_MS).toISOString(), to: observedAt, days }, ...counts };
      }
      const parsed = adoptionReportSchema.parse(report);
      validateAdoptionReport(parsed, registry, knownIds, reports.at(-1));
      reports.push(parsed);
    }
    result.set(app.id, reports);
  }
  return result;
}
