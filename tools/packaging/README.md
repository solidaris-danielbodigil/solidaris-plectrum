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
- `npm run release:check && npm run release:prepare` — verify four packed archives and produce the Core contract snapshot plus archive integrity list in `dist/release/`
- `npm run release:test` — test immutable registry retry decisions

## Attended GitHub Packages release

After merging a version PR, wait for all six required CI jobs on that **main** commit. Confirm the `package-release` GitHub Actions environment is controlled by the receiving maintainers. Run **Publish verified Plectrum release** from `main` with `release_id` equal to `<runtime-version>-devkit-<toolkit-version>` (for example `2.0.1-devkit-0.2.0`). Do not run it on a feature branch or an older main commit.

The workflow checks CI and ownership, packs four exact archives, publishes each missing version to the private GitHub Packages registry, and accepts a retry only when the published integrity matches the local archive. It then installs all four versions in a clean app, builds it, runs the installed toolkit, and writes `contracts.json` and `release.json` with source SHA, versions, archive integrity, date and documentation URL. Finally it builds Storybook against packed libraries, attaches the immutable bundle and manifests to a GitHub Release, and requests a Pages deployment. `storybook/releases/<runtime>-devkit-<toolkit>/` is immutable; `storybook/latest/` advances only after a complete release bundle is verified during Pages assembly. The Storybook at `storybook/` remains a labelled development preview.

The workflow uses its repository `GITHUB_TOKEN` with `packages: write`; no PAT is stored in the repository. For a first publication, confirm all four packages appear as private and grant consumer repositories Actions read access to each package. Their `.npmrc` needs only the scope mapping; CI supplies its own token. Record the workflow run and Pages URL in the handoff after the attended first release.

If publication stops after one package, rerun the same release ID on the same source revision. Existing versions with identical integrity are skipped, while a different archive stops the run. If a draft GitHub Release exists, the run verifies and completes its assets; it never replaces a published asset. A published release with missing assets or mismatched provenance requires maintainer investigation. A failed Pages assembly leaves the prior deployed site and `latest` pointer intact. Do not unpublish an installed version; deprecate it and prepare a patch release instead.

## Local vs published resolution

Monorepo apps keep `tsconfig` paths (`libs/*/src/...`) and `includePaths: ['libs/styles/src']`. Do not point those apps at `dist/` or installed package paths.

Published consumers resolve `@solidaris-danielbodigil/ui` and `@solidaris-danielbodigil/plectrum` from APF in `node_modules`, and SCSS from `node_modules/@solidaris-danielbodigil/styles/src` (see that package README).
