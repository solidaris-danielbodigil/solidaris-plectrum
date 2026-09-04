#!/usr/bin/env node
/**
 * Build APF libs (unless already built) and npm-pack all three packages
 * into tools/packaging/.tarballs/.
 */
import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const tarballDir = join(root, 'tools/packaging/.tarballs');

function run(cmd, cwd = root) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

const skipBuild = process.argv.includes('--skip-build');

if (!skipBuild) {
  run('npx ng build plectrum');
  run('npx ng build ui');
}

const plectrumDist = join(root, 'dist/libs/plectrum');
const uiDist = join(root, 'dist/libs/ui');

if (!existsSync(plectrumDist) || !existsSync(uiDist)) {
  throw new Error('Missing dist/libs/{plectrum,ui}. Run without --skip-build.');
}

mkdirSync(tarballDir, { recursive: true });
for (const file of readdirSync(tarballDir)) {
  if (file.endsWith('.tgz')) {
    rmSync(join(tarballDir, file));
  }
}

const packs = [
  { dir: plectrumDist, label: '@solidaris/plectrum' },
  { dir: uiDist, label: '@solidaris/ui' },
  { dir: join(root, 'libs/styles'), label: '@solidaris/styles' },
  { dir: join(root, 'tools/tokens'), label: '@solidaris/tokens-cli' },
];

for (const { dir, label } of packs) {
  console.log(`\nPacking ${label} from ${dir}`);
  run(`npm pack --pack-destination "${tarballDir}"`, dir);
}

console.log('\nTarballs:');
for (const file of readdirSync(tarballDir).filter((name) => name.endsWith('.tgz'))) {
  console.log(`  ${file}`);
}
