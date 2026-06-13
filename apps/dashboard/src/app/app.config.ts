import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    // Plectrum dark tokens are incomplete — use PrimeNG Aura with `.dark` on <html> (see index.html).
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          // Align with providePlectrum: libs/styles reset (* { padding: 0 }) lives in @layer reset.
          cssLayer: {
            name: 'primeng',
            order: 'reset, primeng',
          },
        },
      },
    }),
  ],
};
