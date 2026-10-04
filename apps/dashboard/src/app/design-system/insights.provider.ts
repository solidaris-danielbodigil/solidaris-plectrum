import type { Provider } from '@angular/core';
import { INSIGHTS } from './data/insights.generated';
import { INSIGHTS_DATA } from './insights.token';

/**
 * Provides the generated insights module. `npm run insights:generate` writes
 * ./data/insights.generated.ts (gitignored); `start:dashboard` and
 * `build:dashboard` run it first.
 */
export function provideInsights(): Provider {
  return { provide: INSIGHTS_DATA, useFactory: () => INSIGHTS };
}
