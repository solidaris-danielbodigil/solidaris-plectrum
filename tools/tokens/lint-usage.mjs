#!/usr/bin/env node
/**
 * Token-usage linter (Wave 4 guardrails + Wave 8 consumer CLI).
 *
 * Fails on:
 *   - --p-* declarations outside 01-settings/_settings.*.scss
 *   - $dt / dt / usePreset / updatePreset imports from @primeuix/themes in apps/ or libs/ui
 *   - hardcoded #hex in apps/ and libs/ui (scss/html/ts templates)
 *   - unknown --pds-* names (not declared in 01-settings and not in tokens.generated.ts)
 *
 * Usage: node tools/tokens/lint-usage.mjs
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  'storybook-static',
  'temp_guidelines',
  'temp_storybook_styles',
]);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function rel(file) {
  return relative(ROOT, file).replaceAll('\\', '/');
}

const OBJECT_API = new Set([
  '--pds-grid-template-columns',
  '--pds-grid-template-rows',
  '--pds-border-color',
  '--pds-border-width',
]);

function collectDeclaredPds() {
  const names = new Set(OBJECT_API);
  const decl = /--(?:#\{\$pds-prefix\}-|pds-)?([a-z0-9-]+)\s*:/gi;
  for (const file of walk(join(ROOT, 'libs/styles'))) {
    if (!file.endsWith('.scss')) continue;
    const body = readFileSync(file, 'utf8');
    let match;
    while ((match = decl.exec(body)) !== null) {
      names.add(`--pds-${match[1]}`);
    }
  }
  const manifest = join(ROOT, 'libs/ui/src/storybook/tokens.generated.ts');
  if (existsSync(manifest)) {
    const body = readFileSync(manifest, 'utf8');
    for (const match of body.matchAll(/"cssVar": "(--pds-[^"]+)"/g)) {
      names.add(match[1]);
    }
  }
  return names;
}

function lintPDeclarations() {
  const violations = [];
  const decl = /^\s*--p-[a-z0-9-]+:/i;
  for (const file of walk(join(ROOT, 'libs/styles'))) {
    if (!file.endsWith('.scss')) continue;
    const path = rel(file);
    const allowed =
      /libs\/styles\/src\/01-settings\/_settings\.[a-z0-9-]+\.scss$/.test(path) &&
      !path.includes('.generated.');
    if (allowed) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (decl.test(line)) {
        violations.push(`${path}:${index + 1}: ${line.trim()}`);
      }
    });
  }
  return violations;
}

function lintPrimeuixImports() {
  const violations = [];
  const banned = /\b(\$dt|dt|usePreset|updatePreset)\b/;
  const fromPrime = /from\s+['"]@primeuix\/themes['"]/;
  for (const root of ['apps', 'libs/ui']) {
    for (const file of walk(join(ROOT, root))) {
      if (!/\.(ts|js)$/.test(file)) continue;
      if (file.includes('.stories.ts')) continue;
      const body = readFileSync(file, 'utf8');
      if (!fromPrime.test(body) && !banned.test(body)) continue;
      if (fromPrime.test(body) && banned.test(body)) {
        violations.push(`${rel(file)}: banned @primeuix/themes token runtime import`);
      }
    }
  }
  return violations;
}

function lintHardcoded() {
  const violations = [];
  const hex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
  const px = /(?<![-\w])\d+px\b/;
  for (const root of ['apps', 'libs/ui/src/lib']) {
    for (const file of walk(join(ROOT, root))) {
      if (!/\.(scss|html)$/.test(file)) continue;
      const path = rel(file);
      if (path.includes('.stories.') || path.includes('storybook')) continue;
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, index) => {
        if (line.includes('var(--')) return;
        if (hex.test(line)) {
          violations.push(`${path}:${index + 1}: hardcoded hex ${line.trim()}`);
        } else if (px.test(line) && !line.includes('1px solid') && !line.includes('border:')) {
          violations.push(`${path}:${index + 1}: hardcoded px ${line.trim()}`);
        }
      });
    }
  }
  return violations;
}

function lintUnknownPds(declared) {
  const violations = [];
  const use = /--pds-[a-z0-9-]+/g;
  for (const root of ['apps', 'libs/ui/src/lib', 'libs/styles/src/06-components']) {
    for (const file of walk(join(ROOT, root))) {
      if (!/\.(scss|html|ts)$/.test(file)) continue;
      const path = rel(file);
      if (
        path.includes('.stories.') ||
        path.includes('.metadata.ts') ||
        path.includes('storybook')
      ) {
        continue;
      }
      const body = readFileSync(file, 'utf8');
      for (const match of body.matchAll(use)) {
        const name = match[0];
        if (name.endsWith('-')) continue;
        if (declared.has(name)) continue;
        violations.push(`${path}: unknown ${name}`);
      }
    }
  }
  return [...new Set(violations)];
}

function main() {
  const declared = collectDeclaredPds();
  const groups = {
    '--p-* declarations': lintPDeclarations(),
    '@primeuix/themes runtime': lintPrimeuixImports(),
    'unknown --pds-*': lintUnknownPds(declared),
  };
  const strict = process.argv.includes('--strict');
  if (strict) {
    groups['hardcoded hex/px'] = lintHardcoded();
  } else {
    const soft = lintHardcoded();
    if (soft.length) {
      console.log(`hardcoded hex/px: ${soft.length} (informational; pass --strict to fail)`);
    }
  }

  let fail = false;
  for (const [label, items] of Object.entries(groups)) {
    if (!items.length) {
      console.log(`${label}: ok`);
      continue;
    }
    fail = true;
    console.error(`${label}: ${items.length}`);
    for (const item of items.slice(0, 50)) console.error(`  ${item}`);
    if (items.length > 50) console.error(`  … ${items.length - 50} more`);
  }

  process.exitCode = fail ? 1 : 0;
}

main();
