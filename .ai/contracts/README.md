# Plectrum contracts

## Authoring and generation

| Input | Owns |
| --- | --- |
| Colocated `*.metadata.ts` | Stable identity, governance, distribution and all component documentation facts |
| `registry.json` | Teams, applications, repositories and operational handoff settings |
| `workspace.json` | Workspace/token configuration and runtime helper exports |
| `process.json` | Versioned commands, check profiles, repository contexts, steps and candidate transitions |
| `compatibility.json` | Separately versioned toolkit and supported DS/schema/process ranges |
| `schema/*.schema.ts` | Canonical structural validation; inferred TypeScript types and generated JSON Schema |

Run these commands **from a Plectrum checkout**:

```sh
npm run pds:component -- --name=example-card --owner=design-system
npm run contracts:generate
npm run contracts:check
npm run docs:check
npm run test:pipelines
```

The scaffold creates unfinished metadata. Complete its TODOs, design and tests before review; `contracts:check` rejects metadata placeholders. An unknown owner or an existing name/ID fails before writing. Add a team/application to `registry.json` once; the generator and Storybook read its labels and choices.

`contracts:generate` produces the metadata registry, runtime barrels, secondary entry configurations, Storybook candidate stylesheet, JSON Schemas, central `index.json` and the portable devkit snapshot. `-- --check` reports drift without rewriting. Commit generated artifacts with their inputs. Do not register a component by hand or export a candidate through a runtime helper barrel.

## Three different indexes

1. `index.json` is the central **source inventory**, keyed by immutable component ID. It includes local source observations; those are not external adoption telemetry.
2. A released contract snapshot is immutable, versioned JSON described by `contracts.v1.schema.json`. Its package version, source revision and docs URL must match the release. Publication is implemented in P7.
3. Storybook's runtime `index.json` provides build-specific docs/story IDs. The generated metadata-source map joins component IDs to the exact MDX source path, including CSS patterns.

Application-local inventories complement the installed snapshot. Teams do not push their whole index over the central index.

## Data exchanged with external repositories

```sh
npm run contracts:validate -- candidate candidate.json
npm run contracts:validate -- adoption adoption.json
npm run contracts:validate -- contracts release-contracts.json
npm run contracts:validate -- release release-manifest.json
```

The CLI parses JSON and validates both its versioned schema and cross-field rules. It never executes a contributed TypeScript module. Schemas live in `schema/json/`; the executable external-team example is in `tools/contracts/contracts.spec.ts`.

Candidate records identify the team/application, immutable component ID, origin repository/revision, metadata and evidence-backed history. `process.json` specifies each transition's responsible role and required evidence. Intake must independently authenticate that actor and authorize the role in P3.

Adoption reports identify the registered app/team, installed package versions, source revision, observation date, reporter version, stable component IDs, evidence kind and known limitations. Validation is available; automated ingestion and freshness aggregation remain P4.

## Distribution and compatibility

Core Angular components export from the main entry. CSS patterns belong to the styles package. Candidates use local distribution: their Angular code is absent from runtime exports and their styles are outside the styles package allowlist. App patterns may use an explicit team secondary entry; iSHARE now uses `@solidaris-danielbodigil/ui/patterns/ishare`.

`@solidaris-danielbodigil/plectrum-devkit@0.1.0` is packable and versioned independently. Its exports include full metadata, schemas, token inventory, process, registry and compatibility; `plectrum init` installs editor adapters into an application repository. Its current docs links target the Storybook development preview. P7 will publish an immutable snapshot per runtime release and a manifest containing its checksum and verified compatibility. Current `@solidaris/contracts` remains a workspace type alias for the Plectrum checkout. The toolkit's `verified` compatibility status means its **local tarball** passed an external-consumer smoke test; it is not a registry publication claim. `@solidaris/tokens-cli` is now private and internal; consumer token checks live in the toolkit.

See the [accepted identity and migration decision](../decisions/2026-09-25-pipeline-contracts-and-distribution.md). Storybook → **Docs / Pipelines and contracts** renders current process and operational configuration directly from these sources.
