#!/usr/bin/env node
/**
 * Safety net: GET /v1/files/{key}/variables/local and flag variables that
 * changed in Figma but were never plugin-pushed into tokens.json.
 *
 * Needs FIGMA_TOKEN. Optional FIGMA_FILE_KEY (default: Plectrum UI Kit).
 *
 * Usage:
 *   node tools/tokens/pull-figma.mjs
 *   node tools/tokens/pull-figma.mjs --help
 *
 * Constraints (Figma Variables API):
 *   - Rate limit: stay under 429; this script does a single GET
 *   - Request bodies for writes are capped (~4MB) — this script is read-only
 *   - Atomic 400: a single invalid variable fails the whole write (Wave 7)
 */

import { resolveDtcg } from './resolve-dtcg.mjs';
import { normalizeHex } from './format-value.mjs';

const DEFAULT_FILE_KEY = 'YNZ1DlSjDNUXrvkxlSp10D';

function help() {
  console.log(`Usage: node tools/tokens/pull-figma.mjs [--file-key KEY]

Read-only safety net against the Figma Variables API.

Environment:
  FIGMA_TOKEN      required (repo secret)
  FIGMA_FILE_KEY   optional, default ${DEFAULT_FILE_KEY}

Exits 1 when a published Figma color/float variable has no matching
resolved path in libs/plectrum/src/tokens.json (plugin never pushed it).`);
}

function figmaNameToPath(name) {
  return String(name)
    .replaceAll('/', '.')
    .replaceAll(' ', '.')
    .toLowerCase();
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    help();
    return;
  }

  const token = process.env.FIGMA_TOKEN;
  const fileKey =
    process.env.FIGMA_FILE_KEY ||
    process.argv[process.argv.indexOf('--file-key') + 1] ||
    DEFAULT_FILE_KEY;

  if (!token) {
    console.error('FIGMA_TOKEN is not set. Skipping live pull (local/dev).');
    process.exitCode = 0;
    return;
  }

  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token },
  });
  if (!res.ok) {
    console.error(`Figma variables GET failed: ${res.status} ${await res.text()}`);
    process.exitCode = 1;
    return;
  }

  const payload = await res.json();
  const variables = Object.values(payload.meta?.variables ?? {});
  const dtcg = resolveDtcg();
  const missing = [];

  for (const variable of variables) {
    const path = figmaNameToPath(variable.name);
    const resolved = dtcg.resolved[path];
    if (resolved != null) continue;
    if (dtcg.byPath.has(path)) continue;
    missing.push({
      name: variable.name,
      path,
      resolvedType: variable.resolvedType,
    });
  }

  console.log(
    `pull-figma: ${variables.length} Figma variables, ${missing.length} not in tokens.json`,
  );
  for (const row of missing.slice(0, 40)) {
    console.log(`  ${row.name}  → ${row.path}  (${row.resolvedType})`);
  }
  if (missing.length > 40) console.log(`  … ${missing.length - 40} more`);

  // unused helper keeps the import live for color compares in later diffs
  void normalizeHex;
  process.exitCode = missing.length ? 1 : 0;
}

await main();
