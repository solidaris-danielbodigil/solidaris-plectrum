# Pipeline identities, contracts and package boundaries

Status: accepted for P0/P1. Distribution and external ingestion remain P2–P7 work.

## Identity and sources

- `component.id` is assigned once (`namespace:local-id`). A rename changes the display name, source paths and generated docs mapping, never the ID. A promoted candidate keeps its original ID, including its original namespace. Do not derive an existing ID again from a new owner or folder.
- A replacement receives a new ID. Keep the old entry deprecated with a note and `governance.replacementId`. Do not recycle removed IDs. Incompatible schema changes increment `schemaVersion`; readers reject unknown versions.
- Colocated metadata owns documentation facts, governance and distribution. `schema/component.schema.ts` is the canonical structural schema; TypeScript types and versioned JSON Schemas derive from it.
- `registry.json` owns team/application identities and operational configuration. Register a new team here once. Application repositories can be external; only entries marked `local-demo` are scanned from this checkout.
- `workspace.json` owns hand-authored workspace/token configuration and helper exports. Generated `index.json` is never an input to its own generation.
- `process.json` owns commands, contexts, check profiles, workflow steps and transitions. Storybook's **Pipelines and contracts** page renders it. Unavailable consumer commands remain explicit instead of presenting unimplemented CLI commands.

## Inventories and evidence

The central index is a source inventory, keyed by component ID. It includes Angular components and CSS patterns, package coordinates and metadata/MDX source locations. Storybook's runtime index supplies the actual docs IDs, matched by complete MDX source path. Names and implementation folders are not navigation keys.

Relationships describe named TypeScript imports, including aliases. They omit CSS composition, dynamic imports and template-only dependencies. Local adoption describes source references, including possible comments or unused imports, not measured runtime usage. External adoption reports and their freshness are implemented in P4. The source inventory has no claim to be a published snapshot.

External records must be JSON validated with `contracts:validate`, never executable metadata modules. Candidate progress is distinct from governance: the review history records role, actor, revision-linked evidence and each allowed transition. These validations check data consistency; authentication and reviewer authorization belong to intake in P3. A self-declared role is not approval.

## Package policy and migration

| Governance | Distribution |
| --- | --- |
| Core | Main Angular entry point, or styles package for CSS |
| Candidate | Local only; no runtime package export |
| App | Local, or explicit `./patterns/<owner>` secondary entry |
| Deprecated | Keep its existing entry until the reviewed removal release |

Candidate styles live under `libs/styles/candidates/06-components`, outside the styles package file allowlist. A generated Storybook-only stylesheet loads them for preview; the Core stylesheet never imports them. On promotion, move the SCSS into `src/06-components`, update the metadata path and add its Core forward.

`DelayPredictionCardComponent` and `TransactionsCicsModalComponent` move from `@solidaris/ui` to `@solidaris/ui/patterns/ishare`. This removes existing root exports and requires a **major release**. The associated changeset records it; package versions have not been advanced. Metadata is available through the contract distribution, not the Angular runtime barrel. Existing monorepo consumers are migrated in the same change.

Secondary entry files live alongside the main entry under `libs/ui/src`; their `ng-package.json` lives under `patterns/<owner>`. This gives ng-packagr a shared source root without re-exporting the pattern from Core.

## Compatibility and handoff

Choose a separately versioned devkit. P2 will distribute schemas, rules and process definitions through its documented `contracts` subpath; each runtime release has an immutable JSON snapshot referenced by checksum from its release manifest. `@solidaris/contracts` currently remains a workspace type alias, not a published package. `compatibility.json` records the initial **planned**, unverified toolkit/DS/schema/process ranges. Release manifests require verified compatibility and matching snapshot versions.

Prepare private GitHub Packages under the personal account recorded in `registry.json`. Current source package names remain `@solidaris/*` until the coordinated scope migration and publication checks in P7. Do not install the future scope before that release exists. GitHub reviewer handles and Figma identities still need owner confirmation; publication and external ingestion remain disabled.
