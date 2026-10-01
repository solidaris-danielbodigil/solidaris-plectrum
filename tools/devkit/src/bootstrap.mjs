import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { initialize, update } from './managed.mjs';
import { configAt, format, projectPath, readJson } from './common.mjs';

const layers = ['01-settings', '02-tools', '03-generic', '04-elements', '05-objects', '06-components', '07-utilities', '08-trumps'];
const barrels = ['settings', 'tools', 'generic', 'elements', 'objects', 'components', 'utilities', 'trumps'];
const packageStyles = 'node_modules/@solidaris-danielbodigil/pds-styles';

function gitRepository(root) {
  try {
    const value = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: root, encoding: 'utf8' }).trim();
    if (value.startsWith('git@github.com:')) return value.replace('git@github.com:', 'https://github.com/').replace(/\.git$/, '');
    if (/^https:\/\//.test(value)) return value.replace(/\.git$/, '');
  } catch { /* A newly created template may not yet have a remote. */ }
  return null;
}

function newFile(root, relative, content, changes) {
  const file = projectPath(root, relative);
  if (fs.existsSync(file)) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  changes.push(relative);
}

function preflight(root) {
  const checks = [
    ['src/styles.scss', "@use 'styles/main'", 'Merge the generated Plectrum entry into the existing global stylesheet.'],
    ['src/styles/main.scss', "@use '06-components/components.core'", 'Merge the ordered shared/local ITCSS composition into the existing main.scss.'],
    ['.storybook/main.ts', '@storybook/addon-vitest', 'Merge the Plectrum Angular-Vite addons, story globs and font assets into the existing Storybook main.'],
    ['.storybook/preview.ts', 'plectrumPreset', 'Merge the Plectrum preset and FR/NL globals with the existing Storybook preview.'],
  ];
  for (const [relative, marker, advice] of checks) {
    const file = projectPath(root, relative);
    if (fs.existsSync(file) && !fs.readFileSync(file, 'utf8').includes(marker)) throw new Error(`Existing ${relative} needs manual Plectrum integration. ${advice} Bootstrap did not alter the project.`);
  }
  const angularFile = projectPath(root, 'angular.json');
  if (!fs.existsSync(angularFile)) throw new Error('Missing angular.json. Start from the Plectrum Angular application starter, or connect an existing Angular project before bootstrap. No files changed.');
  const angular = readJson(angularFile);
  const applications = Object.entries(angular.projects ?? {}).filter(([, project]) => project.projectType === 'application');
  if (applications.length === 0) throw new Error('No Angular application project found in angular.json. Bootstrap did not alter the project.');
  for (const [, project] of applications) {
    const build = (project.architect ?? project.targets)?.build?.options;
    if ((build?.styles ?? []).some((style) => typeof style === 'string' && /(?:pds-styles\/src\/main\.scss|libs\/styles\/src\/main\.scss)$/.test(style))) throw new Error('Existing Angular build imports the complete Plectrum stylesheet. Remove the duplicate before bootstrap; no files changed.');
  }
}

function mergeArray(values = [], value) {
  return values.includes(value) ? values : [...values, value];
}

function angularProject(root, config, changes, readOnly = false) {
  const file = projectPath(root, 'angular.json');
  if (!fs.existsSync(file)) throw new Error('Missing angular.json. Start from the Plectrum Angular application starter, or connect an existing Angular project before bootstrap.');
  const angular = readJson(file);
  const names = Object.keys(angular.projects ?? {}).filter((name) => angular.projects[name].projectType === 'application');
  const selected = config.project ?? (names.length === 1 ? names[0] : null);
  if (!selected || !names.includes(selected)) throw new Error(`Set "project" in .plectrum/config.json to one Angular application (${names.join(', ')}).`);
  const project = angular.projects[selected];
  const targets = project.architect ?? project.targets;
  const build = targets?.build?.options;
  if (!build) throw new Error(`${selected}: missing Angular build options.`);
  if (readOnly) {
    if (!(build.styles ?? []).includes('src/styles.scss') || !targets.storybook || !targets['build-storybook'] || !targets.test) throw new Error('Committed Angular Plectrum targets or stylesheet are missing. Run npm install locally and commit angular.json.');
    return selected;
  }
  const entry = 'src/styles.scss';
  if ((build.styles ?? []).some((style) => typeof style === 'string' && /(?:pds-styles\/src\/main\.scss|libs\/styles\/src\/main\.scss)$/.test(style))) throw new Error('Build already imports the complete Plectrum stylesheet; remove that import before enabling the ordered local ITCSS composition.');
  build.styles = mergeArray(build.styles, entry);
  build.styles = mergeArray(build.styles, 'node_modules/bootstrap-icons/font/bootstrap-icons.css');
  build.stylePreprocessorOptions ??= {};
  build.stylePreprocessorOptions.includePaths = mergeArray(build.stylePreprocessorOptions.includePaths, `${packageStyles}/src`);
  build.assets ??= [];
  if (!build.assets.some((asset) => typeof asset === 'object' && asset.input === `${packageStyles}/assets/fonts`)) {
    build.assets.push({ glob: '**/*', input: `${packageStyles}/assets/fonts`, output: 'assets/fonts' });
  }
  for (const [target, builder] of [['storybook', '@storybook/angular-vite:start-storybook'], ['build-storybook', '@storybook/angular-vite:build-storybook']]) {
    if (targets[target]) continue;
    targets[target] = {
      builder,
      options: {
        configDir: '.storybook',
        ...(target === 'storybook' ? { port: 6006 } : { outputDir: 'dist/storybook' }),
        zoneless: false,
        styles: [...build.styles],
        assets: [...build.assets],
        stylePreprocessorOptions: { includePaths: [...build.stylePreprocessorOptions.includePaths] },
      },
    };
  }
  if (!targets.test) targets.test = { builder: '@angular/build:unit-test', options: { tsConfig: 'tsconfig.spec.json', buildTarget: `${selected}:build:testing`, setupFiles: ['src/test-setup.ts'], browsers: ['chromium'], headless: true } };
  const content = format(angular);
  if (fs.readFileSync(file, 'utf8') !== content) { fs.writeFileSync(file, content); changes.push('angular.json'); }
  return selected;
}

function instructions(root, changes) {
  newFile(root, '.storybook/main.ts', `import type { StorybookConfig } from '@storybook/angular-vite';\n\nconst config: StorybookConfig = {\n  stories: ['./*.stories.ts', '../src/**/*.stories.@(ts|tsx)'],\n  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],\n  framework: { name: '@storybook/angular-vite', options: {} },\n  staticDirs: [{ from: '../node_modules/@solidaris-danielbodigil/pds-styles/assets/fonts', to: 'assets/fonts' }],\n};\nexport default config;\n`, changes);
  newFile(root, '.storybook/tsconfig.json', `{"extends":"../tsconfig.json","compilerOptions":{"module":"esnext","moduleResolution":"bundler","emitDecoratorMetadata":true},"include":["../src/**/*.ts","./*.ts"],"exclude":["../src/**/*.spec.ts"]}\n`, changes);
  newFile(root, '.storybook/preview.ts', `import { inject, provideAppInitializer } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { applicationConfig, type Preview } from '@storybook/angular-vite';
import {
  DEFAULT_PLECTRUM_PRESET_VERSION,
  providePlectrum,
  readStoredPresetVersion,
  writeStoredPresetVersion,
  type PlectrumPresetVersion,
} from '@solidaris-danielbodigil/pds-plectrum';
import { IconRegistry, PdsLocaleService, providePdsLocale, registerPlectrumIcons, type PdsLocale } from '@solidaris-danielbodigil/pds-ui';

function initialPreset(): PlectrumPresetVersion {
  try {
    return typeof localStorage === 'undefined'
      ? DEFAULT_PLECTRUM_PRESET_VERSION
      : readStoredPresetVersion(localStorage) ?? DEFAULT_PLECTRUM_PRESET_VERSION;
  } catch {
    return DEFAULT_PLECTRUM_PRESET_VERSION;
  }
}

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Language for Plectrum component copy',
      toolbar: { title: 'Language', icon: 'globe', dynamicTitle: true,
        items: [{ value: 'fr', title: 'FR' }, { value: 'nl', title: 'NL' }] },
    },
    plectrumPreset: {
      description: 'PrimeNG preset; v0.6 is deprecated and available only for migration comparisons',
      toolbar: { title: 'Preset', icon: 'paintbrush', dynamicTitle: true,
        items: [{ value: 'v1', title: 'Preset v1' }, { value: 'v0.6', title: 'Preset v0.6 (deprecated)' }] },
    },
  },
  initialGlobals: { locale: 'fr', plectrumPreset: initialPreset() },
  decorators: [
    (storyFn, context) => {
      const locale = (context.globals['locale'] ?? 'fr') as PdsLocale;
      const version = (context.globals['plectrumPreset'] ?? DEFAULT_PLECTRUM_PRESET_VERSION) as PlectrumPresetVersion;
      try {
        if (typeof localStorage !== 'undefined') writeStoredPresetVersion(version, localStorage);
      } catch { /* Private browsing can block storage; the selected preset still renders. */ }
      return applicationConfig({ providers: [
        provideAnimationsAsync(),
        providePlectrum(version),
        providePdsLocale(locale),
        provideAppInitializer(() => {
          inject(PdsLocaleService).setLocale(locale);
          registerPlectrumIcons(inject(IconRegistry));
        }),
      ] })(storyFn, context);
    },
  ],
  parameters: { a11y: { test: 'error' } },
};
export default preview;
`, changes);
  newFile(root, 'vitest.config.mts', `import path from 'node:path';\nimport { fileURLToPath } from 'node:url';\nimport { storybookTest } from '@storybook/addon-vitest/vitest-plugin';\nimport { storybookAngularVitest } from '@storybook/angular-vite/vitest';\nimport { playwright } from '@vitest/browser-playwright';\nimport { defineConfig } from 'vitest/config';\n\nconst dirname = path.dirname(fileURLToPath(import.meta.url));\nconst angularOptionsProvided = process.env.STORYBOOK_ANGULAR_BUILDER_OPTIONS_JSON !== undefined;\nexport default defineConfig({\n  test: {\n    projects: [{\n      plugins: [\n        ...(angularOptionsProvided ? [] : [storybookAngularVitest({\n          zoneless: false,\n          styles: ['node_modules/bootstrap-icons/font/bootstrap-icons.css', 'src/styles.scss'],\n          stylePreprocessorOptions: { loadPaths: ['node_modules/@solidaris-danielbodigil/pds-styles/src'] },\n          assets: [{ glob: '**/*', input: 'node_modules/@solidaris-danielbodigil/pds-styles/assets/fonts', output: 'assets/fonts' }],\n        })]),\n        storybookTest({ configDir: path.join(dirname, '.storybook') }),\n      ],\n      test: {\n        name: 'storybook',\n        fileParallelism: false,\n        maxWorkers: 1,\n        browser: { enabled: true, headless: true, provider: playwright({}), instances: [{ browser: 'chromium' }] },\n      },\n    }],\n  },\n});\n`, changes);
  newFile(root, '.storybook/plectrum.stories.ts', `import type { Meta, StoryObj } from '@storybook/angular-vite';\nimport { Button } from 'primeng/button';\nimport { expect, within } from 'storybook/test';\n\nconst meta: Meta<Button> = { title: 'Plectrum/Ready', component: Button, tags: ['autodocs'], args: { label: 'Plectrum ready' } };\nexport default meta;\nexport const Ready: StoryObj<Button> = {\n  play: async ({ canvasElement }) => {\n    await expect(within(canvasElement).getByRole('button', { name: 'Plectrum ready' })).toBeVisible();\n  },\n};\n`, changes);
  newFile(root, '.ai/README.md', `# Plectrum in this application\n\nRead \`rules/plectrum.md\` and the installed devkit's \`rules/consumer.md\` before generating or reviewing components. The installed package owns the versioned process, catalogue, schemas, skills and agent roles. Run \`plectrum update\` after a toolkit upgrade. Keep team-specific instructions in separate files.\n`, changes);
  newFile(root, '.ai/rules/plectrum.md', `# Application rules\n\nUse PrimeNG and Plectrum before creating a local component. Local development does not require Core approval. Put component SCSS in \`src/styles/06-components\`; use published \`--pds-*\` tokens and BEMIT names. A local component remains owned by this team; Core decides whether to integrate it into shared packages. Run the package's local checks and executable tests before delivery.\n`, changes);
  newFile(root, '.githooks/pre-commit', `#!/bin/sh\nset -e\nnpx --no-install plectrum tokens check --strict\n`, changes);
  newFile(root, 'src/test-setup.ts', `import 'zone.js/plugins/vitest-patch';\n`, changes);
}

function configureHook(root) {
  if (!fs.existsSync(projectPath(root, '.git'))) return;
  fs.chmodSync(projectPath(root, '.githooks/pre-commit'), 0o755);
  try {
    const existing = execFileSync('git', ['config', '--local', '--get', 'core.hooksPath'], { cwd: root, encoding: 'utf8' }).trim();
    if (existing && existing !== '.githooks') { console.warn(`Existing core.hooksPath (${existing}) preserved; add .githooks/pre-commit to that hook chain.`); return; }
  } catch { /* No configured hook path. */ }
  try { execFileSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], { cwd: root }); }
  catch { console.warn('Could not configure local Git hook path; run git config --local core.hooksPath .githooks.'); }
}

/** Idempotent project-owned postinstall target. CI verifies committed setup without writing. */
export function bootstrap(root, { ci = Boolean(process.env.CI) } = {}) {
  const pkgFile = projectPath(root, 'package.json');
  if (!fs.existsSync(pkgFile)) throw new Error('Missing package.json. Start from an application package manifest.');
  if (!fs.existsSync(projectPath(root, `${packageStyles}/assets/fonts/agenda/agenda-regular.woff2`))) throw new Error('Installed pds-styles package lacks Agenda assets. Upgrade to the runtime release that includes fonts before bootstrapping.');
  const pkg = readJson(pkgFile);
  const identity = pkg.plectrum;
  if (!identity?.team || !identity?.application) throw new Error('Set package.json plectrum.team and plectrum.application before npm install.');
  const repository = identity.repository ?? gitRepository(root);
  if (!repository) throw new Error('Set package.json plectrum.repository or a Git origin before npm install.');
  if (!ci) preflight(root);
  const configFile = projectPath(root, '.plectrum/config.json');
  if (ci && !fs.existsSync(configFile)) throw new Error('Plectrum setup is missing in CI; run npm install locally and commit the generated files.');
  if (!fs.existsSync(configFile)) initialize(root, ['--team', identity.team, '--application', identity.application, '--repository', repository, ...(identity.project ? ['--project', identity.project] : [])]);
  else if (!ci) update(root);
  const config = configAt(root);
  if (ci) {
    for (const layer of layers) if (!fs.existsSync(projectPath(root, `src/styles/${layer}/_index.scss`))) throw new Error(`Missing committed ITCSS layer: ${layer}`);
    for (const file of ['src/styles.scss', 'src/styles/main.scss', '.storybook/main.ts', '.storybook/preview.ts', '.storybook/tsconfig.json', 'vitest.config.mts']) if (!fs.existsSync(projectPath(root, file))) throw new Error(`Missing committed Plectrum setup: ${file}`);
    angularProject(root, config, [], true);
    console.log('Plectrum setup verified in CI; no source files changed.');
    return [];
  }
  const changes = [];
  for (const [index, layer] of layers.entries()) newFile(root, `src/styles/${layer}/_index.scss`, `// ${layer}: application extensions. Shared Plectrum styles stay in the installed package.\n`, changes);
  newFile(root, 'src/styles/main.scss', layers.flatMap((layer, i) => [`@use '${layer}/${barrels[i]}.core';`, `@use '${layer}' as *;`]).join('\n') + '\n', changes);
  newFile(root, 'src/styles.scss', "@use 'styles/main';\n", changes);
  instructions(root, changes);
  const project = angularProject(root, config, changes);
  configureHook(root);
  console.log(`Plectrum bootstrap for ${project}: ${changes.length} file(s) created or configured. Commit the generated setup. Run npm run pds:storybook, npm run pds:test:unit, npm run pds:test:stories and npm run pds:check:ci.`);
  return changes;
}
