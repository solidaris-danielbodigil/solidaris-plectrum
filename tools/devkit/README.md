# Plectrum team toolkit

`@solidaris-danielbodigil/plectrum-devkit` contains a versioned offline catalogue with complete component metadata, token inventory, JSON schemas, process contract, rules and the `plectrum` CLI. This package is locally packable; registry publication remains disabled until the release pipeline is completed.

```sh
npx --no-install plectrum init --team my-team --application my-app --repository https://github.com/owner/my-app
npx --no-install plectrum catalogue
npx --no-install plectrum doctor
npx --no-install plectrum check --profile ci
```

`init` creates `.plectrum/config.json`, Cursor and VS Code/Copilot instructions and agent roles, plus a CI workflow. It adds PrimeNG MCP configuration; Figma and Storybook MCP URLs are opt-in in the config. `doctor --live` checks configured MCP initialization. Offline catalogue lookup always works without MCP. Invoke **Plectrum** by selecting the generated Plectrum agent in Cursor or the VS Code chat agent picker; in Cursor you can also use `/plectrum` if the agent is exposed as a slash command by your version.

Customize the identity, source/style/candidate paths and MCP URLs in `.plectrum/config.json`. Keep team notes in separate files. `plectrum update` refreshes generated adapters and reports edits to managed files as conflicts. It preserves existing unrelated MCP servers and editor files.

After the Core reviewer merges `.ai/candidates/proposals/<application>-<slug>.json` with `decision: approved-candidate`, run `plectrum scaffold --name slug --proposal <application>-<slug>`. The toolkit reads that merged decision from the central repository and creates a local Angular candidate, metadata JSON, Storybook story, style, decision copy and evidence checklist. `plectrum check --profile ci` verifies the proposal, installed package compatibility, managed adapters, tokens and metadata/API alignment. Commit the candidate and capture an HTTPS preview plus successful CI URL for that same commit. Then run `plectrum candidate-submit --name slug --proposal <application>-<slug> --preview <url> --checks <url>` with `GH_TOKEN` or `GITHUB_TOKEN`. It opens a reviewed intake PR, creating a fork when needed. Run it again after a new commit to revise the same ID. `plectrum candidate-withdraw --id <application>-<slug> --reason <text>` opens a withdrawal PR. `--dry-run` writes a local draft after live central checks without opening a PR. `plectrum candidate-export` remains a local draft; `plectrum adoption-report` remains local until P4.

The package exports `./catalogue`, `./tokens`, `./process`, `./compatibility`, `./registry` and `./schema/*.v1` for tools. Catalogue documentation links point to the development preview and include a template for the future versioned release route. They are not claims of an already published immutable Storybook.
