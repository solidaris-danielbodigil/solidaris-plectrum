import { environment } from '../../environments/environment';

/** Whether moderated user-testing telemetry and the facilitator avatar menu are active. */
export function isTestingTelemetryEnabled(): boolean {
  return environment.enableTestingTelemetry;
}
