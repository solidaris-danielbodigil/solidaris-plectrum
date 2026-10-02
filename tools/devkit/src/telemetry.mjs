// Local, content-free usage events for the Plectrum agent and CLI.
// An event records which tool or command ran, the component it concerned and its
// outcome — never the request text, file contents or code, which can hold member data.
// Events stay in the application checkout (ignored by git) until adoption-report
// aggregates them into counts; sending follows reporting.enabled.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { projectPath, readJson } from './common.mjs';

export const telemetryDirectory = '.plectrum/telemetry';
const eventsFile = `${telemetryDirectory}/events.jsonl`;
const sources = new Set(['mcp', 'cli']);
const outcomes = new Set(['ok', 'empty', 'error']);

/** Telemetry is on unless .plectrum/config.json sets telemetry.enabled to false. */
export function telemetryEnabled(root) {
  try {
    const file = projectPath(root, '.plectrum/config.json');
    if (!fs.existsSync(file)) return false;
    return readJson(file).telemetry?.enabled !== false;
  } catch { return false; }
}

/** Append one event. Failures never break the command that is being measured. */
export function recordEvent(root, { source, name, componentId, outcome = 'ok' }, now = new Date()) {
  if (!sources.has(source) || !outcomes.has(outcome) || !/^[a-z][a-z0-9_ -]*$/.test(name)) return false;
  if (!telemetryEnabled(root)) return false;
  try {
    const directory = projectPath(root, telemetryDirectory);
    fs.mkdirSync(directory, { recursive: true });
    const ignore = path.join(directory, '.gitignore');
    if (!fs.existsSync(ignore)) fs.writeFileSync(ignore, '# Local Plectrum usage events; adoption-report sends counts only.\n*\n');
    const event = { at: now.toISOString(), source, name, ...(componentId && /^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/.test(componentId) ? { componentId } : {}), outcome };
    fs.appendFileSync(path.join(directory, 'events.jsonl'), `${JSON.stringify(event)}\n`);
    return true;
  } catch { return false; }
}

export function readEvents(root) {
  const file = projectPath(root, eventsFile);
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).flatMap((line) => {
    try {
      const event = JSON.parse(line);
      return typeof event.at === 'string' && sources.has(event.source) && typeof event.name === 'string' ? [event] : [];
    } catch { return []; }
  });
}

const increment = (record, key) => { record[key] = (record[key] ?? 0) + 1; };

/**
 * Commit trailers the agent adds to the commits it helped with:
 *   Plectrum-Agent: reuse=plectrum:drawer,plectrum:detail-list
 *   Plectrum-Agent: scaffold=claim-card
 *   Plectrum-Agent: advice
 */
export function parseTrailers(values) {
  const result = { commits: 0, reuse: 0, scaffold: 0, advice: 0, reused: {} };
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    result.commits++;
    const [kind, list = ''] = trimmed.split('=', 2).map((part) => part.trim());
    if (kind === 'reuse') {
      result.reuse++;
      for (const id of list.split(',').map((item) => item.trim()).filter((item) => /^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/.test(item))) increment(result.reused, id);
    } else if (kind === 'scaffold') result.scaffold++;
    else if (kind === 'advice') result.advice++;
  }
  return result;
}

function trailerValues(root, since) {
  try {
    const output = execFileSync('git', ['log', `--since=${since}`, '--format=%(trailers:key=Plectrum-Agent,valueonly,separator=%x1e)%x1f'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return output.split('\x1f').flatMap((commit) => commit.split('\x1e')).map((value) => value.trim()).filter(Boolean);
  } catch { return []; }
}

/**
 * Counts for the adoption report: no request text, no file names, no people.
 * Returns undefined when nothing was observed, so a report without agent use stays unchanged.
 */
export function agentSummary(root, { days = 30, now = new Date() } = {}) {
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const events = readEvents(root).filter((event) => {
    const at = Date.parse(event.at);
    return at >= from.getTime() && at <= now.getTime();
  });
  const trailers = parseTrailers(trailerValues(root, from.toISOString()));
  if (!events.length && !trailers.commits) return undefined;
  const tools = {};
  const commands = {};
  const lookups = {};
  let emptySearches = 0;
  const active = new Set();
  for (const event of events) {
    active.add(event.at.slice(0, 10));
    if (event.source === 'mcp') increment(tools, event.name);
    else increment(commands, event.name);
    if (event.source === 'mcp' && event.name === 'get_component' && event.componentId) increment(lookups, event.componentId);
    if (event.name === 'search_components' && event.outcome === 'empty') emptySearches++;
  }
  return {
    window: { from: from.toISOString(), to: now.toISOString(), days },
    activeDays: active.size,
    tools,
    commands,
    lookups,
    emptySearches,
    commits: { total: trailers.commits, reuse: trailers.reuse, scaffold: trailers.scaffold, advice: trailers.advice, reused: trailers.reused },
  };
}
