export interface TestingTelemetryViewport {
  w: number;
  h: number;
}

export interface TestingTelemetryEvent {
  event: string;
  target?: string;
  /** Human-readable label from `data-test` when captured on click. */
  label?: string;
  timestamp: string;
  taskId?: string | null;
  /** Present on global click events. */
  x?: number;
  y?: number;
  viewport?: TestingTelemetryViewport;
  route?: string;
}

export interface TestingTelemetrySessionBuild {
  production: boolean;
  telemetryEnabled: boolean;
}

export interface TestingTelemetrySession {
  schemaVersion: 1;
  exportedAt: string;
  sessionId?: string;
  participantId?: string;
  app: 'ishare' | 'icrm';
  build: TestingTelemetrySessionBuild;
  events: TestingTelemetryEvent[];
}

export type TestingTelemetryApp = TestingTelemetrySession['app'];
