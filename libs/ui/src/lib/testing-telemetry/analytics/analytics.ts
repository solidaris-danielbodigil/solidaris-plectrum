import type {
  TestingTelemetryEvent,
  TestingTelemetrySession,
} from '../testing-telemetry.types';

/** Known placeholder targets that signal dead-end clicks. */
export const DEAD_END_TARGETS = [
  'drawer-menu',
  'drawer-quick-actions',
  'affiliate-overview-status-action',
  'actions-rapides',
] as const;

export interface SessionStats {
  durationMs: number;
  clickCount: number;
  idleCount: number;
  uniqueTargets: number;
  eventCount: number;
  firstTimestamp: string | null;
  lastTimestamp: string | null;
}

export interface TimelineRow extends TestingTelemetryEvent {
  relativeMs: number;
  relativeLabel: string;
}

export interface TargetAggregate {
  target: string;
  /** Human-readable label when captured on click events. */
  label: string | null;
  count: number;
}

const PRIMENG_INTERNAL_TARGET = /^pn_id_\d+$/i;

const GENERIC_HTML_TARGETS = new Set([
  'a',
  'article',
  'button',
  'div',
  'form',
  'g',
  'header',
  'input',
  'label',
  'li',
  'main',
  'nav',
  'p',
  'path',
  'section',
  'span',
  'svg',
  'ul',
]);

/** Targets that add noise to frequency charts (PrimeNG ids, bare tags without labels). */
export function isNoiseTelemetryTarget(
  target: string | null | undefined,
  label?: string | null,
): boolean {
  const normalizedTarget = target?.trim() ?? '';
  if (!normalizedTarget) {
    return true;
  }

  if (PRIMENG_INTERNAL_TARGET.test(normalizedTarget)) {
    return true;
  }

  if (GENERIC_HTML_TARGETS.has(normalizedTarget.toLowerCase()) && !label?.trim()) {
    return true;
  }

  return false;
}

export interface IdleGap {
  startTimestamp: string;
  endTimestamp: string;
  durationMs: number;
  precedingTarget?: string;
  relativeLabel: string;
}

export interface DeadEndHit {
  target: string;
  count: number;
  timestamps: string[];
}

export class SessionParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionParseError';
  }
}

export function parseSession(json: unknown): TestingTelemetrySession {
  if (typeof json === 'string') {
    try {
      return parseSession(JSON.parse(json));
    } catch {
      throw new SessionParseError('Invalid JSON string');
    }
  }

  if (!json || typeof json !== 'object') {
    throw new SessionParseError('Session payload must be an object');
  }

  const candidate = json as Partial<TestingTelemetrySession>;

  if (candidate.schemaVersion !== 1) {
    throw new SessionParseError('Unsupported or missing schemaVersion');
  }

  if (!candidate.exportedAt || typeof candidate.exportedAt !== 'string') {
    throw new SessionParseError('Missing exportedAt');
  }

  if (candidate.app !== 'ishare' && candidate.app !== 'icrm') {
    throw new SessionParseError('Missing or invalid app');
  }

  if (!candidate.build || typeof candidate.build !== 'object') {
    throw new SessionParseError('Missing build metadata');
  }

  if (!Array.isArray(candidate.events)) {
    throw new SessionParseError('Missing events array');
  }

  return {
    schemaVersion: 1,
    exportedAt: candidate.exportedAt,
    sessionId: candidate.sessionId,
    participantId: candidate.participantId,
    app: candidate.app,
    build: {
      production: !!candidate.build.production,
      telemetryEnabled: !!candidate.build.telemetryEnabled,
    },
    events: candidate.events as TestingTelemetryEvent[],
  };
}

export function computeSessionStats(events: TestingTelemetryEvent[]): SessionStats {
  const clickCount = events.filter((e) => e.event === 'click').length;
  const idleCount = events.filter((e) => e.event === 'idle').length;
  const targets = new Set(
    events.map((e) => e.target).filter((t): t is string => !!t),
  );

  const timestamps = events
    .map((e) => Date.parse(e.timestamp))
    .filter((t) => !Number.isNaN(t));

  const first = timestamps.length > 0 ? Math.min(...timestamps) : null;
  const last = timestamps.length > 0 ? Math.max(...timestamps) : null;

  return {
    durationMs: first !== null && last !== null ? last - first : 0,
    clickCount,
    idleCount,
    uniqueTargets: targets.size,
    eventCount: events.length,
    firstTimestamp:
      first !== null ? new Date(first).toISOString() : null,
    lastTimestamp: last !== null ? new Date(last).toISOString() : null,
  };
}

export function formatRelativeMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `+${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function buildEventTimeline(events: TestingTelemetryEvent[]): TimelineRow[] {
  const sorted = [...events].sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );

  const firstTs = sorted.length > 0 ? Date.parse(sorted[0].timestamp) : 0;

  return sorted.map((event) => {
    const relativeMs = Math.max(0, Date.parse(event.timestamp) - firstTs);
    return {
      ...event,
      relativeMs,
      relativeLabel: formatRelativeMs(relativeMs),
    };
  });
}

export function aggregateClicksByTarget(
  events: TestingTelemetryEvent[],
): TargetAggregate[] {
  const counts = new Map<string, TargetAggregate>();

  for (const event of events) {
    if (event.event !== 'click' || !event.target) {
      continue;
    }

    const label = event.label?.trim() || null;
    if (isNoiseTelemetryTarget(event.target, label)) {
      continue;
    }

    const key = label ? `label:${label}` : `target:${event.target}`;
    const existing = counts.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(key, {
      target: event.target,
      label,
      count: 1,
    });
  }

  return [...counts.values()].sort(
    (a, b) =>
      b.count - a.count ||
      (a.label ?? a.target).localeCompare(b.label ?? b.target),
  );
}

export function findIdleGaps(
  events: TestingTelemetryEvent[],
  thresholdMs = 3000,
): IdleGap[] {
  const timeline = buildEventTimeline(events);
  const gaps: IdleGap[] = [];

  for (let i = 1; i < timeline.length; i++) {
    const prev = timeline[i - 1];
    const curr = timeline[i];
    const gapMs = curr.relativeMs - prev.relativeMs;

    if (gapMs >= thresholdMs) {
      gaps.push({
        startTimestamp: prev.timestamp,
        endTimestamp: curr.timestamp,
        durationMs: gapMs,
        precedingTarget: prev.target,
        relativeLabel: curr.relativeLabel,
      });
    }
  }

  return gaps;
}

export function detectDeadEnds(events: TestingTelemetryEvent[]): DeadEndHit[] {
  const deadEndSet = new Set<string>(DEAD_END_TARGETS);
  const hits = new Map<string, DeadEndHit>();

  for (const event of events) {
    if (event.event !== 'click' || !event.target) {
      continue;
    }

    if (!deadEndSet.has(event.target)) {
      continue;
    }

    const existing = hits.get(event.target);
    if (existing) {
      existing.count += 1;
      existing.timestamps.push(event.timestamp);
    } else {
      hits.set(event.target, {
        target: event.target,
        count: 1,
        timestamps: [event.timestamp],
      });
    }
  }

  return [...hits.values()].sort((a, b) => b.count - a.count);
}

export function buildClicksPerMinute(
  events: TestingTelemetryEvent[],
): { label: string; count: number }[] {
  const timeline = buildEventTimeline(events);
  const clicks = timeline.filter((e) => e.event === 'click');
  const buckets = new Map<number, number>();

  for (const click of clicks) {
    const minute = Math.floor(click.relativeMs / 60000);
    buckets.set(minute, (buckets.get(minute) ?? 0) + 1);
  }

  const maxMinute = buckets.size > 0 ? Math.max(...buckets.keys()) : 0;
  const result: { label: string; count: number }[] = [];

  for (let m = 0; m <= maxMinute; m++) {
    result.push({
      label: formatRelativeMs(m * 60000),
      count: buckets.get(m) ?? 0,
    });
  }

  return result;
}

export function buildClickPath(events: TestingTelemetryEvent[]): string[] {
  const path: string[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    if (event.event !== 'click' || !event.target) {
      continue;
    }
    if (seen.has(event.target)) {
      continue;
    }
    seen.add(event.target);
    path.push(event.target);
  }

  return path;
}
