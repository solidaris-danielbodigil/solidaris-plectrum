import { Injectable, NgZone, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type {
  TestingTelemetryApp,
  TestingTelemetryEvent,
  TestingTelemetrySession,
  TestingTelemetrySessionBuild,
} from './testing-telemetry.types';
import { resolveClickTarget } from './describe-click-target';

/** Idle threshold (ms) before an `idle` event is recorded for the last click target. */
const IDLE_THRESHOLD_MS = 3000;

const SESSION_STORAGE_KEY = 'testing-telemetry-session-id';

/**
 * Test-only event logger for moderated user-testing sessions (plan option B).
 * Records events to an in-memory buffer with JSON/CSV export. Never wire to production analytics.
 */
@Injectable({ providedIn: 'root' })
export class TestingTelemetryService {
  private readonly zone = inject(NgZone);
  private readonly router = inject(Router, { optional: true });

  private enabled = false;
  readonly captureStartedAt = signal<number | null>(null);
  private events: TestingTelemetryEvent[] = [];
  private currentTaskId: string | null = null;
  private sessionId: string | null = null;
  private lastClickTarget: string | null = null;
  private lastClickLabel: string | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private clickListener: ((event: MouseEvent) => void) | null = null;

  constructor() {
    this.bootstrapSessionFromQueryParam();
  }

  /** Whether global click/idle capture is active. */
  isCapturing(): boolean {
    return this.enabled;
  }

  /** Signal mirror of {@link isCapturing} for reactive menu UIs. */
  readonly capturing = signal(false);

  getSessionId(): string | null {
    return this.sessionId;
  }

  /** Clears the buffer and assigns a fresh session id. */
  newSession(): void {
    this.disable();
    this.capturing.set(false);
    this.captureStartedAt.set(null);
    this.clear();
    this.sessionId = this.generateSessionId();
    this.persistSessionId(this.sessionId);
    this.pushLifecycleEvent('session_new', this.sessionId);
  }

  /**
   * Ensures a session envelope exists before capture starts.
   * Creates a fresh session when none exists or when restarting after export.
   */
  prepareSessionForCaptureStart(): void {
    const exportedWhileIdle =
      !this.capturing() &&
      this.events.some((entry) => entry.event === 'session_export');

    if (!this.sessionId || exportedWhileIdle) {
      this.newSession();
    }
  }

  /** Begins capture — enables global click/idle listeners. */
  startCapture(): void {
    this.prepareSessionForCaptureStart();
    this.enable();
    this.capturing.set(true);
    this.captureStartedAt.set(Date.now());
    this.pushLifecycleEvent('session_start', this.sessionId ?? undefined);
  }

  /** Ends capture — disables global click/idle listeners. */
  stopCapture(): void {
    this.pushLifecycleEvent('session_stop', this.sessionId ?? undefined);
    this.capturing.set(false);
    this.captureStartedAt.set(null);
    this.disable();
  }

  /** Activates global click capture and idle detection. */
  enable(): void {
    if (this.enabled || typeof document === 'undefined') {
      return;
    }

    this.enabled = true;
    this.clickListener = (event: MouseEvent) => this.onGlobalClick(event);
    this.zone.runOutsideAngular(() => {
      document.addEventListener('click', this.clickListener!, true);
    });
  }

  disable(): void {
    if (!this.enabled || typeof document === 'undefined') {
      return;
    }

    this.enabled = false;
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener, true);
      this.clickListener = null;
    }
    this.clearIdleTimer();
  }

  startTask(taskId: string): void {
    this.currentTaskId = taskId;
    this.record('task_start', taskId);
  }

  stopTask(): void {
    if (this.currentTaskId) {
      this.record('task_stop', this.currentTaskId);
      this.currentTaskId = null;
    }
  }

  record(event: string, target?: string): void {
    if (!this.enabled) {
      return;
    }

    this.pushEvent({
      event,
      target,
      timestamp: new Date().toISOString(),
      taskId: this.currentTaskId,
    });
  }

  getEvents(): readonly TestingTelemetryEvent[] {
    return this.events;
  }

  clear(): void {
    this.events = [];
    this.currentTaskId = null;
  }

  exportSession(
    app: TestingTelemetryApp,
    build: TestingTelemetrySessionBuild,
  ): TestingTelemetrySession {
    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      sessionId: this.sessionId ?? undefined,
      participantId: this.sessionId ?? undefined,
      app,
      build,
      events: [...this.events],
    };
  }

  exportJson(
    app: TestingTelemetryApp,
    build: TestingTelemetrySessionBuild,
  ): string {
    return JSON.stringify(this.exportSession(app, build), null, 2);
  }

  downloadSession(
    app: TestingTelemetryApp,
    build: TestingTelemetrySessionBuild,
  ): string {
    this.pushLifecycleEvent('session_export', this.sessionId ?? undefined);
    const session = this.exportSession(app, build);
    const json = JSON.stringify(session, null, 2);
    const filename = this.buildDownloadFilename(session.sessionId);
    this.triggerDownload(filename, json);
    return filename;
  }

  exportCsv(): string {
    const header =
      'event,target,label,timestamp,taskId,x,y,viewport_w,viewport_h,route';
    const rows = this.events.map((entry) =>
      [
        csvEscape(entry.event),
        csvEscape(entry.target ?? ''),
        csvEscape(entry.label ?? ''),
        csvEscape(entry.timestamp),
        csvEscape(entry.taskId ?? ''),
        csvEscape(entry.x?.toString() ?? ''),
        csvEscape(entry.y?.toString() ?? ''),
        csvEscape(entry.viewport?.w.toString() ?? ''),
        csvEscape(entry.viewport?.h.toString() ?? ''),
        csvEscape(entry.route ?? ''),
      ].join(','),
    );
    return [header, ...rows].join('\n');
  }

  private onGlobalClick(event: MouseEvent): void {
    const { id: target, label } = resolveClickTarget(event.target);
    this.lastClickTarget = target;
    this.lastClickLabel = label ?? null;
    this.zone.run(() =>
      this.pushEvent({
        event: 'click',
        target,
        label,
        timestamp: new Date().toISOString(),
        taskId: this.currentTaskId,
        x: event.clientX,
        y: event.clientY,
        viewport:
          typeof window !== 'undefined'
            ? { w: window.innerWidth, h: window.innerHeight }
            : undefined,
        route: this.currentRoute(),
      }),
    );
    this.scheduleIdleCheck();
  }

  private scheduleIdleCheck(): void {
    this.clearIdleTimer();
    const target = this.lastClickTarget;
    const label = this.lastClickLabel;
    this.idleTimer = setTimeout(() => {
      this.zone.run(() => {
        if (!this.enabled) {
          return;
        }
        this.pushEvent({
          event: 'idle',
          target: target ?? undefined,
          label: label ?? undefined,
          timestamp: new Date().toISOString(),
          taskId: this.currentTaskId,
        });
      });
    }, IDLE_THRESHOLD_MS);
  }

  private clearIdleTimer(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  private pushLifecycleEvent(event: string, target?: string): void {
    this.pushEvent({
      event,
      target,
      timestamp: new Date().toISOString(),
      taskId: this.currentTaskId,
    });
  }

  private pushEvent(entry: TestingTelemetryEvent): void {
    this.events.push(entry);
  }

  private currentRoute(): string | undefined {
    try {
      return this.router?.url;
    } catch {
      return undefined;
    }
  }

  private bootstrapSessionFromQueryParam(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      this.sessionId = stored;
      return;
    }

    this.applySessionFromQueryParam();
  }

  /** Re-reads `?session=` from the current URL (e.g. after navigation in tests). */
  applySessionFromQueryParam(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const param = new URLSearchParams(window.location.search).get('session');
    if (param) {
      this.sessionId = param;
      this.persistSessionId(param);
    }
  }

  private persistSessionId(id: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    }
  }

  private generateSessionId(): string {
    const now = new Date();
    const stamp = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    return `session-${stamp}`;
  }

  private buildDownloadFilename(sessionId?: string): string {
    const date = new Date().toISOString().slice(0, 10);
    const id = sessionId ?? 'session';
    return `${date}_${id}_telemetry.json`;
  }

  private triggerDownload(filename: string, content: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
