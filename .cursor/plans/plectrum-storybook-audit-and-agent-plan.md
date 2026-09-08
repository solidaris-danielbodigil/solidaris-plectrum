# Plectrum Storybook audit and agent execution plan

Audit date: 8 September 2026  
Target: [Plectrum Storybook](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/introduction--docs)  
Purpose: improve the working design-system documentation and make the project a stronger demonstration of Staff Design System Engineer work.

## 1. Assessment

**Yes: this is credible enough to use in applications now. It does not, by itself, establish a convincing Staff-level case yet.**

Plectrum presents much more than a component gallery. Its token synchronization model, PrimeNG boundaries, ownership and promotion rules, package delivery strategy, and machine-readable contracts demonstrate systems thinking. These are relevant Staff signals. The foundation tools also show care for everyday developer work: finding an appropriate token, inspecting its value, and copying usable code.

The main weaknesses are trust and evidence. Some published examples produce invalid or unresolved CSS references, API tables are incomplete, and the token-contract page reports 28 broken references. The engineering documentation describes substantial infrastructure, but a visitor cannot readily distinguish what is implemented, what has passed recently, what is unreleased, and what has produced results across teams.

For a selective Staff interview, I would want to see the person behind the system: the constraints you inherited, decisions you led, tradeoffs you accepted, people you enabled, and outcomes you can substantiate. More components and more prose will not substitute for that evidence. GitLab's public Staff Frontend description provides one useful reference for cross-team improvements, technical direction, coaching, and complex delivery; it is an illustrative benchmark, not a universal hiring formula. [Staff Frontend Engineer responsibilities](https://handbook.gitlab.com/job-description-library/engineering/development/frontend/staff/)

| Dimension | Assessment of the public artifact | Most valuable next step |
|---|---|---|
| Visual presentation | Cohesive branding and a convincing product identity | Reduce navigation and documentation density |
| Foundation tooling | A clear strength; practical exploration and copying | Make every offered choice and copied example valid |
| Engineering architecture | Strong documented breadth | Link claims to source, exact versions, and passing evidence |
| Component documentation | Useful state examples; uneven API completeness | Establish one accurate consumer-facing contract |
| Information architecture | Learnable, but requires knowledge of internal categories | Add a task-oriented entry point and unified component index |
| Accessibility | Guidance and tooling are present; updated docs describe blocking checks | Verify implementation and publish bounded evidence of tested behavior |
| Governance and delivery | More developed than a typical portfolio Storybook | Show how the process works in a real contribution or migration |
| Staff portfolio evidence | Promising technical signals; insufficient attribution and outcomes | Add a concise, factual case study linked from the intro |

## 2. Scope and evidence rules

This is a broad public-site audit with documentation review, visual inspection, and selected live interactions. It is not a repository code review, a completed WCAG conformance audit, or exhaustive testing of every story.

The deployment changed between the initial inspection and the resumed inspection. The resumed build includes PrimeNG categories, Testing telemetry, Troubleshooting, What's new, Component status, Profile Card/Profile Drawer naming, and more accessibility guidance. Contribute now documents `parameters.a11y.test = 'error'`; the earlier build described `todo`. **Do not create tickets to add these things as though they are absent.**

Evidence labels used below:

- **Observed:** visible content or behavior inspected in the browser.
- **Documented:** the site states that a process or capability exists; its implementation was not independently executed.
- **Initial-pass:** observed before the deployment changed; revalidate before changing code.
- **To verify:** a question for source inspection or further testing, not a proven defect.
- **Recommendation:** an editorial or product judgment to validate with users.

No exact deployed commit was exposed or recorded in this audit. Agent A00 must pin the working baseline. A page saying that CI runs a check is evidence of documentation, not evidence that the latest build passed that check.

### Coverage

| Area | Coverage |
|---|---|
| Intro, app onboarding, contribution, writing stories, CSS architecture, PrimeNG customization, release process, AI strategy | Read during initial pass; Contribute re-read in resumed build |
| Token pipeline, CSS-first surface, Figma sync, sync status | Read during initial pass |
| Token finder, colors, spacing, typography, borders, elevation, shadows, radius, focus, layout, grid, scroll shadow, motion, icons | Broad docs review; selected playground interactions; not every primitive entry or variant |
| Custom components | Initial docs review across Accordion, Copyable Text, Detail List, Drawer, Empty State, Form Field, Icon, Input Clear, List, Avatar, profile-card predecessor, Skeleton Slot, Timeline |
| Current components and shells | Form Field, NavShell and TopNav read; profile-drawer predecessor read initially; SubNavShell load attempted |
| Newly added docs | Testing telemetry, Component status and What's new read; Troubleshooting presence verified |
| Newly added PrimeNG catalog | Forms composition and navigation reviewed; other groups inventoried, not exhaustively exercised |
| Application patterns | Presence and governance classification reviewed; individual iSHARE interactions not fully tested |
| Interaction checks | Token copying; color preview changes; contrast combinations; spacing auto; typography role change and token suffix; border generator; Accordion keyboard toggle |
| Outside completed coverage | Source/CI execution, package install, full drawer keyboard cycle, screen readers, full FR/NL behavior, mobile/reflow matrix, browser compatibility, performance budgets |

## 3. What is already good and should be preserved

### A system with boundaries

The docs distinguish stock PrimeNG behavior, Plectrum theming, structural overrides, custom components, and application patterns. This is valuable engineering judgment. Keep the reuse-first approach; do not manufacture wrappers just to make the catalog look proprietary. The new [PrimeNG Forms page](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/primeng-forms--docs) makes the endorsed composition concrete: Form Field owns labels/hints/errors, while input behavior remains upstream.

### Useful tools, not only swatches

The token finder starts with a practical question: what are you styling? The explorer supports filtering, grid/table views, and copying names, values, or `var()` references. Copying `var(--pds-color-text-muted)` worked. The color playground changed the preview and output when a different pair was selected. The contrast tool showed a failing white-on-white pair correctly. The border generator produced an appropriate inline-start/danger/large-radius class combination.

### Honest operational constraints

The token pipeline distinguishes imported Figma values from code-owned tokens and documents review/promotion. Its sync-status page exposes a timestamp, token counts and allowlisted gaps. The Figma write-back automation is explicitly parked behind a plan constraint. This is better than presenting an imaginary fully automated workflow. Preserve the distinction between manual and automated steps. [Token pipeline](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-token-pipeline--docs)

### Governance and contribution already exist

Ownership, Core/Candidate/App-specific/Deprecated status, promotion, reuse-before-build, and package boundaries are described. These are strengths, not missing checklist items. The next improvement is making the process actionable and demonstrating a real example. [Contribute](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/get-started-contribute--docs)

### Delivery and agent architecture are unusually substantive

Changesets, coordinated packages, packed-consumer smoke tests, generated-file checks, metadata contracts, a generated index, and scaffolding describe a coherent delivery model. These are **documented capabilities**, not independently verified successes. The AI strategy also acknowledges metadata limitations instead of claiming perfect generation. Strengthen those existing mechanisms rather than building a second competing documentation pipeline. [Releases](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-releases-and-versioning--docs), [AI strategy](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-ai-strategy--docs)

### Meaningful compositions and state coverage

The catalog goes beyond isolated buttons: cards, lists, navigation shells, drawers, loading examples, wrapping examples and app-specific patterns show composition. The renamed Profile APIs and explicit ownership classification are already in the current build. Do not propose another generic renaming campaign without an actual consumer need.

## 4. Findings to address first

Priority definitions: **P0** blocks a dependable demonstration or adoption path; **P1** materially affects trust, usability or interview readiness; **P2** improves an already functioning experience. Priority does not imply a security severity.

| ID | Priority / evidence | Finding | Why it matters | Required outcome |
|---|---|---|---|---|
| F01 | P0 investigation; observed intermittent | SubNavShell and TopNav produced `ChunkLoadError` during sidebar navigation. Requests used the host root rather than the Storybook subpath. Reloading TopNav succeeded. | A reviewer can reach a failure screen through normal browsing. | Establish cause; prove fresh deep links and cross-page navigation work from the deployed subpath. Do not describe the entire site as permanently broken. |
| F02 | P1; observed in resumed build | Token contracts reports **28 broken references among 254 consumption entries**. | The system's own trust surface exposes unresolved discrepancies. | Classify every discrepancy and resolve the source, metadata, or inspector issue; retain honest diagnostics. |
| F03 | P1; observed and rechecked | Spacing playground permits `gap` + `auto` and outputs `o-layout--gap-auto` / `var(--pds-spacing-auto)`. Initial computed inspection returned `gap: normal`. | The tool teaches an unsupported CSS value for that property. | Offer auto only where valid; copied code must match an effective supported style. |
| F04 | P1; observed and rechecked | Typography playground outputs `--pds-text-body-md-line`; the actual line-height token inspected initially was `--pds-text-body-md-line-height`. | Copying the reference silently loses the intended line height. | Generate names from the real contract; show the complete intended typography recipe. |
| F05 | P1; observed and rechecked | Spacing calls itself an 8-point scale while declaring half of a 14px base, i.e. 7px, with fractional steps. | The explanation contradicts the values it teaches. | Correct the model and examples; do not change the established scale merely to fit the prose. |
| F06 | P1; observed in resumed build | Form Field API descriptions/defaults are dashes. NavShell's table omits `items` although controls expose it. TopNav prose describes inputs/outputs absent from its API table. | A consumer cannot confidently implement against the page alone. | Publish complete, source-verified inputs, outputs, types, defaults and composition requirements. |
| F07 | P1; observed in resumed build | Contribute recommends Node 18.19+, 20.11+ or 22 while the intro identifies Angular 21. | A newcomer can select an unsupported environment. | Derive a precise compatibility matrix from the repository's actual versions. |
| F08 | P1; observed contradiction | Contribute says token lint fails on hex/px; its gate table describes other failure cases. Initial pipeline docs say hardcoded-value strict mode is local-only. | Teams cannot tell which rules CI really enforces. | Reconcile rules with runnable configuration and distinguish enforced checks from review policy. |
| F09 | P1; observed | What's new lists work under Unreleased and says no published changelog exists yet. | Package-install and release language can imply more maturity than the public evidence establishes. | Clearly label current docs/build versus released packages; verify availability before promising an install path. |
| F10 | P1; observed | Component status includes PrimeNG base values such as `Api`; all 15 modification timestamps were identical. | A generated table can look authoritative while offering misleading lineage or freshness. | Fix or clarify field semantics; distinguish generated time, source modification and human review. |
| F11 | P1; recommendation | No concise, substantiated account of your authorship and cross-team outcomes is readily discoverable. | Strong infrastructure alone does not establish Staff scope or impact. | Add a factual case study linked from the intro. |
| F12 | P2; observed / recommendation | Numerous Status-only stories, broad Docs section and separate upstream/custom catalogs add navigation decisions. | The user must understand the implementation taxonomy before finding a solution. | Provide a unified task-oriented index and simplify low-value navigation entries. |

Sources for key findings: [Token contracts](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-token-contracts--docs), [Spacing playground](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/story/foundations-spacing--playground), [Spacing docs](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-spacing--docs), [Typography playground](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/story/foundations-typography--playground), [Form Field](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-form-field--docs), [NavShell](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-navigation-navshell--docs), [TopNav](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-navigation-topnav--docs), [Component status](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-component-status--docs), [What's new](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-what-s-new--docs).

For F07, Angular's official table specifies Angular 21's Node ranges as `^20.19.0 || ^22.12.0 || ^24.0.0`. Select the project's supported range deliberately rather than copying an unbounded “22+” statement. [Angular version compatibility](https://angular.dev/reference/versions)

### Important qualifications

- F01 occurred in a session spanning a changing deployment. Incorrect asset-base handling, stale chunks and deployment consistency are hypotheses to distinguish, not established root causes. Failed requests included `https://solidaris-danielbodigil.github.io/6778.55434e3f.iframe.bundle.js`; the runtime itself loaded under `/solidaris-plectrum/storybook/`.
- F02 does not prove 28 visible component defects. Missing declarations, stale metadata and scope-sensitive inspection can produce different classes of discrepancy.
- F04 concerns the copied token reference. The visible typography preview changed fonts and sizes correctly when switching roles.
- The intentional failing pair in the contrast checker is useful behavior, not a product accessibility defect.
- Current docs describe blocking accessibility tests. Do not retain the superseded claim that they are globally non-blocking. Verify the actual configuration and latest run.
- The existence of an unreleased changelog does not prove packages have never been published through another process; package availability remains to be checked.

## 5. Information architecture and ease of use

**The Storybook is usable after orientation, but the easiest path is not always the most obvious path.** Experienced contributors will appreciate the depth. A new application developer is more likely to encounter internal architecture before answering a concrete implementation question.

### Keep

- Get started near the top.
- A prominent Token finder.
- Local page navigation for long documents.
- Ownership and reuse status visible on component pages.
- Explicit distinction between Plectrum changes and upstream behavior.

### Improve

1. **Make Browse components land on a catalog.** The initial intro CTA landed on Accordion. A unified index should include upstream, custom and shell components, with filters for purpose and implementation kind. Link to existing stories; do not duplicate implementations.
2. **Use familiar product names as entry points.** Someone looking for Select should find it even though it lives within PrimeNG / Forms. Preserve searchable individual component names and aliases. Use “Avatar” as the human label while showing the exact exported symbol in the API.
3. **Remove badge-only navigation noise.** Status information belongs in docs and the index. Hide Status-only stories from normal browsing where supported, while preserving meaningful interactive stories and test coverage.
4. **Explain related foundation pages.** Shadows versus Elevation, Layout versus Flex Grid, Radius versus Borders should have a one-sentence relationship and a clear recommended starting point.
5. **Make the logo behavior predictable.** The manager logo links to zeroheight. Prefer local Introduction as the home destination and an explicit external Design guidelines link.
6. **Avoid a global reshuffle before validating the index.** A unified landing page may solve most discovery problems without breaking existing story URLs.

### Proposed navigation model

| User intent | Recommended destination | Existing content to reuse |
|---|---|---|
| Understand what Plectrum is | Introduction | Existing hero, concise scope and links |
| Install and render something | Get started / Use in an app | App onboarding + Troubleshooting |
| Choose a component | Components index | PrimeNG groups, Custom components, Shell |
| Pick visual values or layout | Foundations | Token finder and existing foundation docs |
| Build a whole flow | Patterns | Shell composition and app-owned examples |
| Understand system internals | Engineering | CSS architecture, token pipeline, AI contracts, testing |
| Propose, maintain or upgrade | Contribute and releases | Contribution process, status, What's new, versioning |

This is an information model, not an instruction to rename every sidebar group immediately. Preserve stable deep links or provide a tested migration map when titles change.

### Usability acceptance tasks

Run a short moderated evaluation with representative developers and a designer. These are proposed tests, not measured results:

- Find the endorsed Select composition and its input-label requirements.
- Find a text color suitable for a muted label and copy the reference.
- Add a spacing utility without reading CSS architecture first.
- Determine whether a component is reusable by another application.
- Find the supported Node version and render one component in a clean app.
- Identify the latest released version versus the current documentation build.

Record success, wrong turns, assistance and time. Use the current experience as the baseline rather than inventing an improvement percentage. Testing telemetry may help record this moderated work; it is not a CI dashboard or proof of adoption.

## 6. Intro and documentation

### Introduction

The branded hero, version context and role-oriented paths give the system an identity. Keep them, but shorten the first screen around four questions: What is it? Who is it for? How do I start? What can I safely use?

Suggested content structure:

1. One sentence defining the Angular/PrimeNG system and its intended application context.
2. Visible compatibility and maturity information: documentation build, release state, supported framework versions.
3. Four direct tasks: Use in an app, Find a component, Choose a token, Contribute.
4. A compact explanation of stock PrimeNG, Plectrum components, and application patterns.
5. Links to design guidance, code/issue entry points where accessible, and a separate engineering case study.

Replace an architecture-heavy “first hour” with one successful consumer journey. Put deeper source-of-truth and pipeline explanations below it or on the engineering page. Explain which system owns which concern instead of making an unrestricted “single source of truth” claim across Figma, zeroheight, tokens and code.

Do not turn the practitioner homepage into a résumé. A clearly labeled “Engineering case study” can serve hiring reviewers without interrupting consumers.

### App onboarding

The existing installation/provider/style path and packed-consumer reference are useful. Complete the loop with one minimal working component: exact imports, provider configuration, styles, template, and a visible expected result. Make package access requirements explicit if applicable. Replace repository placeholders with a real accessible route or clearly explain access requirements. Verify examples against the actual supported environment.

Troubleshooting now exists: link to it at likely failure points rather than adding a duplicate FAQ. Confirm that missing styles, font/icon registration, registry authentication and framework incompatibility are covered where relevant. [Use Plectrum in an app](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/get-started-use-plectrum-in-an-app--docs)

### Component documentation contract

Use a small common structure, with optional sections only where relevant:

| Section | Required content |
|---|---|
| Purpose | What problem it solves; when to use and when to choose an alternative |
| Ownership | Owner, reuse/lifecycle status, and what that status does and does not guarantee |
| Minimal usage | A consumer-ready example with actual imports and required providers/styles |
| API | Inputs, outputs, types, defaults, requiredness, projected content and relevant interfaces |
| States | Meaningful interaction, content and failure states; avoid duplicate showcase stories |
| Accessibility | Keyboard contract, names/roles/states, labeling responsibilities, tested limits |
| Design and upstream | Canonical Figma reference, PrimeNG boundary, customization rationale |
| Evidence | Applicable tests, last verified version/commit and known limitations |

Distinguish **story controls** from **public API**. Accordion already explains this distinction; apply it consistently. Show code can contain story args or a demonstration template without being a complete consumer example. Verify the copyable usage path independently.

Current Form Field has use/anatomy/accessibility guidance; improve its API and validate the rendered label/hint/error relationships instead of rewriting it from scratch. TopNav likewise has useful boundary and accessibility prose, but the tabular contract remains incomplete.

### Engineering docs

The content is substantial but repetitive structures such as Definition, Architecture, Process, Roles, Rules, Glossary and Reference can make ordinary tasks feel procedural. Use a short decision or workflow first, followed by technical detail. Keep the long references searchable.

Add a small number of decision records explaining tradeoffs: why the CSS architecture fits the constraints, why components remain upstream or custom, how aliases and fallbacks work, and why certain synchronization steps are manual. Verify whether Storybook-only styles forwarded from the shared main stylesheet affect consumer bundles before treating that as a defect.

Clarify that a last successful token promotion is not necessarily the latest attempted synchronization. Link status to the exact input revision and run where available. Avoid describing allowlisted or snapshot-scoped checks as universal live Figma equality.

## 7. Foundations and playgrounds

The foundations are one of the strongest parts of this portfolio. The improvement is consistency and decision support, not adding more swatches.

| Foundation | What works | Improvement |
|---|---|---|
| Token finder | Starts from styling intent; offers recommendations and snippets | Make it the main foundation entry; verify all task choices; hide empty Controls panels |
| Colors | Runtime values, search, copy, preview and contrast checker | Group choices by role; put pair contrast beside the preview; distinguish semantic choices from feature/internal tokens |
| Spacing | Real visual bars and utility guidance | Fix auto/property mismatch and 8-point wording; sort fractional stops numerically; show expression and resolved length |
| Typography | Semantic roles, sample text, real font preview | Fix line-height token; show full role including letter spacing where defined; name copy modes clearly; expose size with family/weight/line height |
| Borders and radius | Useful generator and semantic status roles | Reduce repeated radius material; make side/style/role choices explicit; verify every emitted class exists |
| Shadows and elevation | Role-based utilities and expandable complex values | Explain token versus utility relationship; provide a task-first elevation entry |
| Layout and Flex Grid | Practical overflow, dimensions, alignment and responsive recipes | Lead with recommended recipes; reconcile base-class requirements with snippets |
| Focus | Dedicated ring tokens and keyboard examples | Validate focus visibility across relevant surfaces, forced colors and real component states |
| Motion | Replay and reduced-motion guidance | Verify preference handling; distinguish standard transitions from approved feature exceptions |
| Scroll Shadow | Progressive enhancement and fallback explanation | Verify the browser-support statement against the supported browser matrix |
| Iconography | Search, style and size exploration; initial result limit | Test familiar-name discovery and keyboard use; provide a complete registration example |
| Token contracts | Makes dependency drift visible | Resolve/classify the 28 reports; provide actionable owner/source links |

The initial Semantic Common page mixed 232 tokens, including 121 component/feature tokens, and spacing showed 49 feature entries alongside 15 scale entries. Preserve that diagnostic inventory, but make recommended semantic or scale choices the default view. Documentation-demo values should not appear to be general application recommendations.

### Common playground requirements

- Start with a meaningful valid default.
- Expose only supported combinations; internal `category` strings should not be freely editable consumer controls.
- Keep preview, selected value and copied code synchronized.
- Generate token names from the actual contract instead of concatenating assumed suffixes.
- Label authored expression, alias/fallback and runtime value distinctly.
- Give copy actions clear accessible names and feedback.
- Explain why a choice is appropriate, not only what it looks like.
- Support reset and a useful empty-search state.
- Keep normal content readable at narrow widths and with larger text.

Do not treat all playgrounds as requiring the same UI machinery. Shared behavior is useful; a large generalized framework is unnecessary unless existing duplication justifies it.

## 8. Accessibility, quality and release evidence

Current Contribute says accessibility violations fail stories through `a11y.test = 'error'`. That is the appropriate behavior to verify; the earlier `todo` finding is superseded. Storybook documents the difference between warning-only and failing modes. Automated checks cover only part of accessibility, so a green panel must not become a blanket conformance badge. [Storybook accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)

Initial Accordion testing confirmed keyboard Space toggled the disclosure; the inspected accessibility scan showed zero violations in that tested state. This is a useful narrow result, not proof that all interactions are accessible.

Prioritize meaningful checks:

| Component or flow | Behavior to verify |
|---|---|
| Profile Drawer / overlay compositions | Initial focus, contained tab sequence where modal, Escape, close control, focus restoration, accessible title |
| Form Field | Programmatic label association, described hint/error, required state, invalid timing, projected-control responsibility |
| Input Clear | Keyboard activation, emitted action, field focus retention and name |
| Copyable Text | Success and failure feedback, clipboard-unavailable behavior, accessible confirmation |
| NavShell / SubNavShell / TopNav | Hover and keyboard equivalence, current item, toggle state, search focus behavior and menu keyboard interaction |
| List | Actual interaction semantics, selection/expansion state, empty/loading/error behavior where supported |
| Empty State and Skeleton Slot | Deterministic canonical test examples, correct announcement responsibility, loading transitions |
| FR/NL stories | Real translated strings, accessible names and long-label layout; do not count the toolbar alone as coverage |

The modal drawer test should follow the component's intended modality and the relevant APG behavior. Do not force a non-modal persistent panel into a modal focus trap. [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

Use existing Angular/webpack-compatible story tooling. Do not prescribe a framework migration or Vitest integration without checking supported project tooling. Add interaction assertions for behavior rather than a token `play` function that merely exists. [Storybook interaction testing](https://storybook.js.org/docs/writing-tests/interaction-testing)

Visual tests should use deterministic fixtures. The Empty State's initial documentation described random illustrations by default; pin an illustration in canonical visual tests without automatically removing intentional production behavior. Record baseline ownership and approval rules. Chromatic is described as optional in Contribute, while What's new broadly says it runs in CI: reconcile the exact current configuration.

The new Component status page describes reuse governance. Keep that separate from maturity, test coverage, accessibility review and release availability. “Core — safe in every application” should be qualified as an ownership/reuse statement, not an absolute compatibility or quality guarantee.

## 9. What would strengthen the Staff case

Create one focused case study, with links to the best live examples. Use evidence you can share and distinguish team outcomes from your personal contribution.

| Evidence | Question to answer | Acceptable artifact |
|---|---|---|
| Scope and authorship | What did you inherit, design, implement, lead or influence? | Explicit contribution statement and project timeline |
| Architectural judgment | Which alternatives did you reject and why? | Two or three concise decision records with consequences |
| Cross-team influence | How did another team adopt or contribute successfully? | A real migration/contribution narrative, review history or anonymized example |
| Reliability | How did you prevent or recover from drift and regressions? | Linked test/build report and one concrete incident or prevention example |
| Delivery | Can a consumer install and upgrade the system independently? | Verified clean consumer demonstration and actual release/migration artifacts |
| Outcomes | What changed for users or teams? | Measured baseline and follow-up with method, sample and caveats |
| Leverage through tooling | Did contracts/scaffolding/agents reduce work or errors? | A small task comparison with recorded failures and human review, not speculative savings |

Possible outcome measures include onboarding completion, migration effort, repeated defects, contribution turnaround, or time to find and apply a token. Choose a few that matter and can be measured honestly. Do not invent application counts, adoption percentages, accessibility compliance, time savings or revenue impact.

The Testing telemetry page documents an opt-in, disabled-by-default tool for moderated sessions with CSV/JSON export. That is a useful research capability and potential case-study ingredient. Its existence does not establish successful research or product analytics adoption. [Testing telemetry](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-testing-telemetry--docs)

## 10. Agent execution plan

### Coordinator rules

This document authorizes a plan, not changes to the repository in this audit session. Future implementation agents should follow the actual user's execution request and the repository's applicable instructions.

1. Read applicable `AGENTS.md` and existing project rules. Resolve paths from the real checkout; locations below are candidates taken from published docs.
2. Pin the commit and deployment being assessed. Reproduce findings before editing because the public site changed during the audit.
3. Mark each item confirmed, already fixed, not reproducible, or blocked with evidence.
4. Preserve Angular/PrimeNG architecture and package boundaries unless a task supplies a concrete reason to change them.
5. Edit authoritative source, regenerate derived files, and check drift. Never patch generated output to conceal source problems.
6. Do not fabricate quality badges, run results, impact metrics or author contributions.
7. Do not rename public APIs, change token values or widen product scope solely to make the portfolio appear more sophisticated.
8. Use isolated reviewable changes. Coordinate shared files; parallel work is appropriate only for independent ownership scopes and when authorized in that implementation session.
9. Follow existing authorization for commits, PRs, publishing and deployment; do not assume this audit requests any of them.

### Work packages

#### A00 — Establish a reproducible baseline

**Priority:** prerequisite. **Owner:** coordinator / architect. **Dependencies:** none.

Inspect the checkout, scripts, Storybook configuration, metadata/index generation, package versions and CI workflows. Inventory story IDs, docs pages and public exports. Reproduce F01–F10 and retain exact steps, results and current status. Record which findings were already fixed.

**Deliver:** baseline report containing commit, build/deployment identity, evidence matrix, inventory and commands that actually exist. Assign owners to the remaining work.

**Acceptance:** no ticket treats a superseded finding as current; no guessed commands or paths are presented as verified. The report distinguishes source checks, browser checks and documented claims.

#### A01 — Investigate and fix intermittent story loading

**Priority:** P0 investigation. **Owner:** frontend/platform engineer. **Dependencies:** A00.

Reproduce navigation from a fresh session and a session that stays open across deployment. Inspect asset-base configuration, lazy chunk URLs and deployment consistency. The observed sequence involved NavShell → SubNavShell → TopNav, followed by successful TopNav reload. Determine whether the failure is persistent routing, stale assets or another cause before editing configuration.

**Candidate locations:** Storybook builder/preview configuration and GitHub Pages deployment workflow; discover actual paths.

**Acceptance:** the built site works under `/solidaris-plectrum/storybook/`; fresh direct links and in-app transitions across lazy-loaded groups succeed; console/network records show no relevant chunk-load failures. If deployment transitions are the cause, document and test the chosen recovery/deployment behavior. Do not hide the error overlay as a fix.

**Deliver:** root-cause note, minimal fix if needed, and targeted deployed-subpath smoke coverage. If not reproducible, retain the evidence and state the investigation limit.

#### A02 — Restore token-contract accuracy

**Priority:** P1. **Owner:** token auditor. **Dependencies:** A00.

Classify all 28 reported discrepancies against real declarations, references, scope, imported styles and metadata. Separate undeclared tokens, stale names, alias problems and inspector false positives. Resolve each in its authoritative source. Improve owner/source/action information on the report if needed.

**Candidate locations:** `libs/styles/src/01-settings`, `libs/plectrum/src/tokens.json`, component `.metadata.ts` files, token inspector and generation scripts.

**Acceptance:** every discrepancy has a documented disposition; genuine missing references fail an appropriate check; legitimate scoped tokens do not produce misleading failures. Use an intentionally invalid fixture or mutation to demonstrate detection. No blanket allowlist or deletion of metadata merely to turn the count green.

**Deliver:** classification table, source fixes, regenerated artifacts and focused validation evidence.

#### A03 — Correct and standardize foundation playground behavior

**Priority:** P1. **Owner:** UX engineer. **Dependencies:** A00; coordinate token names with A02.

Fix F03–F05. Use property-aware spacing options and numeric ordering. Derive typography references from the actual contract and include its full supported recipe. Correct scale language without changing the scale. Remove irrelevant editable implementation controls. Keep copy output, preview and value labels synchronized.

**Acceptance:** gap/padding cannot generate auto; margin auto remains available where supported; displayed classes exist and have the intended effective behavior. Typography copied names resolve and match the role. Test representative role/property boundaries and invalid-input handling rather than writing assertions that merely repeat implementation strings. Reset and copy work by keyboard.

**Deliver:** focused fixes and an agreed lightweight playground convention for subsequent pages.

#### A04 — Make component APIs trustworthy

**Priority:** P1. **Owner:** frontend engineer with documentation reviewer. **Dependencies:** A00.

Start with Form Field, NavShell and TopNav. Compare Angular public inputs/outputs/types/defaults against metadata, controls and API tables. Determine the canonical extraction strategy using the existing compiler/documentation tooling. Add missing composition interfaces and complete minimal consumer usage. Fix Component status lineage labels such as `Api`; define timestamp semantics.

**Candidate locations:** `libs/ui/src/lib`, existing metadata/index generator, `.ai/contracts/index.json`, Storybook docs templates.

**Acceptance:** the pilot pages expose the real public contract without dash-only placeholders; story-only args are clearly identified; outputs and required interfaces are covered; minimal usage compiles in the consumer fixture. A deliberate metadata/API mismatch is detected if an automated consistency gate is introduced. Generated files remain reproducible.

**Deliver:** pilot implementation, bounded rollout inventory for remaining components, and documentation-source precedence rules. Avoid creating a second manually maintained API truth.

#### A05 — Verify behavioral and accessibility gates

**Priority:** P1. **Owner:** tester / accessibility specialist. **Dependencies:** A00; integrate relevant A01–A04 fixes.

Confirm actual a11y failure configuration and CI execution. Inspect existing play assertions and use the critical-flow matrix in section 8. Exercise a complete real drawer cycle, field/error association, clear/copy feedback and navigation search/menu behavior. Check representative narrow layouts, enlarged text, reduced motion and forced colors where applicable. Record one appropriate screen-reader pass with environment and limits.

**Acceptance:** relevant checks fail on real regressions and pass for the corrected flows. Any remaining exceptions have an owner, rationale and review target; do not introduce blanket disabled scans. Manual results name the exact component/state and environment. Visual fixtures are deterministic. Reports distinguish automated and manual coverage.

**Deliver:** corrected behaviors where needed, meaningful tests, and an evidence summary. Do not claim full WCAG conformance from axe results.

#### A06 — Improve discovery and the introductory journey

**Priority:** P1 for landing paths; P2 for broad reorganization. **Owner:** UX engineer / researcher. **Dependencies:** A00; coordinate shared docs with A04/A07.

Implement the smallest change that solves the tasks in section 5: unified component index, honest Browse CTA, task-led intro, clear Token finder route and less Status-only clutter. Reuse the new PrimeNG pages and existing status data. Add searchable component names within grouped upstream examples. Clarify logo/home behavior and external destinations.

**Acceptance:** the task evaluation records a baseline and revised outcomes; no invented improvement metrics. Existing deep links still resolve or have a documented tested migration. Index destinations work and show ownership plus implementation kind without implying unverified quality. Navigation labels are consistent and accessible.

**Deliver:** IA mapping, implemented entry points and a short usability result with unresolved issues.

#### A07 — Reconcile onboarding, release and enforcement claims

**Priority:** P1. **Owner:** platform/documentation engineer. **Dependencies:** A00; package smoke may depend on A04.

Fix Node/framework compatibility and the clone/install path. Verify registry/package availability and create an end-to-end consumer example using the project's actual supported versions. Reconcile lint strictness, accessibility configuration, optional Chromatic execution and release claims. Link the existing Troubleshooting and What's new pages. Show documentation build identity separately from released package versions.

The current changelog lists Profile renames as unreleased. Determine whether there are released consumers before choosing aliases, migration notes or breaking-version handling. Do not imply an unreleased rename already shipped.

**Acceptance:** a clean supported consumer can follow the documented path; commands match scripts; stated CI gates match workflow conditions and fail criteria; main/unreleased docs are labeled honestly. No fictitious published version or retrospective migration is created.

**Deliver:** verified setup guide, compatibility/release labels, accurate gate table and actual test/run references where accessible.

#### A08 — Produce the Staff engineering case study

**Priority:** P1 for applications. **Owner:** documentation lead with Daniel supplying factual evidence. **Dependencies:** A00; can draft structure while technical work proceeds.

Use section 9 to build a concise narrative: context, personal remit, constraints, decisions, implementation, rollout, outcomes and lessons. Link a small set of concrete examples such as token drift handling, a consumer migration and a reusable contribution path. Label work still in progress and distinguish your contribution from collaborators' work.

**Acceptance:** every quantitative claim has a source or is omitted; attribution is reviewed by Daniel; no inaccessible source is the sole explanation of a key claim. A reviewer can understand the scope in five minutes and follow links for depth. The practitioner intro remains useful to consumers.

**Deliver:** case-study page/draft, evidence ledger, and a short factual question list for missing input. Missing outcome data must not block correctness fixes in other work packages.

#### A09 — Verify the integrated result and hand off

**Priority:** final gate. **Owner:** coordinator / tester. **Dependencies:** applicable A01–A08 work.

Run the repository's required gates and targeted checks for risks introduced by these changes. Verify the actual built/deployed subpath where authorized, not only a local development server. Recheck key navigation tasks, copied examples, token report, API pilots, release labeling and known critical interactions.

**Acceptance:** each finding has a final status linked to source change and evidence; unresolved limitations are visible; no broad pass claim rests solely on documentation. Stop optional testing once required gates and concrete risks are covered.

**Deliver:** review-ready handoff with commit, changed files, generated artifacts, exact commands and outcomes, manual checks, remaining risks and any deployment step still awaiting the implementation session's authorization.

### Sequencing and ownership

| Wave | Work | Integration constraint |
|---|---|---|
| 0 | A00 baseline | Required before changing findings into implementation tickets |
| 1 | A01 reliability; A02 tokens; A03 playgrounds; A04 API pilots; A07 setup truth | Separate file ownership; coordinate shared token metadata and docs templates |
| 2 | A05 verification; A06 discovery; A08 case study | Reuse corrected contracts and factual evidence; do not publish speculative claims |
| 3 | A09 integration/handoff | Verify the exact resulting build and close the evidence ledger |

These are dependency groups, not calendar estimates. Estimate after inspecting the checkout. A01 should receive immediate attention if the load failure reproduces; do not let an unreproducible intermittent symptom stall independent confirmed fixes indefinitely.

### Suggested coordinator prompt

> Read this audit and the repository instructions. Pin the current commit and classify F01–F12 as confirmed, already fixed, not reproducible or blocked. The live deployment changed during the audit, so verify before editing. Execute the authorized work packages in dependency order, using existing Angular/PrimeNG tooling and authoritative sources. Preserve public contracts unless a verified migration need requires change. Fix source and regenerate derived files. Do not create fictional adoption, accessibility, release or performance evidence. Return reviewable changes with exact validation results and remaining limits. Follow the user's existing authorization for any external publication or deployment.

## 11. Nice-to-haves after the trust fixes

| Enhancement | When it earns its cost |
|---|---|
| Shareable playground settings | Teams regularly exchange precise examples during review |
| Preset comparison view | Multiple supported presets create real upgrade decisions |
| Token change impact view | Existing uses/usedBy data can reliably identify affected components |
| Versioned documentation | Multiple released package versions are actively supported |
| Search synonyms and richer filters | Usability sessions show repeated discovery failures |
| Bundle/performance budgets | Measurements identify a meaningful consumer cost to control |
| Figma/code connection improvements | A concrete design-to-code task is slowed by missing mapping |
| More patterns | A repeated product need demonstrates the value of standardization |
| Additional themes or dark mode | Product demand and support commitments justify the added surface |

Do not prioritize a custom Storybook skin, another component framework, a universal playground engine, exhaustive snapshots, or more AI-generated prose over correctness and evidence.

## 12. Final readiness checklist

- [ ] The public reviewer journey loads reliably, including shell pages and deep links.
- [ ] The 28 token reports are resolved or accurately explained with accountable dispositions.
- [ ] Spacing and typography playgrounds emit valid, resolving examples.
- [ ] Framework requirements and package availability are accurate.
- [ ] Representative component APIs are complete and consumer examples work.
- [ ] Accessibility/test claims match actual configuration and recorded results.
- [ ] The component index makes upstream/custom/shell options easy to discover.
- [ ] Intro and docs distinguish current development from released support.
- [ ] A concise case study explains Daniel's decisions, scope and substantiated outcomes.
- [ ] Remaining gaps are explicit; no invented badges, metrics or guarantees substitute for evidence.

Apply with the project now, describing its current state honestly. The highest-value improvement before a serious interview is a dependable five-minute demonstration supported by one convincing engineering case study.
