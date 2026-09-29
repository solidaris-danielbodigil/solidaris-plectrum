# @solidaris-danielbodigil/pds-ui

Angular components for the Plectrum Design System. Published in Angular Package Format.

## Local vs published

In this monorepo, TypeScript path aliases resolve `@solidaris-danielbodigil/pds-ui` to `src/index.ts` so apps and Storybook keep using source (including `.metadata.ts` for docs/AI).

The published tarball is built with ng-packagr from `src/public-api.ts`. Install it from the registry (or an `npm pack` tarball) and import as usual:

```ts
import { FormFieldComponent } from '@solidaris-danielbodigil/pds-ui';
```

Pair with `@solidaris-danielbodigil/pds-plectrum` (`providePlectrum()`) and `@solidaris-danielbodigil/pds-styles` (global ITCSS). See `@solidaris-danielbodigil/pds-styles` for `stylePreprocessorOptions.includePaths`.

For private-registry access, exact published versions and compatible Angular/PrimeNG peers, follow [Build with Plectrum](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/latest/?path=/docs/get-started-use-plectrum-in-an-app--docs). The UI package does not ship this repository's Storybook, MDX helpers or test suite. Install the devkit separately as development tooling, then configure the application's local Storybook, tests and CI as described in the guide.
