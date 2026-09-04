#!/usr/bin/env node
/**
 * Three-way Figma (tokens.json) / v1 preset / SCSS drift audit.
 *
 * Imports the real Plectrum_v1 default export via tsx — do not regex-scan
 * the preset (see libs/plectrum/scripts/audit-preset-refs.mjs).
 *
 * Wave 1 detector: reports known drift and exits non-zero. Does not rewrite
 * values. Expected FAIL on the primary ramp and radius md/lg.
 *
 * Usage: tsx tools/tokens/audit-drift.mjs
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import v1Preset from '../../libs/plectrum/src/Plectrum_v1/ts/index.ts';
import { collectPresetCssVars } from './collect-preset-css-vars.mjs';
import { unwrapHybridValue } from './format-value.mjs';
import {
  WORKSPACE_ROOT,
  asPreset,
  collectRefs,
  getAt,
  resolveDtcg,
} from './resolve-dtcg.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALIAS_MAP = JSON.parse(readFileSync(join(__dirname, 'alias-map.json'), 'utf8'));
const ALLOWLIST = JSON.parse(
  readFileSync(join(__dirname, 'audit-allowlist.json'), 'utf8'),
);
const FIGMA_FALLBACKS = {
  'extremes.white': '#ffffff',
  'surface.0': '#ffffff',
};

const SETTINGS_DIR = join(WORKSPACE_ROOT, 'libs/styles/src/01-settings');
const PRIMITIVE_BASENAME = '_settings.colors-primitive.scss';

const PRIMARY_SHADES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
];
const RADIUS_STOPS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];

function buildComparisons() {
  const rows = [];
  for (const shade of PRIMARY_SHADES) {
    rows.push({
      name: `primary.${shade}`,
      group: 'primary-ramp',
      figma: `primary.${shade}`,
      presetPath: ['semantic', 'colorScheme', 'light', 'primary', shade],
      scss: `--pds-color-primary-${shade}`,
    });
  }
  for (const stop of RADIUS_STOPS) {
    rows.push({
      name: `border.radius.${stop}`,
      group: 'radius',
      figma: `border.radius.${stop}`,
      presetPath: ['primitive', 'borderRadius', stop],
      scss: `--pds-radius-${stop}`,
    });
  }
  rows.push(
    {
      name: 'surface.0',
      group: 'surface',
      figma: 'surface.0',
      presetPath: ['semantic', 'colorScheme', 'light', 'surface', '0'],
      scss: '--pds-color-surface-0',
    },
    {
      name: 'surface.50',
      group: 'surface',
      figma: 'surface.50',
      presetPath: ['semantic', 'colorScheme', 'light', 'surface', '50'],
      scss: '--pds-color-surface-50',
    },
  );
  return rows;
}

function normalizeColor(value) {
  if (typeof value !== 'string') return null;
  let hex = value.trim().toLowerCase();
  if ((hex.startsWith('"') && hex.endsWith('"')) || (hex.startsWith("'") && hex.endsWith("'"))) {
    hex = hex.slice(1, -1);
  }
  const hex8 = hex.match(/^#([0-9a-f]{8})$/);
  if (hex8) {
    const rgb = hex8[1].slice(0, 6);
    const alpha = hex8[1].slice(6);
    return alpha === 'ff' ? `#${rgb}` : `#${hex8[1]}`;
  }
  const hex6 = hex.match(/^#([0-9a-f]{6})$/);
  if (hex6) return `#${hex6[1]}`;
  const hex3 = hex.match(/^#([0-9a-f]{3})$/);
  if (hex3) {
    const [r, g, b] = hex3[1];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return null;
}

function normalizeComparable(value) {
  if (value == null) return { kind: 'missing', text: null };
  if (typeof value === 'number') {
    if (value === 0) return { kind: 'dimension', text: '0' };
    return { kind: 'dimension', text: `${value}px` };
  }
  const raw = String(value).trim();
  const color = normalizeColor(raw);
  if (color) return { kind: 'color', text: color };
  if (raw === '0') return { kind: 'dimension', text: '0' };
  if (/^\d+(\.\d+)?$/.test(raw)) return { kind: 'dimension', text: `${raw}px` };
  const px = raw.match(/^(\d+(?:\.\d+)?)px$/i);
  if (px) {
    return {
      kind: 'dimension',
      text: Number(px[1]) === 0 ? '0' : `${px[1]}px`,
    };
  }
  return { kind: 'other', text: raw.toLowerCase() };
}

function valuesEqual(a, b) {
  const left = normalizeComparable(a);
  const right = normalizeComparable(b);
  if (left.kind === 'missing' || right.kind === 'missing') return false;
  return left.text === right.text;
}

function formatValue(value) {
  if (value === undefined) return '(missing)';
  if (value === null) return '(unresolved)';
  const normalized = normalizeComparable(value);
  if (normalized.kind === 'color' || normalized.kind === 'dimension') {
    return normalized.text;
  }
  return String(value);
}

function stripScssComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function parseScssCustomProperties(settingsDir) {
  const props = new Map();
  const files = readdirSync(settingsDir).filter((name) => name.endsWith('.scss'));

  for (const file of files) {
    const abs = join(settingsDir, file);
    const body = stripScssComments(readFileSync(abs, 'utf8'));
    const decl = /--(?:#\{\$pds-prefix\}-|pds-)?([a-z0-9-]+)\s*:\s*([^;]+);/gi;
    let match;
    while ((match = decl.exec(body)) !== null) {
      const name = `--pds-${match[1]}`;
      props.set(name, {
        value: unwrapHybridValue(match[2].trim()),
        raw: match[2].trim(),
        file,
        line: body.slice(0, match.index).split('\n').length,
      });
    }
  }

  return props;
}

function collectHardcodedHex(settingsDir) {
  const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
  const findings = [];
  const files = readdirSync(settingsDir).filter((name) => name.endsWith('.scss'));

  for (const file of files) {
    const abs = join(settingsDir, file);
    const source = readFileSync(abs, 'utf8');
    const stripped = stripScssComments(source);
    const lines = stripped.split('\n');
    lines.forEach((line, index) => {
      if (!line.includes(':') || line.trimStart().startsWith('//')) return;
      const hexes = line.match(HEX);
      if (!hexes) return;
      for (const hex of hexes) {
        findings.push({
          file,
          line: index + 1,
          hex,
          declaration: line.trim(),
          primitive:
            file === PRIMITIVE_BASENAME ||
            file === '_settings.shadows.scss' ||
            file === '_settings.doc-demo-box.scss' ||
            file.endsWith('.generated.scss'),
        });
      }
    });
  }

  return findings;
}

function colorIndex(resolved) {
  const byColor = new Map();
  for (const [path, value] of Object.entries(resolved)) {
    const color = normalizeColor(typeof value === 'string' ? value : '');
    if (!color) continue;
    if (!byColor.has(color)) byColor.set(color, []);
    byColor.get(color).push(path);
  }
  return byColor;
}

function lookupFigma(dtcg, path) {
  if (Object.prototype.hasOwnProperty.call(dtcg.resolved, path)) {
    return { value: dtcg.resolved[path], status: 'ok' };
  }
  if (Object.prototype.hasOwnProperty.call(FIGMA_FALLBACKS, path)) {
    return { value: FIGMA_FALLBACKS[path], status: 'ok' };
  }
  if (dtcg.byPath.has(path)) {
    return { value: null, status: 'unresolved' };
  }
  return { value: undefined, status: 'missing' };
}

function resolvePresetLeaf(value, dtcg) {
  if (typeof value !== 'string') return value;
  const match = value.trim().match(/^\{([a-zA-Z0-9._-]+)\}$/);
  if (!match) return value;
  if (Object.prototype.hasOwnProperty.call(dtcg.resolved, match[1])) {
    return dtcg.resolved[match[1]];
  }
  if (Object.prototype.hasOwnProperty.call(FIGMA_FALLBACKS, match[1])) {
    return FIGMA_FALLBACKS[match[1]];
  }
  return value;
}

function summarizeTokensJsonUnresolved(unresolved) {
  const byRoot = new Map();
  for (const entry of unresolved) {
    const root = entry.chain?.[entry.chain.length - 1] ?? entry.alias;
    if (!byRoot.has(root)) byRoot.set(root, []);
    byRoot.get(root).push(entry.path);
  }
  return [...byRoot.entries()].map(([root, paths]) => ({
    source: 'tokens.json',
    ref: root,
    reason: `unresolved root; ${paths.length} dependent token(s)`,
    locations: paths.slice(0, 6),
  }));
}

function main() {
  const v1 = asPreset(v1Preset);
  const dtcg = resolveDtcg();
  const scss = parseScssCustomProperties(SETTINGS_DIR);
  const comparisons = buildComparisons();
  const mismatches = [];
  const missingSides = [];

  for (const row of comparisons) {
    const figma = lookupFigma(dtcg, row.figma);
    const presetRaw = resolvePresetLeaf(getAt(v1, row.presetPath), dtcg);
    const scssEntry = scss.get(row.scss);

    const present = {
      figma: figma.status === 'ok',
      v1: presetRaw !== undefined,
      scss: Boolean(scssEntry),
    };

    if (!present.figma || !present.v1 || !present.scss) {
      missingSides.push({
        name: row.name,
        group: row.group,
        figma: figma.status === 'ok' ? figma.value : figma.status,
        v1: present.v1 ? presetRaw : '(missing)',
        scss: scssEntry ? scssEntry.value : '(missing)',
      });
    }

    const comparable = [present.figma, present.v1, present.scss].filter(Boolean);
    if (comparable.length < 2) continue;

    const figmaVal = present.figma ? figma.value : undefined;
    const v1Val = present.v1 ? presetRaw : undefined;
    const scssVal = scssEntry ? scssEntry.value : undefined;

    const pairs = [];
    if (present.figma && present.v1) pairs.push(valuesEqual(figmaVal, v1Val));
    if (present.figma && present.scss) pairs.push(valuesEqual(figmaVal, scssVal));
    if (present.v1 && present.scss) pairs.push(valuesEqual(v1Val, scssVal));

    if (pairs.some((ok) => !ok)) {
      mismatches.push({
        name: row.name,
        group: row.group,
        figma: formatValue(figma.status === 'missing' ? undefined : figma.value),
        v1: formatValue(v1Val),
        scss: formatValue(scssVal),
        scssVar: row.scss,
      });
    }
  }

  const presetRefs = collectRefs(v1);
  const allowedMissing = new Set(ALLOWLIST.missingAliases ?? []);
  const missingAliases = [];

  for (const [ref, locations] of [...presetRefs.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (Object.prototype.hasOwnProperty.call(dtcg.resolved, ref)) continue;
    if (allowedMissing.has(ref)) continue;
    missingAliases.push({
      source: 'v1-preset',
      ref,
      reason: dtcg.byPath.has(ref) ? 'unresolved-chain' : 'missing-from-tokens.json',
      locations: locations.slice(0, 8),
    });
  }

  missingAliases.push(
    ...summarizeTokensJsonUnresolved(dtcg.unresolved).filter(
      (entry) => !allowedMissing.has(entry.ref),
    ),
  );

  const hexIndex = colorIndex(dtcg.resolved);
  const hardcodedHex = collectHardcodedHex(SETTINGS_DIR).map((item) => {
    const color = normalizeColor(item.hex);
    const aliases = color ? hexIndex.get(color) ?? [] : [];
    return { ...item, matches: aliases.slice(0, 6) };
  });
  const hardcodedLeaks = hardcodedHex.filter((item) => !item.primitive);

  const namedPrimary = mismatches.filter((row) => row.group === 'primary-ramp');
  const namedRadius = mismatches.filter(
    (row) => row.group === 'radius' && (row.name.endsWith('.md') || row.name.endsWith('.lg')),
  );

  const emittedPrime = collectPresetCssVars(v1);
  const aliasMapBreaks = [];
  for (const [pds, prime] of Object.entries(ALIAS_MAP)) {
    if (pds.startsWith('$')) continue;
    if (!emittedPrime.has(prime)) {
      aliasMapBreaks.push({ pds, prime });
    }
  }

  const unmappedSuggestions = [];
  const colorToPrime = new Map();
  for (const name of emittedPrime) {
    const match = name.match(/^--p-(primary|surface|green|orange|red|rose|blue|yellow|gray|neutral)-(\d+)$/);
    if (!match) continue;
    const path = `${match[1]}.${match[2]}`;
    if (Object.prototype.hasOwnProperty.call(dtcg.resolved, path)) {
      colorToPrime.set(path, name);
    }
  }
  const mappedPrimes = new Set(
    Object.entries(ALIAS_MAP)
      .filter(([key]) => !key.startsWith('$'))
      .map(([, value]) => value),
  );
  for (const [path, prime] of colorToPrime) {
    if (mappedPrimes.has(prime)) continue;
    const pds = `--pds-color-${path.replace('.', '-')}`;
    if (scss.has(pds)) {
      unmappedSuggestions.push({ pds, prime, path });
    }
  }

  const fail =
    mismatches.length > 0 ||
    hardcodedLeaks.length > 0 ||
    missingAliases.length > 0 ||
    aliasMapBreaks.length > 0;

  const lines = [];
  lines.push('TOKEN DRIFT AUDIT — Figma / v1 preset / SCSS');
  lines.push('='.repeat(56));
  lines.push(
    `Figma: ${dtcg.sets.length} sets, ${dtcg.resolvedCount}/${dtcg.leafCount} resolved, ${dtcg.unresolved.length} unresolved aliases, ${dtcg.cycles.length} cycles`,
  );
  lines.push('v1 preset: imported default export from Plectrum_v1/ts (tsx)');
  lines.push(`SCSS: ${scss.size} --pds-* declarations in 01-settings`);
  lines.push('');

  lines.push(`HEX / VALUE MISMATCHES (${mismatches.length})`);
  if (mismatches.length === 0) {
    lines.push('  (none)');
  } else {
    for (const row of mismatches) {
      lines.push(`- ${row.name}`);
      lines.push(`    figma:  ${row.figma}`);
      lines.push(`    v1:     ${row.v1}`);
      lines.push(`    scss:   ${row.scss}  (${row.scssVar})`);
    }
  }
  lines.push('');

  lines.push(`MISSING SIDES (${missingSides.length})`);
  if (missingSides.length === 0) {
    lines.push('  (none)');
  } else {
    for (const row of missingSides) {
      lines.push(
        `- ${row.name}  figma=${formatValue(row.figma)}  v1=${formatValue(row.v1)}  scss=${formatValue(row.scss)}`,
      );
    }
  }
  lines.push('');

  lines.push(`MISSING ALIASES (${missingAliases.length})`);
  if (missingAliases.length === 0) {
    lines.push('  (none)');
  } else {
    for (const entry of missingAliases) {
      lines.push(
        `- {${entry.ref}}  [${entry.source}]  ${entry.reason}  @ ${entry.locations.join(', ')}`,
      );
    }
  }
  lines.push('');

  lines.push(`HARDCODED HEX IN 01-settings (${hardcodedHex.length} total, ${hardcodedLeaks.length} outside ${PRIMITIVE_BASENAME})`);
  for (const item of hardcodedHex) {
    const tag = item.primitive ? 'primitive' : 'HARDCODED';
    const alias = item.matches.length ? `  (= ${item.matches.join(', ')})` : '';
    lines.push(
      `- [${tag}] ${item.file}:${item.line}  ${item.hex}${alias}`,
    );
  }
  lines.push('');

  const named = [];
  if (namedPrimary.length) {
    named.push(`primary ramp (${namedPrimary.map((row) => row.name).join(', ')})`);
  }
  if (namedRadius.length) {
    named.push(namedRadius.map((row) => row.name).join(', '));
  }

  lines.push(`ALIAS-MAP BREAKS (${aliasMapBreaks.length})`);
  if (aliasMapBreaks.length === 0) {
    lines.push('  (none)');
  } else {
    for (const row of aliasMapBreaks) {
      lines.push(`- ${row.pds} → ${row.prime}  (never emitted by v1 preset)`);
    }
  }
  lines.push('');

  if (unmappedSuggestions.length) {
    lines.push(`ALIAS-MAP SUGGESTIONS (${unmappedSuggestions.length}) — same tokens.json node, unmapped --p-*`);
    for (const row of unmappedSuggestions.slice(0, 20)) {
      lines.push(`- ${row.pds} could map to ${row.prime}  (${row.path})`);
    }
    lines.push('');
  }

  lines.push(`RESULT: ${fail ? 'FAIL' : 'PASS'}`);
  if (named.length) {
    lines.push(`Known drift named: ${named.join('; ')}`);
  }
  lines.push(
    fail
      ? 'Detector only — drifted values were not rewritten.'
      : 'No drift in the compared Figma / v1 / SCSS set.',
  );

  process.stdout.write(`${lines.join('\n')}\n`);
  process.exitCode = fail ? 1 : 0;
}

main();
