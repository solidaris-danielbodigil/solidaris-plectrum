#!/usr/bin/env node
// Turn a sync diff into a changeset, or a no-release record when nothing shipped changed.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const PACKAGES = ['@solidaris-danielbodigil/ui', '@solidaris-danielbodigil/plectrum', '@solidaris-danielbodigil/styles'];

export function releaseFromReport(report) {
  const changed = report.diff?.changed?.length ?? 0;
  const added = report.diff?.added?.length ?? 0;
  const removed = report.diff?.removed?.length ?? 0;
  const meaningful = changed + added + removed;
  const revision = report.provenance?.revision ?? report.sha ?? 'unknown';
  if (!meaningful) {
    return {
      classification: 'no-release',
      reason: 'The sync did not change token values. Shadow reorders and unchanged exports do not ship.',
      provenance: report.provenance ?? null,
      source: report.source ?? null,
    };
  }
  const summary = [
    `Figma token sync ${revision}.`,
    '',
    `${changed} values changed, ${added} added, ${removed} removed.`,
    'Review the sync report before merging. Adjust the bump if the change is not a patch.',
  ].join('\n');
  const front = PACKAGES.map((name) => `"${name}": patch`).join('\n');
  return {
    classification: 'changeset',
    changeset: `---\n${front}\n---\n\n${summary}\n`,
    summary,
    provenance: report.provenance ?? null,
    source: report.source ?? null,
  };
}

function readArgs(argv) {
  const out = { report: '', intent: '', changeset: '' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--report') out.report = argv[++i];
    else if (argv[i] === '--intent') out.intent = argv[++i];
    else if (argv[i] === '--changeset') out.changeset = argv[++i];
  }
  return out;
}

if (process.argv[1]?.endsWith('sync-release.mjs')) {
  const args = readArgs(process.argv.slice(2));
  const report = JSON.parse(await import('node:fs').then((fs) => fs.readFileSync(args.report, 'utf8')));
  const intent = releaseFromReport(report);
  if (args.intent) {
    mkdirSync(dirname(args.intent), { recursive: true });
    writeFileSync(args.intent, `${JSON.stringify({ classification: intent.classification, reason: intent.reason ?? intent.summary, provenance: intent.provenance, source: intent.source }, null, 2)}\n`);
  }
  if (intent.changeset && args.changeset) {
    mkdirSync(dirname(args.changeset), { recursive: true });
    writeFileSync(args.changeset, intent.changeset);
  }
  console.log(`Release intent: ${intent.classification}`);
}
