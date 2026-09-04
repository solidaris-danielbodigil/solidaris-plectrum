# @solidaris/plectrum

PrimeNG theme presets (v0.6 default, v1 optional) and `providePlectrum()`.

## Local vs published

In this monorepo, TypeScript path aliases resolve `@solidaris/plectrum` to `src/index.ts`. After publish (or `npm pack`), consumers resolve the Angular Package Format build from `node_modules`.

```ts
import { providePlectrum } from '@solidaris/plectrum';

export const appConfig = {
  providers: [providePlectrum()],
};
```

`Plectrum_v0.6/` stays the default. Do not configure PrimeNG theme directly in an app.
