#!/usr/bin/env node
/**
 * Post the sync report as a comment in the Plectrum UI Kit, so designers see
 * the outcome of their plugin push in Figma — promoted or blocked — without
 * GitHub access.
 *
 * A comment is an annotation, not design data: it edits no variable, style or
 * node, so the branch-only rule for Figma writes (apply-to-figma) does not
 * apply. Every run replies to the open root comment that starts with MARKER;
 * once designers resolve that thread the next run starts a new one.
 *
 * Dry-run is the default (prints the message). --post sends it.
 *
 * Environment:
 *   FIGMA_TOKEN                 PAT with file_comments:write (+ file_comments:read for threading)
 *   FIGMA_FILE_KEY              optional, default Plectrum UI Kit (main file, not a branch key)
 *   FIGMA_SYNC_COMMENT_NODE_ID  frame id on that file (123:456). A branch-only
 *                               node, a URL, or a name produces an Unattached comment.
 *
 * Usage:
 *   node tools/tokens/notify-figma.mjs --report sync-report.json [--pr-url URL] [--post]
 */

import { readFileSync } from 'node:fs';

const DEFAULT_FILE_KEY = 'YNZ1DlSjDNUXrvkxlSp10D';
export const MARKER = '[Plectrum token sync]';
const MAX_CHANGES = 10;
const MAX_CHECK_ITEMS = 4;
const GROUP_MIN = 4;

function parseArgs(argv) {
  const out = {
    reportPath: null,
    prUrl: '',
    post: false,
    fileKey: process.env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY,
    nodeId: process.env.FIGMA_SYNC_COMMENT_NODE_ID || null,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--report') out.reportPath = argv[++i];
    else if (arg === '--pr-url') out.prUrl = argv[++i] ?? '';
    else if (arg === '--post') out.post = true;
    else if (arg === '--dry-run') out.post = false;
    else if (arg === '--file-key') out.fileKey = argv[++i];
    else if (arg === '--node-id') out.nodeId = argv[++i];
    else if (arg === '--help' || arg === '-h') out.help = true;
  }
  out.fileKey = normalizeFileKey(out.fileKey);
  out.nodeId = normalizeNodeId(out.nodeId);
  return out;
}

/** Main-file key from a Figma URL, or the string as-is. Branch keys are rejected. */
export function normalizeFileKey(value) {
  if (!value) return value;
  const fromUrl = parseFigmaUrl(value);
  if (fromUrl) return fromUrl.fileKey;
  return value.trim();
}

/** `123:456` from a node id, `123-456`, or a Figma URL `?node-id=`. */
export function normalizeNodeId(value) {
  if (!value) return null;
  const trimmed = value.trim();
  const fromUrl = parseFigmaUrl(trimmed);
  if (fromUrl?.nodeId) return fromUrl.nodeId;
  if (/^https?:\/\//i.test(trimmed) || /\s/.test(trimmed)) return null;
  if (/^\d+[:-]\d+(?:;\d+[:-]\d+)*$/.test(trimmed)) {
    return trimmed.replace(/-/g, ':');
  }
  return null;
}

export function parseFigmaUrl(value) {
  if (!value || !value.includes('figma.com')) return null;
  try {
    const url = new URL(value);
    const match = url.pathname.match(
      /^\/(?:design|file)\/([a-zA-Z0-9]+)(?:\/branch\/[a-zA-Z0-9]+)?/,
    );
    if (!match) return null;
    const rawNode = url.searchParams.get('node-id');
    return {
      fileKey: match[1],
      nodeId: rawNode ? rawNode.replace(/-/g, ':') : null,
    };
  } catch {
    return null;
  }
}

function help() {
  console.log(`Usage: node tools/tokens/notify-figma.mjs --report sync-report.json [--pr-url URL] [--post]

Posts the tokens:report summary as a comment thread in the Figma file.
--dry-run (default) prints the message and the request it would send.
--post    POST /v1/files/:key/comments (requires FIGMA_TOKEN with file_comments:write).

Environment:
  FIGMA_TOKEN                 required for --post; without it the script exits 0 and skips
  FIGMA_FILE_KEY              main file key (default ${DEFAULT_FILE_KEY}). Not a branch key.
  FIGMA_SYNC_COMMENT_NODE_ID  frame id on that file (123:456). Must exist or a new thread is skipped.`);
}

function formatTime(iso) {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

function headline(report) {
  switch (report.result) {
    case 'promote':
      return 'Promoted for review';
    case 'blocked':
      return 'Blocked';
    default:
      return 'Preview';
  }
}

/** Shallow paths first: a primitive or semantic change explains the component cascade below it. */
function byDepth(a, b) {
  const depth = a.path.split('.').length - b.path.split('.').length;
  return depth !== 0 ? depth : a.path.localeCompare(b.path);
}

const RAMP_STOP = /^[a-z]+\.\d+$/;

/**
 * Direct edits, grouped so the list reads as a story rather than a dump:
 *   - colour ramps that changed as a whole collapse to one line
 *   - any other group (first path segment) with GROUP_MIN+ rows collapses to one line
 *   - the rest are listed individually, shallowest path first
 */
function summarizeDirect(rows) {
  const groups = new Map();
  for (const row of rows) {
    const group = row.path.split('.')[0];
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(row);
  }

  const ramps = [];
  const collapsed = [];
  const singles = [];
  for (const [group, members] of groups) {
    if (members.length >= GROUP_MIN && members.every((row) => RAMP_STOP.test(row.path))) {
      ramps.push({ group, size: members.length });
    } else if (members.length >= GROUP_MIN) {
      collapsed.push({ size: members.length, text: `• ${group}: ${members.length} values changed` });
    } else {
      singles.push(...members);
    }
  }

  const lines = [];
  if (ramps.length) {
    const names = ramps.map((ramp) => ramp.group).sort().join(', ');
    const size = ramps.reduce((sum, ramp) => sum + ramp.size, 0);
    lines.push(`• Colour ramps ${names}: ${size} values changed`);
  }
  collapsed.sort((a, b) => b.size - a.size);
  lines.push(...collapsed.map((line) => line.text));
  lines.push(...singles.sort(byDepth).map((row) => `• ${row.path}: ${row.before} → ${row.after}`));
  return lines;
}

function examples(rows, n) {
  return [...rows].sort(byDepth).slice(0, n).map((row) => row.path).join(', ');
}

function changeLines(diff) {
  const lines = [];
  const direct = diff.changed.filter((row) => !row.alias);
  const cascade = diff.changed.filter((row) => row.alias);

  if (direct.length) {
    lines.push(`Edited directly (${direct.length}):`);
    const detail = summarizeDirect(direct);
    lines.push(...detail.slice(0, MAX_CHANGES));
    if (detail.length > MAX_CHANGES) lines.push(`… ${detail.length - MAX_CHANGES} more in the pull request`);
  }
  if (cascade.length) {
    lines.push(`Following from those through aliases: ${cascade.length} values (e.g. ${examples(cascade, 3)})`);
  }
  if (diff.added.length) lines.push(`Added (${diff.added.length}), e.g. ${examples(diff.added, 3)}`);
  if (diff.removed.length) {
    const shown = diff.removed.slice(0, 5).map((row) => row.path).join(', ');
    lines.push(`Removed (${diff.removed.length}): ${shown}${diff.removed.length > 5 ? ', …' : ''}`);
  }
  return lines;
}

/** Plain text — Figma comments render no Markdown. */
export function buildMessage(report, { prUrl = '' } = {}) {
  const lines = [];
  lines.push(`${MARKER} ${headline(report)} — ${formatTime(report.generatedAt)}`);

  const origin = [
    report.actor ? `Pushed by ${report.actor}` : null,
    report.source ? `from ${report.source}` : null,
  ]
    .filter(Boolean)
    .join(' ');
  if (origin) lines.push(origin);
  lines.push('');

  const { diff } = report;
  if (!diff.base.available) {
    lines.push('Change list unavailable: the previous tokens.json could not be read.');
  } else {
    const total = diff.changed.length + diff.added.length + diff.removed.length;
    const summary = [
      `${diff.changed.length} changed`,
      `${diff.added.length} added`,
      `${diff.removed.length} removed`,
      diff.reordered.length ? `${diff.reordered.length} shadow reorders` : null,
    ]
      .filter(Boolean)
      .join(' · ');
    lines.push(`Changes vs the current tokens.json: ${summary}`);
    if (total === 0) {
      lines.push('No resolved value changed.');
    } else {
      lines.push(...changeLines(diff));
    }
  }
  lines.push('');

  lines.push(`Checks: ${report.checks.map((check) => `${check.name} ${check.status}`).join(' · ')}`);
  for (const check of report.checks) {
    if (check.status !== 'FAIL' && check.status !== 'WARN') continue;
    lines.push(`${check.name}: ${check.detail}`);
    for (const item of check.items.slice(0, MAX_CHECK_ITEMS)) lines.push(`  ${item}`);
    if (check.items.length > MAX_CHECK_ITEMS) lines.push(`  … ${check.items.length - MAX_CHECK_ITEMS} more`);
  }
  lines.push('');

  if (report.result === 'promote') {
    lines.push('Next: a developer reviews the pull request. Nothing changes in the apps until it is merged.');
    if (prUrl) lines.push(`Pull request: ${prUrl}`);
    lines.push('After the merge the record appears in Storybook › Docs › Token pipeline › Sync status.');
  } else if (report.result === 'blocked') {
    lines.push(
      'Next: no pull request was opened. A developer must resolve the failed check; if a Figma value is wrong, fix it and push again.',
    );
  }
  if (report.runUrl) lines.push(`Workflow run: ${report.runUrl} (GitHub access required)`);

  return lines.join('\n').trimEnd();
}

async function figma(path, token, init = {}) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    ...init,
    headers: { 'X-Figma-Token': token, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

/** Newest unresolved root comment that carries the marker, if any. */
export function findThreadRoot(comments) {
  return (
    comments
      .filter((c) => !c.parent_id && !c.resolved_at && typeof c.message === 'string' && c.message.startsWith(MARKER))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0] ?? null
  );
}

export function buildRequest(message, { threadRoot = null, nodeId = null } = {}) {
  if (threadRoot) return { message, comment_id: threadRoot.id };
  return {
    message,
    client_meta: nodeId ? { node_id: nodeId, node_offset: { x: 0, y: 0 } } : { x: 0, y: 0 },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    help();
    return;
  }
  if (!args.reportPath) {
    console.error('notify-figma: --report <sync-report.json> is required');
    process.exitCode = 1;
    return;
  }

  const report = JSON.parse(readFileSync(args.reportPath, 'utf8'));
  const message = buildMessage(report, { prUrl: args.prUrl });
  const token = process.env.FIGMA_TOKEN;

  if (!args.post) {
    console.log(message);
    console.log('');
    console.log(`notify-figma: dry-run — would POST /v1/files/${args.fileKey}/comments`);
    console.log(JSON.stringify(buildRequest(message, { nodeId: args.nodeId }), null, 2));
    return;
  }

  if (!token) {
    console.error('notify-figma: FIGMA_TOKEN is not set — skipping the Figma comment.');
    return;
  }

  let threadRoot = null;
  try {
    const existing = await figma(`/files/${args.fileKey}/comments`, token);
    threadRoot = findThreadRoot(existing.comments ?? []);
  } catch (error) {
    console.error(`notify-figma: could not list comments (${error.message}); posting a new thread.`);
  }

  let nodeId = args.nodeId;
  if (!threadRoot && nodeId) {
    const pin = await resolvePinNode(args.fileKey, nodeId, token);
    if (pin === 'missing') {
      console.error(
        `notify-figma: node ${nodeId} is not in file ${args.fileKey} — Figma would store this as Unattached. Not opening a new thread. Merge the Token sync log frame onto this file and set FIGMA_SYNC_COMMENT_NODE_ID to that frame's id (123:456).`,
      );
      return;
    }
    if (pin === 'unknown') {
      console.error(
        `notify-figma: could not verify node ${nodeId} (need file_content:read). Posting anyway.`,
      );
    }
  } else if (!threadRoot && process.env.FIGMA_SYNC_COMMENT_NODE_ID && !nodeId) {
    console.error(
      `notify-figma: FIGMA_SYNC_COMMENT_NODE_ID is not a frame id (want 123:456, not a URL or name). Not opening a new thread.`,
    );
    return;
  }

  const body = buildRequest(message, { threadRoot, nodeId });
  const posted = await figma(`/files/${args.fileKey}/comments`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  console.log(
    `notify-figma: ${threadRoot ? `replied to thread ${threadRoot.id}` : 'opened a new thread'} — comment ${posted?.id ?? '?'} in ${args.fileKey}`,
  );
}

/** @returns {'ok' | 'missing' | 'unknown'} */
async function resolvePinNode(fileKey, nodeId, token) {
  try {
    const ids = encodeURIComponent(nodeId);
    const data = await figma(`/files/${fileKey}/nodes?ids=${ids}`, token);
    const entry = data?.nodes?.[nodeId];
    if (entry?.document) return 'ok';
    return 'missing';
  } catch (error) {
    const text = String(error.message);
    if (text.includes('404') || text.includes('400')) return 'missing';
    return 'unknown';
  }
}

if (process.argv[1]?.includes('notify-figma.mjs')) {
  await main();
}
