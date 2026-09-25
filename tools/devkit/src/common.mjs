import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
export const asset = (name) => readJson(path.join(packageRoot, 'assets', name));
export const format = (value) => JSON.stringify(value, null, 2) + '\n';
export const hash = (value) => createHash('sha256').update(value).digest('hex');
export const packageJson = readJson(path.join(packageRoot, 'package.json'));
export const slash = (value) => value.replaceAll('\\', '/');

export function projectPath(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) throw new Error(`Unsafe project path: ${relative}`);
  const resolved = path.resolve(root, relative);
  const diff = path.relative(root, resolved);
  if (diff.startsWith('..') || path.isAbsolute(diff)) throw new Error(`Path leaves project: ${relative}`);
  return resolved;
}

export function filesUnder(directory, result = []) {
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', '.angular', '.storybook', 'storybook-static'].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) filesUnder(full, result);
    else if (entry.isFile()) result.push(full);
  }
  return result;
}

export function configAt(root) {
  const file = projectPath(root, '.plectrum/config.json');
  if (!fs.existsSync(file)) throw new Error('Missing .plectrum/config.json. Run plectrum init first.');
  const config = readJson(file);
  if (config.schemaVersion !== 1 || !/^[a-z][a-z0-9-]*$/.test(config.team) || !/^[a-z][a-z0-9-]*$/.test(config.application)) throw new Error('Invalid .plectrum/config.json identity.');
  if (!config.paths || !Array.isArray(config.paths.source) || !config.paths.source.length || !Array.isArray(config.paths.styles) || !config.paths.candidates || !config.paths.candidateStyles || !Array.isArray(config.paths.localTokenFiles)) throw new Error('Invalid .plectrum/config.json paths.');
  const dependencies = ['@solidaris-danielbodigil/ui', '@solidaris-danielbodigil/plectrum', '@solidaris-danielbodigil/styles'];
  if (!Array.isArray(config.dependencies) || dependencies.some((name) => !config.dependencies.includes(name))) throw new Error(`Declare all DS dependencies in .plectrum/config.json: ${dependencies.join(', ')}.`);
  if (!config.reporting?.output || typeof config.reporting.enabled !== 'boolean') throw new Error('Configure reporting.output and reporting.enabled in .plectrum/config.json.');
  projectPath(root, config.reporting.output);
  for (const rel of [...config.paths.source, ...config.paths.styles, config.paths.candidates, config.paths.candidateStyles, ...config.paths.localTokenFiles]) projectPath(root, rel);
  if (!/^https?:\/\//.test(config.repository)) throw new Error('Configure a full repository URL in .plectrum/config.json.');
  return config;
}

export function flag(args, key) {
  const pos = args.findIndex((arg) => arg === `--${key}` || arg.startsWith(`--${key}=`));
  if (pos < 0) return undefined;
  const arg = args[pos];
  return arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : args[pos + 1];
}

export function requiredFlag(args, key) {
  const value = flag(args, key);
  if (!value || value.startsWith('--')) throw new Error(`Missing --${key}`);
  return value;
}
