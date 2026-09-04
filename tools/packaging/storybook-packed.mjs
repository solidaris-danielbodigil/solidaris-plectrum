#!/usr/bin/env node
/**
 * Remap workspace path aliases to packed dist and build Storybook.
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

execSync('npm run build:libs', { cwd: ROOT, stdio: 'inherit' });

const files = ['tsconfig.json', 'tsconfig.base.json'];
const backups = files.map((file) => {
  const abs = join(ROOT, file);
  const original = readFileSync(abs, 'utf8');
  const json = JSON.parse(original);
  json.compilerOptions.paths['@solidaris/ui'] = ['dist/libs/ui'];
  json.compilerOptions.paths['@solidaris/plectrum'] = ['dist/libs/plectrum'];
  writeFileSync(abs, `${JSON.stringify(json, null, 2)}\n`);
  return { abs, original };
});

try {
  execSync('npx ng run ui:build-storybook', { cwd: ROOT, stdio: 'inherit' });
} finally {
  for (const { abs, original } of backups) writeFileSync(abs, original);
}
