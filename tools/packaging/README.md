# Packaging

Publishable packages:

| Package | Build | Pack from |
|---|---|---|
| `@solidaris-danielbodigil/pds-plectrum` | `ng build plectrum` (APF) | `dist/libs/plectrum` |
| `@solidaris-danielbodigil/pds-ui` | `ng build ui` (APF) | `dist/libs/ui` |
| `@solidaris-danielbodigil/pds-styles` | none (SCSS source) | `libs/styles` |
| `@solidaris-danielbodigil/pds-devkit` | portable CLI and contracts | `tools/devkit` |

## Scripts

- `npm run build:libs` — ng-packagr for plectrum then ui
- `npm run pack:libs` — build (as needed) and `npm pack` all four into `tools/packaging/.tarballs/`
- `npm run pack:smoke` — pack, install tarballs into a throwaway Angular app **outside this repo** (no path aliases), `ng build`
- `npm run storybook:packed` / `npm run build-storybook:packed` — remaps aliases to `dist/` and runs `ui:build-storybook`. Local `npm run storybook` stays on source.
- `npm run release:check && npm run release:prepare` — verify four packed archives and produce the Core contract snapshot plus archive integrity list in `dist/release/`
- `npm run release:test` — test immutable registry retry decisions

## Attended GitHub Packages release

The first release (`2.0.1-devkit-0.2.0`) used the old package names and is **public**. The `pds-*` identities under the personal account were verified **private** in the attended `2.0.2-devkit-0.2.0` release. The latest verified release recorded in the [handoff](../../docs/handoff/maintainer-pack.md) is `2.0.2-devkit-0.2.1`. A merged version PR only updates manifests; publish a new version through the protected workflow after its exact `main` commit passes CI.

Create a **classic personal access token** as `@solidaris-danielbodigil` with `write:packages` (GitHub includes package read access with that scope). Add it as the `PLECTRUM_PACKAGE_PUBLISH_TOKEN` secret in the repository's `package-release` environment. Keep it out of the repository and chat. The preflight checks the write scope and makes an authenticated package-list request to prove effective read access. The repository `GITHUB_TOKEN` remains for CI and GitHub Release APIs; it does not publish the new packages. Grant consumer repositories read access to each private package after publication.

After merging the version PR, wait for all six required CI jobs on that **main** commit. Confirm the `package-release` GitHub Actions environment still requires an independent maintainer's approval. Run **Publish verified Plectrum release** from `main` with `release_id` equal to `<runtime-version>-devkit-<toolkit-version>` using the versions in the merged package manifests. Do not run it on a feature branch or an older main commit. The workflow rejects a release tag already assigned to another source revision before publishing packages.

The workflow checks CI, package-token identity and ownership, packs four exact archives, publishes each missing version, and accepts a retry only when the published integrity matches the local archive. It reads GitHub's **actual package visibility after each publish** and stops before the next package unless it is private. It then installs all four versions in a clean app, builds it, runs the installed toolkit, and writes `contracts.json` and `release.json` with source SHA, versions, archive integrity, date and documentation URL. Finally it builds Storybook against packed libraries, attaches the immutable bundle and manifests to a GitHub Release, and requests a Pages deployment. `storybook/releases/<runtime>-devkit-<toolkit>/` is immutable; `storybook/latest/` advances only after a complete release bundle is verified during Pages assembly. The Storybook at `storybook/` remains a labelled development preview.

After the attended run, check that all four `pds-*` package pages show **Private**, and record the run, manifest and Pages URL in the handoff. A private package can still be linked to the public source repository; its visibility must be verified separately. Consumer `.npmrc` needs only the scope mapping; each consumer supplies an authorized token. If the first new package appears public, stop: GitHub does not allow changing an already public package to private, so choose another unused name before any further publication.

If publication stops after one package, rerun the same release ID on the same source revision. Existing versions with identical integrity are skipped, while a different archive stops the run. If a draft GitHub Release exists, the run verifies and completes its assets; it never replaces a published asset. A published release with missing assets or mismatched provenance requires maintainer investigation. A failed Pages assembly leaves the prior deployed site and `latest` pointer intact. Do not unpublish an installed version; deprecate it and prepare a patch release instead.

## Local vs published resolution

Monorepo apps keep `tsconfig` paths (`libs/*/src/...`) and `includePaths: ['libs/styles/src']`. Do not point those apps at `dist/` or installed package paths.

Published consumers resolve `@solidaris-danielbodigil/pds-ui` and `@solidaris-danielbodigil/pds-plectrum` from APF in `node_modules`, and SCSS from `node_modules/@solidaris-danielbodigil/pds-styles/src` (see that package README).
