import {
  formatTelemetryEvent,
  formatTelemetryTarget,
  formatTimestampCet,
  isGenericTelemetryTarget,
} from './telemetry-labels';

describe('telemetry labels', () => {
  it('should prefer an explicit data-test label over mapped ids', () => {
    expect(formatTelemetryTarget('journey-view', 'Vue parcours')).toBe('Vue parcours');
  });

  it('should map known target ids to French labels', () => {
    expect(formatTelemetryTarget('filter-sector')).toBe('Filtre secteur');
    expect(formatTelemetryTarget('session-export')).toBe('Exporter les données');
  });

  it('should humanize unknown target ids', () => {
    expect(formatTelemetryTarget('journey-view-toggle')).toBe('Journey View Toggle');
  });

  it('should show unidentified label for generic html targets without labels', () => {
    expect(formatTelemetryTarget('button')).toBe('Élément non identifié');
    expect(formatTelemetryTarget('path')).toBe('Élément non identifié');
    expect(formatTelemetryTarget('button', 'Etape suivante')).toBe('Etape suivante');
  });

  it('should classify generic telemetry targets', () => {
    expect(isGenericTelemetryTarget('div')).toBe(true);
    expect(isGenericTelemetryTarget('path')).toBe(true);
    expect(isGenericTelemetryTarget('journey-view')).toBe(false);
  });

  it('should map known event names to French labels', () => {
    expect(formatTelemetryEvent('session_start')).toBe('Session démarrée');
    expect(formatTelemetryEvent('click')).toBe('Clic');
  });

  it('should format timestamps in European CET style', () => {
    const formatted = formatTimestampCet('2026-06-13T10:00:00.000Z');
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/);
  });
});
