import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { agentSummary, parseTrailers, readEvents, recordEvent } from './telemetry.mjs';

function project(context, telemetry) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-telemetry-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, '.plectrum'));
  fs.writeFileSync(path.join(root, '.plectrum/config.json'), JSON.stringify({ schemaVersion: 1, ...(telemetry === undefined ? {} : { telemetry }) }));
  return root;
}

test('events are local, ignored by git and carry no free text', (context) => {
  const root = project(context);
  const now = new Date('2026-10-01T10:00:00.000Z');
  assert.equal(recordEvent(root, { source: 'mcp', name: 'get_component', componentId: 'plectrum:drawer' }, now), true);
  assert.equal(recordEvent(root, { source: 'mcp', name: 'search_components', outcome: 'empty', request: 'member 12345 Dupont' }, now), true);
  assert.equal(recordEvent(root, { source: 'mcp', name: 'Free text with Capitals' }, now), false);
  assert.equal(recordEvent(root, { source: 'mcp', name: 'get_component', componentId: 'not an id' }, now), true);
  assert.equal(fs.readFileSync(path.join(root, '.plectrum/telemetry/.gitignore'), 'utf8').trim().split('\n').at(-1), '*');
  const raw = fs.readFileSync(path.join(root, '.plectrum/telemetry/events.jsonl'), 'utf8');
  assert.doesNotMatch(raw, /Dupont|12345|not an id/);
  assert.deepEqual(readEvents(root).map((event) => event.componentId ?? null), ['plectrum:drawer', null, null]);
});

test('telemetry.enabled false records nothing', (context) => {
  const root = project(context, { enabled: false });
  assert.equal(recordEvent(root, { source: 'cli', name: 'check' }), false);
  assert.equal(fs.existsSync(path.join(root, '.plectrum/telemetry')), false);
});

test('commit trailers count reuse, scaffolds and advice', () => {
  assert.deepEqual(parseTrailers(['reuse=plectrum:drawer, plectrum:detail-list', 'scaffold=claim-card', 'advice', 'reuse=plectrum:drawer', '']), {
    commits: 4, reuse: 2, scaffold: 1, advice: 1, reused: { 'plectrum:drawer': 2, 'plectrum:detail-list': 1 },
  });
});

test('the summary counts the window and reads trailers from git history', (context) => {
  const root = project(context);
  const now = new Date();
  const day = 24 * 60 * 60 * 1000;
  recordEvent(root, { source: 'mcp', name: 'search_components' }, new Date(now.getTime() - 2 * day));
  recordEvent(root, { source: 'mcp', name: 'search_components', outcome: 'empty' }, new Date(now.getTime() - 2 * day));
  recordEvent(root, { source: 'mcp', name: 'get_component', componentId: 'plectrum:drawer' }, new Date(now.getTime() - day));
  recordEvent(root, { source: 'cli', name: 'check' }, new Date(now.getTime() - day));
  recordEvent(root, { source: 'cli', name: 'check' }, new Date(now.getTime() - 40 * day));
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'ignore' });
  git('init', '-q');
  git('-c', 'user.email=t@example.org', '-c', 'user.name=Test', 'commit', '-q', '--allow-empty', '-m', 'feat: member panel', '-m', 'Plectrum-Agent: reuse=plectrum:drawer,plectrum:detail-list');
  git('-c', 'user.email=t@example.org', '-c', 'user.name=Test', 'commit', '-q', '--allow-empty', '-m', 'chore: no agent');
  const summary = agentSummary(root, { now });
  assert.equal(summary.window.days, 30);
  assert.equal(summary.activeDays, 2);
  assert.deepEqual(summary.tools, { search_components: 2, get_component: 1 });
  assert.deepEqual(summary.commands, { check: 1 });
  assert.deepEqual(summary.lookups, { 'plectrum:drawer': 1 });
  assert.equal(summary.emptySearches, 1);
  assert.deepEqual(summary.commits, { total: 1, reuse: 1, scaffold: 0, advice: 0, reused: { 'plectrum:drawer': 1, 'plectrum:detail-list': 1 } });
});

test('no events and no trailers leave the report without an agent block', (context) => {
  assert.equal(agentSummary(project(context)), undefined);
});
