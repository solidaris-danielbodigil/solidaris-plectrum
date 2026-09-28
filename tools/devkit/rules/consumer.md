<!-- Generated from process.json 1.4.0 by contracts:generate. Do not edit. -->
# Plectrum in an application repository

The installed `@solidaris-danielbodigil/pds-devkit` package owns the catalogue, schemas, process and shared role instructions. `.plectrum/config.json` owns this application's identity and paths. `plectrum update` regenerates editor adapters; keep team-specific notes in other files.

Never edit node_modules or assume libs/ui exists. Candidates live under `src/plectrum-candidates`; their styles under `src/styles/plectrum-candidates`.

## Build with Plectrum

1. **install** — team, in this repository. Needs: package read access, or packed tarballs for an unreleased revision. Produces: installed packages.
2. **initialize** — team, in this repository. Needs: installed toolkit; registered team and application. Produces: .plectrum/config.json; editor adapters; CI workflow. Commands: `plectrum init --team <id> --application <id> --repository <url>`, `plectrum catalogue [--id <component-id>]`, `plectrum doctor [--live]`.
3. **build** — team, in this repository. Needs: installed packages. Produces: themed screens from PrimeNG, Core components and --pds-* tokens.
4. **validate** — team, in this repository. Needs: initialized toolkit. Produces: passing CI profile. Commands: `plectrum tokens check [--strict]`, `plectrum check --profile ci`.
5. **adopt** — team, in this repository. Needs: published release. Produces: validated adoption JSON. Commands: `plectrum adoption-report [--output <path>]`, `plectrum adoption-submit [--dry-run]`.
6. **upgrade** — team, in this repository. Needs: published release. Produces: upgraded packages and regenerated adapters. Commands: `plectrum update`, `plectrum doctor [--live]`, `plectrum check --profile ci`.

## Contribute a component

1. **discover** — team, in this repository. Needs: installed packages and toolkit. Produces: gap proposal.
2. **approve** — core, in the central Plectrum repository. Needs: gap proposal. Produces: recorded decision and owner.
3. **implement** — team, in this repository. Needs: approved proposal; compatible toolkit. Produces: local candidate; stories; metadata; evidence. Commands: `plectrum init --team <id> --application <id> --repository <url>`, `plectrum scaffold --name <slug> --proposal <application>-<slug>`, `plectrum check --profile ci`.
4. **submit** — team, in this repository. Needs: checks passed. Produces: reviewed intake PR. Commands: `plectrum candidate-submit --name <slug> --proposal <application>-<slug> --preview <url> --checks <url> [--dry-run]`, `plectrum candidate-withdraw --id <application>-<slug> --reason <text> [--dry-run]`.
5. **integrate** — core, in the central Plectrum repository. Needs: accepted candidate. Produces: core metadata; package exports; changeset. Commands: `npm run contracts:generate`, `npm run contracts:check`, `npm run docs:check`, `npm run test:pipelines`.
6. **design-return** — designer, in the central Plectrum repository. Needs: accepted implementation; reviewed token proposal when new variables are needed. Produces: token mapping when applicable and Custom components node URL; design approval and branch merge; library publication; validated token return export when variables changed. Commands: `npm run tokens:propose`.
7. **release** — release, in the central Plectrum repository. Needs: CI passed; review approved. Produces: packages; contract snapshot; versioned docs; release manifest. Commands: `npm run pack:smoke`.
8. **adopt** — team, in this repository. Needs: published release. Produces: validated adoption JSON. Commands: `plectrum adoption-report [--output <path>]`, `plectrum adoption-submit [--dry-run]`.

## Proposal decisions

- `approved-candidate`: The requesting team is the recorded owner. The toolkit scaffolds and submits only under this decision. Next step: **implement**.
- `use-existing`: No candidate intake. The team uses the existing PrimeNG control, Core component or token.
- `app-specific`: No central candidate intake: the toolkit refuses to scaffold or submit under this decision.
- `rejected`: No candidate intake: the toolkit refuses to scaffold or submit under this decision.

## Commands

- `plectrum init --team <id> --application <id> --repository <url>` — Create .plectrum/config.json, editor adapters, MCP entries and the CI workflow.
- `plectrum update` — Regenerate managed adapters after a toolkit upgrade; report edited managed files as conflicts.
- `plectrum catalogue [--id <component-id>]` — List the installed offline catalogue, or print one component contract.
- `plectrum doctor [--live]` — Check package and toolkit compatibility, managed files and configured MCP endpoints.
- `plectrum validate --schema <schema> --file <relative.json>` — Validate a local JSON file against an installed exchange schema.
- `plectrum tokens check [--strict]` — Check --pds-* usage against the installed token inventory; --strict also rejects hex and px.
- `plectrum check --profile ci` — Run the CI profile: compatibility, strict tokens, source scan, managed adapters and candidates.
- `plectrum scaffold --name <slug> --proposal <application>-<slug>` — Create a local candidate after the central proposal record approves it.
- `plectrum candidate-export --name <slug> [--output <path>]` — Write a local candidate JSON draft without contacting the central repository.
- `plectrum candidate-submit --name <slug> --proposal <application>-<slug> --preview <url> --checks <url> [--dry-run]` — Open or revise the reviewed central intake pull request for the committed candidate.
- `plectrum candidate-withdraw --id <application>-<slug> --reason <text> [--dry-run]` — Open a central pull request that withdraws the submission; the ID stays reserved.
- `plectrum adoption-report [--output <path>]` — Write a local adoption draft of installed packages and detected component usage.
- `plectrum adoption-submit [--dry-run]` — Open a reviewed central pull request with the adoption report.

Candidate and adoption pull requests need GH_TOKEN or GITHUB_TOKEN. adoption-submit does nothing until reporting.enabled is true in .plectrum/config.json.

The package's `rules/central/` files describe the Plectrum checkout and are reference material. Their monorepo paths and commands do not apply to application repositories.
