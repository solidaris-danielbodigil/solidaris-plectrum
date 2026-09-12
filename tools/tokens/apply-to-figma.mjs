#!/usr/bin/env node
/**
 * Apply proposed.dtcg.json to a Figma **branch**, never the main file.
 *
 *   1. GET /v1/files/:mainKey?branch_data=true
 *   2. Resolve branch `proposals/{app}` — abort if missing
 *   3. GET /v1/files/:branchKey/variables/local
 *   4. POST /v1/files/:branchKey/variables  — only when --write is passed
 *
 * Dry-run is the default. Figma branch creation is a manual Full-seat UI action.
 *
 * Enterprise only: steps 3–4 need file_variables:read / file_variables:write,
 * scopes Figma does not offer on the Organization plan (403 Invalid scope).
 * Parked Enterprise alternative. Live path: tools/figma-plugin.
 *
 * Usage:
 *   node tools/tokens/apply-to-figma.mjs --app scratch
 *   node tools/tokens/apply-to-figma.mjs --app scratch --only color/pipeline/probe --write
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { cssToFigmaColor, MAIN_FILE_KEY } from './figma-values.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_FILE_KEY = MAIN_FILE_KEY;
const DEFAULT_PROPOSAL = join(__dirname, 'proposed.dtcg.json');

function parseArgs(argv) {
  const out = {
    app: 'scratch',
    dryRun: true,
    proposal: DEFAULT_PROPOSAL,
    fileKey: process.env.FIGMA_MAIN_FILE_KEY || DEFAULT_FILE_KEY,
    branchKey: process.env.FIGMA_PROPOSAL_BRANCH_KEY || '',
    only: [],
    all: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--app') out.app = argv[++i];
    else if (arg === '--write') out.dryRun = false;
    else if (arg === '--dry-run') out.dryRun = true;
    else if (arg === '--proposal') out.proposal = argv[++i];
    else if (arg === '--file-key') out.fileKey = argv[++i];
    else if (arg === '--branch-key') out.branchKey = argv[++i];
    else if (arg === '--all') out.all = true;
    else if (arg === '--only') {
      out.only = String(argv[++i] ?? '')
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean);
    } else if (arg === '--help' || arg === '-h') out.help = true;
  }
  return out;
}

function help() {
  console.log(`Usage: node tools/tokens/apply-to-figma.mjs --app <name> [--only name] [--dry-run|--write]

Resolves Figma branch proposals/{app} from the main UI Kit file.
Aborts if that branch is missing — never writes to main.

--only       comma-separated Figma names (required unless --all), e.g. color/pipeline/probe
--all        include every color in proposed.dtcg.json (do not use for the first write)
--branch-key Figma branch file key (from /design/{main}/branch/{key}/…). Skips branch listing.
--dry-run    (default) prints the POST payload + resolved branch key
--write      POST /v1/files/:branchKey/variables (file_variables:write)`);
}

async function figma(path, token, init = {}) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    ...init,
    headers: {
      'X-Figma-Token': token,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

function pickColors(proposal, only) {
  const rows = [];
  for (const [name, token] of Object.entries(proposal.codeOwned ?? {})) {
    if (only.length && !only.includes(name)) continue;
    if (token.$type !== 'color') continue;
    const color = cssToFigmaColor(token.$value);
    if (!color) continue;
    rows.push({
      name,
      color,
      cssVar: token.$extensions?.['com.solidaris.pds']?.cssVar ?? null,
      source: token.$extensions?.['com.solidaris.pds']?.source ?? null,
    });
  }
  return rows;
}

function buildPayload(rows, { collectionName, existing }) {
  const collections = Object.values(existing?.meta?.variableCollections ?? {});
  const variables = Object.values(existing?.meta?.variables ?? {});
  const found = collections.find((c) => c.name === collectionName && !c.remote);

  const body = {
    variableCollections: [],
    variableModes: [],
    variables: [],
    variableModeValues: [],
  };

  let collectionId;
  let modeId;
  if (found) {
    collectionId = found.id;
    modeId = found.defaultModeId ?? found.modes?.[0]?.modeId;
  } else {
    collectionId = 'tmp_collection';
    modeId = 'tmp_mode';
    body.variableCollections.push({
      action: 'CREATE',
      id: collectionId,
      name: collectionName,
      initialModeId: modeId,
      hiddenFromPublishing: true,
    });
    body.variableModes.push({
      action: 'UPDATE',
      id: modeId,
      name: 'Value',
      variableCollectionId: collectionId,
    });
  }

  if (!modeId) {
    throw new Error(`Collection "${collectionName}" has no mode`);
  }

  for (const [index, row] of rows.entries()) {
    const already = variables.find(
      (variable) => variable.name === row.name && variable.variableCollectionId === (found?.id ?? ''),
    );
    if (already) {
      body.variableModeValues.push({
        variableId: already.id,
        modeId: found.defaultModeId ?? found.modes?.[0]?.modeId,
        value: row.color,
      });
      continue;
    }
    const tempId = `tmp_var_${index}`;
    body.variables.push({
      action: 'CREATE',
      id: tempId,
      name: row.name,
      resolvedType: 'COLOR',
      variableCollectionId: collectionId,
      hiddenFromPublishing: true,
      description: row.cssVar
        ? `Code-owned token ${row.cssVar}`
        : 'Code-owned token from the repo',
      scopes: ['ALL_SCOPES'],
      codeSyntax: row.cssVar ? { WEB: `var(${row.cssVar})` } : undefined,
    });
    body.variableModeValues.push({
      variableId: tempId,
      modeId,
      value: row.color,
    });
  }

  return body;
}

function explainFigmaError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/Invalid scope/i.test(message)) {
    return (
      `${message}\n` +
      'FIGMA_TOKEN needs file_variables:read (dry-run) and file_variables:write (real apply). ' +
      'Figma cannot add scopes to an existing token — mint a new one and update the GitHub secret.'
    );
  }
  if (/Limited by Figma plan|Incorrect account type/i.test(message)) {
    return `${message}\nVariables API requires an Enterprise org and a Full seat.`;
  }
  return message;
}

async function resolveProposalBranch(mainFileKey, branchName, token) {
  const file = await figma(`/files/${mainFileKey}?branch_data=true&depth=1`, token);
  const branches = file.branches ?? file.meta?.branches ?? [];
  const branch = branches.find((item) => item.name === branchName) ?? null;
  console.log(
    `listed ${mainFileKey} name=${file.name ?? '?'} mainFileKey=${file.mainFileKey ?? '—'} ` +
      `keys=${Object.keys(file).join(',')} branches=${branches.length}`,
  );
  return { branch, branches, fileName: file.name ?? null };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    help();
    return;
  }

  if (!args.all && !args.only.length) {
    console.error(
      'apply-to-figma: pass --only name[,name] (or --all). Refusing to dump every code-owned color.',
    );
    process.exitCode = 1;
    return;
  }

  const branchName = `proposals/${args.app}`;
  const collectionName = branchName;
  const proposal = existsSync(args.proposal)
    ? JSON.parse(readFileSync(args.proposal, 'utf8'))
    : { codeOwned: {} };
  const rows = pickColors(proposal, args.only);
  const token = process.env.FIGMA_TOKEN;

  if (!rows.length) {
    console.error(
      args.only.length
        ? `apply-to-figma: no color tokens matched --only ${args.only.join(',')}`
        : 'apply-to-figma: no color tokens in proposed.dtcg.json',
    );
    process.exitCode = 1;
    return;
  }

  if (!token) {
    console.log('apply-to-figma: FIGMA_TOKEN unset — printing dry-run payload only.');
    console.log(`requested branch: ${branchName}`);
    console.log(`main file key (never written): ${args.fileKey}`);
    console.log(JSON.stringify(buildPayload(rows, { collectionName, existing: {} }), null, 2));
    console.log('dry-run: zero writes.');
    return;
  }

  let branchKey = args.branchKey.trim();
  if (branchKey) {
    console.log(`using explicit --branch-key ${branchKey} (listing skipped)`);
  } else {
    let resolved;
    try {
      resolved = await resolveProposalBranch(args.fileKey, branchName, token);
    } catch (error) {
      console.error(`apply-to-figma: could not list Figma branches (${explainFigmaError(error)})`);
      process.exitCode = 1;
      return;
    }

    const { branch, branches } = resolved;
    if (!branch) {
      const available = branches.map((item) => item.name).join(', ') || '(none)';
      console.error(
        `Figma branch "${branchName}" is missing. Create it in the Figma UI (Full seat) from the main UI Kit. ` +
          `Aborting — will not write to main file ${args.fileKey}. Available branches: ${available}. ` +
          `Or pass --branch-key from the Figma URL /design/{main}/branch/{key}/.`,
      );
      process.exitCode = 1;
      return;
    }
    branchKey = branch.key;
  }
  if (!branchKey || branchKey === args.fileKey || branchKey === DEFAULT_FILE_KEY) {
    console.error(
      `apply-to-figma: resolved key is the main file (${branchKey}). Refusing to write to main.`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(`resolved branch: ${branchName} → ${branchKey}`);

  let existing = {};
  try {
    existing = await figma(`/files/${branchKey}/variables/local`, token);
  } catch (error) {
    console.error(`apply-to-figma: could not read branch variables (${explainFigmaError(error)})`);
    process.exitCode = 1;
    return;
  }

  const payload = buildPayload(rows, { collectionName, existing });
  console.log(`payload: ${payload.variables.length} create, ${payload.variableModeValues.length} values`);
  console.log(JSON.stringify(payload, null, 2));

  if (args.dryRun) {
    console.log('dry-run: zero writes.');
    return;
  }

  let posted;
  try {
    posted = await figma(`/files/${branchKey}/variables`, token, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(`apply-to-figma: POST failed (${explainFigmaError(error)})`);
    process.exitCode = 1;
    return;
  }
  console.log('apply-to-figma: wrote variables to branch', branchKey);
  if (posted?.meta?.tempIdToRealId) {
    console.log('tempIdToRealId', JSON.stringify(posted.meta.tempIdToRealId));
  }
}

await main();
