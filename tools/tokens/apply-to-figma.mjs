#!/usr/bin/env node
/**
 * Apply proposed.dtcg.json to a Figma **branch**, never the main file.
 *
 *   1. GET /v1/files/:key?branch_data=true
 *   2. Resolve branch `proposals/{app}`
 *   3. POST /v1/files/:branchKey/variables  — only when --write is passed
 *
 * Dry-run is the default. Abort if the named branch is missing.
 * Figma branch creation is a manual Full-seat UI action (no API).
 *
 * Real writes: workflow_dispatch + GitHub Environment approval.
 *
 * Usage:
 *   node tools/tokens/apply-to-figma.mjs --app ishare
 *   node tools/tokens/apply-to-figma.mjs --app ishare --write
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_FILE_KEY = 'YNZ1DlSjDNUXrvkxlSp10D';
const DEFAULT_PROPOSAL = join(__dirname, 'proposed.dtcg.json');

function parseArgs(argv) {
  const out = {
    app: 'app',
    dryRun: true,
    proposal: DEFAULT_PROPOSAL,
    fileKey: process.env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--app') {
      out.app = argv[++i];
    } else if (arg === '--write') {
      out.dryRun = false;
    } else if (arg === '--dry-run') {
      out.dryRun = true;
    } else if (arg === '--proposal') {
      out.proposal = argv[++i];
    } else if (arg === '--file-key') {
      out.fileKey = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      out.help = true;
    }
  }
  return out;
}

function help() {
  console.log(`Usage: node tools/tokens/apply-to-figma.mjs --app <name> [--dry-run|--write]

Resolves Figma branch proposals/{app} via GET /v1/files/:key?branch_data=true.
Aborts if that branch is missing — never falls back to mainFileKey.

--dry-run (default) prints the POST payload + resolved branch key, zero writes.
--write   POST /v1/files/:branchKey/variables (requires FIGMA_TOKEN + Environment approval).

Constraints:
  - Rate limit / ~4MB body / atomic 400 (one invalid variable fails the batch)
  - Branch creation is manual in the Figma UI (Full seat)`);
}

async function figmaGet(path, token) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': token },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GET ${path} → ${res.status} ${text}`);
  }
  return JSON.parse(text);
}

function buildPayload(proposal) {
  const variables = [];
  for (const [name, token] of Object.entries(proposal.codeOwned ?? {})) {
    variables.push({
      name,
      resolvedType: token.$type === 'color' ? 'COLOR' : 'FLOAT',
      valuesByMode: { placeholder: token.$value },
    });
  }
  return { variables };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    help();
    return;
  }

  const branchName = `proposals/${args.app}`;
  const proposal = existsSync(args.proposal)
    ? JSON.parse(readFileSync(args.proposal, 'utf8'))
    : { codeOwned: {} };
  const payload = buildPayload(proposal);
  const token = process.env.FIGMA_TOKEN;

  if (!token) {
    console.log(`apply-to-figma: FIGMA_TOKEN unset — printing dry-run payload only.`);
    console.log(`requested branch: ${branchName}`);
    console.log(`resolved branch key: (unavailable without FIGMA_TOKEN)`);
    console.log(`main file key (never written): ${args.fileKey}`);
    console.log(JSON.stringify(payload, null, 2));
    console.log('dry-run: zero writes.');
    return;
  }

  const file = await figmaGet(`/files/${args.fileKey}?branch_data=true`, token);
  const branches = file.branches ?? file.meta?.branches ?? [];
  const branch = branches.find(
    (item) => item.name === branchName || item.key === branchName,
  );

  if (!branch) {
    console.error(
      `Figma branch "${branchName}" is missing. Create it in the Figma UI (Full seat). ` +
        `Aborting — will not write to main file ${args.fileKey}.`,
    );
    process.exitCode = 1;
    return;
  }

  const branchKey = branch.key;
  console.log(`resolved branch: ${branchName} → ${branchKey}`);
  console.log(`payload variables: ${payload.variables.length}`);
  console.log(JSON.stringify(payload, null, 2));

  if (args.dryRun) {
    console.log('dry-run: zero writes.');
    return;
  }

  const res = await fetch(`https://api.figma.com/v1/files/${branchKey}/variables`, {
    method: 'POST',
    headers: {
      'X-Figma-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`POST variables failed: ${res.status} ${text}`);
    process.exitCode = 1;
    return;
  }
  console.log('apply-to-figma: wrote variables to branch', branchKey);
}

await main();
