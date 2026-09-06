// =============================================================================
// libs/ui/src/storybook/docs-stack.ts
// Published Plectrum version plus the PrimeNG / Angular majors this repo
// actually depends on. The hero eyebrow reads this so the stack cannot drift
// from package.json.
// =============================================================================

import angularPackage from '@angular/core/package.json';
import primengPackage from 'primeng/package.json';
import uiPackage from '../../package.json';

function major(specifier: string): string {
  const match = specifier.match(/\d+/);
  return match?.[0] ?? specifier;
}

export const PLECTRUM_VERSION = uiPackage.version;
export const PRIMENG_MAJOR = major(primengPackage.version);
export const ANGULAR_MAJOR = major(angularPackage.version);

/** Uppercased by `.c-docs-hero__eyebrow`. */
export function docsHeroEyebrow(): string {
  return `v${PLECTRUM_VERSION} · PrimeNG v${PRIMENG_MAJOR} · Angular ${ANGULAR_MAJOR}`;
}
