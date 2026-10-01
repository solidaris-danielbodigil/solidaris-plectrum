# @solidaris-danielbodigil/pds-devkit

## 0.5.0

### Minor Changes

- 8deb3aa: Turn usage reporting on by default, and show its status in a generated `Plectrum/Setup` story and in `plectrum doctor`. New applications get `reporting.enabled: true`, and the generated CI workflow runs `plectrum adoption-submit` after each push to `main` with the `PLECTRUM_ADOPTION_TOKEN` secret. While the application is not in the Plectrum registry or no token is set, the submission is skipped with a GitHub Actions warning instead of failing the build. Existing `.plectrum/config.json` files keep their current value; set `reporting.enabled` to `false` to opt out.

## 0.4.1

### Patch Changes

- a00b0ca: Mark the v0.6 preset as deprecated while retaining it for migration comparisons. Ship Agenda font files in `pds-styles` and generate FR/NL and preset controls in application Storybook previews. Remove the test-only SCSS component.

## 0.3.2

### Patch Changes

- 1d24002: Describe the design-origin component route and the distinct PrimeNG 21 token and Custom components Figma files in the installed process and registry snapshots.

## 0.3.1

### Patch Changes

- 4424c08: Mark Profile Card as deprecated in the distributed catalogue and link its proposed Profile header design. The existing Angular export remains available; no replacement component is published yet.

## 0.3.0

### Minor Changes

- d4cbb3d: Render `plectrum help`, the generated agent roles, baseline instructions and `rules/consumer.md` from the installed process contract (1.3.0), which now carries command summaries, the onboarding journey, proposal outcomes and routes. `self-check` fails when the CLI and the contract disagree on available commands. Catalogue and doctor link each component to the versioned Storybook of the installed runtime and toolkit pair instead of the development preview. Ships `schema/process.v1.schema.json`.

## 0.2.1

### Patch Changes

- 52a9aea: Update the distributed registry snapshot after the verified private GitHub Packages release.
