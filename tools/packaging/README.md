# Packaging

Publishable packages:

| Package | Build | Pack from |
|---|---|---|
| `@solidaris-danielbodigil/plectrum` | `ng build plectrum` (APF) | `dist/libs/plectrum` |
| `@solidaris-danielbodigil/ui` | `ng build ui` (APF) | `dist/libs/ui` |
| `@solidaris-danielbodigil/styles` | none (SCSS source) | `libs/styles` |
| `@solidaris-danielbodigil/plectrum-devkit` | portable CLI and contracts | `tools/devkit` |

## Scripts

- `npm run build:libs` — ng-packagr for plectrum then ui
- `npm run pack:libs` — build (as needed) and `npm pack` all four into `tools/packaging/.tarballs/`
- `npm run pack:smoke` — pack, install tarballs into a throwaway Angular app **outside this repo** (no path aliases), `ng build`
- `npm run storybook:packed` / `npm run build-storybook:packed` — remaps aliases to `dist/` and runs `ui:build-storybook`. Local `npm run storybook` stays on source.

## Local vs published resolution

Monorepo apps keep `tsconfig` paths (`libs/*/src/...`) and `includePaths: ['libs/styles/src']`. Do not point those apps at `dist/` or installed package paths.

Published consumers resolve `@solidaris-danielbodigil/ui` and `@solidaris-danielbodigil/plectrum` from APF in `node_modules`, and SCSS from `node_modules/@solidaris-danielbodigil/styles/src` (see that package README).
