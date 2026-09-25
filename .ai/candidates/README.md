# Candidate records

The central repository owns three decisions and one team submission, each keyed by the stable `application-component` ID:

- `proposals/<id>.json`: Core triage and owner; merge this before team scaffolding.
- `submissions/<id>.json`: the latest team submission, revision or withdrawal, delivered by the toolkit as a pull request. This is JSON data, never executed.
- `reviews/<id>.json`: Core acceptance or rejection of the **current** submitted source revision.
- `promotions/<id>.json`: reviewed integration of that revision into package-eligible Core source, linked to API, token, dependency, i18n, accessibility and Figma evidence.

Register the team/application/repository pair in `.ai/contracts/registry.json` first. Core can create records without hand-writing JSON:

```sh
npm run candidate:record -- proposal --team TEAM --application APP --component SLUG --issue CENTRAL_ISSUE_URL --decision approved-candidate --decided-by @REVIEWER --decision-url CENTRAL_DECISION_URL --note "Why this gap is approved"
npm run candidate:record -- review --id APP-SLUG --decision accepted --pull-request CENTRAL_SUBMISSION_PR_URL --reviewed-by @REVIEWER --note "What was reviewed"
npm run candidate:record -- promotion --id APP-SLUG --integration-pr CENTRAL_INTEGRATION_PR_URL --api EVIDENCE_URL --tokens EVIDENCE_URL --dependencies EVIDENCE_URL --i18n EVIDENCE_URL --accessibility EVIDENCE_URL --figma EVIDENCE_URL
```

`--decision` also accepts `use-existing`, `app-specific` and `rejected`; `--reviewed-by`/`--decided-by` must be one of the Core reviewers in the registry. `--file record.json` is available for an existing schema-valid record. Open the integration PR as a draft first to obtain its URL, then add the promotion record to that PR. Commit each generated record in a reviewed PR. Use `npm run candidate:check` before review. A revision invalidates a prior review and requires new acceptance before promotion. A withdrawn ID stays reserved.

Every submission PR must pass `candidate:check` and `contracts:check`. A reviewer must inspect the pinned application commit and preview; metadata alone does not supply component implementation. Promotion requires importing and testing actual code, stories, styles and dependencies, reconciling tokens/i18n/accessibility with Plectrum, and updating central metadata. `contracts:generate` then updates the central index and exports from that source. The Find a component table reads these validated JSON records at Storybook build time and sends candidate readers to the team's preview.

`CODEOWNERS` is generated from the Core reviewers in `registry.json`. GitHub `main` protection now requires one Code Owner approval and six CI jobs: `intake-guard`, `build`, `pack-smoke`, `storybook-tests`, `storybook-packed` and `figma-plugin`. It also dismisses stale approvals, requires current checks and applies to administrators. Merge the generated CODEOWNERS file and CI workflow so those settings can govern new PRs. GitHub does not count an author's own review as approval; `@danielbodi` is the second reviewer for Core-authored PRs and has write access.
