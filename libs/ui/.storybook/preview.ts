import { inject, provideAppInitializer } from '@angular/core';
import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PLECTRUM_PRESET_STORAGE_KEY,
  providePlectrum,
  readStoredPresetVersion,
  writeStoredPresetVersion,
  type PlectrumPresetVersion,
} from '@solidaris/plectrum';
import { IconRegistry, registerPlectrumIcons } from '../src/lib/icon';
import { installStorybookToastListener } from '../src/storybook/storybook-toast';

installStorybookToastListener();

function readInitialPreset(): PlectrumPresetVersion {
  if (typeof localStorage === 'undefined') {
    return 'v0.6';
  }

  return readStoredPresetVersion(localStorage) ?? 'v0.6';
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
          { value: 'v0.6', title: 'Plectrum v0.6' },
          { value: 'v1', title: 'Plectrum v1' },
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
        'v0.6') as PlectrumPresetVersion;

      if (typeof localStorage !== 'undefined') {
        writeStoredPresetVersion(version, localStorage);
      }

      return applicationConfig({
        providers: [
          provideAnimationsAsync(),
          providePlectrum(version),
          provideAppInitializer(() => {
            registerPlectrumIcons(inject(IconRegistry));
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
            'Troubleshooting',
            'AI strategy',
          ],
          'Foundations',
          ['Token finder'],
          'Patterns',
          'Custom components',
          'Shell',
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
    },
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'On this page',
      },
    },
  },
};

export { PLECTRUM_PRESET_STORAGE_KEY };
export default preview;
