#!/usr/bin/env node
// Prove a clean external Angular app can install the published registry versions.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const registry = JSON.parse(readFileSync(join(root, '.ai/contracts/registry.json'), 'utf8'));
const packages = JSON.parse(readFileSync(join(root, 'dist/release/package-artifacts.json'), 'utf8'));
// The toolkit is a development dependency; read its name instead of hardcoding a former one.
const toolkitName = JSON.parse(readFileSync(join(root, 'tools/devkit/package.json'), 'utf8')).name;
const expectedRepo = new URL(registry.repository).pathname.slice(1);
if (process.env['GITHUB_ACTIONS'] !== 'true' || process.env['GITHUB_REPOSITORY'] !== expectedRepo || !process.env['NODE_AUTH_TOKEN']) {
  throw new Error('Registry smoke requires the authenticated Plectrum release workflow.');
}
const consumer = mkdtempSync(join(tmpdir(), 'plectrum-registry-smoke-'));
cpSync(join(root, 'tools/packaging/consumer-app'), consumer, { recursive: true });
const config = `${registry.operations.publicationScope}:registry=${registry.operations.registry}\n//npm.pkg.github.com/:_authToken=` + '$' + '{NODE_AUTH_TOKEN}\n';
writeFileSync(join(consumer, '.npmrc'), config);
const packageFile = join(consumer, 'package.json');
const manifest = JSON.parse(readFileSync(packageFile, 'utf8'));
for (const pkg of packages) {
  if (pkg.name === toolkitName) manifest.devDependencies[pkg.name] = pkg.version;
  else manifest.dependencies[pkg.name] = pkg.version;
}
writeFileSync(packageFile, `${JSON.stringify(manifest, null, 2)}\n`);
const run = (command, args) => execFileSync(command, args, { cwd: consumer, stdio: 'inherit', env: process.env });
run('npm', ['install', '--legacy-peer-deps', '--prefer-online']);
run('npx', ['ng', 'build']);
run('git', ['init']);
run('git', ['add', 'package.json', 'src']);
run('git', ['-c', 'user.name=Plectrum', '-c', 'user.email=plectrum@example.invalid', 'commit', '-m', 'registry smoke fixture']);
run('npx', ['--no-install', 'plectrum', 'init', '--team', 'ishare', '--application', 'registry-smoke', '--repository', 'https://github.com/example/registry-smoke']);
run('npx', ['--no-install', 'plectrum', 'doctor']);
run('npx', ['--no-install', 'plectrum', 'check', '--profile', 'ci']);
console.log(`Registry smoke passed from ${consumer}`);
