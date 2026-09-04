#!/usr/bin/env node
/**
 * Diff code-declared --pds-* tokens against tokens.json and emit
 * proposed.dtcg.json for code-only tokens (e.g. --pds-color-emutnav-*,
 * --pds-color-surface-75).
 *
 * Dotted CSS names map to Figma `/` grouping (names cannot contain `.` `{` `}`).
 *
 * Usage:
 *   node tools/tokens/propose-to-figma.mjs
 *   node tools/tokens/propose-to-figma.mjs --out tools/tokens/proposed.dtcg.json
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { listCatalog } from './catalog.mjs';
import { unwrapHybridValue } from './format-value.mjs';
import { resolveDtcg } from './resolve-dtcg.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const SETTINGS = join(ROOT, 'libs/styles/src/01-settings');

function parseArgs(argv) {
  const out = { outPath: join(__dirname, 'proposed.dtcg.json') };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--out') {
      out.outPath = argv[i + 1];
      i += 1;
    }
    if (argv[i] === '--help' || argv[i] === '-h') out.help = true;
  }
  return out;
}

function cssNameToFigma(cssName) {
  return cssName.replaceAll('.', '/').replaceAll('-', '/');
}

function collectScssTokens() {
  const catalogPaths = new Set(
    listCatalog()
      .map((token) => token.path)
      .filter(Boolean),
  );
  const tokens = [];
  const decl = /--(?:#\{\$pds-prefix\}-|pds-)([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  for (const file of readdirSync(SETTINGS).filter((name) => name.endsWith('.scss'))) {
    if (file.includes('.generated.')) continue;
    const body = readFileSync(join(SETTINGS, file), 'utf8');
    let match;
    while ((match = decl.exec(body)) !== null) {
      tokens.push({
        cssName: match[1],
        cssVar: `--pds-${match[1]}`,
        value: unwrapHybridValue(match[2].trim()),
        file,
      });
    }
  }
  return { tokens, catalogPaths };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: node tools/tokens/propose-to-figma.mjs [--out proposed.dtcg.json]

Emits DTCG for --pds-* tokens that exist in 01-settings but not in tokens.json.
Figma names use / grouping (no '.' '{' '}').`);
    return;
  }

  const dtcg = resolveDtcg();
  const { tokens } = collectScssTokens();
  const proposed = {};
  const report = [];

  for (const token of tokens) {
    const pathGuess = token.cssName.replace(/^color-/, '').replaceAll('-', '.');
    if (dtcg.resolved[pathGuess] != null || dtcg.byPath.has(pathGuess)) continue;
    if (token.value.startsWith('var(')) continue;
    const figmaName = cssNameToFigma(token.cssName);
    proposed[figmaName] = {
      $type: token.value.startsWith('#') || token.value.startsWith('rgba') ? 'color' : 'other',
      $value: token.value,
      $extensions: {
        'com.solidaris.pds': {
          cssVar: token.cssVar,
          source: token.file,
        },
      },
    };
    report.push(`${token.cssVar}  →  ${figmaName}  (${token.file})`);
  }

  const doc = {
    $description:
      'Code-owned tokens proposed for a Figma branch. Apply with apply-to-figma --dry-run first.',
    codeOwned: proposed,
  };

  writeFileSync(args.outPath, `${JSON.stringify(doc, null, 2)}\n`);
  console.log(`propose-to-figma: ${report.length} code-only tokens → ${args.outPath}`);
  for (const line of report) console.log(`  ${line}`);
}

main();
