import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { asset, configAt, filesUnder, flag, format, packageJson, projectPath, readJson, requiredFlag, slash } from './common.mjs';
import { candidateCheck, check, validateSchema } from './checks.mjs';
import { GitHubClient, githubRepository } from './github.mjs';

const nowDate = () => new Date().toISOString().slice(0, 10);
const safeName = (value) => /^[a-z][a-z0-9-]*$/.test(value);
const className = (name) => name.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join('');

async function approvedProposal(root, args, name, client = new GitHubClient(process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN)) {
  const config = configAt(root);
  const id = requiredFlag(args, 'proposal');
  const expected = `${config.application}-${name}`;
  if (id !== expected) throw new Error(`Proposal ID must be ${expected}.`);
  const central = asset('registry.json').repository;
  let proposal;
  const checkout = flag(args, 'central-checkout');
  if (checkout) proposal = readJson(path.join(path.resolve(checkout), '.ai/candidates/proposals', `${id}.json`));
  else proposal = await client.proposal(githubRepository(central).fullName, id);
  validateSchema('proposal', proposal);
  if (proposal.id !== id || proposal.componentId !== `${config.team}:${name}` || proposal.team !== config.team || proposal.application !== config.application || proposal.owner !== config.team || proposal.decision !== 'approved-candidate' || !proposal.issueUrl.startsWith(`${central}/issues/`) || !proposal.decisionUrl.startsWith(`${central}/`)) throw new Error(`Central proposal ${id} does not approve ${config.team}:${name} for ${config.application}.`);
  return proposal;
}

export async function scaffold(root, args) {
  const config = configAt(root);
  const name = requiredFlag(args, 'name');
  if (!safeName(name)) throw new Error('Candidate name must be a lowercase slug.');
  const folder = `${config.paths.candidates}/${name}`;
  const file = `${folder}/${name}`;
  const style = `${config.paths.candidateStyles}/_components.${name}.scss`;
  const targets = [`${file}.component.ts`, `${file}.stories.ts`, `${file}.component.spec.ts`, `${file}.metadata.json`, `${folder}/evidence.md`, style];
  if (targets.some((p) => fs.existsSync(projectPath(root, p)))) throw new Error(`Candidate ${name} already has files; scaffold did not overwrite them.`);
  const cls = `${className(name)}Component`;
  const metadata = {
    component: { id: `${config.team}:${name}`, name: className(name), category: 'molecules', description: `TODO: Describe the ${name} candidate and the need it addresses.`, type: 'display', path: `${file}.component.ts`, bemBlock: `c-${name}`, itcssLayer: '06-components', scssPath: style, created: nowDate(), modified: nowDate() },
    distribution: { kind: 'local' },
    governance: { status: 'candidate', owner: config.team, note: 'Local application component; central sharing is optional.' },
    usage: { useCases: ['TODO: Describe a supported use case.'], commonPatterns: [], antiPatterns: [] },
    props: [],
    accessibility: { wcagLevel: 'AA', keyboardSupport: ['TODO: Record keyboard behavior.'] },
    tokens: { consumed: [] },
    aiHints: { priority: 'medium', context: 'TODO: Describe the candidate selection context.', selectionCriteria: { gap: 'TODO: Record the application gap.' }, keywords: [name] },
    examples: [{ name: 'Basic', description: 'TODO: Explain this example.', code: `<app-${name} />` }],
  };
  validateSchema('metadata', metadata);
  const content = {
    [`${file}.component.ts`]: `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-${name}',\n  standalone: true,\n  template: \`<div class="c-${name}">Describe the candidate</div>\`,\n})\nexport class ${cls} {}\n`,
    [`${file}.stories.ts`]: `import type { Meta, StoryObj } from '@storybook/angular-vite';\nimport { ${cls} } from './${name}.component';\n\nconst meta: Meta<${cls}> = { title: 'Application/${className(name)}', component: ${cls}, tags: ['autodocs'] };\nexport default meta;\nexport const Default: StoryObj<${cls}> = {};\n`,
    [`${file}.component.spec.ts`]: `import { TestBed } from '@angular/core/testing';\nimport { ${cls} } from './${name}.component';\n\ndescribe('${cls}', () => {\n  it('renders its host', async () => {\n    await TestBed.configureTestingModule({ imports: [${cls}] }).compileComponents();\n    const fixture = TestBed.createComponent(${cls});\n    fixture.detectChanges();\n    expect(fixture.nativeElement.querySelector('.c-${name}')).not.toBeNull();\n  });\n});\n`,
    [`${file}.metadata.json`]: format(metadata),
    [`${folder}/evidence.md`]: `# ${className(name)} evidence\n\nOwner and use case: TODO\nDesign reference and states: TODO\nKeyboard test: TODO\nScreen reader test: TODO\nStory and responsive checks: TODO\nKnown limitations: TODO\n`,
    [style]: `// Candidate styles. Use published --pds-* tokens.\n.c-${name} {\n  display: block;\n}\n`,
  };
  const index = projectPath(root, `${config.paths.candidateStyles}/_index.scss`);
  if (!fs.existsSync(index)) throw new Error(`Missing ITCSS component index: ${path.relative(root, index)}. Run plectrum bootstrap first.`);
  const importLine = `@use 'components.${name}';`;
  if (fs.readFileSync(index, 'utf8').includes(importLine)) throw new Error(`ITCSS component import already exists: ${importLine}`);
  for (const [relative, body] of Object.entries(content)) { const target = projectPath(root, relative); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, body); }
  fs.appendFileSync(index, `\n${importLine}\n`);
  console.log(`Scaffolded ${name} in ${folder}; complete metadata, story, styles and evidence before export.`);
}

function revision(root) {
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(); }
  catch { throw new Error('A committed git HEAD is required to export traceable candidate/adoption data.'); }
}

function requireCommitted(root, paths) {
  const output = execFileSync('git', ['status', '--porcelain', '--', ...paths], { cwd: root, encoding: 'utf8' }).trim();
  if (output) throw new Error(`Commit relevant source and metadata before export; the Git revision must identify the exported state:\n${output}`);
}

export function candidateExport(root, args) {
  const config = configAt(root);
  const name = requiredFlag(args, 'name');
  if (!safeName(name)) throw new Error('Candidate name must be a lowercase slug.');
  const result = candidateCheck(root, config);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  const relative = `${config.paths.candidates}/${name}/${name}.metadata.json`;
  const file = projectPath(root, relative);
  if (!fs.existsSync(file)) throw new Error(`Candidate metadata missing: ${relative}`);
  const metadata = readJson(file);
  requireCommitted(root, [config.paths.candidates, config.paths.candidateStyles, '.plectrum/config.json']);
  const exportObject = { schemaVersion: 1, id: `${config.application}-${name}`, componentId: metadata.component.id, team: config.team, application: config.application, state: 'proposed', origin: { repository: config.repository, revision: revision(root), path: relative }, metadata, evidence: {}, history: [] };
  validateSchema('candidate', exportObject);
  const output = projectPath(root, flag(args, 'output') ?? `.plectrum/exports/${name}.candidate.json`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, format(exportObject));
  console.log(`Wrote local proposal draft ${slash(path.relative(root, output))}; central submission and review are separate.`);
}

function submissionBase(root, config, name, proposal, args) {
  check(root, 'ci');
  requireCommitted(root, [config.paths.candidates, config.paths.candidateStyles, '.plectrum/config.json']);
  const relative = `${config.paths.candidates}/${name}/${name}.metadata.json`;
  const metadata = readJson(projectPath(root, relative));
  const sha = revision(root);
  const preview = requiredFlag(args, 'preview');
  const checksUrl = requiredFlag(args, 'checks');
  for (const [kind, url] of [['preview', preview], ['checks', checksUrl]]) {
    if (!/^https:\/\//.test(url)) throw new Error(`${kind} must be a full HTTPS URL.`);
  }
  const packages = config.dependencies.map((pkg) => ({ name: pkg, version: readJson(projectPath(root, `node_modules/${pkg}/package.json`)).version }));
  return {
    schemaVersion: 1,
    id: proposal.id,
    proposalId: proposal.id,
    operation: 'submit',
    componentId: metadata.component.id,
    team: config.team,
    application: config.application,
    origin: { repository: config.repository, revision: sha, path: relative },
    metadata,
    toolkitVersion: packageJson.version,
    processVersion: asset('process.json').version,
    packages,
    preview: { url: preview, revision: sha },
    checks: { url: checksUrl, revision: sha },
    submittedAt: new Date().toISOString(),
  };
}

export async function candidateSubmit(root, args, client = new GitHubClient(process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN)) {
  const config = configAt(root);
  const name = requiredFlag(args, 'name');
  if (!safeName(name)) throw new Error('Candidate name must be a lowercase slug.');
  // Submission always rechecks the merged central decision; a local cached copy is insufficient.
  const liveArgs = args.filter((arg) => arg !== '--central-checkout');
  const proposal = await approvedProposal(root, liveArgs, name, client);
  const submission = submissionBase(root, config, name, proposal, args);
  const central = asset('registry.json').repository;
  const repo = githubRepository(central).fullName;
  const previous = await client.content(repo, `.ai/candidates/submissions/${proposal.id}.json`);
  if (previous) {
    if (previous.value.operation === 'withdraw') throw new Error('This candidate ID was withdrawn and cannot be reused.');
    submission.operation = 'revise';
  }
  validateSchema('submission', submission);
  const output = projectPath(root, flag(args, 'output') ?? `.plectrum/exports/${proposal.id}.submission.json`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, format(submission));
  if (args.includes('--dry-run')) { console.log(`Validated local submission draft ${slash(path.relative(root, output))}; no PR opened.`); return submission; }
  const url = await client.submitPullRequest(central, submission);
  console.log(`Candidate ${submission.id} ${submission.operation} PR: ${url}`);
  return url;
}

export async function candidateWithdraw(root, args, client = new GitHubClient(process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN)) {
  const config = configAt(root);
  const id = requiredFlag(args, 'id');
  const reason = requiredFlag(args, 'reason');
  const central = asset('registry.json').repository;
  const previous = await client.content(githubRepository(central).fullName, `.ai/candidates/submissions/${id}.json`);
  if (!previous || previous.value.operation === 'withdraw') throw new Error(`${id}: no active central submission to withdraw.`);
  const submission = { ...previous.value, operation: 'withdraw', withdrawalReason: reason, submittedAt: new Date().toISOString() };
  if (submission.team !== config.team || submission.application !== config.application || submission.origin.repository !== config.repository) throw new Error(`${id}: submission does not belong to this application.`);
  validateSchema('submission', submission);
  const output = projectPath(root, flag(args, 'output') ?? `.plectrum/exports/${id}.withdrawal.json`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, format(submission));
  if (args.includes('--dry-run')) { console.log(`Validated withdrawal draft ${slash(path.relative(root, output))}; no PR opened.`); return submission; }
  const url = await client.submitPullRequest(central, submission);
  console.log(`Candidate ${id} withdrawal PR: ${url}`);
  return url;
}

export function adoptionReport(root, args) {
  const config = configAt(root);
  requireCommitted(root, [...config.paths.source, '.plectrum/config.json']);
  const catalogue = asset('catalogue.json');
  const packageNames = config.dependencies;
  const packages = packageNames.map((name) => {
    const file = projectPath(root, `node_modules/${name}/package.json`);
    if (!fs.existsSync(file)) throw new Error(`Missing installed package ${name}`);
    return { name, version: readJson(file).version };
  });
  const observations = [];
  const sourceFiles = [...new Set(config.paths.source.flatMap((relative) => filesUnder(projectPath(root, relative))))].filter((file) => /\.(ts|html)$/.test(file) && !/\.(spec|stories|metadata)\.ts$/.test(file));
  if (!sourceFiles.length) throw new Error('No source files for adoption report; check config.paths.source.');
  const bodies = sourceFiles.map((file) => ({ file: slash(path.relative(root, file)), body: fs.readFileSync(file, 'utf8') }));
  for (const component of catalogue.components) {
    const entry = component.package?.importPath;
    if (!entry || !component.package.exportName) continue;
    const matches = bodies.filter(({ body }) => {
      const imported = new RegExp(`import\\s*\\{[^}]*\\b${component.package.exportName}\\b[^}]*\\}\\s*from\\s*['"]${entry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 's').test(body);
      const selector = component.selector && new RegExp(`<${component.selector}(?:\\s|>)`).test(body);
      return imported || selector;
    });
    if (matches.length) observations.push({ componentId: component.id, kind: 'source-reference', count: matches.length, files: matches.map((m) => m.file) });
  }
  const report = { schemaVersion: 1, application: config.application, team: config.team, source: { repository: config.repository, revision: revision(root), path: '.' }, observedAt: new Date().toISOString(), reporterVersion: packageJson.version, packages, observations, limitations: ['Static source references can include unused imports.', 'Runtime rendering, dynamic composition and styling-only usage are not measured.', 'PrimeNG controls are omitted until a reliable selector mapping is packed with the toolkit.', 'Installed package versions are not usage.', 'A missing central report is not proof of non-adoption.'] };
  validateSchema('adoption', report);
  const output = projectPath(root, flag(args, 'output') ?? config.reporting.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, format(report));
  console.log(`Wrote local adoption report ${slash(path.relative(root, output))}: ${observations.length} component references.`);
  return report;
}

const isRegistered = (config) => asset('registry.json').applications.some((app) => app.id === config.application && app.team === config.team);

/** Usage-report readiness in reader words, for bootstrap and doctor. The CI secret cannot be checked locally. */
export function usageReportStatus(config) {
  const id = `${config.team}/${config.application}`;
  if (!config.reporting?.enabled) return ['Usage reporting: off (reporting.enabled is false in .plectrum/config.json).'];
  if (!isRegistered(config)) return [`Usage reporting: not active yet — ${id} is not in the Plectrum registry. Register the team, then upgrade the toolkit.`, 'Usage reporting: CI also needs the PLECTRUM_ADOPTION_TOKEN secret.'];
  return [`Usage reporting: ${id} is registered. CI sends the report after each push to main when the PLECTRUM_ADOPTION_TOKEN secret is set.`];
}

/** A skipped step that people should notice: a yellow annotation on GitHub Actions, a plain line elsewhere. */
function skipWarning(message) {
  console.log(process.env.GITHUB_ACTIONS === 'true' ? `::warning title=Plectrum usage report::${message}` : message);
}

export async function adoptionSubmit(root, args, client = new GitHubClient(process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN)) {
  const config = configAt(root);
  if (!config.reporting.enabled) {
    console.log('Adoption submission is off (reporting.enabled is false in .plectrum/config.json).');
    return;
  }
  // Reporting is on by default; until the team is registered and CI has a token, skip without failing the build.
  if (!isRegistered(config)) {
    skipWarning(`Adoption submission skipped: ${config.team}/${config.application} is not in the Plectrum registry yet. Register the team, then upgrade the toolkit.`);
    return;
  }
  if (!client.token && !args.includes('--dry-run')) {
    skipWarning('Adoption submission skipped: set the PLECTRUM_ADOPTION_TOKEN secret (or GH_TOKEN locally) to open the report pull request.');
    return;
  }
  const report = adoptionReport(root, args);
  const central = asset('registry.json').repository;
  const current = await client.content(githubRepository(central).fullName, `.ai/adoption/${report.application}.json`);
  if (current?.value?.observedAt > report.observedAt) throw new Error('The central report is newer than this observation.');
  if (args.includes('--dry-run')) { console.log('Validated adoption submission; no PR opened.'); return report; }
  const url = await client.submitAdoptionPullRequest(central, report);
  console.log(`Adoption report PR: ${url}`);
  return url;
}
