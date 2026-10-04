import { InjectionToken } from '@angular/core';
import type { PlectrumInsights } from '@pds-internal/insights';

/** Facts behind the Plectrum metrics pages (tools/insights/generate.ts output). */
export const INSIGHTS_DATA = new InjectionToken<PlectrumInsights>('INSIGHTS_DATA');
