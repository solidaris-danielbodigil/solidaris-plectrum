import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TestingTelemetryService } from './testing-telemetry.service';

describe('TestingTelemetryService', () => {
  let service: TestingTelemetryService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        TestingTelemetryService,
        {
          provide: Router,
          useValue: { url: '/affiliate/eva' },
        },
      ],
    });
    service = TestBed.inject(TestingTelemetryService);
  });

  afterEach(() => {
    service.disable();
    sessionStorage.clear();
  });

  it('should not record events when capture is disabled', () => {
    service.record('custom', 'target');
    expect(service.getEvents().length).toBe(0);
  });

  it('should record click events with coordinates when capture is enabled', () => {
    service.enable();

    const button = document.createElement('button');
    button.setAttribute('data-telemetry-id', 'test-button');
    document.body.appendChild(button);

    button.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: 120,
        clientY: 80,
      }),
    );

    const click = service.getEvents().find((e) => e.event === 'click');
    expect(click?.target).toBe('test-button');
    expect(click?.x).toBe(120);
    expect(click?.y).toBe(80);
    expect(click?.viewport).toEqual({
      w: window.innerWidth,
      h: window.innerHeight,
    });
    expect(click?.route).toBe('/affiliate/eva');

    button.remove();
  });

  it('should resolve nested menu label clicks to ancestor data-telemetry-id', () => {
    service.enable();

    const link = document.createElement('a');
    link.setAttribute('data-telemetry-id', 'session-start');
    const label = document.createElement('span');
    label.textContent = 'Démarrer la session test';
    link.appendChild(label);
    document.body.appendChild(link);

    label.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: 10,
        clientY: 10,
      }),
    );

    const click = service.getEvents().find((e) => e.event === 'click');
    expect(click?.target).toBe('session-start');

    link.remove();
  });

  it('should record click label from data-test when present', () => {
    service.enable();

    const button = document.createElement('button');
    button.setAttribute('data-telemetry-id', 'journey-view');
    button.setAttribute('data-test', 'Vue parcours');
    document.body.appendChild(button);

    button.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: 10,
        clientY: 10,
      }),
    );

    const click = service.getEvents().find((e) => e.event === 'click');
    expect(click?.target).toBe('journey-view');
    expect(click?.label).toBe('Vue parcours');

    button.remove();
  });

  it('should record human label from aria-label when telemetry id is absent', () => {
    service.enable();

    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Etape suivante');
    document.body.appendChild(button);

    button.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: 10,
        clientY: 10,
      }),
    );

    const click = service.getEvents().find((e) => e.event === 'click');
    expect(click?.target).toBe('button');
    expect(click?.label).toBe('Etape suivante');

    button.remove();
  });

  it('should manage session lifecycle events', () => {
    service.newSession();
    expect(service.getSessionId()).toBeTruthy();
    expect(service.getEvents().some((e) => e.event === 'session_new')).toBeTrue();

    service.startCapture();
    expect(service.isCapturing()).toBeTrue();
    expect(service.capturing()).toBeTrue();
    expect(service.captureStartedAt()).toBeTruthy();
    expect(service.getEvents().some((e) => e.event === 'session_start')).toBeTrue();

    service.stopCapture();
    expect(service.isCapturing()).toBeFalse();
    expect(service.capturing()).toBeFalse();
    expect(service.captureStartedAt()).toBeNull();
    expect(service.getEvents().some((e) => e.event === 'session_stop')).toBeTrue();
  });

  it('should auto-create a session when capture starts without an existing session id', () => {
    service.startCapture();

    expect(service.getSessionId()).toBeTruthy();
    expect(service.getEvents().some((e) => e.event === 'session_new')).toBeTrue();
    expect(service.getEvents().some((e) => e.event === 'session_start')).toBeTrue();
    expect(service.isCapturing()).toBeTrue();
  });

  it('should resume the same session when restarting capture after stop without export', () => {
    service.newSession();
    const sessionId = service.getSessionId();
    service.startCapture();
    service.stopCapture();

    service.startCapture();

    expect(service.getSessionId()).toBe(sessionId);
    expect(service.getEvents().filter((e) => e.event === 'session_new').length).toBe(1);
    expect(service.getEvents().filter((e) => e.event === 'session_start').length).toBe(2);
  });

  it('should start a fresh session when capture begins after export', () => {
    service.newSession();
    service.startCapture();
    service.record('marker', 'test-target');
    service.stopCapture();
    service.downloadSession('ishare', {
      production: false,
      telemetryEnabled: true,
    });

    expect(service.getEvents().length).toBeGreaterThan(2);

    service.startCapture();

    const events = service.getEvents();
    expect(events.map((entry) => entry.event)).toEqual(['session_new', 'session_start']);
    expect(service.isCapturing()).toBeTrue();
  });

  it('should export a session envelope', () => {
    service.newSession();
    service.startCapture();
    service.record('marker', 'journey-view');
    service.stopCapture();

    const session = service.exportSession('ishare', {
      production: false,
      telemetryEnabled: true,
    });

    expect(session.schemaVersion).toBe(1);
    expect(session.app).toBe('ishare');
    expect(session.build.telemetryEnabled).toBeTrue();
    expect(session.events.length).toBeGreaterThan(0);
    expect(session.sessionId).toBe(service.getSessionId() ?? undefined);
  });

  it('should return the download filename from downloadSession', () => {
    service.newSession();
    const filename = service.downloadSession('ishare', {
      production: false,
      telemetryEnabled: true,
    });

    expect(filename).toMatch(/^\d{4}-\d{2}-\d{2}_.+_telemetry\.json$/);
    expect(service.getEvents().some((e) => e.event === 'session_export')).toBeTrue();
  });

  it('should persist session id in sessionStorage when starting a new session', () => {
    sessionStorage.clear();
    service.newSession();

    const id = service.getSessionId();
    expect(id).toBeTruthy();
    expect(sessionStorage.getItem('testing-telemetry-session-id')).toBe(id);
  });

  it('should read session id from sessionStorage on bootstrap', () => {
    sessionStorage.setItem('testing-telemetry-session-id', 'P02');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        TestingTelemetryService,
        { provide: Router, useValue: { url: '/affiliate/eva' } },
      ],
    });

    const bootstrapped = TestBed.inject(TestingTelemetryService);
    expect(bootstrapped.getSessionId()).toBe('P02');
  });
});
