#!/usr/bin/env node
/**
 * Human-readable summary of one Figma → repository token sync.
 *
 * Compares the previous ingestion SSOT (git HEAD by default) with the new
 * dump (the working tree after the staging copy), folds in the --json output
 * of tokens:audit and tokens:validate-preset plus the workflow step outcomes,
 * and writes:
 *   - Markdown for the GitHub job summary and the promotion PR body
 *   - a JSON twin for other channels (chat webhook, Figma comment)
 *   - a TypeScript module for the Storybook page Docs/Token pipeline/Sync status
 *
 * Never fails the job: a blocked sync still gets a report.
 *
 * Usage:
 *   node tools/tokens/report.mjs
 *     [--base HEAD | --base git:<rev> | --base <tokens.json>]
 *     [--head <tokens.json>]
 *     [--audit audit.json] [--validate validate.json]
 *     [--outcome build=success] [--outcome audit=failure] …
 *     [--md report.md] [--json report.json] [--ts sync-report.generated.ts]
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import {
  formatShadowValue,
  normalizeHex,
  shadowLayersFromPaths,
  shadowLayersFromValue,
} from './format-value.mjs';
import {
  ALIAS_RE,
  DEFAULT_TOKENS_PATH,
  TOKEN_REF_RE,
  WORKSPACE_ROOT,
  normalizeRef,
  resolveDtcg,
} from './resolve-dtcg.mjs';

const SRC_TOKENS_REL = 'libs/plectrum/src/tokens.json';
const THEME_DIR = join(WORKSPACE_ROOT, 'libs/plectrum/sync/theme');
const MAX_CHANGED_ROWS = 40;
const MAX_LIST_ITEMS = 20;
/** Expanded shadow leaf (`…shadow.x`, `…shadow.0.blur`) as older dumps wrote them. */
const SHADOW_LEAF_RE = /^(.+?)(?:\.\d+)?\.(x|y|blur|spread|color|type)$/;

const OUTCOME_LABEL = {
  success: 'OK',
  failure: 'FAIL',
  cancelled: 'CANCELLED',
  skipped: 'SKIP',
};

function parseArgs(argv) {
  const out = {
    base: 'HEAD',
    head: DEFAULT_TOKENS_PATH,
    auditPath: null,
    validatePath: null,
    outcomes: {},
    mdPath: null,
    jsonPath: null,
    tsPath: null,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      return argv[i];
    };
    switch (arg) {
      case '--base':
        out.base = next();
        break;
      case '--head':
        out.head = resolve(next());
        break;
      case '--audit':
        out.auditPath = next();
        break;
      case '--validate':
        out.validatePath = next();
        break;
      case '--outcome': {
        const [key, value] = String(next()).split('=');
        if (key) out.outcomes[key] = value ?? '';
        break;
      }
      case '--md':
        out.mdPath = next();
        break;
      case '--json':
        out.jsonPath = next();
        break;
      case '--ts':
        out.tsPath = next();
        break;
      case '--help':
      case '-h':
        out.help = true;
        break;
      default:
        break;
    }
  }
  return out;
}

function git(args) {
  try {
    return execFileSync('git', args, {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function loadBase(spec) {
  const isGit = spec === 'HEAD' || spec.startsWith('git:');
  if (isGit) {
    const rev = spec === 'HEAD' ? 'HEAD' : spec.slice(4);
    const label = `${rev}:${SRC_TOKENS_REL}`;
    const out = git(['show', label]);
    if (out == null) {
      return { raw: null, label, error: 'not in git history' };
    }
    try {
      return { raw: JSON.parse(out), label };
    } catch (error) {
      return { raw: null, label, error: error.message };
    }
  }
  const abs = resolve(spec);
  if (!existsSync(abs)) return { raw: null, label: spec, error: 'file not found' };
  return {
    raw: JSON.parse(readFileSync(abs, 'utf8')),
    label: relative(WORKSPACE_ROOT, abs) || abs,
  };
}

function readJson(path) {
  if (!path || !existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Display form that also serves as the comparison key: hex8 `ff` → hex6,
 * numbers rounded to 4 decimals (the plugin exports float32 noise such as
 * 18.290000915527344 for 18.29).
 */
function displayValue(value) {
  if (value == null) return null;
  if (typeof value === 'object') {
    return formatShadowValue(value) ?? JSON.stringify(normalizeDeep(value));
  }
  const raw = String(value).trim();
  if (/^-?\d+(\.\d+)?$/.test(raw)) return String(Number.parseFloat(Number(raw).toFixed(4)));
  return normalizeHex(raw) ?? raw;
}

function normalizeDeep(value) {
  if (Array.isArray(value)) return value.map(normalizeDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalizeDeep(value[key])]),
    );
  }
  return displayValue(value);
}

function aliasOf(dtcg, path) {
  const leaf = dtcg.byPath.get(path);
  if (typeof leaf?.value !== 'string') return null;
  const match = leaf.value.trim().match(ALIAS_RE);
  return match ? match[1] : null;
}

/** prefix → expanded leaf paths, so a composite shadow can be compared with its older expanded form. */
function indexExpandedShadows(resolved) {
  const byPrefix = new Map();
  for (const path of Object.keys(resolved)) {
    const match = path.match(SHADOW_LEAF_RE);
    if (!match) continue;
    if (!byPrefix.has(match[1])) byPrefix.set(match[1], []);
    byPrefix.get(match[1]).push(path);
  }
  return byPrefix;
}

function sameLayers(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((layer, index) => layer === right[index]);
}

function diffTokens(base, head) {
  const changed = [];
  const reordered = [];
  const added = [];
  const removed = [];
  const headPaths = new Set(Object.keys(head.resolved));
  const baseShadows = indexExpandedShadows(base.resolved);
  const folded = new Set();

  for (const path of Object.keys(head.resolved).sort()) {
    const value = head.resolved[path];
    const after = displayValue(value);
    const alias = aliasOf(head, path);
    const headLayers = typeof value === 'object' ? shadowLayersFromValue(value) : null;

    if (headLayers && baseShadows.has(path)) {
      for (const leaf of baseShadows.get(path)) folded.add(leaf);
      const baseLayers = shadowLayersFromPaths(base.resolved, path);
      const before = baseLayers ? baseLayers.join(', ') : null;
      if (before === after) continue;
      (sameLayers(baseLayers, headLayers) ? reordered : changed).push({ path, before, after, alias });
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(base.resolved, path)) {
      added.push({ path, after, alias });
      continue;
    }
    const before = displayValue(base.resolved[path]);
    if (before !== after) changed.push({ path, before, after, alias });
  }

  for (const path of Object.keys(base.resolved).sort()) {
    if (headPaths.has(path) || folded.has(path)) continue;
    const shadow = path.match(SHADOW_LEAF_RE);
    const isShadowPrefix =
      shadow &&
      (base.resolved[`${shadow[1]}.color`] != null || base.resolved[`${shadow[1]}.0.color`] != null);
    if (isShadowPrefix && !headPaths.has(shadow[1])) {
      // Collapse the expanded leaves of a removed shadow into one row.
      for (const leaf of baseShadows.get(shadow[1]) ?? []) folded.add(leaf);
      const layers = shadowLayersFromPaths(base.resolved, shadow[1]);
      removed.push({ path: shadow[1], before: layers ? layers.join(', ') : displayValue(base.resolved[path]) });
      continue;
    }
    removed.push({ path, before: displayValue(base.resolved[path]) });
  }
  return { changed, reordered, added, removed };
}

/** Resolved values that still carry a `{…}` reference — an export the resolver could not follow. */
function danglingRefs(head) {
  const byRef = new Map();
  for (const [path, value] of Object.entries(head.resolved)) {
    if (typeof value !== 'string') continue;
    for (const match of value.matchAll(TOKEN_REF_RE)) {
      const ref = normalizeRef(match[1]);
      if (!byRef.has(ref)) byRef.set(ref, []);
      byRef.get(ref).push(path);
    }
  }
  return [...byRef.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ref, paths]) => ({ ref, dependents: paths.length, sample: paths.slice(0, 3) }));
}

function themeEntries() {
  if (!existsSync(THEME_DIR)) return [];
  return readdirSync(THEME_DIR).filter((name) => name !== '.gitkeep');
}

function count(n, singular, plural = `${singular}s`) {
  return `${n} ${n === 1 ? singular : plural}`;
}

function buildChecks(outcomes, audit, validate, head) {
  const checks = [];

  const dangling = danglingRefs(head);
  const danglingTotal = dangling.reduce((sum, row) => sum + row.dependents, 0);
  checks.push({
    id: 'integrity',
    name: 'Value integrity',
    status: head.unresolved.length + head.cycles.length + dangling.length === 0 ? 'PASS' : 'WARN',
    detail:
      head.unresolved.length + head.cycles.length + dangling.length === 0
        ? 'Every alias resolves to a literal.'
        : [
            head.unresolved.length ? count(head.unresolved.length, 'unresolved alias', 'unresolved aliases') : null,
            head.cycles.length ? count(head.cycles.length, 'alias cycle') : null,
            dangling.length
              ? `${count(dangling.length, 'reference')} the exporter left unresolvable (${danglingTotal} dependent values)`
              : null,
          ]
            .filter(Boolean)
            .join(', ') + '. Check the variables in Figma.',
    items: [
      ...head.unresolved.slice(0, MAX_LIST_ITEMS).map((row) => `${row.path} → {${row.alias}} (${row.reason})`),
      ...head.cycles.slice(0, 5).map((cycle) => `cycle: ${cycle.join(' → ')}`),
      ...dangling.map((row) => `{${row.ref}} — ${count(row.dependents, 'dependent value')}, e.g. ${row.sample[0]}`),
    ],
  });

  const build = outcomes.build;
  checks.push({
    id: 'build',
    name: 'Build',
    status: OUTCOME_LABEL[build] ?? 'NOT RUN',
    detail:
      build === 'success'
        ? 'Generated SCSS and the Storybook token manifest were refreshed from this dump.'
        : build === 'failure'
          ? 'tokens:build failed — see the run log.'
          : 'Not run.',
    items: [],
  });

  let auditStatus = OUTCOME_LABEL[outcomes.audit] ?? 'NOT RUN';
  let auditDetail = outcomes.audit === 'failure' ? 'Drift detected — see the run log.' : 'Not run.';
  const auditItems = [];
  if (audit) {
    auditStatus = audit.result === 'PASS' ? 'PASS' : 'FAIL';
    if (audit.result === 'PASS') {
      auditDetail = 'Figma, the PrimeNG preset and the generated SCSS agree.';
    } else {
      const parts = [];
      if (audit.mismatches?.length) parts.push(count(audit.mismatches.length, 'value mismatch', 'value mismatches'));
      if (audit.missingAliases?.length) parts.push(count(audit.missingAliases.length, 'missing alias', 'missing aliases'));
      if (audit.hardcodedLeaks?.length) parts.push(`${audit.hardcodedLeaks.length} hard-coded hex outside primitives`);
      if (audit.aliasMapBreaks?.length) parts.push(count(audit.aliasMapBreaks.length, 'alias-map break'));
      auditDetail = parts.length ? `${parts.join(', ')}.` : 'Drift detected — see the run log.';
      for (const row of audit.mismatches ?? []) {
        auditItems.push(`${row.name} — Figma ${row.figma}, preset ${row.v1}, SCSS ${row.scss} (${row.scssVar})`);
      }
      for (const row of audit.missingAliases ?? []) auditItems.push(`${row.ref} — ${row.reason}`);
      for (const row of audit.hardcodedLeaks ?? []) auditItems.push(`${row.file}:${row.line} ${row.hex}`);
      for (const row of audit.aliasMapBreaks ?? []) {
        auditItems.push(`${row.pds} → ${row.prime} is never emitted by the preset`);
      }
    }
  }
  checks.push({ id: 'audit', name: 'Drift audit', status: auditStatus, detail: auditDetail, items: auditItems });

  let coverageStatus = OUTCOME_LABEL[outcomes.validate] ?? 'NOT RUN';
  let coverageDetail = 'Not run.';
  const coverageItems = [];
  if (validate) {
    const hard = (validate.missingFromTokensJson?.length ?? 0) + (validate.unresolvedChains?.length ?? 0);
    const soft = validate.allowlisted?.length ?? 0;
    if (hard > 0) {
      coverageStatus = 'FAIL';
      coverageDetail = `${count(hard, 'preset reference')} cannot be resolved in this dump. The theme is not promoted.`;
      for (const row of validate.missingFromTokensJson ?? []) coverageItems.push(`${row.ref} — missing from tokens.json`);
      for (const row of validate.unresolvedChains ?? []) coverageItems.push(`${row.ref} — chain breaks at ${row.root}`);
    } else if (soft > 0) {
      coverageStatus = 'WARN';
      coverageDetail = `${count(soft, 'code-owned gap')} (allowlisted: spacing, durations, focus style). Expected.`;
      for (const row of validate.allowlisted ?? []) coverageItems.push(row.ref);
    } else {
      coverageStatus = 'PASS';
      coverageDetail = 'Every preset reference resolves in this dump.';
    }
    if (validate.staleAllowlist?.length) {
      coverageItems.push(
        `Allowlist entries that now resolve and can be removed: ${validate.staleAllowlist.join(', ')}`,
      );
    }
  }
  checks.push({ id: 'coverage', name: 'Preset coverage', status: coverageStatus, detail: coverageDetail, items: coverageItems });

  const files = themeEntries();
  let themeStatus = 'SKIP';
  let themeDetail =
    'No theme files in this sync — the plugin has no Theme Designer key yet. Plectrum_v1/ is unchanged.';
  if (files.length > 0) {
    if (outcomes.theme === 'success') {
      themeStatus = 'OK';
      themeDetail = 'Theme files copied into Plectrum_v1/. Hand-fixes stay in extend.ts.';
    } else if (outcomes.theme === 'failure') {
      themeStatus = 'FAIL';
      themeDetail = 'Theme copy failed — see the run log.';
    } else {
      themeDetail = 'Theme files present but not promoted: preset coverage did not pass.';
    }
  }
  checks.push({ id: 'theme', name: 'Theme', status: themeStatus, detail: themeDetail, items: [] });

  return checks;
}

function overallResult(outcomes, checks) {
  if (!outcomes.build && !outcomes.audit) {
    return {
      result: 'preview',
      text: 'Preview — run from tokens-sync.yml to include check outcomes and the promotion status.',
    };
  }
  const audit = checks.find((check) => check.id === 'audit');
  const promote = outcomes.build === 'success' && (outcomes.audit === 'success' || audit?.status === 'PASS');
  return promote
    ? {
        result: 'promote',
        text: 'A promotion pull request is opened for developer review. Nothing changes in the published packages until it is merged.',
      }
    : {
        result: 'blocked',
        text: 'No promotion pull request. A developer must resolve the failed check above. The change list shows what this sync would have applied.',
      };
}

function context(headRaw, head) {
  const env = process.env;
  const runUrl =
    env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY && env.GITHUB_RUN_ID
      ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`
      : null;
  return {
    generatedAt: new Date().toISOString(),
    source: typeof headRaw?.source === 'string' ? headRaw.source : null,
    branch: env.GITHUB_REF_NAME ?? git(['rev-parse', '--abbrev-ref', 'HEAD']),
    sha: (env.GITHUB_SHA ?? git(['rev-parse', 'HEAD']) ?? '').slice(0, 7) || null,
    actor: env.GITHUB_ACTOR ?? null,
    runNumber: env.GITHUB_RUN_NUMBER ?? null,
    runUrl,
    sets: head.sets,
    leafCount: head.leafCount,
    resolvedCount: head.resolvedCount,
    unresolved: head.unresolved.length,
  };
}

function formatTime(iso) {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

function detailsBlock(summary, items, render) {
  const lines = [`<details><summary>${summary}</summary>`, ''];
  for (const item of items.slice(0, MAX_LIST_ITEMS)) lines.push(`- ${render(item)}`);
  if (items.length > MAX_LIST_ITEMS) lines.push(`- … and ${items.length - MAX_LIST_ITEMS} more in the JSON report`);
  lines.push('', '</details>', '');
  return lines;
}

function renderMarkdown(report) {
  const lines = [];
  lines.push(`## Figma token sync — ${formatTime(report.generatedAt)}`, '');
  lines.push('| | |', '|---|---|');
  lines.push(`| Source | \`${report.source ?? 'not stated in tokens.json'}\` |`);
  if (report.branch) lines.push(`| Branch | \`${report.branch}\`${report.sha ? ` @ \`${report.sha}\`` : ''} |`);
  if (report.actor) lines.push(`| Pushed by | ${report.actor} |`);
  if (report.runUrl) lines.push(`| Workflow run | [#${report.runNumber ?? 'run'}](${report.runUrl}) |`);
  lines.push(`| Token sets | ${report.sets.length} (${report.sets.join(', ')}) |`);
  lines.push(
    `| Tokens | ${report.resolvedCount} of ${report.leafCount} resolve${report.unresolved ? `, ${report.unresolved} unresolved` : ''} |`,
  );
  lines.push('');

  const { base, changed, reordered, added, removed } = report.diff;
  lines.push('### What changed', '');
  if (!base.available) {
    lines.push(`Previous tokens.json not available (\`${base.label}\`: ${base.error}). Change list skipped.`, '');
  } else if (changed.length + reordered.length + added.length + removed.length === 0) {
    lines.push(`No value changes compared with \`${base.label}\`.`, '');
  } else {
    lines.push(
      `Compared with \`${base.label}\`: **${count(changed.length, 'changed value')}**, ${added.length} added, ${removed.length} removed` +
        (reordered.length ? `, ${count(reordered.length, 'shadow')} with the same layers in a different order.` : '.'),
      '',
    );
    if (changed.length) {
      lines.push('| Token | Before | After | Alias |', '|---|---|---|---|');
      for (const row of changed.slice(0, MAX_CHANGED_ROWS)) {
        lines.push(
          `| \`${row.path}\` | \`${row.before}\` | \`${row.after}\` | ${row.alias ? `\`{${row.alias}}\`` : ''} |`,
        );
      }
      if (changed.length > MAX_CHANGED_ROWS) {
        lines.push('', `… and ${changed.length - MAX_CHANGED_ROWS} more in the JSON report.`);
      }
      lines.push('');
    }
    if (added.length) {
      lines.push(
        ...detailsBlock(
          `Added (${added.length})`,
          added,
          (row) => `\`${row.path}\` = \`${row.after}\`${row.alias ? ` ({${row.alias}})` : ''}`,
        ),
      );
    }
    if (removed.length) {
      lines.push(...detailsBlock(`Removed (${removed.length})`, removed, (row) => `\`${row.path}\` (was \`${row.before}\`)`));
    }
    if (reordered.length) {
      lines.push(
        ...detailsBlock(
          `Shadow layers reordered (${reordered.length}) — visually identical when the layers share a colour`,
          reordered,
          (row) => `\`${row.path}\``,
        ),
      );
    }
  }

  lines.push('### Checks', '', '| Check | Result | Detail |', '|---|---|---|');
  for (const check of report.checks) lines.push(`| ${check.name} | ${check.status} | ${check.detail} |`);
  lines.push('');
  for (const check of report.checks) {
    if (check.items.length) {
      lines.push(...detailsBlock(`${check.name}: ${count(check.items.length, 'item')}`, check.items, (item) => `\`${item}\``));
    }
  }

  lines.push('### Result', '', report.resultText, '');
  return `${lines.join('\n')}\n`;
}

/** Storybook module — same convention as tokens.generated.ts. */
function renderTs(report) {
  return [
    '// AUTO-GENERATED by `npm run tokens:report` (tokens-sync.yml) — do not edit.',
    '// Record of the last promoted Figma → repository token sync: what changed,',
    '// which checks ran, and the outcome. Values are the before/after of that sync,',
    '// not a token reference — current values are read from the CSSOM',
    '// (.ai/rules/10-css-ssot.md). Rendered by Docs/Token pipeline/Sync status.',
    "import type { SyncReport } from './sync-report.types';",
    '',
    `export const SYNC_REPORT: SyncReport = ${JSON.stringify(report, null, 2)};`,
    '',
  ].join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: node tools/tokens/report.mjs [--base HEAD|git:<rev>|<file>] [--head <file>]
  [--audit audit.json] [--validate validate.json] [--outcome step=outcome …]
  [--md report.md] [--json report.json] [--ts sync-report.generated.ts]

Writes a Markdown + JSON summary of a Figma → repo token sync: changed values,
check results, and whether a promotion pull request follows. --ts writes the
module the Storybook page Docs/Token pipeline/Sync status renders.`);
    return;
  }

  if (!existsSync(args.head)) {
    process.stderr.write(`report: head tokens file not found: ${args.head}\n`);
    process.exitCode = 1;
    return;
  }

  const headRaw = JSON.parse(readFileSync(args.head, 'utf8'));
  const head = resolveDtcg(headRaw);
  const base = loadBase(args.base);
  const diff = base.raw
    ? { base: { available: true, label: base.label }, ...diffTokens(resolveDtcg(base.raw), head) }
    : {
        base: { available: false, label: base.label, error: base.error },
        changed: [],
        reordered: [],
        added: [],
        removed: [],
      };

  const checks = buildChecks(args.outcomes, readJson(args.auditPath), readJson(args.validatePath), head);
  const outcome = overallResult(args.outcomes, checks);

  const report = {
    ...context(headRaw, head),
    outcomes: args.outcomes,
    diff,
    checks,
    result: outcome.result,
    resultText: outcome.text,
  };

  const markdown = renderMarkdown(report);
  if (args.mdPath) writeFileSync(args.mdPath, markdown, 'utf8');
  if (args.jsonPath) writeFileSync(args.jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  if (args.tsPath) writeFileSync(args.tsPath, renderTs(report), 'utf8');
  if (!args.mdPath) process.stdout.write(markdown);

  process.stderr.write(
    `report: ${diff.changed.length} changed, ${diff.added.length} added, ${diff.removed.length} removed, ` +
      `${diff.reordered.length} shadow reorders — ${outcome.result}\n`,
  );
}

main();
