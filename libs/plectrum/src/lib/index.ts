import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import PlectrumPreset from '../Plectrum_v0.6';

/**
 * SSOT provider for the Plectrum design system.
 * Use this in both apps — never configure PrimeNG theme directly in an app.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [providePlectrum()]
 * };
 */
export function providePlectrum(): EnvironmentProviders {
  return makeEnvironmentProviders([
    providePrimeNG({
      ripple: true,
      theme: {
        preset: PlectrumPreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            // reset < primeng < unlayered SDS styles
            order: 'reset, primeng',
          },
        },
      },
    }),
  ]);
}
