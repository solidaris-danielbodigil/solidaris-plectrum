# @solidaris-danielbodigil/plectrum

PrimeNG theme presets (v1 default, v0.6 optional) and `providePlectrum()`.

## Local vs published

In this monorepo, TypeScript path aliases resolve `@solidaris-danielbodigil/plectrum` to `src/index.ts`. After publish (or `npm pack`), consumers resolve the Angular Package Format build from `node_modules`.

```ts
import { providePlectrum } from '@solidaris-danielbodigil/plectrum';

export const appConfig = {
  providers: [providePlectrum()],
};
```

`Plectrum_v1/` is the default. Do not configure PrimeNG theme directly in an app.
