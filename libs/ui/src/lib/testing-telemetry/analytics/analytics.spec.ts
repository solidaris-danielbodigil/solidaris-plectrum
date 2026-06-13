import {
  aggregateClicksByTarget,
  buildClickPath,
  buildClicksPerMinute,
  buildEventTimeline,
  computeSessionStats,
  detectDeadEnds,
  findIdleGaps,
  formatRelativeMs,
  isNoiseTelemetryTarget,
  parseSession,
  SessionParseError,
} from './analytics';
import type { TestingTelemetryEvent, TestingTelemetrySession } from '../testing-telemetry.types';

const baseSession: TestingTelemetrySession = {
  schemaVersion: 1,
  exportedAt: '2026-06-13T10:00:00.000Z',
  sessionId: 'P01',
  participantId: 'P01',
  app: 'ishare',
  build: { production: false, telemetryEnabled: true },
  events: [],
};

function event(
  partial: Partial<TestingTelemetryEvent> & Pick<TestingTelemetryEvent, 'event' | 'timestamp'>,
): TestingTelemetryEvent {
  return {
    taskId: null,
    ...partial,
  };
}

describe('testing telemetry analytics', () => {
  const sampleEvents: TestingTelemetryEvent[] = [
    event({ event: 'session_start', timestamp: '2026-06-13T10:00:00.000Z' }),
    event({
      event: 'click',
      target: 'journey-view',
      timestamp: '2026-06-13T10:00:05.000Z',
    }),
    event({
      event: 'click',
      target: 'drawer-quick-actions',
      timestamp: '2026-06-13T10:00:08.000Z',
    }),
    event({ event: 'idle', target: 'journey-view', timestamp: '2026-06-13T10:00:12.000Z' }),
    event({
      event: 'click',
      target: 'journey-view',
      timestamp: '2026-06-13T10:01:30.000Z',
    }),
  ];

  it('should parse a valid session', () => {
    const parsed = parseSession({ ...baseSession, events: sampleEvents });
    expect(parsed.app).toBe('ishare');
    expect(parsed.events.length).toBe(5);
  });

  it('should reject invalid session payloads', () => {
    expect(() => parseSession({})).toThrowError(SessionParseError);
    expect(() => parseSession('not-json')).toThrowError(SessionParseError);
  });

  it('should compute session stats', () => {
    const stats = computeSessionStats(sampleEvents);
    expect(stats.clickCount).toBe(3);
    expect(stats.idleCount).toBe(1);
    expect(stats.uniqueTargets).toBe(2);
    expect(stats.durationMs).toBe(90000);
  });

  it('should build a timeline with relative labels', () => {
    const timeline = buildEventTimeline(sampleEvents);
    expect(timeline[0].relativeLabel).toBe('+00:00');
    expect(timeline[1].relativeLabel).toBe('+00:05');
    expect(formatRelativeMs(154000)).toBe('+02:34');
  });

  it('should aggregate clicks by target', () => {
    const aggregates = aggregateClicksByTarget(sampleEvents);
    expect(aggregates[0]).toEqual({
      target: 'journey-view',
      label: null,
      count: 2,
    });
    expect(aggregates[1]).toEqual({
      target: 'drawer-quick-actions',
      label: null,
      count: 1,
    });
  });

  it('should exclude noise targets from click aggregates', () => {
    const aggregates = aggregateClicksByTarget([
      event({
        event: 'click',
        target: 'pn_id_55',
        timestamp: '2026-06-13T10:00:01.000Z',
      }),
      event({
        event: 'click',
        target: 'span',
        timestamp: '2026-06-13T10:00:02.000Z',
      }),
      event({
        event: 'click',
        target: 'article',
        label: 'Article utile',
        timestamp: '2026-06-13T10:00:03.000Z',
      }),
      event({
        event: 'click',
        target: 'journey-view',
        label: 'Vue parcours',
        timestamp: '2026-06-13T10:00:04.000Z',
      }),
      event({
        event: 'click',
        target: 'journey-view-alt',
        label: 'Vue parcours',
        timestamp: '2026-06-13T10:00:05.000Z',
      }),
    ]);

    expect(aggregates).toEqual([
      { target: 'journey-view', label: 'Vue parcours', count: 2 },
      { target: 'article', label: 'Article utile', count: 1 },
    ]);
  });

  it('should classify noise telemetry targets', () => {
    expect(isNoiseTelemetryTarget('pn_id_55')).toBe(true);
    expect(isNoiseTelemetryTarget('span')).toBe(true);
    expect(isNoiseTelemetryTarget('span', 'Continuer')).toBe(false);
    expect(isNoiseTelemetryTarget('journey-view')).toBe(false);
  });

  it('should find idle gaps above threshold', () => {
    const gaps = findIdleGaps(sampleEvents, 3000);
    expect(gaps.length).toBeGreaterThan(0);

    const longest = gaps.reduce((max, gap) =>
      gap.durationMs > max.durationMs ? gap : max,
    );
    expect(longest.durationMs).toBe(78000);
    expect(longest.precedingTarget).toBe('journey-view');
  });

  it('should detect dead-end placeholder clicks', () => {
    const deadEnds = detectDeadEnds(sampleEvents);
    expect(deadEnds.length).toBe(1);
    expect(deadEnds[0].target).toBe('drawer-quick-actions');
  });

  it('should build clicks per minute buckets', () => {
    const buckets = buildClicksPerMinute(sampleEvents);
    expect(buckets[0].count).toBe(2);
    expect(buckets[1].count).toBe(1);
  });

  it('should build ordered unique click path', () => {
    expect(buildClickPath(sampleEvents)).toEqual([
      'journey-view',
      'drawer-quick-actions',
    ]);
  });
});
