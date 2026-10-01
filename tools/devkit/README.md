# Plectrum application devkit

`@solidaris-danielbodigil/pds-devkit` distributes the versioned catalogue, token inventory, schemas, process contract, application rules and the `plectrum` CLI. Use the [documentation of the release you install](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/latest/); `package.json` holds the source version.

Start a new Angular application from [`tools/consumers/starter`](../consumers/starter/README.md). Set its `package.json` `plectrum` identity, configure private-registry access, then run `npm install`. The starter declares all runtime and development dependencies and runs `plectrum bootstrap` from its own `postinstall`. This generates empty local ITCSS layers and an ordered SCSS entry, Angular/Storybook/test targets, Agenda asset mappings from `pds-styles`, `.ai` rules/skills/protocols/agents, editor adapters, a fast Git hook and a GitHub Actions job. The generated preview includes FR/NL locale and a v1 preset selector; deprecated v0.6 remains available for migration comparisons. The operation is idempotent; CI verifies committed setup without migrating files.

Useful commands in the application root:

```sh
npm run pds:storybook
npm run pds:build-storybook
npm run pds:test:unit
npm run pds:test:stories
npm run pds:check:ci
npm run pds:component -- --name local-card
```

`plectrum scaffold --name <slug>` creates a locally owned Angular component, story, unit test, metadata, evidence checklist and `src/styles/06-components/_components.<slug>.scss`; it registers the style in the local ITCSS index. Core approval is **not** needed to create or deliver a local component. Complete the scaffold's placeholders and tests before CI. The static `plectrum check --profile ci` checks contracts and files but does not execute unit tests, Storybook interactions or an Angular build.

To submit for shared intake, Core first merges `.ai/candidates/proposals/<application>-<slug>.json` with `decision: approved-candidate`. Then run `plectrum candidate-submit --name <slug> --proposal <application>-<slug> --preview <https-url> --checks <https-url>` from a committed revision. Submission rereads the central decision and opens a reviewed pull request; it does not publish a Core package. `candidate-export` is an offline draft, while adoption reporting is optional.

`plectrum update` refreshes managed files after a toolkit upgrade and reports conflicts instead of overwriting edited adapters. Team-specific instructions stay in separate files. The starter's `.npmrc` names GitHub Packages without credentials; developers and CI must supply authorized access. Its GitHub job is portable, but CI owners must map it to Solidaris branch protection, secrets and global checks. Browser installation (`npx playwright install chromium` locally; `--with-deps` in CI) remains required for unit and Storybook tests.
