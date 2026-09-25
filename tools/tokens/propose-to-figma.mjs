#!/usr/bin/env node
/**
 * Diff code-declared --pds-* tokens against tokens.json and emit
 * proposed.dtcg.json for code-only tokens (e.g. --pds-color-emutnav-*,
 * --pds-color-surface-75).
 *
 * Types the value when Figma can store it (color, dimension in px, number,
 * fontWeight, fontFamily). Everything else stays `$type: other` with a reason.
 *
 * Dotted CSS names map to Figma `/` grouping (names cannot contain `.` `{` `}`).
 *
 * Usage:
 *   node tools/tokens/propose-to-figma.mjs
 *   node tools/tokens/propose-to-figma.mjs --out tools/tokens/proposed.dtcg.json
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { formatCssLiteral, unwrapHybridValue } from './format-value.mjs';
import { cssToFigmaColor, REM_IN_PX, roundPx } from './figma-values.mjs';
import { resolveDtcg } from './resolve-dtcg.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const SETTINGS = join(ROOT, 'libs/styles/src/01-settings');
const MAX_DEPTH = 8;
const VAR_RE = /var\(\s*(--[a-z0-9-]+)\s*(?:,\s*((?:[^()]+|\([^()]*\))*))?\)/gi;

export const DEFAULT_OUT_PATH = join(__dirname, 'proposed.dtcg.json');

function parseArgs(argv) {
  const out = { outPath: DEFAULT_OUT_PATH };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--out') {
      out.outPath = argv[i + 1];
      i += 1;
    }
    if (argv[i] === '--help' || argv[i] === '-h') out.help = true;
  }
  return out;
}

export function collapseWhitespace(value) {
  return String(value).replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

export function interpolatePdsPrefix(value) {
  return String(value).replace(/--#\{\$pds-prefix\}-/g, '--pds-');
}

export function normalizeRaw(value) {
  return interpolatePdsPrefix(collapseWhitespace(value));
}

export function cssNameToFigma(cssName) {
  return cssName.replaceAll('.', '/').replaceAll('-', '/');
}

export function parseFontFamily(value) {
  const parts = [];
  const re = /"([^"]+)"|'([^']+)'|([a-zA-Z][a-zA-Z0-9- ]*)/g;
  let match;
  while ((match = re.exec(value)) !== null) {
    const part = (match[1] || match[2] || match[3]).trim();
    if (part) parts.push(part);
  }
  return parts;
}

function isFontFamily(value, cssName) {
  if (/font-family/.test(cssName)) return true;
  return /['"]/.test(value) && /sans-serif|serif|monospace|Agenda|Open Sans/i.test(value);
}

function looksLikeShadow(value, cssName) {
  if (/(^|\/)shadow(\/|$)/.test(cssName)) return true;
  return /px/.test(value) && /,/.test(value) && /rgba?\(|#[0-9a-f]{3,8}/i.test(value);
}

export function evaluatePxExpression(input) {
  const s = String(input).replace(/\s+/g, '');
  let i = 0;

  function peek() {
    return s[i];
  }
  function eat(ch) {
    if (s[i] === ch) {
      i += 1;
      return true;
    }
    return false;
  }
  function parseNumber() {
    const start = i;
    while (i < s.length && /[0-9.]/.test(s[i])) i += 1;
    if (start === i) return null;
    const n = Number(s.slice(start, i));
    return Number.isFinite(n) ? n : null;
  }
  function unary() {
    if (eat('+')) return unary();
    if (eat('-')) {
      const inner = unary();
      return inner == null ? null : -inner;
    }
    if (eat('(')) {
      const inner = expr();
      if (inner == null || !eat(')')) return null;
      return inner;
    }
    return parseNumber();
  }
  function term() {
    let value = unary();
    if (value == null) return null;
    while (peek() === '*' || peek() === '/') {
      const op = s[i];
      i += 1;
      const right = unary();
      if (right == null) return null;
      if (op === '/' && right === 0) return null;
      value = op === '*' ? value * right : value / right;
    }
    return value;
  }
  function expr() {
    let value = term();
    if (value == null) return null;
    while (peek() === '+' || peek() === '-') {
      const op = s[i];
      i += 1;
      const right = term();
      if (right == null) return null;
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }

  const result = expr();
  if (result == null || i !== s.length) return null;
  return result;
}

function pxifyInner(inner) {
  const converted = inner
    .replace(/(-?[\d.]+)rem\b/gi, (_, n) => `${Number(n) * REM_IN_PX}px`)
    .replace(/(-?[\d.]+)px\b/gi, '$1');
  if (/[a-z%]/i.test(converted)) return null;
  return evaluatePxExpression(converted);
}

export function resolveCalcs(value) {
  let current = value;
  for (let guard = 0; guard < 20; guard += 1) {
    const next = current.replace(/calc\(([^()]+)\)/gi, (match, inner) => {
      const n = pxifyInner(inner);
      return n == null ? match : `${roundPx(n)}px`;
    });
    if (next === current) break;
    current = next;
  }
  return current;
}

export function classifyResolved(value, cssName = '') {
  const v = collapseWhitespace(value);

  if (/#\{\$/.test(v)) {
    return { $type: 'other', $value: v, reason: 'sass:interpolation' };
  }
  if (looksLikeShadow(v, cssName)) {
    return { $type: 'other', $value: v, reason: 'unsupported:shadow' };
  }
  if (/linear-gradient|radial-gradient|conic-gradient/i.test(v)) {
    return { $type: 'other', $value: v, reason: 'unsupported:gradient' };
  }
  if (/color-mix\s*\(/i.test(v)) {
    return { $type: 'other', $value: v, reason: 'unsupported:color-mix' };
  }
  if (/allow-discrete|transition/i.test(`${v} ${cssName}`) && /ms|s\b|ease/i.test(v)) {
    return { $type: 'other', $value: v, reason: 'unsupported:transition' };
  }
  if (/cubic-bezier/i.test(v)) {
    return { $type: 'other', $value: v, reason: 'unsupported:easing' };
  }
  if (/^\d+(\.\d+)?m?s$/i.test(v)) {
    return { $type: 'other', $value: v, reason: 'unsupported:duration' };
  }
  if (/%/.test(v)) {
    return { $type: 'other', $value: v, reason: 'unit:%' };
  }
  if (/\d(?:vw|vh|vmin|vmax)\b/i.test(v)) {
    return { $type: 'other', $value: v, reason: 'unit:viewport' };
  }
  if (/^(auto|none|currentcolor|inherit|unset|initial)$/i.test(v)) {
    return { $type: 'other', $value: v, reason: 'unsupported:keyword' };
  }
  if (cssToFigmaColor(v)) {
    return { $type: 'color', $value: v };
  }
  if (isFontFamily(v, cssName)) {
    return { $type: 'fontFamily', $value: parseFontFamily(v) };
  }
  if (/^-?\d+(\.\d+)?px$/i.test(v)) {
    return { $type: 'dimension', $value: { value: roundPx(parseFloat(v)), unit: 'px' } };
  }
  if (/^-?\d+(\.\d+)?rem$/i.test(v)) {
    return { $type: 'dimension', $value: { value: roundPx(parseFloat(v) * REM_IN_PX), unit: 'px' } };
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) {
    const n = Number(v);
    if (n === 0) return { $type: 'dimension', $value: { value: 0, unit: 'px' } };
    if (n === 400 || n === 600 || n === 700) return { $type: 'fontWeight', $value: n };
    return { $type: 'number', $value: n };
  }
  if (/calc\(/i.test(v) || /var\(/i.test(v)) {
    const varMatch = v.match(/var\((--[a-z0-9-]+)[^)]*\)/i);
    return {
      $type: 'other',
      $value: v,
      reason: varMatch ? `unresolved:${varMatch[0].replace(/\s+/g, '')}` : 'unresolved:calc',
    };
  }
  return { $type: 'other', $value: v, reason: 'unsupported:value' };
}

function cssVarToPathCandidates(varName) {
  const name = varName.replace(/^--pds-/, '');
  const dotted = name.replaceAll('-', '.');
  const withoutColor = name.replace(/^color-/, '').replaceAll('-', '.');
  return [...new Set([dotted, withoutColor])];
}

function lookupDtcg(varName, dtcg) {
  if (!dtcg) return null;
  for (const path of cssVarToPathCandidates(varName)) {
    if (dtcg.resolved?.[path] != null) return dtcg.resolved[path];
    if (dtcg.byPath?.has?.(path)) return dtcg.byPath.get(path).value;
  }
  return null;
}

function literalFromDtcg(value) {
  if (value == null) return null;
  if (typeof value === 'number') return value === 0 ? '0' : `${value}px`;
  const formatted = formatCssLiteral(value);
  return formatted ?? String(value);
}

function typedToCss(typed) {
  switch (typed.$type) {
    case 'dimension':
      return `${typed.$value.value}px`;
    case 'number':
    case 'fontWeight':
      return String(typed.$value);
    case 'fontFamily':
      return typed.$value.map((part) => (/\s/.test(part) ? `'${part}'` : part)).join(', ');
    default:
      return String(typed.$value);
  }
}

function substituteVars(value, ctx, depth) {
  let unresolved = null;
  const next = value.replace(VAR_RE, (match, name, fallback) => {
    if (unresolved) return match;
    const raw = ctx.lookup.get(name);
    if (raw != null) {
      const resolved = resolveRaw(raw, ctx, depth + 1);
      if (resolved.skip) {
        unresolved = resolved.reason ?? `unresolved:${match.replace(/\s+/g, '')}`;
        return match;
      }
      if (resolved.$type === 'other' && resolved.reason) {
        unresolved = resolved.reason;
        return match;
      }
      return typedToCss(resolved);
    }
    const fromDtcg = lookupDtcg(name, ctx.dtcg);
    if (fromDtcg != null) {
      const literal = literalFromDtcg(fromDtcg);
      if (literal != null) return literal;
    }
    if (fallback) return collapseWhitespace(fallback);
    unresolved = `unresolved:${match.replace(/\s+/g, '')}`;
    return match;
  });
  if (unresolved) return { ok: false, reason: unresolved };
  return { ok: true, value: next };
}

export function resolveRaw(rawValue, ctx, depth = 0) {
  if (depth > MAX_DEPTH) {
    return { $type: 'other', $value: String(rawValue), reason: 'unresolved:depth', skip: false };
  }
  const normalized = normalizeRaw(rawValue);
  const substituted = substituteVars(normalized, ctx, depth);
  if (!substituted.ok) {
    return { $type: 'other', $value: normalized, reason: substituted.reason, skip: false };
  }
  const withCalcs = resolveCalcs(substituted.value);
  return classifyResolved(withCalcs, ctx.cssName ?? '');
}

export function classifyToken(rawValue, options = {}) {
  const { cssName = '', lookup = new Map(), dtcg = null } = options;
  const normalized = normalizeRaw(rawValue);
  if (/^var\(/.test(normalized)) {
    return { skip: true, reason: 'alias', $type: 'other', $value: normalized };
  }
  return resolveRaw(normalized, { lookup, dtcg, cssName });
}

export function collectScssTokens(settingsDir = SETTINGS) {
  const tokens = [];
  const files = readdirSync(settingsDir)
    .filter((name) => name.endsWith('.scss') && !name.includes('.generated.'))
    .sort();
  const decl = /--(?:#\{\$pds-prefix\}-|pds-)([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  for (const file of files) {
    const body = readFileSync(join(settingsDir, file), 'utf8');
    let match;
    while ((match = decl.exec(body)) !== null) {
      tokens.push({
        cssName: match[1],
        cssVar: `--pds-${match[1]}`,
        value: unwrapHybridValue(match[2].trim()),
        file,
      });
    }
  }
  return { tokens };
}

export function buildLookup(tokens) {
  const lookup = new Map();
  for (const token of tokens) {
    if (!lookup.has(token.cssVar)) {
      lookup.set(token.cssVar, normalizeRaw(token.value));
    }
  }
  return lookup;
}

function inTokensJson(token, dtcg) {
  const pathGuess = token.cssName.replace(/^color-/, '').replaceAll('-', '.');
  return dtcg.resolved[pathGuess] != null || dtcg.byPath.has(pathGuess);
}

export function buildProposal(tokens, dtcg) {
  const lookup = buildLookup(tokens);
  const proposed = {};
  const report = [];

  const unique = [];
  const seen = new Set();
  for (const token of tokens) {
    if (seen.has(token.cssVar)) continue;
    seen.add(token.cssVar);
    unique.push(token);
  }
  unique.sort((a, b) => cssNameToFigma(a.cssName).localeCompare(cssNameToFigma(b.cssName)));

  for (const token of unique) {
    if (inTokensJson(token, dtcg)) continue;
    const classified = classifyToken(token.value, {
      cssName: token.cssName,
      lookup,
      dtcg,
    });
    if (classified.skip) continue;

    const figmaName = cssNameToFigma(token.cssName);
    const extensions = {
      cssVar: token.cssVar,
      source: token.file,
    };
    if (classified.reason) extensions.reason = classified.reason;

    proposed[figmaName] = {
      $type: classified.$type,
      $value: classified.$value,
      $extensions: { 'com.solidaris.pds': extensions },
    };
    report.push(
      `${token.cssVar}  →  ${figmaName}  (${classified.$type}${classified.reason ? ` · ${classified.reason}` : ''})`,
    );
  }

  return {
    $description:
      'Code-owned tokens proposed for a Figma branch. Apply with the Plectrum tokens plugin (or apply-to-figma --dry-run on Enterprise).',
    codeOwned: proposed,
    report,
  };
}

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(`Usage: node tools/tokens/propose-to-figma.mjs [--out proposed.dtcg.json]

Emits DTCG for --pds-* tokens that exist in 01-settings but not in tokens.json.
Figma names use / grouping (no '.' '{' '}').`);
    return;
  }

  const dtcg = resolveDtcg();
  const { tokens } = collectScssTokens();
  const { report, ...doc } = buildProposal(tokens, dtcg);

  writeFileSync(args.outPath, `${JSON.stringify(doc, null, 2)}\n`);
  console.log(`propose-to-figma: ${report.length} code-only tokens → ${args.outPath}`);
  for (const line of report) console.log(`  ${line}`);
}

const invokedDirectly =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (invokedDirectly) {
  main();
}
