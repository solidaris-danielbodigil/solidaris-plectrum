import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { TestingTelemetryService } from '@solidaris/ui';
import { TestingSessionMenuService } from './testing-session-menu.service';

describe('TestingSessionMenuService', () => {
  let service: TestingSessionMenuService;
  let telemetry: TestingTelemetryService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [TestingSessionMenuService, TestingTelemetryService, MessageService],
    });
    service = TestBed.inject(TestingSessionMenuService);
    telemetry = TestBed.inject(TestingTelemetryService);
  });

  afterEach(() => {
    telemetry.disable();
    sessionStorage.clear();
  });

  it('should expose a single start/stop toggle without separate export or new session items', () => {
    const items = service.menuItems();
    const ids = items.map((item) => item.id);

    expect(ids).toEqual(['session-start']);
    expect(items.find((item) => item.id === 'session-start')?.label).toBe(
      'Démarrer la session test',
    );
  });

  it('should start capture when toggling from idle', () => {
    service.toggleCapture();

    expect(telemetry.capturing()).toBeTrue();
    expect(telemetry.getSessionId()).toBeTruthy();
    expect(telemetry.getEvents().some((event) => event.event === 'session_new')).toBeTrue();
    expect(telemetry.getEvents().some((event) => event.event === 'session_start')).toBeTrue();
  });

  it('should expose a stable stop label and publish the timer separately while capturing', () => {
    service.toggleCapture();

    const items = service.menuItems();
    const stopItem = items.find((item) => item.id === 'session-stop');

    expect(stopItem?.label).toBe('Arrêter la session test');
    expect(stopItem?.badge).toBeUndefined();
    expect(service.captureElapsedLabel()).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should clear the elapsed timer label when idle', () => {
    expect(service.captureElapsedLabel()).toBeNull();
  });

  it('should keep the same menu item identity across timer ticks', () => {
    service.toggleCapture();

    const first = service.menuItems();
    const second = service.menuItems();

    expect(second).toBe(first);
  });

  it('should stop capture and export telemetry when toggling from capturing', () => {
    const downloadSpy = spyOn(telemetry, 'downloadSession').and.callThrough();

    service.toggleCapture();
    expect(telemetry.capturing()).toBeTrue();

    service.toggleCapture();

    expect(telemetry.capturing()).toBeFalse();
    expect(downloadSpy).toHaveBeenCalledWith('ishare', {
      production: jasmine.any(Boolean),
      telemetryEnabled: jasmine.any(Boolean),
    });
    expect(
      telemetry.getEvents().some((event) => event.event === 'session_stop'),
    ).toBeTrue();
    expect(
      telemetry.getEvents().some((event) => event.event === 'session_export'),
    ).toBeTrue();
  });
});
