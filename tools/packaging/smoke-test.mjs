#!/usr/bin/env node
/**
 * Pack libs and `ng build` a throwaway Angular app with no path aliases.
 * The consumer is copied outside the workspace so tsconfig paths cannot leak.
 */

import { execSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TARBALLS = join(ROOT, 'tools/packaging/.tarballs');
const FIXTURE = join(ROOT, 'tools/consumers/starter');

function run(cmd, cwd, env = process.env) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env });
}

function expectFailure(cmd, cwd, contains) {
  const result = spawnSync(cmd, { cwd, encoding: 'utf8', shell: true });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (result.status === 0 || !output.includes(contains)) throw new Error(`Expected failure containing ${contains}: ${cmd}\n${output}`);
}

run('node tools/packaging/pack.mjs', ROOT);

const tgz = readdirSync(TARBALLS).filter((name) => name.endsWith('.tgz'));
const fileDeps = {};
for (const name of tgz) {
  const match = name.match(/^solidaris-danielbodigil-(pds-(?:ui|plectrum|styles|devkit))-(\d+\.\d+\.\d+)\.tgz$/);
  if (!match) continue;
  fileDeps[`@solidaris-danielbodigil/${match[1]}`] = `file:${join(TARBALLS, name)}`;
}
if (Object.keys(fileDeps).length !== 4) throw new Error(`Expected four Plectrum tarballs, found ${Object.keys(fileDeps).length}.`);

const dest = mkdtempSync(join(tmpdir(), 'pds-pack-smoke-'));
cpSync(FIXTURE, dest, { recursive: true });

const pkg = JSON.parse(readFileSync(join(dest, 'package.json'), 'utf8'));
pkg.plectrum = { team: 'ishare', application: 'smoke-app', project: 'application', repository: 'https://github.com/example/smoke-app' };
pkg.dependencies = { ...pkg.dependencies, ...fileDeps };
pkg.devDependencies = { ...pkg.devDependencies, '@solidaris-danielbodigil/pds-devkit': fileDeps['@solidaris-danielbodigil/pds-devkit'] };
delete pkg.dependencies['@solidaris-danielbodigil/pds-devkit'];
writeFileSync(join(dest, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);

// This disposable app must initialize on its first install, even when the
// parent smoke job runs in CI. Later commands still inherit CI and verify it.
run('npm install', dest, { ...process.env, CI: '' });
const layers = ['01-settings', '02-tools', '03-generic', '04-elements', '05-objects', '06-components', '07-utilities', '08-trumps'];
const barrels = ['settings', 'tools', 'generic', 'elements', 'objects', 'components', 'utilities', 'trumps'];
const mainStyles = readFileSync(join(dest, 'src/styles/main.scss'), 'utf8');
for (const [index, layer] of layers.entries()) {
  if (!existsSync(join(dest, `src/styles/${layer}/_index.scss`))) throw new Error(`Bootstrap omitted local ITCSS layer ${layer}.`);
  const shared = `@use '${layer}/${barrels[index]}.core';`;
  const local = `@use '${layer}' as *;`;
  if (mainStyles.split(shared).length !== 2 ||
      mainStyles.split(local).length !== 2 ||
      mainStyles.indexOf(shared) > mainStyles.indexOf(local)) throw new Error(`Shared/local ITCSS composition is wrong for ${layer}.`);
}
for (const relative of ['.storybook/main.ts', '.storybook/preview.ts', '.storybook/plectrum-setup.stories.ts', '.ai/rules/plectrum.md', '.ai/skills/plectrum-component/SKILL.md', '.github/agents/plectrum.agent.md', '.github/workflows/plectrum-checks.yml', '.githooks/pre-commit', 'vitest.config.mts']) {
  if (!existsSync(join(dest, relative))) throw new Error(`Bootstrap omitted ${relative}.`);
}
if (!readFileSync(join(dest, '.storybook/preview.ts'), 'utf8').includes('providePlectrum(version)')) throw new Error('Local Storybook is missing the Plectrum provider.');
for (const font of ['regular', 'italic', 'semibold', 'bold']) {
  if (!existsSync(join(dest, `node_modules/@solidaris-danielbodigil/pds-styles/assets/fonts/agenda/agenda-${font}.woff2`))) throw new Error(`Packed styles package is missing Agenda ${font}.`);
}
for (const file of ['open-sans-latin-variable.woff2', 'OFL.txt']) {
  if (!existsSync(join(dest, `node_modules/@solidaris-danielbodigil/pds-styles/assets/fonts/open-sans/${file}`))) throw new Error(`Packed styles package is missing Open Sans ${file}.`);
}
if (existsSync(join(dest, 'node_modules/@solidaris-danielbodigil/pds-styles/src/06-components/_components.test-component.scss'))) throw new Error('Test-only component leaked into packed styles.');
run("node -e \"console.log(require.resolve('@solidaris-danielbodigil/pds-devkit/schema/metadata.v1'))\"", dest);
run("node -e \"console.log(require.resolve('@solidaris-danielbodigil/pds-devkit/catalogue'))\"", dest);
run('npx ng build application', dest);
if (!existsSync(join(dest, 'dist/application/browser/assets/fonts/agenda/agenda-regular.woff2'))) throw new Error('Application build did not publish Agenda fonts.');
if (!existsSync(join(dest, 'dist/application/browser/assets/fonts/open-sans/open-sans-latin-variable.woff2'))) throw new Error('Application build did not publish Open Sans.');

run('git init', dest);
run('git add package.json src', dest);
run('git -c user.name=Plectrum -c user.email=plectrum@example.invalid commit -m fixture', dest);
run('npx --no-install plectrum bootstrap', dest);
run('npx --no-install plectrum update', dest);
run('npx --no-install plectrum doctor', dest);
run('npx --no-install plectrum catalogue --id plectrum:form-field', dest);
run('npx --no-install plectrum check --profile ci', dest);
run('npm run pds:component -- --name smoke-card', dest);
const componentIndex = readFileSync(join(dest, 'src/styles/06-components/_index.scss'), 'utf8');
if ((componentIndex.match(/@use 'components\.smoke-card';/g) ?? []).length !== 1) throw new Error('Generated candidate style is not imported exactly once from local ITCSS.');
if (!existsSync(join(dest, 'src/styles/06-components/_components.smoke-card.scss'))) throw new Error('Generated candidate style is outside local ITCSS.');
if (existsSync(join(dest, 'src/plectrum-candidates/smoke-card/smoke-card.component.scss'))) throw new Error('Generated candidate has a colocated stylesheet.');
run('npx --no-install plectrum validate --schema metadata --file src/plectrum-candidates/smoke-card/smoke-card.metadata.json', dest);
expectFailure('npx --no-install plectrum check --profile ci', dest, 'complete candidate placeholders');
const metadataFile = join(dest, 'src/plectrum-candidates/smoke-card/smoke-card.metadata.json');
const metadata = JSON.parse(readFileSync(metadataFile, 'utf8'));
metadata.component.description = 'A local card for the smoke app after an approved gap review.';
metadata.usage.useCases = ['Display the smoke app summary.'];
metadata.accessibility.keyboardSupport = ['Static content; no keyboard interactions.'];
metadata.aiHints.context = 'Use for the approved smoke app summary.';
metadata.aiHints.selectionCriteria.gap = 'Approved local candidate for smoke testing.';
metadata.examples[0].description = 'Basic smoke card presentation.';
writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
writeFileSync(join(dest, 'src/plectrum-candidates/smoke-card/evidence.md'), '# Smoke card evidence\n\nOwner and use case: smoke team summary\nDesign reference and states: local static card\nKeyboard test: static content\nScreen reader test: text announced\nStory and responsive checks: default story reviewed\nKnown limitations: not shipped as Core\nReuse potential (none / possible / likely) and why: possible — other teams show summaries\n');
metadata.props = [{ name: 'missingInput', type: 'string', required: false, description: 'A deliberately mismatched API.' }];
writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
expectFailure('npx --no-install plectrum check --profile ci', dest, 'missing from Angular inputs');
metadata.props = [];
writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
run('npx --no-install plectrum check --profile ci', dest);
run('npm run pds:test:unit', dest);
run('npm run pds:build-storybook', dest);
if (!existsSync(join(dest, 'dist/storybook/assets/fonts/agenda/agenda-regular.woff2'))) throw new Error('Local Storybook did not publish Agenda fonts.');
if (!existsSync(join(dest, 'dist/storybook/assets/fonts/open-sans/open-sans-latin-variable.woff2'))) throw new Error('Local Storybook did not publish Open Sans.');
const storyIndex = JSON.parse(readFileSync(join(dest, 'dist/storybook/index.json'), 'utf8'));
for (const id of ['plectrum-ready--docs', 'application-smokecard--docs']) {
  if (storyIndex.entries?.[id]?.type !== 'docs') throw new Error(`Local Storybook did not publish ${id}.`);
}
run('npm run pds:test:stories', dest);
run('git add src .plectrum/config.json', dest);
run('git -c user.name=Plectrum -c user.email=plectrum@example.invalid commit -m candidate', dest);
run('npx --no-install plectrum candidate-export --name smoke-card', dest);
const workflows = await import(pathToFileURL(join(dest, 'node_modules/@solidaris-danielbodigil/pds-devkit/src/workflows.mjs')).href);
const centralProposal = { schemaVersion: 1, id: 'smoke-app-smoke-card', componentId: 'ishare:smoke-card', team: 'ishare', application: 'smoke-app', issueUrl: 'https://github.com/solidaris-danielbodigil/solidaris-plectrum/issues/1', decision: 'approved-candidate', owner: 'ishare', decidedBy: '@solidaris-danielbodigil', decidedAt: '2026-09-25T00:00:00.000Z', decisionUrl: 'https://github.com/solidaris-danielbodigil/solidaris-plectrum/issues/1#issuecomment-1', note: 'Approved fixture' };
let centralSubmission = null;
const fakeCentral = {
  proposal: async () => centralProposal,
  content: async () => centralSubmission ? { value: centralSubmission } : null,
  submitPullRequest: async () => { throw new Error('Dry run opened a pull request.'); },
};
const submitted = await workflows.candidateSubmit(dest, ['candidate-submit', '--name', 'smoke-card', '--proposal', 'smoke-app-smoke-card', '--preview', 'https://example.com/previews/1968925', '--checks', 'https://example.com/checks/1968925', '--dry-run'], fakeCentral);
if (submitted.operation !== 'submit' || submitted.origin.revision !== submitted.preview.revision) throw new Error('Packed toolkit did not prepare a pinned candidate submission.');
centralSubmission = submitted;
const withdrawn = await workflows.candidateWithdraw(dest, ['candidate-withdraw', '--id', 'smoke-app-smoke-card', '--reason', 'Smoke fixture withdrawal', '--dry-run'], fakeCentral);
if (withdrawn.operation !== 'withdraw' || !withdrawn.withdrawalReason) throw new Error('Packed toolkit did not prepare a withdrawal.');
run('npx --no-install plectrum adoption-report', dest);
const adoption = JSON.parse(readFileSync(join(dest, '.plectrum/reports/adoption.json'), 'utf8'));
if (adoption.localComponents?.[0]?.reusePotential !== 'possible') throw new Error('Usage report does not carry the local component and its reuse estimate.');
for (const relative of ['.cursor/agents/plectrum.md', '.github/agents/plectrum.agent.md', '.github/instructions/plectrum.instructions.md', '.github/workflows/plectrum-checks.yml', '.plectrum/exports/smoke-card.candidate.json', '.plectrum/reports/adoption.json']) {
  if (!existsSync(join(dest, relative))) throw new Error(`Missing generated consumer artifact: ${relative}`);
}
const notes = join(dest, '.plectrum/team-notes.md');
writeFileSync(notes, 'Team-owned notes survive updates.\n');
const mcpFile = join(dest, '.cursor/mcp.json');
const mcp = JSON.parse(readFileSync(mcpFile, 'utf8'));
mcp.mcpServers['team-owned'] = { url: 'https://example.invalid/mcp' };
writeFileSync(mcpFile, `${JSON.stringify(mcp, null, 2)}\n`);
run('npx --no-install plectrum update', dest);
if (readFileSync(notes, 'utf8') !== 'Team-owned notes survive updates.\n') throw new Error('Team notes changed during update.');
if (!JSON.parse(readFileSync(mcpFile, 'utf8')).mcpServers['team-owned']) throw new Error('Unrelated MCP server lost during update.');
const managed = join(dest, '.cursor/agents/plectrum.md');
const original = readFileSync(managed, 'utf8');
writeFileSync(managed, `${original}\nTeam edit\n`);
expectFailure('npx --no-install plectrum update', dest, 'Managed-file conflict');
writeFileSync(managed, original);
run('npx --no-install plectrum update', dest);
const styles = join(dest, 'src/styles.scss');
const before = readFileSync(styles, 'utf8');
writeFileSync(styles, `${before}\n.invalid { color: var(--pds-not-a-token); }\n`);
expectFailure('npx --no-install plectrum check --profile ci', dest, 'unknown --pds-not-a-token');
writeFileSync(styles, before);
run('npx --no-install plectrum check --profile ci', dest);
const configFile = join(dest, '.plectrum/config.json');
const originalConfig = readFileSync(configFile, 'utf8');
const emptyConfig = JSON.parse(originalConfig);
emptyConfig.paths.source = ['missing-src'];
emptyConfig.paths.styles = ['missing-styles'];
writeFileSync(configFile, `${JSON.stringify(emptyConfig, null, 2)}\n`);
expectFailure('npx --no-install plectrum check --profile ci', dest, 'No application source or style files scanned');
writeFileSync(configFile, originalConfig);
run('npx --no-install plectrum check --profile ci', dest);

console.log(`pack:smoke succeeded in ${dest}`);
