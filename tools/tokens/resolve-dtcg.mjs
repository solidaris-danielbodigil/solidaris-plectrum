#!/usr/bin/env node
/**
 * Flatten the 7 DTCG sets in libs/plectrum/src/tokens.json and resolve
 * `{alias}` chains to literals. Detects cycles and missing refs.
 *
 * Import:
 *   import { resolveDtcg, DEFAULT_TOKENS_PATH } from './resolve-dtcg.mjs';
 *
 * CLI:
 *   node tools/tokens/resolve-dtcg.mjs
 *   node tools/tokens/resolve-dtcg.mjs --out /tmp/resolved.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const WORKSPACE_ROOT = resolve(__dirname, '../..');
export const DEFAULT_TOKENS_PATH = join(
  WORKSPACE_ROOT,
  'libs/plectrum/src/tokens.json',
);

const META_KEYS = new Set(['$themes', '$metadata']);
/** Whole-value alias: `{primary.600}` */
export const ALIAS_RE = /^\{([a-zA-Z0-9._-]+)\}$/;
/** Any `{token.path}` occurrence, including embedded refs. */
export const TOKEN_REF_RE = /\{([a-zA-Z0-9._-]+)\}/g;

export function loadTokensFile(filePath = DEFAULT_TOKENS_PATH) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

/**
 * Token-set names in `$metadata.tokenSetOrder`, then any extra sets.
 * Later sets override earlier ones when paths collide (Tokens Studio merge).
 */
export function listTokenSets(raw) {
  const present = Object.keys(raw).filter(
    (key) => !META_KEYS.has(key) && raw[key] && typeof raw[key] === 'object',
  );
  const ordered = [];
  for (const name of raw.$metadata?.tokenSetOrder ?? []) {
    if (present.includes(name)) ordered.push(name);
  }
  for (const name of present) {
    if (!ordered.includes(name)) ordered.push(name);
  }
  return ordered;
}

function isTokenLeaf(node) {
  return (
    node !== null &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    Object.prototype.hasOwnProperty.call(node, '$value')
  );
}

export function flattenSet(setTree, setName) {
  const leaves = new Map();

  function walk(node, parts) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    if (isTokenLeaf(node)) {
      leaves.set(parts.join('.'), {
        value: node.$value,
        type: node.$type ?? null,
        set: setName,
      });
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      walk(child, [...parts, key]);
    }
  }

  walk(setTree, []);
  return leaves;
}

export function flattenAllSets(raw) {
  const sets = listTokenSets(raw);
  const byPath = new Map();
  const collisions = [];

  for (const setName of sets) {
    const leaves = flattenSet(raw[setName], setName);
    for (const [path, leaf] of leaves) {
      if (byPath.has(path)) {
        collisions.push({ path, from: byPath.get(path).set, to: setName });
      }
      byPath.set(path, leaf);
    }
  }

  return { byPath, sets, collisions };
}

function aliasName(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(ALIAS_RE);
  return match ? match[1] : null;
}

export function resolveAliases(byPath) {
  const resolved = {};
  const unresolved = [];
  const cycles = [];
  const cache = new Map();

  function rememberUnresolved(path, alias, reason, chain) {
    if (
      !unresolved.some((entry) => entry.path === path && entry.alias === alias)
    ) {
      unresolved.push({ path, alias, reason, chain });
    }
  }

  function resolvePath(path, stack) {
    if (cache.has(path)) return cache.get(path);

    if (stack.includes(path)) {
      const cycle = [...stack.slice(stack.indexOf(path)), path];
      if (!cycles.some((existing) => existing.join('>') === cycle.join('>'))) {
        cycles.push(cycle);
      }
      return { status: 'cycle', value: null, chain: cycle };
    }

    const leaf = byPath.get(path);
    if (!leaf) {
      return { status: 'missing', value: null, chain: [path] };
    }

    const rawValue = leaf.value;
    const next = aliasName(rawValue);

    if (next) {
      const inner = resolvePath(next, [...stack, path]);
      if (inner.status !== 'ok') {
        const status = inner.status === 'cycle' ? 'cycle' : 'unresolved';
        const chain = [path, ...inner.chain];
        const result = { status, value: rawValue, chain };
        cache.set(path, result);
        if (status === 'unresolved') {
          rememberUnresolved(path, next, inner.status, chain);
        }
        return result;
      }
      const result = {
        status: 'ok',
        value: inner.value,
        type: leaf.type,
        set: leaf.set,
      };
      cache.set(path, result);
      return result;
    }

    if (typeof rawValue === 'string') {
      const embeds = [...rawValue.matchAll(TOKEN_REF_RE)];
      if (embeds.length > 0) {
        let out = rawValue;
        for (const embed of embeds) {
          const inner = resolvePath(embed[1], [...stack, path]);
          if (inner.status !== 'ok') {
            const chain = [path, ...inner.chain];
            const result = {
              status: 'unresolved',
              value: rawValue,
              chain,
            };
            cache.set(path, result);
            rememberUnresolved(path, embed[1], inner.status, chain);
            return result;
          }
          out = out.replaceAll(embed[0], String(inner.value));
        }
        const result = {
          status: 'ok',
          value: out,
          type: leaf.type,
          set: leaf.set,
        };
        cache.set(path, result);
        return result;
      }
    }

    const result = {
      status: 'ok',
      value: rawValue,
      type: leaf.type,
      set: leaf.set,
    };
    cache.set(path, result);
    return result;
  }

  for (const path of byPath.keys()) {
    const result = resolvePath(path, []);
    if (result.status === 'ok') {
      resolved[path] = result.value;
    }
  }

  return { resolved, unresolved, cycles };
}

/**
 * Walk any JSON-like tree and collect `{token.path}` string refs.
 * @returns {Map<string, string[]>} ref → locations
 */
export function collectRefs(node, acc = new Map(), trail = []) {
  if (typeof node === 'string') {
    for (const match of node.matchAll(TOKEN_REF_RE)) {
      const ref = match[1];
      if (!acc.has(ref)) acc.set(ref, []);
      acc.get(ref).push(trail.join('.') || '(root)');
    }
    return acc;
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) =>
      collectRefs(item, acc, [...trail, String(index)]),
    );
    return acc;
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      collectRefs(value, acc, [...trail, key]);
    }
  }
  return acc;
}

export function getAt(node, path) {
  const parts = Array.isArray(path) ? path : String(path).split('.');
  let current = node;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[part];
  }
  return current;
}

/**
 * tsx/Node interop sometimes wraps a TS default export as `{ default: preset }`
 * when imported from an `.mjs` file. Unwrap so callers see primitive/semantic.
 */
export function asPreset(mod) {
  if (mod?.primitive && mod?.semantic) return mod;
  if (mod?.default?.primitive && mod?.default?.semantic) return mod.default;
  return mod;
}

/**
 * @param {string | object} [rawOrPath] tokens.json path or already-parsed object
 * @returns {{
 *   resolved: Record<string, unknown>,
 *   unresolved: { path: string, alias: string, reason: string, chain: string[] }[],
 *   cycles: string[][],
 *   collisions: { path: string, from: string, to: string }[],
 *   sets: string[],
 *   leafCount: number,
 *   resolvedCount: number,
 *   byPath: Map<string, { value: unknown, type: string | null, set: string }>,
 * }}
 */
export function resolveDtcg(rawOrPath = DEFAULT_TOKENS_PATH) {
  const raw =
    typeof rawOrPath === 'string' ? loadTokensFile(rawOrPath) : rawOrPath;
  const { byPath, sets, collisions } = flattenAllSets(raw);
  const { resolved, unresolved, cycles } = resolveAliases(byPath);
  return {
    resolved,
    unresolved,
    cycles,
    collisions,
    sets,
    leafCount: byPath.size,
    resolvedCount: Object.keys(resolved).length,
    byPath,
  };
}

function parseArgs(argv) {
  const out = { file: DEFAULT_TOKENS_PATH, outPath: null, stats: true };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out') {
      out.outPath = argv[i + 1];
      i += 1;
    } else if (arg === '--file') {
      out.file = resolve(argv[i + 1]);
      i += 1;
    } else if (arg === '--quiet') {
      out.stats = false;
    } else if (arg === '--help' || arg === '-h') {
      out.help = true;
    }
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: node tools/tokens/resolve-dtcg.mjs [--file tokens.json] [--out resolved.json] [--quiet]

Flattens all DTCG sets, resolves {alias} chains, prints path → literal JSON.`);
    return;
  }

  const result = resolveDtcg(args.file);
  const json = JSON.stringify(result.resolved, null, 2);

  if (args.outPath) {
    writeFileSync(args.outPath, `${json}\n`, 'utf8');
  } else {
    process.stdout.write(`${json}\n`);
  }

  if (args.stats) {
    const lines = [
      `sets: ${result.sets.length} (${result.sets.join(', ')})`,
      `leaves: ${result.leafCount}`,
      `resolved: ${result.resolvedCount}`,
      `unresolved: ${result.unresolved.length}`,
      `cycles: ${result.cycles.length}`,
      `collisions: ${result.collisions.length}`,
    ];
    if (result.unresolved.length) {
      lines.push(
        'unresolved aliases:',
        ...result.unresolved.map(
          (entry) => `  ${entry.path} → {${entry.alias}} (${entry.reason})`,
        ),
      );
    }
    if (result.cycles.length) {
      lines.push(
        'cycles:',
        ...result.cycles.map((cycle) => `  ${cycle.join(' → ')}`),
      );
    }
    process.stderr.write(`${lines.join('\n')}\n`);
  }

  if (result.cycles.length > 0) {
    process.exitCode = 1;
  }
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (invokedDirectly) {
  main();
}
