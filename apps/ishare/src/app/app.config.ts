import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { providePlectrum } from '@solidaris/plectrum';
import { IconRegistry, registerPlectrumIcons, TESTING_TELEMETRY_ENABLED } from '@solidaris/ui';
import { routes } from './app.routes';
import { registerIshareIcons } from './ishare.icons';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePlectrum(),
    { provide: TESTING_TELEMETRY_ENABLED, useValue: environment.enableTestingTelemetry },
    MessageService,
    provideAppInitializer(() => {
      const iconRegistry = inject(IconRegistry);
      registerIshareIcons(iconRegistry);
      registerPlectrumIcons(iconRegistry);
    }),
  ],
};