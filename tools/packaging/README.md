# Packaging

Publishable packages:

| Package | Build | Pack from |
|---|---|---|
| `@solidaris/plectrum` | `ng build plectrum` (APF) | `dist/libs/plectrum` |
| `@solidaris/ui` | `ng build ui` (APF) | `dist/libs/ui` |
| `@solidaris/styles` | none (SCSS source) | `libs/styles` |

## Scripts

- `npm run build:libs` — ng-packagr for plectrum then ui
- `npm run pack:libs` — build (as needed) and `npm pack` all three into `tools/packaging/.tarballs/`
- `npm run pack:smoke` — pack, install tarballs into a throwaway Angular app **outside this repo** (no path aliases), `ng build`
- `npm run storybook:packed` / `npm run build-storybook:packed` — remaps aliases to `dist/` and runs `ui:build-storybook`. Local `npm run storybook` stays on source.

## Local vs published resolution

Monorepo apps keep `tsconfig` paths (`libs/*/src/...`) and `includePaths: ['libs/styles/src']`. Do not point those apps at `dist/` or `node_modules/@solidaris/*`.

Published consumers resolve `@solidaris/ui` and `@solidaris/plectrum` from APF in `node_modules`, and SCSS from `node_modules/@solidaris/styles/src` (see that package README).
