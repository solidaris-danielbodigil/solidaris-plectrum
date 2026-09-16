import { defineConfig } from 'vitest/config';

/**
 * Extra Vitest options for `ng test` (`@angular/build:unit-test`).
 * Angular already owns plugins, includes, and the browser provider — this file
 * only caps parallelism so Chromium + coverage cannot fan out across every core
 * and exhaust a laptop (or a CI runner sharing the same config).
 */
export default defineConfig({
  test: {
    fileParallelism: false,
    maxWorkers: 1,
    isolate: true,
  },
});
