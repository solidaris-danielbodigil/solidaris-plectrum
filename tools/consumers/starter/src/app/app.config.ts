import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePlectrum } from '@solidaris-danielbodigil/pds-plectrum';
import { IconRegistry, registerPlectrumIcons } from '@solidaris-danielbodigil/pds-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePlectrum(),
    provideAppInitializer(() => registerPlectrumIcons(inject(IconRegistry))),
  ],
};
