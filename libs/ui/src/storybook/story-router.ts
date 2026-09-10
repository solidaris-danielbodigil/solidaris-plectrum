// =============================================================================
// libs/ui/src/storybook/story-router.ts
// Router providers for stories whose templates carry routerLink.
//
// Storybook's iframe.html ships `<base target="_parent">` with no href, so
// Angular's PathLocationStrategy falls back to `location.origin` as base href.
// With a real Location the router's first unmatched navigation restores the
// URL with replaceState('/') — which rewrites the iframe URL to the host root.
// The static GitHub Pages build loads chunks with a relative publicPath, so
// the next lazily loaded page is then requested from https://host/<chunk>.js
// instead of /solidaris-plectrum/storybook/<chunk>.js and fails to load.
//
// MockLocationStrategy keeps the router URL in memory: routerLink hosts still
// render hrefs and react to clicks, but the iframe document keeps its own URL.
// =============================================================================

import { LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';
import type { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter, type Routes } from '@angular/router';

/**
 * Router for stories. Every path resolves (wildcard, componentless), so
 * clicking a sample routerLink never raises "Cannot match any routes", and
 * the browser URL is never touched.
 */
export function provideStoryRouter(
  routes: Routes = [],
): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter([...routes, { path: '**', children: [] }]),
    { provide: LocationStrategy, useClass: MockLocationStrategy },
  ];
}
