#!/usr/bin/env node
// Reject a Figma staging dump that cannot be pinned to an exporter, file and revision.
import { readFileSync, writeFileSync } from 'node:fs';

export function assessStaging(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    errors.push('Staging tokens must be a JSON object.');
    return errors;
  }
  if (typeof doc.source !== 'string' || !doc.source.trim()) errors.push('Missing exporter source.');
  const provenance = doc.provenance;
  if (!provenance || typeof provenance !== 'object' || Array.isArray(provenance)) errors.push('Missing provenance.');
  else {
    for (const key of ['fileKey', 'revision', 'schemaVersion']) {
      if (typeof provenance[key] !== 'string' || !provenance[key].trim()) errors.push(`Missing provenance.${key}.`);
    }
  }
  const tokens = Object.keys(doc).filter((key) => key !== 'source' && key !== 'provenance');
  if (!tokens.length) errors.push('Staging contains no tokens.');
  return errors;
}

export function releaseIntent(doc) {
  return {
    classification: 'no-release',
    reason: 'This Figma sync does not publish packages. A reviewer adds a changeset when the value change must ship.',
    source: doc.source,
    provenance: doc.provenance,
  };
}

function readArgs(argv) {
  const out = { file: '', intent: '' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--intent') out.intent = argv[++i];
    else out.file = argv[i];
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1].replaceAll('\\', '/')}` || process.argv[1]?.endsWith('staging-gate.mjs')) {
  const args = readArgs(process.argv.slice(2));
  if (!args.file) {
    console.error('Usage: node tools/tokens/staging-gate.mjs [--intent out.json] <tokens.json>');
    process.exit(1);
  }
  let doc;
  try { doc = JSON.parse(readFileSync(args.file, 'utf8')); }
  catch (error) {
    console.error(`Incomplete staging: ${args.file} is not JSON (${error.message}).`);
    process.exit(1);
  }
  const errors = assessStaging(doc);
  if (errors.length) {
    console.error(`Incomplete staging: ${args.file}`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  if (args.intent) writeFileSync(args.intent, `${JSON.stringify(releaseIntent(doc), null, 2)}\n`);
  console.log(`Staging pinned: ${doc.source} ${doc.provenance.fileKey} @ ${doc.provenance.revision}`);
}
