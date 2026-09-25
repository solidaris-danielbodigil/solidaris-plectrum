import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { storybookAngularVitest } from '@storybook/angular-vite/vitest';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Set by `storybook dev` / the testing widget. Standalone CLI runs do not have it. */
const storybookAlreadyProvidedAngularOptions =
  process.env.STORYBOOK_ANGULAR_BUILDER_OPTIONS_JSON !== undefined;

/**
 * Storybook in-app tests only (`vitest --project=storybook`).
 * Unit specs stay on `ng test` / `@angular/build:unit-test` — do not add them here.
 */
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [
          ...(storybookAlreadyProvidedAngularOptions
            ? []
            : [
                storybookAngularVitest({
                  zoneless: false,
                  styles: [
                    'node_modules/bootstrap-icons/font/bootstrap-icons.css',
                    'libs/styles/src/main.scss',
                  ],
                  stylePreprocessorOptions: {
                    loadPaths: ['libs/styles/src'],
                  },
                  assets: [
                    {
                      glob: '**/*',
                      input: 'libs/assets',
                      output: 'assets',
                    },
                  ],
                }),
              ]),
          storybookTest({
            configDir: path.join(dirname, 'libs/ui/.storybook'),
            storybookUrl: 'http://localhost:6006',
          }),
        ],
        test: {
          name: 'storybook',
          // One Chromium context. The testing widget + coverage-v8 + Chromatic
          // `build-storybook` in the same Node process is what OOM'd local machines.
          fileParallelism: false,
          maxWorkers: 1,
          isolate: true,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          coverage: {
            // Widget/CLI opt in with the Coverage checkbox or `--coverage`.
            enabled: false,
            provider: 'v8',
            processingConcurrency: 1,
            include: ['libs/ui/src/lib/**'],
            exclude: [
              '**/*.stories.ts',
              '**/*.mdx',
              '**/*.spec.ts',
              '**/*.metadata.ts',
              '**/package.json',
            ],
          },
        },
      },
    ],
  },
});
