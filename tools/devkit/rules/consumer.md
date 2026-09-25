# Plectrum in an application repository

The installed `@solidaris-danielbodigil/plectrum-devkit` package owns the catalogue, schemas, process and shared role instructions. `.plectrum/config.json` owns this application's identity and paths. `plectrum update` regenerates editor adapters; keep team-specific notes in other files.

1. Run `plectrum catalogue` and inspect PrimeNG and the Figma design before proposing a gap.
2. Open a proposal issue in the central Plectrum repository. Wait until the Core reviewer merges the `approved-candidate` proposal record naming your team as owner.
3. Run `plectrum scaffold --name <slug> --proposal <application>-<slug>` into the configured application paths. Never edit `node_modules` or assume `libs/ui` exists here.
4. Author metadata, stories, implementation and accessibility evidence together. Metadata owns usage advice, examples and design decisions.
5. Commit the candidate, run `plectrum check --profile ci` in CI, and publish a versioned preview of that same commit. Run `plectrum candidate-submit --name <slug> --proposal <application>-<slug> --preview <https-url> --checks <https-url>` with a GitHub token. Repeat after a new commit to revise; `plectrum candidate-withdraw --id <application>-<slug> --reason <text>` retires the submission. The central PR, not a local index.json, supplies catalogue data.
6. Run `plectrum adoption-report` for a local report draft. Central intake is not yet automated.

The package's `rules/central/` files describe the Plectrum checkout and are reference material. Their monorepo paths and commands do not apply to application repositories.
