# @solidaris-danielbodigil/pds-plectrum

PrimeNG theme preset v1 and `providePlectrum()`. Preset v0.6 is deprecated: it remains available to compare existing screens during migration, but new applications should use v1.

## Local vs published

In this monorepo, TypeScript path aliases resolve `@solidaris-danielbodigil/pds-plectrum` to `src/index.ts`. After publish (or `npm pack`), consumers resolve the Angular Package Format build from `node_modules`.

```ts
import { providePlectrum } from '@solidaris-danielbodigil/pds-plectrum';

export const appConfig = {
  providers: [providePlectrum()],
};
```

`Plectrum_v1/` is the default. Do not configure PrimeNG theme directly in an app.

PrimeNG and `@primeuix/themes` are compatible peer dependencies of the runtime packages; the application starter declares them. Follow the [published installation guide](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/latest/?path=/docs/get-started-use-plectrum-in-an-app--docs) for registry access, exact versions, provider setup and shared SCSS. The devkit bootstrap generates a local Storybook preview that applies the selected preset and FR/NL locale through the published providers.
