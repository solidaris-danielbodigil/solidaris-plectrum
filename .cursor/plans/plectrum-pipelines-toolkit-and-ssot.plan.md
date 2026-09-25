---
name: Plectrum pipelines, team toolkit and documentation SSOT
overview: Complete the Figma-to-packages and teams-to-Plectrum-to-Figma pipelines, distribute a versioned contributor toolkit, collect adoption from external repositories, and generate Storybook guidance from the same sources that drive the tools and checks.
todos:
  - id: p0-contracts
    content: "P0: define stable identities, authoritative sources, workflow states, compatibility and ownership"
    status: completed
  - id: p1-generators
    content: "P1: repair scaffolding, generate metadata registration, correct catalogue governance and enforce package boundaries"
    status: completed
  - id: p2-toolkit
    content: "P2: ship a portable versioned toolkit with editor adapters, contract snapshots, initialization, updates and CI checks"
    status: completed
  - id: p3-candidates
    content: "P3: implement external candidate submission, central intake and traceable promotion"
    status: in_progress
  - id: p4-adoption
    content: "P4: collect application adoption reports and generate catalogue usage with freshness and provenance"
    status: in_progress
  - id: p5-figma-inbound
    content: "P5: validate and promote the final Figma token/theme state with all generated artifacts and release intent"
    status: in_progress
  - id: p6-figma-outbound
    content: "P6: complete attended candidate/token promotion into Figma and record the return export"
    status: pending
  - id: p7-release
    content: "P7: publish verified package artifacts, toolkit and contracts with matching versioned Storybook documentation"
    status: pending
  - id: p8-docs
    content: "P8: render onboarding, contribution and pipeline guidance from shared process and release sources"
    status: pending
  - id: p9-proof
    content: "P9: prove both complete journeys in an external consumer, migrate existing content and document recovery"
    status: pending
  - id: restore-main-review
    content: "After the plan build: restore main review — one Code Owner approval, stale-review dismissal, admin enforcement"
    status: pending
isProject: false
---

# Plectrum pipelines, team toolkit and documentation SSOT

Created: 2026-09-24. Updated: 2026-09-25. Status: P0–P2 merged. P3 implementation is on `main` via PR #8; its live external candidate and promotion are still unproven, so P3 stays open. PR #9 is merged. Its follow-up on `main` passed CI and Pages, and Release opened the version PR #10. Publishing stays disabled. P4 intake is implemented and still needs a live external report. P5–P9 remain pending.

## Outcome

Application teams install Plectrum packages and receive a compatible development toolkit that guides and checks their work. They can discover existing components, propose a gap, develop a candidate in their own repository, submit it for review, and consume the resulting release. Their installed versions and detected component usage reach the central catalogue through a documented reporting process.

Designers can export approved Figma changes into Plectrum, validate the resulting tokens and theme together, and release tested packages with matching Storybook pages. Accepted contributions can travel back into Figma through the existing agent/plugin workflow and return through the same validated export pipeline.

Storybook, editor agents, CLI guidance and CI checks must agree because they consume shared, versioned sources. Facts already present in metadata, package manifests, workflow definitions or reports must not be retyped into prose or tables.

Success means:

- A new team can complete onboarding from the published instructions without copying internal repository folders or relying on monorepo path aliases.
- Both pipeline directions have explicit inputs, owners, transitions, outputs, checks and recovery steps.
- Updating a component contract updates its documentation and catalogue entry through generation and rendering.
- Updating a process changes the toolkit and its Storybook guidance in the same reviewed change.
- Adoption works for external repositories and clearly distinguishes installed packages, detected source usage and missing/stale reports.
- Released packages, contract snapshots, compatible toolkit versions and consumer documentation can be traced to exact versions and source revisions.
- Human decisions remain explicit: proposal triage, design acceptance, ownership, Figma branch merge and library publication.

## Verified starting point

The audit inspected the repository's configuration and source. The current docs SSOT check, release-docs check and contract check pass; the contract check covers 20 metadata files. This is not evidence that the external-team journeys work. Registry permissions, branch protections and successful live workflow runs still need verification during implementation.

| Existing capability | Gap to close |
| --- | --- |
| Component metadata renders documentation figures and Controls | The scaffold emits older handwritten MDX sections; metadata registration and package exports are separate manual steps. |
| Runtime packages and a throwaway consumer build exist | Agent folders require manual download; metadata/schema/tools are not delivered as a usable consumer toolkit. |
| `@solidaris/contracts` works in this workspace | It is a TypeScript alias into `.ai/contracts/schema`, not an independently consumable contract package. |
| `@solidaris/tokens-cli` is packed | The linter resolves paths relative to its own installation and expects this monorepo's layout; the smoke test does not exercise it. Hex/px failures require `--strict`. |
| Component catalogue combines metadata, PrimeNG mappings and docs links | `usedIn` scans local apps only; every status except `app` is currently presented as Core. |
| Metadata has governance | Team names are restricted; app-specific components are exported from the main UI package. Required design-system ownership review is not configured through CODEOWNERS. |
| Figma staging builds tokens and opens a promotion PR | Existing preset validation precedes the incoming theme copy. The workflow does not regenerate the token proposal or create release intent. |
| Repo-to-Figma token proposal, agent path and plugin exist | External candidate intake, promotion tracking and round-trip verification are missing. The plugin transfers tokens, not component implementations. |
| Changesets and Pages deployment exist | npm publishing is disabled; Pages follows main independently of package releases and CI completion. |
| Docs include setup and process descriptions | Some facts are duplicated or stale: package/release wording, CI Node version, catalogue count, owner lists and agent instructions. |

Primary implementation surfaces:

- `libs/ui/src/docs/{get-started-consume,get-started-contribute,ai-strategy,story-authoring,token-pipeline,token-pipeline-figma,catalogue,releases}.mdx`
- `libs/ui/src/docs/docs-figure-stories.ts` and `libs/ui/src/storybook/`
- `.ai/contracts/schema/`, `.ai/contracts/protocols/`, `.ai/rules/`, `.ai/skills/`
- `.cursor/agents/`, `.github/agents/`, editor baseline instructions and MCP configuration
- `tools/generators/sds-component/index.ts`, `tools/scripts/generate-index.ts`, validation scripts
- `tools/tokens/`, `tools/figma-plugin/`, `tools/packaging/`
- `.github/workflows/`, `.changeset/config.json`, library package manifests and entry points

The existing user edit to `libs/ui/src/docs/catalogue.mdx` was re-read and incorporated during P3, retaining its source explanation while removing the fixed row count and updating candidate/usage provenance. P8 can further reduce hand-written guidance.

## Source-of-truth boundaries

Introduce new sources only where the information is not already owned elsewhere. Proposed names below describe responsibilities; finalize paths and package names in P0.

| Information | Authoritative source | Derived consumers |
| --- | --- | --- |
| Component description, usage advice, anti-patterns, patterns, anatomy, props, behavior, variants, composition, accessibility, examples and explanations | Colocated `*.metadata.ts`, typed and validated | Docs figures, Controls, catalogue, exported contract snapshot, toolkit queries |
| Rendered states and interaction behavior | Component implementation and `*.stories.ts` | Canvases, anatomy specimens, interaction tests and previews |
| Page structure and genuinely story-specific commentary | Attached MDX | Storybook page; do not repeat metadata facts here |
| Cross-cutting architectural decisions | `.ai/decisions/` | Linked rationale; accepted operational rules are reflected in the process contract |
| Rules, workflow steps, supported commands and check profiles | Shared versioned process definitions plus canonical rule text | Toolkit help, editor adapters, Storybook process figures and CI entry points |
| Team/application identity and accountable owners | Shared team/application registry | Schema validation, CLI options, labels, filters, owner review mapping |
| DS inventory and component relationships | Source/metadata scans | Generated central contracts index and release contract snapshot |
| Candidate state, origin and review evidence | Central candidate records linked to proposal/PR/revision | Intake checks, candidate listings, promotion status and Figma handoff |
| External application adoption | Validated report from each application's CI | Generated adoption aggregate and catalogue usage columns |
| Figma-owned token values | Reviewed export promoted into `libs/plectrum/src/tokens.json` | Generated SCSS and token annotations |
| Code-owned tokens and supported CSS API | Appropriate ITCSS sources and reviewed token mappings/catalogue | Compiled stylesheet, token proposal and public token inventory |
| Tokens/classes currently available in a preview | CSSOM of the loaded stylesheet | Foundation galleries, playgrounds and token contract checks |
| PrimeNG/Figma component correspondence | `PRIMENG_KIT` or its successor shared mapping | PrimeNG catalogue, Figma links and toolkit catalogue |
| Release versions and compatibility | Package manifests and declared compatibility metadata | Install instructions, toolkit compatibility checks, release manifest |
| Publication date/status and documentation URL | Recorded result of a successful release | Storybook release state and consumer install guidance |
| Release descriptions | Changesets and package changelogs | Generated What's new feed |
| Build-specific story/docs IDs | Storybook-generated runtime `index.json` | Resolved navigation and component links |

Usage advice and example explanations stay authored once in metadata and are rendered everywhere needed. Do not introduce parallel prose in MDX, agent files or the toolkit.

There are three distinct inventories:

1. **Central source inventory:** `.ai/contracts/index.json`, regenerated and committed in the Plectrum repository. Move any preserved hand-authored workspace configuration into an explicit input so the generated file does not feed itself.
2. **Published contract snapshot:** a versioned, portable representation of the released DS. Include stable IDs, package exports, metadata and resolvable documentation/source references; repository-relative paths alone are insufficient.
3. **Application-local inventory:** candidates and usage detected in a consuming repository. It complements the installed DS snapshot and is never merged wholesale over Plectrum's central index.

Adoption reports are observations associated with component IDs. Keep them independent from the source inventory and join them when building the catalogue. Existing local-app scans may feed the same observation format.

## Target user journeys

### Figma to Plectrum to teams

1. Designer approves and exports the intended Figma revision to staging.
2. Automation assembles the complete proposed token/theme state while preserving explicitly owned overrides.
3. Build, audit, preset validation, proposal generation and documentation generation run against that final state.
4. The promotion PR carries generated artifacts, provenance, review evidence and a changeset or a justified no-release classification.
5. Required CI and reviewers approve the revision.
6. Release automation builds and verifies the actual publishable artifacts, publishes them and records the release result.
7. The matching versioned Storybook and contract snapshot become available; latest links advance only after successful release checks.
8. Teams receive dependency update PRs, run compatibility/usage checks and report their new adoption state.

### Teams to candidates to Plectrum and Figma

1. A team installs packages and initializes the compatible toolkit.
2. The toolkit/agent checks the installed catalogue and PrimeNG/Figma references before proposing a gap.
3. The core team records the proposal outcome and accountable owner.
4. The team develops an approved candidate locally using portable scaffolding, metadata, stories, styles and checks.
5. A submission identifies the exact source revision and carries validated candidate metadata plus the required preview/evidence or source bundle.
6. Central intake exposes the candidate with its actual status and origin. It does not mark it as Core or publish it through the Core entry point.
7. If the core team chooses promotion, the contribution is integrated, generalized and reviewed. The central index and docs are regenerated from the integrated sources.
8. An attended agent/Figma session applies approved token proposals and creates/updates the component with variable bindings; the existing plugin remains the token-only fallback. A designer may perform the component work manually.
9. Figma review, branch merge and library publication are recorded. The return export passes the inbound pipeline and reconciles the promoted values.
10. A verified package release and matching docs let the team upgrade, remove its local implementation and report use of the released component.

App-specific work may remain app-specific indefinitely. Candidate status is not a promise of promotion. Ordinary adoption reporting never requires a candidate submission.

## Implementation phases

### P0 — Define contracts, identity and operational ownership

- Assign stable component IDs independent of display names, folder names and Storybook titles. Use them across metadata, candidates, adoption and package exports; define rename/replacement handling.
- Separate governance (`core`, `candidate`, `app`, `deprecated`) from proposal/promotion progress. Define allowed transitions, responsible role and required evidence for each transition.
- Define versioned schemas for published contracts, candidate records, adoption reports, toolkit compatibility and release manifests. External exchange uses validated data, not executable TypeScript imports.
- Introduce a team/application registry including repository identity and display label. Generate or validate owner options from it instead of repeating unions in the schema and CLI.
- Extract shared process steps, prerequisites, commands, applicable repository context and check profiles. Preserve canonical human-readable rule text; avoid creating a second workflow engine.
- Define consumer-repository versus Plectrum-repository paths and responsibilities explicitly. Consumer rules must not instruct teams to modify installed packages or nonexistent monorepo folders.
- Default to a separately versioned development toolkit with explicit supported DS/schema ranges. Each runtime release has a matching contract snapshot. Record the compatibility choice before implementing distribution.
- Confirm operational configuration: registry, DS owner/reviewer handle, registered repositories, authenticated report transport, Figma files/collections, release hosting and supported editors. Do not invent organizational identities.

Acceptance: a documented contract can describe a new external team, one local candidate, one released component and one adoption report without adding a team name to multiple code files. Every workflow step identifies its repository and owner.

### P1 — Repair the local generation foundation

- Update the component scaffold to the current metadata-driven CSF/MDX pattern: Status, Usage, Anatomy, Accessibility and applicable Patterns/Examples/Variants figures; Controls under the primary canvas; literal figure tags where required by Storybook's indexer.
- Remove invalid placeholder example markup and obsolete handwritten sections. Make unfinished content explicitly detectable without requiring authors to reconstruct the documentation structure.
- Generate the metadata registry from discovered metadata files with deterministic ordering and duplicate-ID/name checks. Retain a static generated barrel if needed by the build system.
- Derive catalogue rows from the registry and display governance accurately, including candidates and deprecated entries. Keep an unambiguous stable-ID-to-docs mapping for Angular and CSS-only entries.
- Validate public exports against governance and release policy. Keep app patterns outside Core distribution or behind an explicitly documented separate entry point/package. Plan migration and version impact before removing existing public exports.
- Update central inventory generation to cover the agreed component kinds and portability fields; retain relationship data with documented scan limitations.
- Add a scaffold integration fixture: create a component in a disposable workspace, complete minimal required content, run registration/index generation, docs/contracts checks and package export checks.

Acceptance: a newly scaffolded component requires no manual catalogue registration or repair of the generated docs structure. An eligible public component is available from the packed entry point; a candidate is never silently presented or shipped as Core.

### P2 — Deliver the portable team toolkit

Proposed package: `@solidaris/plectrum-devkit`. Finalize the contract distribution boundary in P0; it may be a separate `@solidaris/contracts` package or a documented toolkit subpath.

- Ship portable schemas, released catalogue/metadata, shared rule/process content and the supported CLI. Include package export names and versioned docs URLs so agents can inspect contracts absent from the UI runtime package.
- Keep the authoritative toolkit content in the installed version. Provide explicit initialization and update commands that write small editor adapters and project configuration at the repository root.
- Generate Cursor and VS Code/Copilot role files from common role instructions with editor-specific capabilities. Audit and synchronize baseline instruction files, not just subagent folders. Document the actual Plectrum invocation for each supported editor.
- Configure available MCP endpoints explicitly. Validate capabilities and provide offline catalogue fallback; do not assume every consuming team runs Plectrum's Storybook at localhost:6006.
- Record managed file versions/checksums. Initialization and updates must be idempotent, preserve unrelated existing editor configuration and detect conflicts in managed files. Keep team notes outside managed content.
- Add project configuration for team/application ID, source/style roots, candidate locations, DS dependencies and report settings. Resolve paths from the consumer project/config, never from the CLI's installation directory.
- Make token linting read the installed DS token inventory plus approved local declarations. Define strictness in a shared check profile and render the same behavior in docs. Missing configuration or an unexpectedly empty scan must not produce a misleading successful validation.
- Provide scaffold, validate, doctor/compatibility, candidate-export and adoption-report capabilities. Proposed commands are not to be advertised as available until implemented and tested.
- Supply consumer CI entry points that check toolkit compatibility, metadata/API alignment, tokens and candidate requirements regardless of whether an agent performed the work.
- Fix or delegate the existing `@solidaris/tokens-cli` commands so two incompatible implementations are not maintained. Include its versioning/publishing in the chosen package topology; it is currently outside the root workspace package list.
- Test a packed toolkit installed outside this monorepo, without inherited aliases, scripts or source folders. Verify actual editor-generated content and every documented command.

Acceptance: a clean external Angular repository follows Storybook onboarding, initializes Plectrum, resolves the contract schema and runs checks. An intentionally invalid token is detected. A toolkit update preserves team notes and either updates cleanly or reports a concrete conflict.

Implemented 2026-09-25: `@solidaris/plectrum-devkit@0.1.0` packs the generated full-metadata catalogue, process, registry, JSON schemas, token inventory and shared role/rule content. `plectrum init/update` manages Cursor and VS Code/Copilot adapters, MCP entries and CI with checksums; project identity and paths live in `.plectrum/config.json`. The CLI provides offline catalogue, compatibility/MCP doctor, strict token and candidate checks, scaffold, schema validation, candidate export and adoption report. The latter two produce local drafts; central transport and ingestion remain P3/P4. The former `@solidaris/tokens-cli` package is internal to the Plectrum workspace and is no longer packed for consumers. Packed external Angular smoke covers build, all CLI commands, generated adapters, managed-file conflict, unrelated MCP/team notes preservation, metadata/API mismatch, empty scan and invalid tokens. Storybook builds; 20 toolkit documentation routes resolve in its generated index. `contracts:generate --check`, `contracts:check`, `docs:check` and four pipeline tests pass. The snapshot labels current Storybook routes as preview; immutable versioned documentation and registry publication remain P7.

### P3 — Implement candidate intake and promotion records

- Give proposal records a stable reference and record the core team's decision. Scaffold/submit checks verify the decision and owner rather than treating a local field as proof of central approval.
- Define a submission contract with candidate ID, application ID, proposal, source repository/revision, compatible DS/toolkit versions, metadata, preview and review evidence.
- Default external candidate visibility to a validated central listing linked to the team's versioned preview. To render the component in central Storybook, explicitly integrate its implementation, dependencies, stories, styles and tests; metadata alone is insufficient.
- Choose a reviewed PR-based intake as the initial transport. Validate submissions, preserve provenance and handle updates/removals by stable ID. Do not execute submitted metadata to obtain catalogue data.
- On promotion, reconcile names/API, tokens, dependencies, i18n, accessibility evidence, package eligibility and Figma references. Update central source files, regenerate the index/registry and commit generated artifacts with the contribution.
- Track the relationship from local candidate ID to released component ID so usage history and replacement instructions survive promotion.
- Derive candidate/promotion status displays from these records and review evidence. Avoid manually maintaining the same status in issue prose, metadata and separate tables.
- Add ownership checks and CODEOWNERS after the real reviewer identity is supplied; verify required review/check configuration in the repository host.

Acceptance: an external team can submit, revise and withdraw a candidate; reviewers can promote one through a traceable PR. The catalogue updates automatically from the accepted records. Submitting a team's local `index.json` is neither necessary nor sufficient.

### P4 — Collect adoption from external repositories

- Generate an adoption report in each registered application's CI after a successful default-branch build, with a periodic refresh where appropriate.
- Include schema version, application/repository identity, source revision, observed time, installed DS/toolkit versions and detected component IDs. Include report/scanner version to explain methodology changes.
- Distinguish package installation from component usage. Prefer parsing supported imports/templates over counting arbitrary text mentions. Document blind spots, including dynamically composed usage and unsupported template forms.
- Include PrimeNG controls only where reliable mapping/detection exists, and label that coverage. Do not interpret absence of a report or incomplete coverage as non-adoption.
- Use authenticated CI submission or central retrieval of registered artifacts through the transport selected in P0. Validate repository/application identity; installing a package must not silently send telemetry.
- Aggregate one current report per application with history/provenance where useful. Prevent older reports overwriting newer observations, and handle duplicate, failed, missing, stale and retired applications explicitly.
- Generate the adoption data consumed by Find a component. Trigger a catalogue data deployment when accepted reports change; it must not require a runtime package version bump.
- Scope usage displayed on versioned docs using stable IDs and reported package versions. Label current observations as current data and record their timestamp independently of the docs build version.
- Retain local demonstration apps as identifiable observations so external adoption can be filtered separately.

Acceptance: usage reported from an external repository appears without editing catalogue code. Removed usage disappears after a newer complete report; stale reports remain visibly stale. Candidate submissions and adoption updates operate independently.

### P5 — Make Figma ingestion validate the final artifact

- Pin the incoming Figma/export revision and record exporter/schema version and source file identity. Reject incomplete staging explicitly.
- Assemble incoming tokens and theme into a proposed state before auditing. Preserve code-owned overrides using an explicit ownership boundary; do not assume a broad theme copy cannot overwrite them.
- Run token generation, drift audit and preset validation against that assembled state. Review allowlisted gaps explicitly and gate newly introduced unresolved references.
- Regenerate every affected committed artifact, including SCSS, token annotations, `proposed.dtcg.json` and the sync report. Verify a second run produces no changes.
- Require a changeset for shipped behavior/token changes, or a reviewed machine-checkable no-release classification. Generate release descriptions from the meaningful diff where possible; humans confirm version impact.
- Open/update a promotion PR based on the current target branch with only intended export/generated changes. Preserve the export revision when rebasing/retrying; avoid promoting unrelated staging commits via an unrestricted add of all files.
- Ensure bot-created PR checks actually run. Choose an appropriate GitHub App or document required workflow approval; verify current GitHub event behavior during implementation.
- Make reports distinguish proposed, blocked, merged and released states. Surface failed sync runs through a workflow artifact/status link even when no report can merge into Storybook.

Acceptance: an invalid incoming theme fails even if the previous preset was valid. A valid sync PR passes all generation checks, contains release intent and records provenance. Retries do not create duplicate PRs or unrelated changes.

### P6 — Complete the return path into Figma

- Preserve the accepted attended workflow from the September 2026 ADRs: agent + Figma MCP is the default during an active session; the Plectrum tokens plugin is the token-only fallback; a designer may create the component manually.
- Keep Enterprise REST alternatives explicitly disabled/configured as alternatives until the required access and operating model are verified. Do not present manual dispatch availability as a working unattended path.
- Export candidate token proposals from configured external project inputs, then review and integrate accepted proposals centrally. Maintain ownership and supported token-type information; expose skipped/unrepresentable values clearly.
- Pin the reviewed proposal revision. Apply selected tokens to the approved branch/collection with explicit identity checks. Generate the component with variable bindings or record the equivalent designer work.
- Consolidate Figma file/collection identities used by docs, toolkit, plugin and validation. Verify that protected-main-file checks refer to the current relevant library.
- Record token mapping, component node URL, source revision, design review result and Figma merge/publication evidence in the promotion record; expose the relevant link through component metadata.
- Require design acceptance before marking a design-dependent promotion complete. Resolve the existing ADR wording around code promotion versus Figma completion into one documented sequence.
- After merge/publication, ingest the return export through P5 and verify the accepted token values/mappings. Prevent identical values bouncing indefinitely between code proposals and Figma exports.
- Provide recovery for an interrupted session, changed branch, partially applied proposal, conflict or unavailable designer. Keep the prior released version usable throughout.

Acceptance: one external candidate travels through reviewed code, variable-bound Figma work, publication and validated return export. Every manual step is visible with its owner and evidence; no automation claims to create a component when only token transfer occurred.

### P7 — Publish packages and documentation as a traceable release

- Confirm registry/authentication and package ownership. Enable publishing only after the actual publishable artifacts have passed the consumer and contract checks.
- Build Angular packages from the intended APF output and publish those outputs, not unbuilt workspace source. Explicitly include styles, toolkit, contract snapshot and any retained CLI packages in release orchestration.
- Preserve the agreed fixed-version relationship of UI/theme/styles. Publish compatible toolkit/contracts according to P0 and record all versions in a release manifest.
- Verify export/governance policy, contract completeness and installed-consumer compatibility against the packed release artifacts. Include toolkit CLI behavior in consumer smoke coverage.
- Record successful publication with source revision, artifact identity, registry version, date and documentation URLs. Derive registry status and release date from this evidence, replacing manual flags/proxy dates.
- Publish immutable Storybook documentation for each release. Provide an explicitly labelled development preview of main and advance the released latest pointer only when package and docs publication succeed.
- Gate deployment on successful checks for the same source revision. Avoid an independent main-push deployment advertising unverified or unreleased behavior as the current release.
- Handle partial publish/retry: detect already-published immutable versions, finish missing artifacts safely and leave the latest pointer unchanged until the release is complete.
- Supply dependency-update configuration for runtime and toolkit compatibility. Upgrade docs identify breaking changes and local-candidate migration steps from release data.

Acceptance: a fresh application installs from the intended registry and follows the matching Storybook. Package versions, toolkit compatibility, catalogue snapshot and release provenance agree. A failed or partial release cannot move the released latest pointer.

### P8 — Generate clear Storybook guidance from shared sources

- Rewrite Build with Plectrum around the external team's complete journey: prerequisites, package install, toolkit initialization, first themed component, validation, reporting and upgrades.
- Rewrite Contribute around proposal outcomes and exact repository context: developing locally, submitting a candidate, making a change directly in Plectrum, or promoting existing work. Display who acts next and what artifact they provide.
- Render process steps, command blocks, check tables, owner options, supported versions and capabilities from the same versioned definitions used by the toolkit. Reuse existing Angular docs figures and attach them through stories/MDX.
- Keep detailed implementation/internal lineage out of the normal onboarding flow. Link to maintainer material for generation, transport and recovery details.
- Keep component guidance in metadata: usage, anti-patterns, patterns, examples and explanations, variants, composition, behavior and accessibility. Extend metadata where a reusable component fact lacks a field; render it through shared figures.
- Reserve MDX for composition of the page and genuinely example-specific context. Preserve architectural decisions as linked ADRs rather than copying them into every surface.
- Derive catalogue counts, team filters, governance labels, package versions, install filenames, release dates/state and pending changeset state. Discover docs routes from the relevant build index instead of copying IDs where resolvable.
- Keep explicit reviewed mappings when they encode a real design decision, such as a Figma token alias or PrimeNG correspondence. Store each mapping once; do not replace necessary curation with inferred values.
- Extract shared agent role text and remove contradictory instructions across editors and docs, including stale MCP/testing capabilities. Generate editor-specific wrappers and check their outputs for drift.
- Update doc checks to validate shared-data rendering and runnable examples. Avoid checks that merely require manually repeated version strings to occur in prose.
- Present installed-version docs by default, with clear links to latest/development documentation. Expose adoption freshness and candidate state without implying that every catalogue row is a Core package export.

Acceptance: changing a workflow step or supported command updates toolkit help, agent guidance and Storybook from one source. Changing a metadata use case updates the docs without an MDX edit. A new team or component updates the relevant lists without a hand-edited count.

### P9 — Prove the journeys and migrate

- Exercise a disposable external Angular repository with no access to the monorepo's path aliases, copied `.ai` tree or internal scripts.
- Complete onboarding, candidate creation, validation, submission, adoption reporting, toolkit update and consumption of a promoted package using only the documented supported workflow.
- Exercise a representative Figma inbound change and an outbound candidate round trip using the configured attended tools and review process. Record which steps are automated and which were completed by a person/agent.
- Migrate existing components, app patterns, team identities and candidate records. Preserve stable links/redirects and provide release notes for any public-export change.
- Migrate copied-agent-folder users to managed adapters without losing local notes. Remove obsolete manual-copy guidance only when the replacement is available.
- Add operational instructions for stale reports, failed exports, invalid candidate submissions, missing reviewers, incompatible toolkit versions, failed publishing and documentation rollback.
- Archive superseded procedures and update relevant ADRs through explicit follow-up decisions. Do not leave two active instructions for the same journey.

Acceptance: the scenarios below pass, required live configuration is verified, and the maintainers can identify the source and recovery action for every failed stage.

## Verification scenarios

| Scenario | Required evidence |
| --- | --- |
| Clean consumer initialization | Real packed/published runtime packages and toolkit work outside the monorepo; editor adapters and instructions point to compatible content. |
| Consumer validation failure | An invalid token, incompatible contract version and missing required configuration fail with actionable messages; an empty scan cannot silently pass. |
| New component | Scaffolded docs follow metadata figures; registry/index generation and eligible exports work without manual registration. |
| Metadata edit | Usage/example changes appear in Storybook and the exported contract without duplicated prose edits. |
| New application | Registry-driven options and labels update across CLI/docs/catalogue without repeated team-name edits. |
| Candidate lifecycle | Proposal, submission revision, review, Figma evidence, package release and replacement mapping remain traceable. |
| External adoption | A report updates usage; a newer report removes obsolete usage; stale/missing/unsupported observations are distinct. |
| Figma inbound | A bad new preset is rejected; a valid final state produces deterministic generated artifacts and release intent. |
| Figma outbound and return | Selected approved tokens and the component reach the correct branch; published values reconcile through inbound generation without a proposal loop. |
| Process/toolkit update | CLI help, editor guidance and Storybook share the same process version; managed-file conflicts preserve user content. |
| Release | Registry artifacts install successfully; versioned Storybook describes those artifacts; latest advances only after all required outputs succeed. |
| Retry/recovery | Duplicate reports/PRs/releases are avoided, prior released docs remain available and incomplete work stays visibly incomplete. |

Use focused unit/schema tests for parsing, identity, compatibility and report merging; integration tests for scaffolding and installed CLI behavior; existing Storybook interaction/a11y checks for rendered docs. Run complete release/round-trip scenarios at their integration milestones, not after every prose edit.

## Sequence and completion gates

1. **Foundation:** P0 then P1. Establish contracts and repair the existing generation path.
2. **Team workflow:** P2 then P3/P4. Prove external consumption before relying on candidate/adoption inputs.
3. **Design round trip:** P5 then P6, using the candidate contracts established in P3.
4. **Distribution:** P7 joins the verified runtime, toolkit, contracts and documentation outputs.
5. **Documentation:** update affected guidance in each phase; P8 completes the shared-source rendering and removes superseded instructions.
6. **Acceptance:** P9 validates the entire system and migration.

Do not mark a phase complete solely because its files exist. Check its acceptance criteria, record tests and identify any external dependency still outstanding. Credentials, reviewer identities, repository protections and attended Figma review can remain explicit dependencies while independent implementation continues.

The plan is complete only when both directions have been exercised and teams can follow the published process using distributed artifacts. Central Storybook must then reflect component contracts, reviewed candidates, release state and observed external adoption through their declared sources.

## P0/P1 implementation record — 2026-09-25

Branch: `codex/plectrum-foundations`.

- Assigned stable IDs and distribution declarations to all 20 metadata contracts, including CSS patterns. Generated TypeScript registry, complete source inventory, versioned JSON Schemas and eligible package exports share those inputs.
- Added the team/application registry, operational configuration, process/transition contract and independent toolkit compatibility declaration. External JSON validation checks identity, owner/application/repository consistency, transition evidence, schema versions and release compatibility. Intake authentication and transport remain P3/P4.
- Repaired scaffolding: current metadata figures, valid examples, explicit TODO validation, registry generation and package boundaries. Candidate code is absent from runtime exports; candidate styles stay outside the published styles tree and are included only by Storybook.
- Corrected all four catalogue statuses and resolved docs through stable IDs plus exact MDX source paths, including CSS-only components. Verified all 20 routes against the built Storybook index.
- Moved the two iSHARE patterns to `@solidaris/ui/patterns/ishare`, migrated application imports and recorded the breaking change in a major changeset. Package versions and publication remain unchanged.
- Added a Storybook **Pipelines and contracts** page rendered from shared definitions, synchronized affected creation instructions and both editor agents, and documented the migration/identity decision in `.ai/decisions/2026-09-25-pipeline-contracts-and-distribution.md`.

Verification:

- `npm test`: 613 tests passed (UI 401, iSHARE 204, Plectrum 8).
- `npm run test:pipelines`: 4 tests passed — schema/external-team and route tests plus an isolated scaffold → docs/contracts → build → npm tarball → TypeScript consumer test. Confirms Core presence, Candidate absence, secondary imports, duplicate rejection, source-boundary enforcement and generated-file drift detection.
- `contracts:check`, `docs:check`, generated-artifact check, tools/schema TypeScript checks and Storybook TypeScript check passed.
- Library build, iSHARE production build and static Storybook build passed.

External dependencies remain explicit in `registry.json`: reviewer identity, confirmation of Figma libraries, external report authentication and package publication. GitHub Packages is selected as private under the personal account; source scopes remain `@solidaris/*` until P7. The toolkit compatibility declaration is **planned**, not a claim that the toolkit has shipped. No registry publication, push or Figma write was performed.

## P3 implementation record — 2026-09-25

- Added stable proposal, submission, review and promotion schemas and central JSON records. A merged approved proposal is required by consumer scaffolding; the toolkit rechecks the central decision before submission. The local candidate CI checks the cached decision, metadata/API alignment, stories, style and evidence.
- `@solidaris/plectrum-devkit@0.2.0` opens a reviewed GitHub intake PR from a fork when necessary. Submit/revise/withdraw keep one stable ID and pin source, preview and checks to a commit. `--dry-run` validates and writes a local draft. Intake PRs are limited to one JSON file before other CI jobs run.
- Core `candidate:record` commands capture decisions, reviews and integration evidence. `candidate:check` verifies registry/provenance/version compatibility, immutable identity across PR revisions, accepted current review, package-eligible integrated Core source, colocated stories/tests and a promotion changeset. Submitted JSON is parsed, never imported as executable code.
- Storybook's Find a component table includes active central submissions, current review state and the team's preview link. CI and the GitHub Pages deployment regenerate this listing from validated central records. Withdrawn/promoted candidates leave the candidate list; a promoted Core entry is generated from central metadata and the stable ID is retained in the promotion record. A team's local `index.json` is never ingested.
- `CODEOWNERS` is generated from the registry's Core reviewers: `@solidaris-danielbodigil` and `@danielbodi`. The latter received explicitly authorized write access. With explicit user approval, GitHub `main` protection was activated: one required Code Owner approval, stale approval dismissal, strict passing checks for `intake-guard`, `build`, `pack-smoke`, `storybook-tests`, `storybook-packed`, `figma-plugin`, and admin enforcement. PR #8 was approved and merged on 2026-09-25; these rules now govern future candidate PRs.
- Local verification passed: schema/tools and Storybook typecheck, `contracts:check`, `docs:check`, `candidate:check`, devkit tests, pipeline tests, 402 UI tests, packed toolkit/consumer smoke with submit/withdraw drafts, Storybook build and 20 built docs-route checks. GitHub PR transport was exercised with a fake API; no real candidate PR, promotion or package release exists yet. Complete the live acceptance scenario with the first registered external application.

## P4 implementation — 2026-09-25

- `plectrum adoption-report` still writes a local draft. `plectrum adoption-submit` opens a reviewed pull request containing only `.ai/adoption/<application>.json`, and only when `reporting.enabled` is true. The generated consumer workflow calls it on `main` with `PLECTRUM_ADOPTION_TOKEN`; a disabled flag does not send telemetry.
- Central checks reject an older or conflicting report, an unknown component, or a report whose repository does not match the registry. A newer report that omits a component removes that usage. A report older than 14 days stays visible as stale. Registered applications without a report stay listed as missing, which is not non-adoption.
- Find a component reads the generated listing. Local demo scans remain labeled `demo` until that application submits a report. PrimeNG controls are not counted. Storybook and Pages regenerate the listing on build, so a report does not need a package version bump.
- Pipeline tests cover appearance, removal, and staleness. A live report from a registered external repository is still required before P4 is complete.

## Post-merge verification — 2026-09-25

PR #8 merge commit `00f9552` on `main` triggered three workflows:

| Workflow | Run | Result |
| --- | --- | --- |
| CI | [36108738187](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/36108738187) | Success. Required jobs `intake-guard`, `build`, `pack-smoke`, `storybook-tests`, `storybook-packed` and `figma-plugin` passed. `visual-tests` skipped. |
| Deploy GitHub Pages | [36108738139](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/36108738139) | Success. |
| Release | [36108738042](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/36108738042) | Failed while creating the version PR. Changesets moved the runtime manifests to 2.0.0; `get-started-consume.mdx` still named 1.0.0, so `docs:check` blocked the commit. No version PR was opened. `publish` remains commented out in `.github/workflows/release.yml`. |

[PR #9](https://github.com/solidaris-danielbodigil/solidaris-plectrum/pull/9) makes `changeset:version` refresh the lockfile, changelog, consumer install examples, contracts and catalogue before that commit. It merged as `46b738c` on 2026-09-25. CI run [36109817384](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/36109817384) was green before merge.

That merge triggered:

| Workflow | Run | Result |
| --- | --- | --- |
| CI | [36111283442](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/36111283442) | Success. The same six required jobs passed. `visual-tests` skipped. |
| Deploy GitHub Pages | [36111283241](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/36111283241) | Success. |
| Release | [36111283323](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/36111283323) | Success. It committed `Version Packages` (`4a06aa5`) and opened [PR #10](https://github.com/solidaris-danielbodigil/solidaris-plectrum/pull/10). The commit hook passed, including the docs check that blocked the previous attempt. |

PR #10 does not publish packages. GitHub held its CI for approval because `github-actions[bot]` opened it; that run was approved and is the remaining check. Merging PR #10 would bump the manifests to 2.0.0 without publishing. It does not complete the P3 live-candidate acceptance.

## References

- Existing contribution policy: `docs/component-promotion.md` and `.ai/contracts/protocols/component-creation.md`.
- Existing Figma decisions: `.ai/decisions/2026-09-10-repo-to-figma-plugin.md` and `.ai/decisions/2026-09-12-repo-to-figma-agent-and-plugin.md`.
- Existing review enforcement question: `.ai/questions/2026-09-06-core-team-intake-and-codeowners.md`.
- Existing generated-file gates: `tools/scripts/check-commit.mjs` and `.github/workflows/ci.yml`.
- GitHub automation event behavior: https://docs.github.com/en/enterprise-cloud%40latest/actions/concepts/security/github_token — verify when implementing bot-created PRs and deployment sequencing.

## P5 progress — 2026-09-25

Staging must carry exporter source and provenance before promotion. The promotion commit is rebuilt from `main` and keeps `extend.ts`. The incoming theme is assembled before preset validation, so a bad new theme fails even when the previous preset was valid. Generated SCSS, the token manifest and `proposed.dtcg.json` are rebuilt and checked for a clean second run. A live Figma export with provenance is still required. P6 still needs a designer session, and P7 still needs registry credentials.

## Restore main review

Suspended 2026-09-25 so plan pull requests can merge without a second account. Required approvals are 0 and Code Owner review is off. These settings stay in force: a pull request, strict passing checks for `intake-guard`, `build`, `pack-smoke`, `storybook-tests`, `storybook-packed` and `figma-plugin`, conversation resolution, no force-push, and admin enforcement.

Restore before calling the plan finished:

- One required approving review.
- Code Owner review from `@solidaris-danielbodigil` or `@danielbodi`.
- Stale review dismissal.
- The same six required checks, strict, with admin enforcement left on.
