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
      const version = (context.globals['plectrumPreset'] ?? 'v0.6') as PlectrumPresetVersion;

      if (typeof localStorage !== 'undefined') {
        writeStoredPresetVersion(version, localStorage);
      }

      return applicationConfig({
        providers: [provideAnimationsAsync(), providePlectrum(version)],
      })(storyFn, context);
    },
  ],
  parameters: {
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
  },
};

export { PLECTRUM_PRESET_STORAGE_KEY };
export default preview;
