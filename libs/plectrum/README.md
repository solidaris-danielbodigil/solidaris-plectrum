# @solidaris-danielbodigil/pds-plectrum

PrimeNG theme presets (v1 default, v0.6 optional) and `providePlectrum()`.

## Local vs published

In this monorepo, TypeScript path aliases resolve `@solidaris-danielbodigil/pds-plectrum` to `src/index.ts`. After publish (or `npm pack`), consumers resolve the Angular Package Format build from `node_modules`.

```ts
import { providePlectrum } from '@solidaris-danielbodigil/pds-plectrum';

export const appConfig = {
  providers: [providePlectrum()],
};
```

`Plectrum_v1/` is the default. Do not configure PrimeNG theme directly in an app.

PrimeNG and `@primeuix/themes` are compatible peer dependencies of the runtime packages; the devkit does not bundle or configure them. Follow the [published installation guide](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/latest/?path=/docs/get-started-use-plectrum-in-an-app--docs) for registry access, exact versions, provider setup and shared SCSS. Use the same theme providers in the application and its separately configured local Storybook.
