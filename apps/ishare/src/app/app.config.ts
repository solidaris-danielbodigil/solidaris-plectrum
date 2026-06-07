import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { providePlectrum } from '@solidaris/plectrum';
import { IconRegistry, registerPlectrumIcons } from '@solidaris/ui';
import { routes } from './app.routes';
import { registerIshareIcons } from './ishare.icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePlectrum(),
    MessageService,
    provideAppInitializer(() => {
      const iconRegistry = inject(IconRegistry);
      registerIshareIcons(iconRegistry);
      registerPlectrumIcons(iconRegistry);
    }),
  ],
};