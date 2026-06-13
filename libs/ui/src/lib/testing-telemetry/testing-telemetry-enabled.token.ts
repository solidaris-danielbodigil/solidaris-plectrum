import { InjectionToken } from '@angular/core';

/** When true, `sdsTelemetryLabel` writes `data-test` on host elements (dev / moderated testing only). */
export const TESTING_TELEMETRY_ENABLED = new InjectionToken<boolean>(
  'TESTING_TELEMETRY_ENABLED',
  { factory: () => false },
);
