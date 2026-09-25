#!/usr/bin/env node
/**
 * Pack libs and `ng build` a throwaway Angular app with no path aliases.
 * The consumer is copied outside the workspace so tsconfig paths cannot leak.
 */

import { execSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TARBALLS = join(ROOT, 'tools/packaging/.tarballs');
const FIXTURE = join(ROOT, 'tools/packaging/consumer-app');

function run(cmd, cwd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
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
  const match = name.match(/^solidaris-(.+)-(\d+\.\d+\.\d+)\.tgz$/);
  if (!match) continue;
  fileDeps[`@solidaris/${match[1]}`] = `file:${join(TARBALLS, name)}`;
}

const dest = mkdtempSync(join(tmpdir(), 'pds-pack-smoke-'));
cpSync(FIXTURE, dest, { recursive: true });

const pkg = JSON.parse(readFileSync(join(dest, 'package.json'), 'utf8'));
pkg.dependencies = { ...pkg.dependencies, ...fileDeps };
pkg.devDependencies = { ...pkg.devDependencies, '@solidaris/plectrum-devkit': fileDeps['@solidaris/plectrum-devkit'] };
delete pkg.dependencies['@solidaris/plectrum-devkit'];
writeFileSync(join(dest, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);

run('npm install --legacy-peer-deps', dest);
run("node -e \"console.log(require.resolve('@solidaris/plectrum-devkit/schema/metadata.v1'))\"", dest);
run("node -e \"console.log(require.resolve('@solidaris/plectrum-devkit/catalogue'))\"", dest);
run('npx ng build', dest);

run('git init', dest);
run('git add package.json src', dest);
run('git -c user.name=Plectrum -c user.email=plectrum@example.invalid commit -m fixture', dest);
run('npx --no-install plectrum init --team ishare --application smoke-app --repository https://github.com/example/smoke-app', dest);
run('npx --no-install plectrum update', dest);
run('npx --no-install plectrum doctor', dest);
run('npx --no-install plectrum catalogue --id plectrum:form-field', dest);
run('npx --no-install plectrum check --profile ci', dest);
const central = join(dest, 'central-checkout');
mkdirSync(join(central, '.ai/candidates/proposals'), { recursive: true });
writeFileSync(join(central, '.ai/candidates/proposals/smoke-app-smoke-card.json'), `${JSON.stringify({ schemaVersion: 1, id: 'smoke-app-smoke-card', componentId: 'ishare:smoke-card', team: 'ishare', application: 'smoke-app', issueUrl: 'https://github.com/solidaris-danielbodigil/solidaris-plectrum/issues/1', decision: 'approved-candidate', owner: 'ishare', decidedBy: '@solidaris-danielbodigil', decidedAt: '2026-09-25T00:00:00.000Z', decisionUrl: 'https://github.com/solidaris-danielbodigil/solidaris-plectrum/issues/1#issuecomment-1', note: 'Approved fixture' }, null, 2)}\n`);
run(`npx --no-install plectrum scaffold --name smoke-card --proposal smoke-app-smoke-card --central-checkout "${central}"`, dest);
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
writeFileSync(join(dest, 'src/plectrum-candidates/smoke-card/evidence.md'), '# Smoke card evidence\n\nProposal decision and owner: approved by smoke team\nDesign reference and states: local static card\nKeyboard test: static content\nScreen reader test: text announced\nStory and responsive checks: default story reviewed\nKnown limitations: not shipped as Core\n');
metadata.props = [{ name: 'missingInput', type: 'string', required: false, description: 'A deliberately mismatched API.' }];
writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
expectFailure('npx --no-install plectrum check --profile ci', dest, 'missing from Angular inputs');
metadata.props = [];
writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
run('npx --no-install plectrum check --profile ci', dest);
run('git add src .plectrum/config.json', dest);
run('git -c user.name=Plectrum -c user.email=plectrum@example.invalid commit -m candidate', dest);
run('npx --no-install plectrum candidate-export --name smoke-card', dest);
const workflows = await import(pathToFileURL(join(dest, 'node_modules/@solidaris/plectrum-devkit/src/workflows.mjs')).href);
const centralProposal = JSON.parse(readFileSync(join(central, '.ai/candidates/proposals/smoke-app-smoke-card.json'), 'utf8'));
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
