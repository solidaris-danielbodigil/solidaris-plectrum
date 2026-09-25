#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { asset, configAt, flag, packageJson, packageRoot, projectPath, readJson, requiredFlag } from '../src/common.mjs';
import { initialize, update } from '../src/managed.mjs';
import { candidateCheck, check, compatibility, tokenCheck, validateSchema } from '../src/checks.mjs';
import { adoptionReport, adoptionSubmit, candidateExport, candidateSubmit, candidateWithdraw, scaffold } from '../src/workflows.mjs';
import { probeMcp } from '../src/mcp.mjs';

const args = process.argv.slice(2);
const root = path.resolve(flag(args, 'root') ?? process.cwd());
const command = args[0];

async function probe(name, url) {
  const result = await probeMcp(url);
  if (result.ok) console.log(`${name}: MCP initialized; capabilities ${result.capabilities.join(', ') || 'none'}`);
  else console.log(`${name}: unavailable (${result.error})`);
}

function help() {
  console.log(`Plectrum toolkit ${packageJson.version}\n\nCommands:\n  init --team ID --application ID --repository URL\n  update\n  catalogue [--id plectrum:form-field]\n  doctor [--live]\n  scaffold --name slug --proposal application-slug\n  validate --schema metadata|proposal|submission|candidateReview|candidatePromotion|candidate|adoption --file relative.json\n  tokens check [--strict]\n  check --profile ci\n  candidate-export --name slug [--output path]\n  candidate-submit --name slug --proposal application-slug --preview URL --checks URL [--dry-run]\n  candidate-withdraw --id application-slug --reason TEXT [--dry-run]\n  adoption-report [--output path]\n  adoption-submit [--dry-run]\n\nAll commands accept --root path. Candidate and adoption PR operations need GH_TOKEN or GITHUB_TOKEN. adoption-submit does nothing until reporting.enabled is true.\n`);
}

async function main() {
  if (!command || ['help', '--help', '-h'].includes(command)) return help();
  if (command === 'init') return initialize(root, args);
  if (command === 'update') return update(root);
  if (command === 'self-check') {
    for (const schema of ['compatibility', 'registry', 'metadata', 'candidate', 'proposal', 'submission', 'candidateReview', 'candidatePromotion', 'adoption', 'contracts', 'release']) readJson(path.join(packageRoot, 'assets/schema', `${schema}.v1.schema.json`));
    validateSchema('compatibility', asset('compatibility.json'));
    validateSchema('registry', asset('registry.json'));
    for (const entry of asset('catalogue.json').components) {
      validateSchema('metadata', entry.metadata);
      if (!entry.docs?.previewUrl || !entry.docs?.versionedUrlTemplate) throw new Error(`Missing documentation route in snapshot: ${entry.id}`);
    }
    if (!asset('tokens.json').names.length) throw new Error('Empty token inventory.');
    console.log(`Toolkit snapshot valid: ${asset('catalogue.json').components.length} components; ${asset('tokens.json').names.length} tokens.`);
    return;
  }
  if (command === 'catalogue') {
    const catalogue = asset('catalogue.json');
    const id = flag(args, 'id');
    const entries = id ? catalogue.components.filter((item) => item.id === id) : catalogue.components;
    if (!entries.length) throw new Error(`No catalogue component ${id}`);
    if (id) console.log(JSON.stringify(entries[0], null, 2));
    else for (const item of entries) console.log(`${item.id}\t${item.package?.importPath ?? 'local'}\t${item.package?.exportName ?? 'CSS'}\t${item.docs.previewUrl ?? item.docs.sourcePath}`);
    return;
  }
  if (command === 'doctor') {
    const config = configAt(root);
    const errors = compatibility(root, config);
    const report = candidateCheck(root, config);
    errors.push(...report.errors);
    console.log(`Toolkit ${packageJson.version}; process ${asset('process.json').version}; ${asset('catalogue.json').components.length} catalogue entries.\nInstalled snapshot documentation is a development preview until P7 publishes a versioned release.`);
    for (const [name, url] of Object.entries(config.mcp ?? {})) {
      if (!url) console.log(`${name}: not configured; offline catalogue available`);
      else if (args.includes('--live')) await probe(name, url);
      else console.log(`${name}: configured ${url}; pass --live to verify MCP initialize capabilities`);
    }
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('Compatibility and managed files: ok');
    return;
  }
  if (command === 'scaffold') return scaffold(root, args);
  if (command === 'validate') {
    const schema = requiredFlag(args, 'schema');
    if (!['metadata', 'proposal', 'submission', 'candidateReview', 'candidatePromotion', 'candidate', 'adoption'].includes(schema)) throw new Error('Unknown exchange schema. Run plectrum help.');
    const file = projectPath(root, requiredFlag(args, 'file'));
    validateSchema(schema, readJson(file));
    console.log(`${schema} valid: ${path.relative(root, file)}`);
    return;
  }
  if (command === 'tokens' && args[1] === 'check') {
    const config = configAt(root);
    const result = tokenCheck(root, config, args.includes('--strict'));
    if (result.violations.length) throw new Error(result.violations.join('\n'));
    console.log(`Token check passed: ${result.count} files scanned; ${args.includes('--strict') ? 'strict' : 'unknown-token'} profile.`);
    return;
  }
  if (command === 'check') return check(root, flag(args, 'profile') ?? 'ci');
  if (command === 'candidate-export') return candidateExport(root, args);
  if (command === 'candidate-submit') return candidateSubmit(root, args);
  if (command === 'candidate-withdraw') return candidateWithdraw(root, args);
  if (command === 'adoption-report') return adoptionReport(root, args);
  if (command === 'adoption-submit') return adoptionSubmit(root, args);
  throw new Error(`Unknown command: ${args.slice(0, 2).join(' ')}. Run plectrum help.`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
