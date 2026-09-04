#!/usr/bin/env node
/**
 * Resolve tokens.json, apply alias-map.json, emit *.generated.scss + tokens.generated.ts.
 *
 * Usage: node tools/tokens/build.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { listCatalog } from './catalog.mjs';
import { composeDropShadow, formatCssLiteral } from './format-value.mjs';
import { resolveDtcg } from './resolve-dtcg.mjs';
import { createStyleDictionary } from './sd.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALIAS_MAP_PATH = join(__dirname, 'alias-map.json');

/** tokens.json is missing extremes.white — surface.0 cannot resolve without this. */
const PATH_FALLBACKS = {
  'extremes.white': '#ffffff',
  'surface.0': '#ffffff',
};

function loadAliasMap() {
  const raw = JSON.parse(readFileSync(ALIAS_MAP_PATH, 'utf8'));
  const map = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith('$')) continue;
    map[key] = value;
  }
  return map;
}

function resolveLiteral(token, dtcg) {
  if (token.literal != null) return formatCssLiteral(token.literal);
  if (token.compose === 'shadow') {
    const composed = composeDropShadow(dtcg.resolved, token.path);
    if (composed) return composed;
  }
  if (token.path) {
    if (Object.prototype.hasOwnProperty.call(dtcg.resolved, token.path)) {
      return formatCssLiteral(dtcg.resolved[token.path]);
    }
    if (Object.prototype.hasOwnProperty.call(PATH_FALLBACKS, token.path)) {
      return formatCssLiteral(PATH_FALLBACKS[token.path]);
    }
  }
  return null;
}

function emitValue(token, fallback, aliasMap) {
  const prime = aliasMap[token.cssVar] ?? null;
  const ref = token.ref
    ? `var(--#{$pds-prefix}-${token.ref})`
    : null;
  if (prime && fallback) return `var(${prime}, ${fallback})`;
  if (prime && ref) return `var(${prime}, ${ref})`;
  if (ref) return ref;
  if (fallback) return fallback;
  return null;
}

export function computeTokens(dtcg = resolveDtcg(), aliasMap = loadAliasMap()) {
  const computed = [];
  const missing = [];
  for (const token of listCatalog()) {
    const fallback = resolveLiteral(token, dtcg);
    const emitted = emitValue(token, fallback, aliasMap);
    if (!emitted) {
      missing.push(token.cssVar);
      continue;
    }
    computed.push({
      ...token,
      fallback,
      emitted,
      primeNgVar: aliasMap[token.cssVar] ?? null,
    });
  }
  return { computed, missing };
}

async function main() {
  const aliasMap = loadAliasMap();
  const dtcg = resolveDtcg();
  const { computed, missing } = computeTokens(dtcg, aliasMap);
  if (missing.length) {
    console.error('tokens:build missing values:');
    for (const name of missing) console.error(`  ${name}`);
    process.exitCode = 1;
    return;
  }

  const sd = createStyleDictionary(computed);
  await sd.hasInitialized;
  await sd.buildAllPlatforms();

  console.log(
    `tokens:build wrote ${computed.length} tokens ` +
      `(${computed.filter((t) => t.primeNgVar).length} hybrid) ` +
      `from ${dtcg.resolvedCount}/${dtcg.leafCount} resolved DTCG leaves. ` +
      `Code-owned tokens are discovered from the CSSOM, not emitted here.`,
  );
}

if (process.argv[1]?.includes('build.mjs')) {
  await main();
}
