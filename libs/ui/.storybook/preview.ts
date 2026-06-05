import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePlectrum } from '@solidaris/plectrum';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        providePlectrum(),
      ],
    }),
  ],
  parameters: {
    // Use the app's page background (--sds-color-surface-page = gray-50 = #f9f9f9)
    // so the shell's own surface/50 (#f6f6f6) background is clearly visible.
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app',   value: '#f9f9f9' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    layout: 'fullscreen',
  },
};

export default preview;
