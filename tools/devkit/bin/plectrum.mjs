#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { asset, configAt, flag, installedDocsUrl, packageJson, packageRoot, projectPath, readJson, requiredFlag } from '../src/common.mjs';
import { initialize, recommendedMcp, update } from '../src/managed.mjs';
import { bootstrap } from '../src/bootstrap.mjs';
import { candidateCheck, check, compatibility, tokenCheck, validateSchema } from '../src/checks.mjs';
import { adoptionReport, adoptionSubmit, candidateExport, candidateSubmit, candidateWithdraw, scaffold, usageReportStatus } from '../src/workflows.mjs';
import { probeMcp } from '../src/mcp.mjs';
import { serveStdio } from '../src/mcp-server.mjs';
import { recordEvent } from '../src/telemetry.mjs';
import { consumerCommands, renderHelp, subcommandOf } from '../src/process.mjs';

const args = process.argv.slice(2);
const root = path.resolve(flag(args, 'root') ?? process.cwd());
const command = args[0];
const contract = asset('process.json');
const exchangeSchemas = contract.commands.consumerValidate.values.schema;

async function probe(name, url) {
  const result = await probeMcp(url);
  if (result.ok) console.log(`${name}: MCP initialized; capabilities ${result.capabilities.join(', ') || 'none'}`);
  else if (/^HTTP 401\b/.test(result.error)) console.log(`${name}: reachable; sign in from the editor (OAuth) to use it`);
  else console.log(`${name}: unavailable (${result.error})`);
}

const docsFor = (entry) => installedDocsUrl(root, entry);

function docsNotice() {
  const registry = asset('registry.json');
  const base = registry.operations.storybook.replace(/\/$/, '');
  return `Documentation links target the installed runtime with toolkit ${packageJson.version}; that page exists only if this exact pair was released. Latest release: ${base}/latest/ · development preview: ${base}/`;
}

const handlers = {
  init: () => initialize(root, args),
  bootstrap: () => bootstrap(root),
  update: () => update(root),
  catalogue: () => {
    const catalogue = asset('catalogue.json');
    const id = flag(args, 'id');
    const entries = id ? catalogue.components.filter((item) => item.id === id) : catalogue.components;
    if (!entries.length) throw new Error(`No catalogue component ${id}`);
    if (id) console.log(JSON.stringify({ ...entries[0], installedDocsUrl: docsFor(entries[0]) }, null, 2));
    else {
      for (const item of entries) console.log(`${item.id}\t${item.package?.importPath ?? 'local'}\t${item.package?.exportName ?? 'CSS'}\t${docsFor(item)}`);
      console.log(docsNotice());
    }
  },
  doctor: async () => {
    const config = configAt(root);
    const errors = compatibility(root, config);
    const report = candidateCheck(root, config);
    errors.push(...report.errors);
    console.log(`Toolkit ${packageJson.version}; process ${contract.version}; ${asset('catalogue.json').components.length} catalogue entries.\n${docsNotice()}`);
    console.log(config.mcp?.plectrum === false ? 'plectrum: offline MCP server disabled (mcp.plectrum is false)' : 'plectrum: offline MCP server over stdio, started by the editor from .cursor/mcp.json and .vscode/mcp.json');
    for (const [name, url] of Object.entries(config.mcp ?? {})) {
      if (name === 'plectrum') continue;
      if (!url) console.log(`${name}: not configured${recommendedMcp[name] ? `; recommended ${recommendedMcp[name]} in .plectrum/config.json, then plectrum update` : ''}`);
      else if (args.includes('--live')) await probe(name, url);
      else console.log(`${name}: configured ${url}; pass --live to verify MCP initialize capabilities`);
    }
    for (const line of usageReportStatus(config)) console.log(line);
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('Compatibility and managed files: ok');
  },
  scaffold: () => scaffold(root, args),
  mcp: () => new Promise((resolve) => serveStdio(root).on('close', resolve)),
  validate: () => {
    const schema = requiredFlag(args, 'schema');
    if (!exchangeSchemas.includes(schema)) throw new Error(`Unknown exchange schema. Use one of: ${exchangeSchemas.join(', ')}.`);
    const file = projectPath(root, requiredFlag(args, 'file'));
    validateSchema(schema, readJson(file));
    console.log(`${schema} valid: ${path.relative(root, file)}`);
  },
  'tokens check': () => {
    const config = configAt(root);
    const result = tokenCheck(root, config, args.includes('--strict'));
    if (result.violations.length) throw new Error(result.violations.join('\n'));
    console.log(`Token check passed: ${result.count} files scanned; ${args.includes('--strict') ? 'strict' : 'unknown-token'} profile.`);
  },
  check: () => check(root, flag(args, 'profile') ?? 'ci'),
  'candidate-export': () => candidateExport(root, args),
  'candidate-submit': () => candidateSubmit(root, args),
  'candidate-withdraw': () => candidateWithdraw(root, args),
  'adoption-report': () => adoptionReport(root, args),
  'adoption-submit': () => adoptionSubmit(root, args),
};

/** Every advertised command must be implemented, and nothing implemented may stay unadvertised. */
function commandCoverage() {
  const advertised = new Set(consumerCommands(contract).map((item) => subcommandOf(item.usage)));
  const implemented = new Set(Object.keys(handlers));
  return {
    missing: [...advertised].filter((name) => !implemented.has(name)),
    unadvertised: [...implemented].filter((name) => !advertised.has(name)),
  };
}

function selfCheck() {
  for (const schema of ['process', 'compatibility', 'registry', 'metadata', 'candidate', 'proposal', 'submission', 'candidateReview', 'candidatePromotion', 'candidateFigmaReturn', 'adoption', 'contracts', 'release']) readJson(path.join(packageRoot, 'assets/schema', `${schema}.v1.schema.json`));
  validateSchema('process', contract);
  validateSchema('compatibility', asset('compatibility.json'));
  validateSchema('registry', asset('registry.json'));
  const coverage = commandCoverage();
  if (coverage.missing.length) throw new Error(`Process advertises unimplemented commands: ${coverage.missing.join(', ')}`);
  if (coverage.unadvertised.length) throw new Error(`CLI implements commands missing from the process contract: ${coverage.unadvertised.join(', ')}`);
  for (const entry of asset('catalogue.json').components) {
    validateSchema('metadata', entry.metadata);
    if (!entry.docs?.previewUrl || !entry.docs?.versionedUrlTemplate) throw new Error(`Missing documentation route in snapshot: ${entry.id}`);
  }
  if (!asset('tokens.json').names.length) throw new Error('Empty token inventory.');
  console.log(`Toolkit snapshot valid: process ${contract.version}; ${Object.keys(handlers).length} commands; ${asset('catalogue.json').components.length} components; ${asset('tokens.json').names.length} tokens.`);
}

async function main() {
  if (!command || ['help', '--help', '-h'].includes(command)) return console.log(renderHelp(contract, packageJson.version));
  if (command === 'self-check') return selfCheck();
  const name = command === 'tokens' ? `tokens ${args[1]}` : command;
  const handler = handlers[name];
  if (!handler) throw new Error(`Unknown command: ${args.slice(0, 2).join(' ')}. Run plectrum help.`);
  // The MCP server records each tool call itself; setup commands are not usage.
  const measured = !['mcp', 'init', 'bootstrap', 'update'].includes(name);
  try {
    const result = await handler();
    if (measured) recordEvent(root, { source: 'cli', name });
    return result;
  } catch (error) {
    if (measured) recordEvent(root, { source: 'cli', name, outcome: 'error' });
    throw error;
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
