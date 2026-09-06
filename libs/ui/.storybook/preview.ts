import {
  createComponent,
  EnvironmentInjector,
  inject,
  provideAppInitializer,
} from '@angular/core';
import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Button } from 'primeng/button';
import {
  DEFAULT_PLECTRUM_PRESET_VERSION,
  PLECTRUM_PRESET_STORAGE_KEY,
  providePlectrum,
  readStoredPresetVersion,
  writeStoredPresetVersion,
  type PlectrumPresetVersion,
} from '@solidaris/plectrum';
import { IconRegistry, registerPlectrumIcons } from '../src/lib/icon';
import { installStorybookToastListener } from '../src/storybook/storybook-toast';
import { PlectrumDocsContainer } from './docs-container';
import { DocsAnchor } from './docs-link';

installStorybookToastListener();

function readInitialPreset(): PlectrumPresetVersion {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_PLECTRUM_PRESET_VERSION;
  }

  return (
    readStoredPresetVersion(localStorage) ?? DEFAULT_PLECTRUM_PRESET_VERSION
  );
}

const preview: Preview = {
  globalTypes: {
    plectrumPreset: {
      description: 'Plectrum PrimeNG preset version',
      toolbar: {
        title: 'Plectrum',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'v1', title: 'Plectrum v1' },
          { value: 'v0.6', title: 'Plectrum v0.6' },
        ],
      },
    },
  },
  initialGlobals: {
    plectrumPreset: readInitialPreset(),
  },
  decorators: [
    (storyFn, context) => {
      const version = (context.globals['plectrumPreset'] ??
        DEFAULT_PLECTRUM_PRESET_VERSION) as PlectrumPresetVersion;

      if (typeof localStorage !== 'undefined') {
        writeStoredPresetVersion(version, localStorage);
      }

      return applicationConfig({
        providers: [
          provideAnimationsAsync(),
          providePlectrum(version),
          provideAppInitializer(() => {
            registerPlectrumIcons(inject(IconRegistry));
            // PrimeNG injects .p-button CSS on first Button create. MDX anchors
            // only wear those classes — mount a detached link button so prose
            // links match pds-docs-link on pages that have not rendered one yet.
            const button = createComponent(Button, {
              environmentInjector: inject(EnvironmentInjector),
            });
            button.instance.link = true;
            button.changeDetectorRef.detectChanges();
          }),
        ],
      })(storyFn, context);
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'Get started',
          ['Use Plectrum in an app', 'Contribute'],
          'Docs',
          [
            'Writing stories',
            'CSS architecture',
            'Token pipeline',
            'PrimeNG customizations',
            'Releases and versioning',
            'AI strategy',
          ],
          'Foundations',
          ['Token finder'],
          // Core catalogue first; app-owned (status app / candidate) work sits
          // under Patterns/{App}.
          'Custom components',
          'Shell',
          'Patterns',
          ['iSHARE'],
        ],
      },
    },
    // Use the app's page background (--pds-color-surface-page = gray-50 = #f9f9f9)
    // so the shell's own surface/50 (#f6f6f6) background is clearly visible.
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#f9f9f9' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    layout: 'fullscreen',
    // addon-a11y × test-runner: WCAG 2.1 AA per story (rules/06-accessibility.md).
    // 'todo' = non-blocking report in the test run and the a11y panel.
    // Flip to 'error' once the existing violations are fixed to gate CI.
    a11y: {
      test: 'todo',
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
    docs: {
      container: PlectrumDocsContainer,
      components: { a: DocsAnchor },
      toc: {
        headingSelector: 'h2, h3',
        title: 'On this page',
      },
    },
  },
};

export { PLECTRUM_PRESET_STORAGE_KEY };
export default preview;
