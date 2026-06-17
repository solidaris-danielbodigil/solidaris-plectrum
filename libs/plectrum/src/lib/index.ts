import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import PlectrumPresetV06 from '../Plectrum_v0.6';
import PlectrumPresetV1 from '../Plectrum_v1';
import { resolvePresetVersion, type PlectrumPresetVersion } from './preset-storage';

export type { PlectrumPresetVersion } from './preset-storage';
export {
  PLECTRUM_PRESET_STORAGE_KEY,
  readStoredPresetVersion,
  resolvePresetVersion,
  toggleStoredPresetVersion,
  writeStoredPresetVersion,
} from './preset-storage';
export { PlectrumPresetMenuService } from './plectrum-preset-menu.service';

/**
 * SSOT provider for the Plectrum design system.
 * Use this in both apps — never configure PrimeNG theme directly in an app.
 *
 * @param version — Explicit preset version. When omitted, reads
 *   `solidaris-plectrum-preset` from localStorage (default `v1`).
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [providePlectrum()]
 * };
 */
export function providePlectrum(
  version?: PlectrumPresetVersion,
): EnvironmentProviders {
  const resolved = resolvePresetVersion(version);
  const preset = resolved === 'v1' ? PlectrumPresetV1 : PlectrumPresetV06;

  return makeEnvironmentProviders([
    providePrimeNG({
      ripple: true,
      theme: {
        preset,
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
