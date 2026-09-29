# Plectrum team toolkit

`@solidaris-danielbodigil/pds-devkit` contains a versioned offline catalogue with complete component metadata, token inventory, JSON schemas, process contract, rules and the `plectrum` CLI. The private package was first verified in release `2.0.2-devkit-0.2.0`; use the matching versioned Storybook for the version you install. The earlier `plectrum-devkit` package name was published publicly.

```sh
npx --no-install plectrum init --team my-team --application my-app --repository https://github.com/owner/my-app
npx --no-install plectrum catalogue
npx --no-install plectrum doctor
npx --no-install plectrum check --profile ci
```

`init` creates `.plectrum/config.json`, Cursor and VS Code/Copilot instructions and agent roles, plus a CI workflow. It adds PrimeNG MCP configuration; Figma and Storybook MCP URLs are opt-in in the config. `doctor --live` checks configured MCP initialization. Offline catalogue lookup always works without MCP. Invoke **Plectrum** by selecting the generated Plectrum agent in Cursor or the VS Code chat agent picker; in Cursor you can also use `/plectrum` if the agent is exposed as a slash command by your version.

Customize the identity, source/style/candidate paths and MCP URLs in `.plectrum/config.json`. Keep team notes in separate files. `plectrum update` refreshes generated adapters and reports edits to managed files as conflicts. It preserves existing unrelated MCP servers and editor files.

## What the application still needs

Start from an existing Angular application and use the [published installation guide](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/latest/?path=/docs/get-started-use-plectrum-in-an-app--docs). The runtime packages and compatible PrimeNG/theme peers are application dependencies; install this toolkit as a development dependency. `npm install` installs packages but does not bootstrap the application workspace with this version.

| Concern | Current behavior |
| --- | --- |
| SCSS and ITCSS | Shared source comes from `pds-styles`. Configure Sass, the global entry point and empty local ITCSS layers in the application. Put local component styles in `src/styles/06-components` and wire each import once, preserving layer order. |
| Storybook and tests | Configure application Storybook, providers, styles, assets and test runners separately. The generated story is not a configured server or an executed test. |
| Checks and CI | `plectrum check --profile ci` performs static package/configuration, token and candidate checks. It does not run an Angular build, unit tests, story interactions or accessibility tests. Add those jobs with the Solidaris CI owners. |
| Pre-commit | No hook is installed by this package. Connect the agreed fast checks to the application's hook and repeat required checks in CI. |
| AI instructions | Application roles and editor adapters are generated. Central rules, skills and protocols under `rules/central` are reference material; the full `.ai/` tree and Core agents are not copied into the application. |

The generated GitHub workflow needs private-registry authentication configured by the application. It also invokes adoption submission on pushes to `main`; reporting stays disabled by default. If enabled, configure `PLECTRUM_ADOPTION_TOKEN`. A generated workflow does not configure merge requirements or the organisation's full CI policy.

## Candidate workflow

The current scaffolder requires a merged Core approval. Independent local scaffolding and the complete application starter are [planned work](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/get-started-use-plectrum-in-an-app--docs#planned-onboarding), not shipped capabilities.

After the Core reviewer merges `.ai/candidates/proposals/<application>-<slug>.json` with `decision: approved-candidate`, run `plectrum scaffold --name slug --proposal <application>-<slug>`. The toolkit reads that merged decision from the central repository and creates a local Angular candidate, metadata JSON, Storybook story, style, decision copy and evidence checklist. `plectrum check --profile ci` verifies the proposal, installed package compatibility, managed adapters, tokens and metadata/API alignment. Commit the candidate and capture an HTTPS preview plus successful CI URL for that same commit. Then run `plectrum candidate-submit --name slug --proposal <application>-<slug> --preview <url> --checks <url>` with `GH_TOKEN` or `GITHUB_TOKEN`. It opens a reviewed intake PR, creating a fork when needed. Run it again after a new commit to revise the same ID. `plectrum candidate-withdraw --id <application>-<slug> --reason <text>` opens a withdrawal PR. `--dry-run` writes a local draft after live central checks without opening a PR. `plectrum candidate-export` and `plectrum adoption-report` write local drafts; `plectrum adoption-submit` opens a reviewed central PR when the application enables reporting.

The package exports `./catalogue`, `./tokens`, `./process`, `./compatibility`, `./registry` and `./schema/*.v1` for tools. Catalogue and doctor resolve a versioned Storybook link for a released runtime/toolkit pair and label an unreleased pair as a development preview.

`scaffold` writes styles under `paths.candidateStyles` (initially `src/styles/plectrum-candidates`). Set that path to the application's ITCSS component layer before scaffolding. It does not register the SCSS import or create a unit spec. Complete the evidence checklist with actual test results; a passing static check does not execute that evidence.
