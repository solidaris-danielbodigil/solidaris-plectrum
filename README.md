# Solidaris Plectrum

Plectrum is the Solidaris design system: Angular components, PrimeNG presets, shared SCSS and a contributor toolkit. This Angular CLI workspace also contains the iShare, iCRM, Dashboard and iGED applications. Those workspace applications are not a generated starter for a new team repository.

## Use Plectrum in an application

Start with [Build with Plectrum in the published documentation](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/latest/?path=/docs/get-started-use-plectrum-in-an-app--docs). Check its release banner and use the installation instructions for that release. The [development preview](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/) describes main; source versions alone do not prove publication.

| Package | Purpose |
| --- | --- |
| `@solidaris-danielbodigil/pds-ui` | Shared Angular components |
| `@solidaris-danielbodigil/pds-plectrum` | PrimeNG presets and `providePlectrum()` |
| `@solidaris-danielbodigil/pds-styles` | Shared ITCSS/SCSS source |
| `@solidaris-danielbodigil/pds-devkit` | Development CLI, offline catalogue, contracts, rules and editor adapters |

The packages are private on GitHub Packages; developers and application CI need read access. Install compatible Angular and PrimeNG peers as application dependencies. The current devkit does **not** bootstrap Angular, local SCSS/ITCSS folders, Storybook, test runners or a pre-commit hook. `plectrum init` creates toolkit configuration, editor adapters, MCP entries and a Plectrum checks workflow. Application build/tests and Solidaris CI integration still need setup.

The [detailed onboarding guide source](libs/ui/src/docs/get-started-consume.mdx) explains each step and its verification. The [application autonomy and devkit plan](docs/plan-autonomie-equipes-devkit-ci.md) describes the intended complete starter and the remaining implementation work.

## Work in the Plectrum repository

Use a Node version supported by [`package.json`](package.json), then:

```sh
git clone https://github.com/solidaris-danielbodigil/solidaris-plectrum.git
cd solidaris-plectrum
npm install
npm run storybook
```

Open [local Storybook](http://localhost:6006/). The start script regenerates contracts, changelog, candidate and adoption data before starting the catalogue. Lifecycle scripts install the central pre-commit hook when no unrelated hook already exists. These repository scripts are not installed into an application by the devkit.

| Command | Runs |
| --- | --- |
| `npm start` | iShare |
| `npm run start:icrm` | iCRM |
| `npm run start:dashboard` | Dashboard |
| `npm run start:iged` | iGED |
| `npm run docs:check` | Documentation consistency checks |
| `npm run check:commit` | Fast local docs, contract, token, style and generated-file gates |
| `npm test` | Configured UI, iShare and Plectrum unit suites |

The [maintainer guide](libs/ui/src/docs/maintainer-workflow.mdx) explains the full CI jobs, story tests, package checks and their limits. The [packaging guide](tools/packaging/README.md) covers publishing and isolated consumer verification.

## Repository layout

- `apps/`: workspace applications.
- `libs/ui/src/`: shared components, stories and MDX documentation.
- `libs/ui/.storybook/`: Storybook configuration and test integration.
- `libs/plectrum/`: presets, theme integration and token source.
- `libs/styles/src/`: shared ITCSS layers, settings, objects, components and utilities.
- `libs/assets/`: shared repository assets; some assets still require separate application setup.
- `tools/devkit/`: portable contributor toolkit.
- `tools/`: generators, token tooling, packaging and documentation checks.
- `.ai/`: central contracts, rules, protocols, skills and agents.

## Contribute

Read [Contribute](libs/ui/src/docs/get-started-contribute.mdx) and the [AI knowledge base](.ai/README.md). The current candidate scaffolder requires a merged Core proposal decision. Application-owned candidates remain in their repository until reviewed integration and a verified package release; see [component promotion](docs/component-promotion.md).
