# @solidaris-danielbodigil/pds-ui

Angular components for the Plectrum Design System. Published in Angular Package Format.

## Local vs published

In this monorepo, TypeScript path aliases resolve `@solidaris-danielbodigil/pds-ui` to `src/index.ts` so apps and Storybook keep using source (including `.metadata.ts` for docs/AI).

The published tarball is built with ng-packagr from `src/public-api.ts`. Install it from the registry (or an `npm pack` tarball) and import as usual:

```ts
import { FormFieldComponent } from '@solidaris-danielbodigil/pds-ui';
```

Pair with `@solidaris-danielbodigil/pds-plectrum` (`providePlectrum()`) and `@solidaris-danielbodigil/pds-styles` (global ITCSS). See `@solidaris-danielbodigil/pds-styles` for `stylePreprocessorOptions.includePaths`.
