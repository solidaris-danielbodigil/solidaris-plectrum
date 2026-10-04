# ADR: Core dashboard for usage, agent effect and recommendations

**Date:** 2026-10-03
**Status:** accepted (branch `feat/core-dashboard`)
**Related:** `.ai/decisions/2026-09-25-pipeline-contracts-and-distribution.md` (adoption evidence, candidate records)

## Context

Core needs one place to see whether Plectrum is used, whether the `/plectrum` agent helps, and what to do next. The facts already exist in the repository: the central index (`usedIn` from the local scan), the toolkit catalogue, the agent search evaluation, candidate and promotion records, the token sync report and proposals, release tags and pending changesets, each with git history. Usage reports from application repositories (`.ai/adoption/*.json`) do not exist yet: `registry.operations.reportIngestionEnabled` was `false` until this change set it to `true`, and all three registered applications are still `missing`.

Storybook rendered some of these numbers (agent use by application, the search-quality table). Storybook is versioned with each release and read by application teams; per-application usage and Core-only follow-up do not belong in an immutable release bundle, and a table of zeros until reporting starts says little.

## Decision

- **Dashboard in `apps/dashboard`.** The existing Angular dashboard app gets a `/design-system/:section` area (Overview, Adoption, Local components, Agent & MCP, Search quality, Pipeline, Tokens & releases, Recommendations) with hash routing, so deep links work on GitHub Pages without a 404 dispatcher. It is a Core tool, not a published package; no changeset.
- **`libs/insights` is a pure engine.** Types (`PlectrumInsights`) and `recommend(data, source, now)` with one rule per file and `DEFAULT_THRESHOLDS`. No Node, Angular or devkit imports, so it runs in the browser (ages computed live with `new Date()`) and in `node --test` with a fixed date. Path alias `@pds-internal/insights`.
- **`tools/insights` is the generator.** `npm run insights:generate` reads repository facts and their git history, reuses the existing readers (`aggregateAdoption`, `readAdoptionReports`, `readCandidateRecords`, the devkit `scanObservations` and `searchComponents`) and precomputes local-component similarity. It writes facts only, never recommendations.
- **The generated module is gitignored.** `apps/dashboard/src/app/design-system/data/insights.generated.ts` is a pure function of the checkout (`generatedAt` = HEAD commit time), so there is no `--check` gate. `start:dashboard` and `build:dashboard` run the generator first. A shallow clone yields empty history arrays and `historyAvailable: false`; the Pages build checks out full history.
- **Demo data is isolated.** Until real reports arrive, agent counts and local components come from `tools/insights/demo/seed.json` combined with a real scan of the local-demo apps, validated with `adoptionReportSchema` in memory. Demo reports are never written to `.ai/adoption/`, never reach `tools/devkit/assets/local-components.json` (which `contracts:generate` ships), and are never merged with reported data: the module carries `usage.reported` and `usage.demo` side by side. The dashboard has a Reported | Demo switch, defaults to Demo while no application has reported, and shows a permanent warning while Demo is selected. Tests assert that no seed id leaks into the reported sources.
- **No request text, ever.** Empty searches stay counts per application (`tools/devkit/src/telemetry.mjs`); a catalogue gap is a ratio, not a list of queries.
- **Storybook keeps guidance and transparency.** *Use the Plectrum agent* keeps **What is measured** (what is counted, how to turn it off, what is sent) and the **Search quality** heading as anchors, without numbers, and links to the dashboard (`#/design-system/agent`, `#/design-system/search`). *At a glance* links to the dashboard for usage and recommendations. `DASHBOARD_URL` derives from `registry.operations.storybook`; no URL is typed in a page. The catalogue's app-team view (`CENTRAL_ADOPTION`, "Used in") is unchanged.
- **Same exposure as Storybook.** The Pages workflow builds the dashboard with base href `/solidaris-plectrum/dashboard/` and publishes it at `/dashboard/` beside `/storybook/`. Versioned Storybook bundles (`storybook.tar.gz`, `storybook/releases/<id>/`) never contain dashboard or demo data. CI builds it on every pull request (`npm run build:dashboard`).
- **Aura dark kept.** The dashboard stays on PrimeNG Aura dark instead of `providePlectrum()`, because the Plectrum dark tokens are incomplete. New UI uses PrimeNG components, `o-flex` / `o-layout` mixes and `u-*` utilities; chart colours are read from `--p-*` at runtime. Dashboard SCSS lives in `apps/dashboard/src/styles/`, with a separate `styles.scss` entry point loaded after the shared `main.scss`. Its tokens and component blocks stay out of the shared stylesheet and Storybook token inventory.

## Options set aside

- **Numbers in Storybook.** Rejected: frozen into every release bundle, and visible to every team.
- **Committing the generated module with a `--check` gate.** Rejected: it would change on every commit (history, HEAD time) and churn every pull request.
- **Writing demo reports to `.ai/adoption/`.** Rejected: they would flow into shipped toolkit assets and be indistinguishable from real reports.
- **A `demo` flag on adoption reports.** Rejected: `adoptionReportSchema` is strict and real reports must not change shape for a demo.

## Consequences

- Recommendations reflect the day the dashboard is opened, not the day it was built. Thresholds live in `libs/insights/src/thresholds.ts`; a new rule needs a positive and a negative fixture.
- On `main`, a sync report stage `proposed` means merged; the generator and the token rule treat it as merged, never as blocked.
- Once applications send reports, the dashboard switches to Reported by default; the demo seed stays as a fixture for rule coverage and can be deleted when every rule fires on real data.
- With no external report, Reported coverage is unknown. Recommendations to retire an unused component require a fresh report from every registered external application; demo usage never counts as reported evidence.
- The dashboard is public wherever Storybook is public. It shows only per-application totals, component ids and repository facts; nothing identifies a person.
- Runbook: `docs/handoff/maintainer-pack.md` §9.
