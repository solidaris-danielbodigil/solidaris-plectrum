import { Injectable, NgZone, inject } from '@angular/core';

export interface TestingTelemetryEvent {
  event: string;
  target?: string;
  timestamp: string;
  taskId?: string | null;
}

/** Idle threshold (ms) before an `idle` event is recorded for the last click target. */
const IDLE_THRESHOLD_MS = 3000;

/**
 * Test-only event logger for moderated user-testing sessions (plan option B).
 * Records `{ event, target, timestamp, taskId }` to an in-memory buffer with
 * JSON/CSV export. Never wire to production analytics.
 */
@Injectable({ providedIn: 'root' })
export class TestingTelemetryService {
  private readonly zone = inject(NgZone);

  private enabled = false;
  private events: TestingTelemetryEvent[] = [];
  private currentTaskId: string | null = null;
  private lastClickTarget: string | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private clickListener: ((event: MouseEvent) => void) | null = null;

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

    this.events.push({
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

  exportJson(): string {
    return JSON.stringify(this.events, null, 2);
  }

  exportCsv(): string {
    const header = 'event,target,timestamp,taskId';
    const rows = this.events.map((entry) =>
      [
        csvEscape(entry.event),
        csvEscape(entry.target ?? ''),
        csvEscape(entry.timestamp),
        csvEscape(entry.taskId ?? ''),
      ].join(','),
    );
    return [header, ...rows].join('\n');
  }

  private onGlobalClick(event: MouseEvent): void {
    const target = describeClickTarget(event.target);
    this.lastClickTarget = target;
    this.zone.run(() => this.record('click', target));
    this.scheduleIdleCheck();
  }

  private scheduleIdleCheck(): void {
    this.clearIdleTimer();
    const target = this.lastClickTarget;
    this.idleTimer = setTimeout(() => {
      this.zone.run(() => this.record('idle', target ?? undefined));
    }, IDLE_THRESHOLD_MS);
  }

  private clearIdleTimer(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }
}

function describeClickTarget(target: EventTarget | null): string {
  if (!(target instanceof Element)) {
    return 'unknown';
  }

  const el = target.closest(
    'button, a, [role="button"], input, [data-telemetry-id]',
  );
  if (!el) {
    return target.tagName.toLowerCase();
  }

  const telemetryId = el.getAttribute('data-telemetry-id');
  if (telemetryId) {
    return telemetryId;
  }

  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  const id = el.id;
  if (id) {
    return `#${id}`;
  }

  return el.tagName.toLowerCase();
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
