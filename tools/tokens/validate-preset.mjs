#!/usr/bin/env node
/**
 * Every `{token.path}` in the imported Plectrum_v1 default export must
 * resolve to a literal against libs/plectrum/src/tokens.json.
 *
 * Gaps listed under `missingAliases` in audit-allowlist.json are code-owned
 * (spacing, durations, focus-ring style — see foundations-phase-0.md). They are
 * reported but do not fail the run. Anything else missing or unresolved fails.
 *
 * Replaces the hardcoded KNOWN_BLOCKERS / V06_ONLY lists in
 * libs/plectrum/scripts/audit-preset-refs.mjs.
 *
 * Usage: tsx tools/tokens/validate-preset.mjs [--json report.json]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import v1Preset from '../../libs/plectrum/src/Plectrum_v1/ts/index.ts';
import { asPreset, collectRefs, resolveDtcg } from './resolve-dtcg.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALLOWLIST = JSON.parse(
  readFileSync(join(__dirname, 'audit-allowlist.json'), 'utf8'),
);

function parseArgs(argv) {
  const out = { jsonPath: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--json') {
      out.jsonPath = argv[i + 1];
      i += 1;
    }
  }
  return out;
}

/** path → root of the broken chain, for every unresolved tokens.json leaf. */
function unresolvedRoots(dtcg) {
  const roots = new Map();
  for (const entry of dtcg.unresolved) {
    roots.set(entry.path, entry.chain?.[entry.chain.length - 1] ?? entry.alias);
  }
  return roots;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dtcg = resolveDtcg();
  const refs = collectRefs(asPreset(v1Preset));
  const allowed = new Set(ALLOWLIST.missingAliases ?? []);
  const roots = unresolvedRoots(dtcg);

  const missing = [];
  const unresolved = [];
  const allowlisted = [];

  for (const [ref, locations] of [...refs.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (Object.prototype.hasOwnProperty.call(dtcg.resolved, ref)) continue;
    const entry = { ref, locations: [...new Set(locations)] };
    if (dtcg.byPath.has(ref)) {
      const root = roots.get(ref) ?? ref;
      if (allowed.has(root)) {
        allowlisted.push({ ...entry, reason: 'unresolved-chain', root });
      } else {
        unresolved.push({ ...entry, root });
      }
    } else if (allowed.has(ref)) {
      allowlisted.push({ ...entry, reason: 'missing-from-tokens.json' });
    } else {
      missing.push(entry);
    }
  }

  /** Allowlist entries that resolve now — safe to drop from audit-allowlist.json. */
  const staleAllowlist = [...allowed]
    .filter((ref) => Object.prototype.hasOwnProperty.call(dtcg.resolved, ref))
    .sort();

  const fail = missing.length + unresolved.length > 0;
  const tokensJsonRoots = new Map();
  for (const entry of dtcg.unresolved) {
    const root = entry.chain?.[entry.chain.length - 1] ?? entry.alias;
    tokensJsonRoots.set(root, (tokensJsonRoots.get(root) ?? 0) + 1);
  }

  const report = {
    uniqueRefs: refs.size,
    resolved: refs.size - missing.length - unresolved.length - allowlisted.length,
    missingFromTokensJson: missing,
    unresolvedChains: unresolved,
    allowlisted,
    staleAllowlist,
    tokensJsonUnresolvedRoots: [...tokensJsonRoots.entries()].map(
      ([root, dependents]) => ({ root, dependents }),
    ),
    result: fail ? 'FAIL' : 'PASS',
  };

  const json = `${JSON.stringify(report, null, 2)}\n`;
  process.stdout.write(json);
  if (args.jsonPath) writeFileSync(args.jsonPath, json, 'utf8');

  process.stderr.write(
    `validate-preset: ${report.result} — ${report.resolved}/${refs.size} refs resolved, ` +
      `${allowlisted.length} allowlisted (code-owned), ${missing.length} missing, ` +
      `${unresolved.length} unresolved` +
      (staleAllowlist.length
        ? `; ${staleAllowlist.length} allowlist entr${staleAllowlist.length === 1 ? 'y' : 'ies'} now resolve and can be removed`
        : '') +
      '\n',
  );

  process.exitCode = fail ? 1 : 0;
}

main();
