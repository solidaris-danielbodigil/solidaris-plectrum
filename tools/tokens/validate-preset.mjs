#!/usr/bin/env node
/**
 * Every `{token.path}` in the imported Plectrum_v1 default export must
 * resolve to a literal against libs/plectrum/src/tokens.json.
 *
 * Replaces the hardcoded KNOWN_BLOCKERS / V06_ONLY lists in
 * libs/plectrum/scripts/audit-preset-refs.mjs.
 *
 * Usage: tsx tools/tokens/validate-preset.mjs
 */

import v1Preset from '../../libs/plectrum/src/Plectrum_v1/ts/index.ts';
import { asPreset, collectRefs, resolveDtcg } from './resolve-dtcg.mjs';

function main() {
  const dtcg = resolveDtcg();
  const refs = collectRefs(asPreset(v1Preset));
  const missing = [];
  const unresolved = [];

  for (const [ref, locations] of [...refs.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (Object.prototype.hasOwnProperty.call(dtcg.resolved, ref)) continue;
    const entry = {
      ref,
      locations: [...new Set(locations)],
    };
    if (dtcg.byPath.has(ref)) {
      unresolved.push(entry);
    } else {
      missing.push(entry);
    }
  }

  const fail = missing.length + unresolved.length > 0;
  const tokensJsonRoots = new Map();
  for (const entry of dtcg.unresolved) {
    const root = entry.chain?.[entry.chain.length - 1] ?? entry.alias;
    tokensJsonRoots.set(root, (tokensJsonRoots.get(root) ?? 0) + 1);
  }

  const report = {
    uniqueRefs: refs.size,
    resolved: refs.size - missing.length - unresolved.length,
    missingFromTokensJson: missing,
    unresolvedChains: unresolved,
    tokensJsonUnresolvedRoots: [...tokensJsonRoots.entries()].map(
      ([root, dependents]) => ({ root, dependents }),
    ),
    result: fail ? 'FAIL' : 'PASS',
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (fail) {
    process.stderr.write(
      `validate-preset: ${missing.length} missing, ${unresolved.length} unresolved of ${refs.size} unique {token.path} refs\n`,
    );
  }

  process.exitCode = fail ? 1 : 0;
}

main();
