#!/usr/bin/env node
/**
 * Read-only audit: list unique {token.path} refs in Plectrum_v1 preset.
 * Usage: node libs/plectrum/scripts/audit-preset-refs.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const presetDir = join(__dirname, '../src/Plectrum_v1/ts');
const TOKEN_REF = /\{([a-zA-Z0-9._-]+)\}/g;

const KNOWN_BLOCKERS = new Set([]);
const V06_ONLY = new Set([
  'surface.75',
  'focus.color',
  'transparant.black.100',
  'transparant.black.200',
  'emutnav.item.color',
]);

const tokens = new Map();

for (const file of readdirSync(presetDir).filter((f) => f.endsWith('.ts'))) {
  const content = readFileSync(join(presetDir, file), 'utf8');
  let match;
  while ((match = TOKEN_REF.exec(content)) !== null) {
    const token = match[1];
    if (!tokens.has(token)) tokens.set(token, new Set());
    tokens.get(token).add(file);
  }
}

const blockers = [...KNOWN_BLOCKERS]
  .filter((t) => tokens.has(t))
  .map((t) => ({ token: t, files: [...tokens.get(t)] }));

const v06Refs = [...V06_ONLY]
  .filter((t) => tokens.has(t))
  .map((t) => ({ token: t, files: [...tokens.get(t)] }));

console.log(
  JSON.stringify(
    {
      uniqueTokens: tokens.size,
      blockers,
      v06OnlyRefsInV1: v06Refs,
      sampleTokens: [...tokens.keys()].sort().slice(0, 20),
    },
    null,
    2,
  ),
);
