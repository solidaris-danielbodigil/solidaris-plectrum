import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePlectrum } from '@solidaris/plectrum';
import {
  IconRegistry,
  registerAppLogos,
  registerPlectrumIcons,
} from '@solidaris/ui';
import { routes } from './app.routes';
import { readIgedPagesRedirect } from './pages-redirect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePlectrum(),
    provideAppInitializer(() => {
      const iconRegistry = inject(IconRegistry);
      registerAppLogos(iconRegistry);
      registerPlectrumIcons(iconRegistry);
      const redirect = readIgedPagesRedirect();
      if (redirect && redirect !== '/') {
        void inject(Router).navigateByUrl(redirect);
      }
    }),
  ],
};
