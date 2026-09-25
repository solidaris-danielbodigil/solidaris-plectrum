import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import Ajv2020 from 'ajv/dist/2020.js';
import ts from 'typescript';
import { asset, configAt, filesUnder, packageJson, packageRoot, projectPath, readJson, slash } from './common.mjs';
import { managedStatus } from './managed.mjs';

const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
const validators = new Map();
export function validateSchema(name, value) {
  if (!validators.has(name)) validators.set(name, ajv.compile(readJson(path.join(packageRoot, 'assets/schema', `${name}.v1.schema.json`))));
  const validate = validators.get(name);
  if (!validate(value)) throw new Error(`${name} schema: ${ajv.errorsText(validate.errors, { separator: '\n' })}`);
}

export function compatibility(root, config) {
  const errors = managedStatus(root);
  const contract = asset('compatibility.json');
  validateSchema('compatibility', contract);
  if (contract.toolkitVersion !== packageJson.version) errors.push('Toolkit package and compatibility snapshot versions differ.');
  const catalogue = asset('catalogue.json');
  const tokens = asset('tokens.json');
  if (!catalogue.components?.length || !tokens.names?.length) errors.push('Installed catalogue or token inventory is empty.');
  const installedVersions = [];
  for (const name of config.dependencies) {
    const file = projectPath(root, `node_modules/${name}/package.json`);
    if (!fs.existsSync(file)) { errors.push(`Missing installed package: ${name}`); continue; }
    const version = readJson(file).version;
    installedVersions.push(version);
    if (!semver.valid(version) || !semver.satisfies(version, contract.dsVersionRange)) errors.push(`${name}@${version} is outside ${contract.dsVersionRange}`);
    if (name === '@solidaris/styles' && version !== tokens.stylesVersion) errors.push(`Token inventory styles ${tokens.stylesVersion} differs from installed ${version}`);
    if (name === '@solidaris/ui') {
      for (const entry of catalogue.components.filter((c) => c.package?.name === name)) {
        if (entry.package.version !== version) { errors.push(`Catalogue ${entry.id} uses ${entry.package.version}, installed UI is ${version}`); break; }
      }
    }
  }
  if (new Set(installedVersions).size > 1) errors.push(`DS runtime packages must share one version: ${installedVersions.join(', ')}`);
  if (!semver.satisfies(asset('process.json').version, contract.processVersionRange)) errors.push('Process contract version is incompatible.');
  if (!semver.satisfies(`${catalogue.schemaVersion}.0.0`, contract.contractSchemaRange)) errors.push('Contract schema version is incompatible.');
  return errors;
}

export function tokenCheck(root, config, strict = true) {
  const inventory = asset('tokens.json');
  if (!inventory.names?.length) throw new Error('Installed DS token inventory is empty.');
  const approved = new Set(inventory.names);
  for (const relative of config.paths.localTokenFiles) {
    const file = projectPath(root, relative);
    if (!fs.existsSync(file)) throw new Error(`Approved local token file is missing: ${relative}`);
    const body = fs.readFileSync(file, 'utf8');
    for (const match of body.matchAll(/^\s*(--pds-[a-z0-9-]+)\s*:/gm)) approved.add(match[1]);
  }
  const paths = [...new Set([...config.paths.source, ...config.paths.styles])];
  const scanned = new Set();
  const violations = [];
  for (const relative of paths) {
    const directory = projectPath(root, relative);
    for (const file of filesUnder(directory)) {
      if (!/\.(scss|css|html|ts)$/.test(file) || /\.(spec|stories|metadata)\.ts$/.test(file)) continue;
      if (scanned.has(file)) continue;
      scanned.add(file);
      const name = slash(path.relative(root, file));
      const body = fs.readFileSync(file, 'utf8');
      for (const match of body.matchAll(/--pds-[a-z0-9-]+/g)) {
        if (!approved.has(match[0]) && !match[0].endsWith('-')) violations.push(`${name}: unknown ${match[0]}`);
      }
      if (/\b(?:\$dt|dt|usePreset|updatePreset)\b/.test(body) && /from\s+['"]@primeuix\/themes['"]/.test(body)) violations.push(`${name}: runtime @primeuix/themes helper import`);
      if (!config.paths.localTokenFiles.includes(name) && /^\s*--pds-[a-z0-9-]+\s*:/m.test(body)) violations.push(`${name}: undeclared local --pds-* token`);
      if (strict && /\.(scss|css|html)$/.test(file)) {
        body.split('\n').forEach((line, i) => {
          if (/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/.test(line)) violations.push(`${name}:${i + 1}: hardcoded hex`);
          else if (/(?<![-\w])\d+px\b/.test(line) && !line.includes('1px solid') && !line.includes('border:')) violations.push(`${name}:${i + 1}: hardcoded px`);
        });
      }
    }
  }
  if (!scanned.size) violations.push('No application source or style files scanned; check config.paths.');
  return { count: scanned.size, violations: [...new Set(violations)] };
}

function classInputs(file) {
  const body = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, body, ts.ScriptTarget.Latest, true);
  const names = new Set();
  function visit(node) {
    if (ts.isPropertyDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
      const init = node.initializer;
      if (init && ts.isCallExpression(init)) {
        const callee = init.expression;
        const functionName = ts.isIdentifier(callee) ? callee.text : ts.isPropertyAccessExpression(callee) ? callee.name.text : '';
        if (['input', 'model'].includes(functionName)) names.add(node.name.text);
      }
      for (const decorator of ts.getDecorators(node) ?? []) {
        const expr = decorator.expression;
        if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression) && expr.expression.text === 'Input') names.add(node.name.text);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return names;
}

export function candidateCheck(root, config) {
  const base = projectPath(root, config.paths.candidates);
  const errors = [];
  let count = 0;
  for (const file of filesUnder(base).filter((f) => f.endsWith('.metadata.json'))) {
    count++;
    const rel = slash(path.relative(root, file));
    let metadata;
    try { metadata = readJson(file); validateSchema('metadata', metadata); }
    catch (error) { errors.push(`${rel}: ${error.message}`); continue; }
    if (/TODO:/.test(JSON.stringify(metadata))) errors.push(`${rel}: complete candidate placeholders before CI`);
    if (metadata.component.id.split(':')[0] !== config.team || metadata.governance.owner !== config.team || metadata.governance.status !== 'candidate' || metadata.distribution.kind !== 'local') errors.push(`${rel}: candidate ownership, status, ID or distribution invalid`);
    const proposalFile = path.join(path.dirname(file), 'proposal.json');
    if (!fs.existsSync(proposalFile)) errors.push(`${rel}: merged proposal copy missing`);
    else {
      try {
        const proposal = readJson(proposalFile);
        validateSchema('proposal', proposal);
        if (proposal.decision !== 'approved-candidate' || proposal.componentId !== metadata.component.id || proposal.team !== config.team || proposal.application !== config.application || proposal.id !== `${config.application}-${path.basename(path.dirname(file))}` || proposal.owner !== config.team || !proposal.decisionUrl.startsWith(`${asset('registry.json').repository}/`)) errors.push(`${rel}: proposal does not approve this candidate`);
      } catch (error) { errors.push(`${rel}: ${error.message}`); }
    }
    if (!metadata.component.path.startsWith(`${config.paths.candidates}/`)) errors.push(`${rel}: implementation must stay under ${config.paths.candidates}`);
    if (!metadata.component.scssPath?.startsWith(`${config.paths.candidateStyles}/`)) errors.push(`${rel}: styles must stay under ${config.paths.candidateStyles}`);
    const source = projectPath(root, metadata.component.path);
    if (!fs.existsSync(source)) { errors.push(`${rel}: implementation missing ${metadata.component.path}`); continue; }
    const stem = source.replace(/\.component\.ts$/, '');
    if (!fs.existsSync(`${stem}.stories.ts`)) errors.push(`${rel}: Storybook story missing`);
    const style = metadata.component.scssPath;
    if (!style || !fs.existsSync(projectPath(root, style))) errors.push(`${rel}: candidate style missing`);
    const declared = new Set((metadata.props ?? []).map((p) => p.name));
    const actual = classInputs(source);
    for (const name of actual) if (!declared.has(name)) errors.push(`${rel}: Angular input ${name} missing from metadata.props`);
    for (const name of declared) if (!actual.has(name)) errors.push(`${rel}: metadata prop ${name} missing from Angular inputs`);
    const evidence = path.join(path.dirname(file), 'evidence.md');
    if (!fs.existsSync(evidence)) errors.push(`${rel}: evidence.md missing`);
    else if (/TODO\b/.test(fs.readFileSync(evidence, 'utf8'))) errors.push(`${rel}: complete evidence.md before CI`);
  }
  return { count, errors };
}

export function check(root, profile) {
  const config = configAt(root);
  if (profile !== 'ci') throw new Error('Supported check profile: ci');
  const policy = asset('process.json').checkProfiles.consumerCi;
  if (!policy?.strictTokens || !policy.requireSourceScan || !policy.requireInstalledPackages || !policy.requireManagedAdapters || !policy.requireCandidateStoriesAndEvidence) throw new Error('Incomplete consumerCi check profile in installed process contract.');
  const errors = compatibility(root, config);
  const tokens = tokenCheck(root, config, true);
  const candidates = candidateCheck(root, config);
  errors.push(...tokens.violations, ...candidates.errors);
  if (errors.length) throw new Error(`Plectrum CI failed:\n${errors.map((e) => `  ${e}`).join('\n')}`);
  console.log(`Plectrum CI passed: ${tokens.count} source/style files; ${candidates.count} candidates; installed contracts and packages compatible.`);
}
