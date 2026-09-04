#!/usr/bin/env node
/**
 * Reject new bare --spacing- / --text- / --font- / --line-height-
 * declarations outside _settings.legacy-aliases.scss.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const ALLOWED = new Set([
  'libs/styles/src/01-settings/_settings.legacy-aliases.scss',
]);
const DECL =
  /^\s*--(spacing|text|font|line-height)-[a-z0-9-]*\s*:/i;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (
      entry === 'node_modules' ||
      entry === 'dist' ||
      entry === '.git' ||
      entry === 'storybook-static'
    ) {
      continue;
    }
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (/\.(scss|css)$/.test(entry)) files.push(full);
  }
  return files;
}

function main() {
  const violations = [];
  for (const file of walk(ROOT)) {
    const rel = relative(ROOT, file).replaceAll('\\', '/');
    if (ALLOWED.has(rel)) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (DECL.test(line) && !line.includes('#{$pds-prefix}')) {
        violations.push(`${rel}:${index + 1}: ${line.trim()}`);
      }
    });
  }

  if (violations.length) {
    console.error('Unprefixed token declarations are only allowed in legacy aliases:');
    for (const violation of violations) console.error(`  ${violation}`);
    process.exit(1);
  }

  console.log('Prefix check passed.');
}

main();
