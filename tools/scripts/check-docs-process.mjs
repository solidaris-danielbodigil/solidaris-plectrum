#!/usr/bin/env node
// Docs render shared process, registry, manifest and release data; they do not restate it.
// Fails when a page or agent source:
//   - types a toolkit command instead of rendering it from process.json,
//   - names a `plectrum` subcommand the process contract does not advertise,
//   - names an `npm run` script that package.json does not define,
//   - reads release state from a build flag instead of the recorded release,
//   - hardcodes a distributed package name where the manifests are imported.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { consumerCommands, subcommandOf } from '../devkit/src/process.mjs';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8').replaceAll('\r\n', '\n');
const json = (path) => JSON.parse(read(path));
const contract = json('.ai/contracts/process.json');
const scripts = { ...json('package.json').scripts, ...json('tools/consumers/starter/package.json').scripts };
const packages = ['libs/ui', 'libs/plectrum', 'libs/styles', 'tools/devkit'].map((dir) => json(`${dir}/package.json`).name);
const problems = [];
const fail = (file, message) => problems.push(`${file}: ${message}`);

function files(dir, pattern) {
  return readdirSync(resolve(root, dir), { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && pattern.test(entry.name))
    .map((entry) => relative(root, join(entry.parentPath, entry.name)).replaceAll('\\', '/'));
}

const docs = files('libs/ui/src/docs', /\.(mdx|stories\.ts)$/);
const agentSources = files('.ai/agents', /\.md$/);
const advertised = new Set(consumerCommands(contract).map((command) => subcommandOf(command.usage)));

/** Code the page renders from data is not prose: drop JS expressions and import lines. */
const prose = (text) => text.replace(/^import .*$/gm, '');

for (const file of [...docs, ...agentSources]) {
  const text = prose(read(file));
  for (const match of text.matchAll(/npm run ([a-z][\w:-]*)/g)) {
    if (!scripts[match[1]]) fail(file, `names npm run ${match[1]}, which package.json does not define`);
  }
  for (const match of text.matchAll(/`plectrum ([a-z][a-z-]*)(?: ([a-z]+))?/g)) {
    const name = match[1] === 'tokens' ? `tokens ${match[2]}` : match[1];
    if (!advertised.has(name) && name !== 'help') fail(file, `names plectrum ${name}, which process.json does not advertise`);
  }
}

// Onboarding, contribution and strategy pages render toolkit commands from process.json.
const processPages = [
  'libs/ui/src/docs/get-started-consume.mdx',
  'libs/ui/src/docs/get-started-consume.stories.ts',
  'libs/ui/src/docs/get-started-contribute.mdx',
  'libs/ui/src/docs/get-started-contribute.stories.ts',
  'libs/ui/src/docs/ai-strategy.mdx',
  'libs/ui/src/docs/introduction.mdx',
  'libs/ui/src/docs/introduction.stories.ts',
  'libs/ui/src/docs/maintainer-workflow.mdx',
];
for (const file of processPages) {
  const text = read(file);
  if (text.includes(contract.toolkit.invocation)) fail(file, `types "${contract.toolkit.invocation} …" — render it with command() from process-docs`);
  if (/`plectrum [a-z-]+ (?:--|<)/.test(text)) fail(file, 'types a plectrum command with arguments — render it from process.json');
}
for (const file of ['libs/ui/src/docs/get-started-consume.stories.ts', 'libs/ui/src/docs/get-started-contribute.stories.ts', 'libs/ui/src/docs/pipeline-contracts.stories.ts']) {
  if (!read(file).includes("from '../storybook/process-docs'")) fail(file, 'must render its steps from ../storybook/process-docs');
}

// Release state comes from the recorded release, never a build flag or manifest version.
for (const file of files('libs/ui/src', /\.(ts|mdx|html)$/)) {
  const text = read(file);
  if (/VITE_PLECTRUM_RELEASED|REGISTRY_PUBLISHED|RELEASE_SUMMARY/.test(text)) fail(file, 'reads release state from a build flag — use release-context.ts');
}
if (read('.github/workflows/publish-release.yml').includes('VITE_PLECTRUM_RELEASED')) fail('.github/workflows/publish-release.yml', 'sets the retired release build flag');

// Package names come from the manifests. The First component snippet is verified against the consumer app.
const withoutVerifiedSnippet = (text) => text.replace(/(?:## First component|<h2 id="first-component"[^>]*>[\s\S]*?<\/h2>)[\s\S]*?```ts[\s\S]*?```/, '');
for (const file of ['libs/ui/src/docs/get-started-consume.mdx', 'libs/ui/src/docs/get-started-contribute.mdx', 'libs/ui/src/docs/releases.mdx', 'libs/ui/src/docs/ai-strategy.mdx', 'libs/ui/src/docs/introduction.stories.ts']) {
  const text = withoutVerifiedSnippet(read(file));
  for (const name of packages) if (text.includes(name)) fail(file, `hardcodes ${name} — import it from the manifests (process-docs)`);
}

// Rendering requires something to render.
if (!contract.journeys.onboarding?.length || !contract.journeys.contribution?.length) fail('.ai/contracts/process.json', 'onboarding and contribution journeys must not be empty');

if (problems.length) {
  console.error('Docs process check failed — render shared data instead of restating it:\n' + problems.map((item) => `  - ${item}`).join('\n'));
  process.exit(1);
}
console.log(`Docs process check passed: ${docs.length} docs files and ${agentSources.length} agent sources use process ${contract.version}, package scripts and manifests.`);
