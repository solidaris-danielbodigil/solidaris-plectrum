# @solidaris/ui

Angular components for the Plectrum Design System. Published in Angular Package Format.

## Local vs published

In this monorepo, TypeScript path aliases resolve `@solidaris/ui` to `src/index.ts` so apps and Storybook keep using source (including `.metadata.ts` for docs/AI).

The published tarball is built with ng-packagr from `src/public-api.ts`. Install it from the registry (or an `npm pack` tarball) and import as usual:

```ts
import { FormFieldComponent } from '@solidaris/ui';
```

Pair with `@solidaris/plectrum` (`providePlectrum()`) and `@solidaris/styles` (global ITCSS). See `@solidaris/styles` for `stylePreprocessorOptions.includePaths`.
