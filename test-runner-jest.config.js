/**
 * Storybook test-runner jest config — ejected only to raise testTimeout:
 * token-explorer pages (Iconography, Colors) render hundreds of cells and
 * exceed jest's 15s default.
 *
 * a11y checks run through Storybook's native addon-a11y × test-runner
 * integration, controlled by parameters.a11y.test in .storybook/preview.ts
 * ('todo' = non-blocking report; flip to 'error' to gate CI).
 *
 * Coverage: `test-storybook --coverage` via @storybook/addon-coverage
 * (Istanbul). Visual tests are Chromatic (`npx chromatic`), not Jest
 * image snapshots — a test-runner hooks file is forbidden here (Jest 30
 * rejects module.register() inside workers).
 *
 * Do NOT add a test-runner.(js|ts) hooks file in the config dir: Storybook
 * loads it through serverRequire → module.register(), which Jest 30 forbids
 * inside workers.
 */
const { getJestConfig } = require('@storybook/test-runner');

module.exports = {
  ...getJestConfig(),
  testTimeout: 60_000,
};
