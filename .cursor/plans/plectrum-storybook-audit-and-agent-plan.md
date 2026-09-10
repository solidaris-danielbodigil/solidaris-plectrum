# Plectrum: consumer Storybook audit and October handoff plan

Revision 2.1 — 9 September 2026  
Supersedes the plan dated 8 September 2026.  
Revision 2.1 records that **Testing telemetry** and **Troubleshooting** were removed from Storybook Docs on purpose and must not be restored there.  
Revision 2.2 (9 September 2026, evening) records the implementation of B00–B05 — see §10.  
Target: [Plectrum Storybook](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/introduction--docs)

## 1. Corrected objective

**Plectrum is a customer deliverable. Its Storybook should help application teams choose, understand, implement and verify the system.** It should not become Daniel's portfolio or the permanent home of every maintenance document.

Daniel clarified that the extensive Docs section is temporarily collecting knowledge for his October 2026 handoff. Most organizational and maintenance documentation will move to Confluence or another customer-owned platform. That context changes the earlier assessment and priorities.

This revision separates three concerns:

| Concern                         | Audience                                           | Destination                                                       | Success criterion                                                     |
| ------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| Use Plectrum                    | Application developers and designers               | Storybook, with concise links to related guidance                 | Find the appropriate component/token and use it correctly             |
| Maintain Plectrum after October | Design-system owners, maintainers and contributors | Customer knowledge base, backed by authoritative repository files | Operate, change, release and troubleshoot without depending on Daniel |
| Demonstrate Staff-level work    | Hiring reviewers                                   | Daniel's own portfolio and interview material                     | Explain judgment, scope, influence and substantiated outcomes         |

**Corrections to the first plan:**

- Withdraw the requirement to put a personal engineering case study on the customer's Storybook homepage.
- Do not interpret the temporary handoff documentation as the intended final consumer IA.
- Do not require architecture, CI dashboards, governance procedures or impact metrics to remain in Storybook to make it “Staff-worthy.”
- Judge consumer usability and operational handoff separately. A smaller Storybook can be the better result.
- Keep implementation requirements, accessibility responsibilities and compatibility information near the live components. Moving general documentation must not strip the consumer contract.
- Preserve code, tests, schemas, generated manifests and executable instructions in the repository when that is their authoritative home. Confluence explains and links to them; it should not become a manually maintained substitute for code.

The earlier assessment overemphasized making Staff evidence visible within this customer artifact. The stronger Staff signal here is leaving a focused product and an independently maintainable system. The final hiring narrative can explain that work elsewhere.

## 2. Second-round findings and changes since the first audit

This round used the live deployment on 9 September. The Component status page reports **index generated 9 September 2026, 08:15 UTC**. That is an index timestamp, not proof of a deployment commit or a passing CI run.

### Improvements confirmed

| Previous finding                                   | Current observation                                                                              | Revised disposition                                                                                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F02: 28 broken token references out of 254 entries | Token contracts now displays **226 / 226 contracts**, with no broken-reference warning           | Close the old visible-warning ticket. Perform one source-level reconciliation; do not ask agents to fix the obsolete count                                                 |
| F06: incomplete Form Field API                     | Descriptions, types, requiredness/defaults and `requiredLabel` are present                       | Substantially addressed for this page; shift to example correctness                                                                                                        |
| F06: NavShell omitted items and outputs            | API now includes `items: NavItem[]`, `activeItemId` and `itemClicked`                            | Addressed in the inspected published table                                                                                                                                 |
| F06: TopNav lacked much of its API                 | Extensive inputs and outputs now present, including search, menu and controlled-state contracts  | Substantially addressed; improve progressive disclosure rather than add another table                                                                                      |
| F06: Profile Drawer incomplete contract            | Inputs, model and outputs are now documented                                                     | Preserve; some interactive controls still have inappropriate editor types                                                                                                  |
| F10: misleading modification timestamps            | Status page now gives a clearly labeled index generation time and a Used by column               | Timestamp concern addressed                                                                                                                                                |
| F10: status inventory hard to use                  | Page states names link to docs, includes status filters and dependency information               | Useful progress; still an Angular-only inventory, not a complete consumer catalog                                                                                          |
| Toolbar treated as an iSHARE Candidate             | Toolbar is now under Custom components, marked Core; the pending changelog records its promotion | Do not propose promoting or renaming it again                                                                                                                              |
| Release-state presentation                         | What's new now clearly separates pending changesets, bump levels and “No release yet”            | Better transparency; reconcile with the intro/install language                                                                                                             |
| Testing telemetry and Troubleshooting in Docs      | Removed from Storybook Docs by the owner; they must not live in this consumer catalog            | Do not restore either page. Telemetry remains a repository/export concern; troubleshooting belongs in Get started (consumer) or the maintainer runbook, not a Docs section |

Sources: [Token contracts](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-token-contracts--docs), [Form Field](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-form-field--docs), [NavShell](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-navigation-navshell--docs), [TopNav](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-navigation-topnav--docs), [Component status](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-component-status--docs), [Toolbar](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-toolbar--docs), [What's new](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-what-s-new--docs).

The reduction from 254 to 226 entries is exactly 28. The public page alone cannot show whether every removed entry was stale metadata or whether any real consumption was accidentally omitted. Verify that once in source; this is a bounded integrity check, not an allegation that the fix concealed defects.

### Current consumer findings

P0 means investigate first because normal consumption is interrupted. P1 means correct before handoff unless explicitly accepted as debt. P2 means improve when it solves a demonstrated usability problem.

| ID  | Priority         | Evidence from this round                                                                                                                          | Action                                                                                       |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| R01 | P0               | Normal navigation produced intermittent chunk-load failures again, including SubNavShell and subsequent documentation pages                       | Diagnose asset-base/deployment behavior and add a cross-page navigation check                |
| R02 | P1               | Spacing still offers `auto` for `gap`; output is `o-layout--gap-auto`, computed gap is `normal`                                                   | Constrain supported property/value combinations                                              |
| R03 | P1               | Typography still outputs `--pds-text-body-md-line`, which resolves empty; `--pds-text-body-md-line-height` resolves to `1.714rem`                 | Generate and display actual token names                                                      |
| R04 | P1               | Spacing still describes an 8-point scale while defining half a 14px base and fractional stops                                                     | Correct the explanation; preserve established values                                         |
| R05 | P1               | Form Field's embedded docs examples repeat `story-form-field-oa` and `story-form-field-reference` input IDs                                       | Make IDs unique per rendered example and verify label/error associations                     |
| R06 | P1 investigation | Default Profile Drawer opened while focus remained on its trigger; Escape from the close control closed it, then focus was on the document body   | Verify and correct focus entry/return and intended modality in isolated and embedded stories |
| R07 | P1               | Intro advertises package v0.1.0 and published installs, while What's new says “No release yet”; setup lacks a complete rendered component example | Clarify current availability and prove the consumer path                                     |
| R08 | P1 handoff       | Contribute still lists Node 18.19+, 20.11+ or 22 and gives conflicting lint enforcement descriptions                                              | Correct before migration; moving a page does not fix its content                             |
| R09 | P2               | Profile Drawer `visible: model<boolean>` has “Set string”; `labels` object has “Set string”; `data` uses a text editor                            | Fix story control mappings without changing the public API                                   |
| R10 | P2               | Selecting Border in Token finder works but returns 40 tokens including text, placeholder and background values                                    | Narrow recommendations to border roles; retain an explicit broader reference view            |
| R11 | P2               | Component status still shows PrimeNG base `Api` for List, ProfileCard and TopNav                                                                  | Correct lineage semantics or omit this internal field from the consumer index                |
| R12 | P2 / migration   | Intro's Browse components still links to Accordion; Status-only stories remain; initial contributor routes will become obsolete when docs move    | Update the consumer entry paths during documentation cutover                                 |

### Reproduction notes and limits

**R01 — navigation:** a fresh audit browser session navigated through NavShell to SubNavShell and received a chunk-load error. The failed URL was at the host root, for example `https://solidaris-danielbodigil.github.io/9320.4c0eb92f.iframe.bundle.js`, rather than under `/solidaris-plectrum/storybook/`. Later navigation from a shell page to Component status failed at the host-root `docs-component-status-mdx.66482d74.iframe.bundle.js`; Contribute also failed before a reload recovered it. SubNavShell and TopNav did render successfully at other points. Investigate base URL, router/decorator interactions, lazy asset loading and deployment consistency. The root cause is not established; do not mark all shell stories as permanently broken.

**R02–R04 — foundations:** select gap and then auto in [Spacing Playground](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/story/foundations-spacing--playground). Inspect the output and effective gap. Compare the default reference in [Typography Playground](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/story/foundations-typography--playground) with the declared line-height variable. The defect is the copied reference, not the visible font rendering. The misleading scale description is in [Spacing docs](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-spacing--docs).

**R05 — Form Field:** the docs page embeds multiple stories in one document. Each pair of vertical examples reuses the same input ID; the horizontal pair does likewise. Invalid controls did have `aria-invalid="true"` and error `aria-describedby` references, and required controls had `aria-required="true"`: preserve those improvements. Label text in this page was `O.A.*()` / `NISS*()`, whereas the PrimeNG Forms invalid example showed `(required)`. Investigate the story's label/default wiring; do not conclude that required semantics are universally absent. Test docs compositions as well as isolated stories.

**R06 — Profile Drawer:** in the [Default embedded example](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/shell-profile-drawer--docs), clicking its trigger opened the panel but the active element remained the trigger. The open panel exposed `role="complementary"` without an inspected accessible label or `aria-modal`; the API describes modal as true by default. Pressing Escape from the Fermer button closed the panel; the observed active element afterward was body. This is a targeted finding in that embedded example, not a completed focus-trap or screen-reader audit. Verify intended modality, headless-template responsibilities and isolated behavior before choosing the fix. The docs' statement that PrimeNG owns focus behavior does not replace an integration test. [W3C modal-dialog behavior](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

**R07–R08 — compatibility:** [Contribute](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/get-started-contribute--docs) still recommends Node versions that do not match the intro's Angular 21. Angular's official table gives `^20.19.0 || ^22.12.0 || ^24.0.0` for Angular 21. Confirm actual package versions and publish a deliberate supported range. [Angular compatibility](https://angular.dev/reference/versions)

Token finder changed correctly from text guidance to border guidance. Copy produced a success toast with the intended token; this round's clipboard read did not independently confirm the clipboard contents. Do not call copying broken or fully verified on that evidence alone.

## 3. Content placement: what stays, moves or splits

Use this decision rule: **keep content beside the example when a consumer needs it to implement or use the component correctly. Move content that explains how to own or operate the system to the maintainer knowledge base.**

The destination platform is not yet specified. “Knowledge base” below means the customer-selected Confluence space or equivalent, not a new platform recommendation. No external migration has been executed in this audit.

| Existing content                                                                    | Final home                                                                                     | What remains in Storybook                                                                                             |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Introduction                                                                        | Storybook                                                                                      | Short purpose, available version, four consumer tasks, support and design links                                       |
| Use Plectrum in an app                                                              | Storybook, or a single canonical consumer guide linked prominently                             | Exact installation/provider/style requirements and a first working example must remain directly reachable             |
| Contribute: proposal and help entry                                                 | Split                                                                                          | Short “request a change / report a problem” route, support owner and reuse-status definitions                         |
| Contribute: ownership model, promotion, reviews, scaffold, internal setup           | Knowledge base + repository                                                                    | Link to the canonical maintainer guide                                                                                |
| Writing stories                                                                     | Maintainer guide + repository template                                                         | Real component stories and component-specific usage instructions                                                      |
| CSS architecture                                                                    | Split                                                                                          | Only the supported consumer class/token contract, layout recipes and customization boundaries                         |
| CSS architecture: ITCSS internals and authoring rules                               | Knowledge base + versioned repository rules                                                    | No requirement to learn the folder structure to consume a component                                                   |
| Token pipeline: design, commands, promotion and Figma operations                    | Knowledge base + repository scripts                                                            | Brief token usage/provenance note where relevant                                                                      |
| CSS-first surface                                                                   | Split                                                                                          | Supported public tokens/utilities and examples; internal generation detail moves                                      |
| Figma sync and sync status                                                          | Maintainer runbook / generated operational report                                              | Relevant design-kit links; no operational dashboard required in the consumer tree                                     |
| Token contracts                                                                     | Maintainer diagnostics, local/CI report, or a separate maintenance view                        | Optional specific consumed-token details if useful; no need for the global audit in Foundations                       |
| PrimeNG customizations                                                              | Split                                                                                          | What differs from upstream, supported composition, relevant warnings and links to upstream API                        |
| PrimeNG customization implementation inventory                                      | Maintainer guide + repository                                                                  | No duplication of SCSS internals on every consumer page                                                               |
| Releases and versioning                                                             | Split                                                                                          | Current availability, compatibility, upgrade instructions and breaking-change impact                                  |
| Release process, credentials ownership, version/publish/rollback procedure          | Maintainer runbook + repository automation                                                     | Link to operational docs only where needed                                                                            |
| What's new                                                                          | Consumer release notes may stay                                                                | Distinguish released from unreleased; explain consumer impact and migration steps                                     |
| Component status                                                                    | Split or reuse as index data                                                                   | Human component names, owner/support, reuse/lifecycle status, docs links                                              |
| Metadata generation, dependency graph and internal lineage                          | Repository / maintainer diagnostics                                                            | Do not expose `Api`/atomic category fields merely because the generator provides them                                 |
| AI strategy and agent protocols                                                     | Knowledge base explanation + repository instructions/contracts                                 | No required consumer AI page                                                                                          |
| Testing telemetry                                                                   | Repository (`libs/ui` export + iSHARE wiring) and research/maintainer knowledge base if needed | **Do not restore** a Docs/Testing telemetry page. Consumer Storybook is not the home for the user-testing capture API |
| Troubleshooting                                                                     | Split by audience; **not** a Storybook Docs page                                               | Consumer installation, styling, imports, icons and usage failures stay on Get started / the relevant component page   |
| CI, publishing, token-sync and tooling troubleshooting                              | Maintainer runbook                                                                             | Link from the maintainer entry point. **Do not restore** a Docs/Troubleshooting page                                  |
| Foundations and playgrounds                                                         | Storybook                                                                                      | Recommended tokens, live previews, valid output, usage guidance and relevant accessibility                            |
| Component API, states, keyboard behavior, labels, slots and supported customization | Storybook                                                                                      | Keep these close to the live component                                                                                |
| Shell integration                                                                   | Storybook                                                                                      | Practical app-shell composition and controlled state/routing responsibilities                                         |
| App-specific patterns                                                               | Optional clearly labeled examples or a separate app catalog                                    | Keep only useful reference compositions; never imply they are generic public APIs                                     |
| Personal impact, authorship and Staff case study                                    | Daniel's own portfolio                                                                         | No personal case study or recruitment CTA in the customer's Storybook                                                 |

Do not delete whole MDX pages based on the Docs folder alone. Mixed pages need to be split. A maintainer-oriented title can contain a consumer rule that would otherwise be lost.

### Prevent documentation drift

- Assign one authoritative home per fact. Keep public API/types/defaults tied to source; keep executable commands and configuration versioned.
- Confluence can explain workflows and link to the matching repository revision, generated reference and Storybook examples.
- Do not manually copy generated API tables or live token inventories into Confluence.
- For policy prose, select one canonical maintained copy and link to it elsewhere. If customer workflows require a mirror, define its synchronization owner and rule.
- Record content owner, last reviewed date and applicable package/build version where useful. A page generation timestamp is not human review evidence.
- Existing zeroheight design guidance is already referenced. Map its role alongside the new knowledge base rather than creating a third duplicate set of design principles.

## 4. Recommended final consumer experience

### Introduction

The current branded hero is polished and appropriate for a customer. Preserve the Solidaris identity. Shorten the content after the hero around these tasks:

1. **Use Plectrum in an app:** supported environment, install, provider/styles, first rendered component.
2. **Find a component:** a small unified index that links to existing PrimeNG, custom and shell pages.
3. **Choose a token or layout:** Token finder and recommended foundation recipes.
4. **Get help or request a change:** customer-owned contact/issue route and concise support guidance.

The current “First hour” starts by skimming foundations and ends with learning two internal contracts. Replace that with a successful implementation path. Consumers should not need to understand token promotion or ITCSS maintenance before using a component.

Move maintainer onboarding and architecture routes out of the primary call-to-action group when their destinations are ready. The final Storybook may have one clearly labeled “Maintainer documentation” external link. Do not use placeholder Confluence links or remove content before its destination is available.

Make version language consistent across intro, install instructions and What's new. Being unreleased is acceptable during handoff preparation; presenting an unverified install as an available release is confusing. Do not rush a release purely for appearance.

### Navigation

A suitable final structure is:

| Section                    | Purpose                                                                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Introduction / Get started | Understand scope and render the first example                                                                                                  |
| Components                 | Find a solution; retain meaningful PrimeNG/custom/shell grouping if it helps                                                                   |
| Foundations                | Find recommended values and layout techniques                                                                                                  |
| Patterns                   | Optional compositions with explicit reuse scope                                                                                                |
| Updates and support        | Releases, upgrades and support route. Known consumer failures stay on Get started or the component page — not a standalone Troubleshooting doc |

This is a target information model, not a mandate to rename every story title. Begin with the index and corrected entry links. Preserve stable story IDs where possible; use a migration map when destinations move.

The current status index omits CSS-only blocks by design. Do not turn it into the complete consumer catalog without including those supported options and relevant PrimeNG entries. A consumer searches for a solution, not for an Angular class with metadata.

Badge-only Status stories can leave normal navigation while retaining useful state stories and coverage. Grouped PrimeNG pages are reasonable theme proof; searchable labels should still lead someone looking for Select, DatePicker or AutoComplete to the correct example.

### Component docs

The recent API improvements should be retained. Do not migrate types, defaults, slots, outputs, two-way models or accessibility responsibilities away from their components.

Prefer this compact order:

- Purpose and when to choose it.
- Working example and minimal consumer code.
- Essential controls; advanced controls collapsed when appropriate.
- Relevant states and composition examples.
- Complete API, including exported data interfaces or an accessible link to their definition.
- Keyboard/accessibility responsibilities and supported customization boundaries.
- Design/upstream reference, owner and support route.

TopNav now has a long controls table followed by a long API table. That is useful completeness but heavy repetition. Keep full reference information and make common controls easy to scan. Profile Drawer's object and boolean-model editors should match their actual values. API accuracy and control-editor quality are separate issues.

For Profile Drawer, remove promotion-history wording such as “management wants the dossier drawer everywhere” from the eventual consumer introduction. Keep intended use, supported data shape and limitations. Promotion rationale belongs in the maintainer record. Domain-specific sample content is fine when clearly an example; another rename is not required.

### Foundations and playgrounds

Keep them in Storybook. They are directly useful to consumers, not merely handoff documentation.

| Area                                 | Recommended adjustment                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Token finder                         | Keep task-based selection. Show relevant recommendations first; Border should not lead with text/background tokens       |
| Spacing                              | Fix gap/auto, numeric ordering and scale explanation; show useful resolved lengths alongside expressions                 |
| Typography                           | Fix line-height reference; include the full supported typography role; keep real font previews                           |
| Colors                               | Keep semantic choices, preview and contrast close together; distinguish recommended roles from primitive/internal values |
| Borders/radius and shadows/elevation | Explain which page to start with and how utility classes relate to tokens; avoid duplicate encyclopedic material         |
| Layout and grid                      | Keep ready-to-use recipes for wrapping, overflow, responsive layout and shell composition                                |
| Focus and motion                     | Keep consumer behavior and accessibility requirements; move authoring pipeline details                                   |
| Iconography                          | Keep search, supported names/styles/sizes and complete consumer registration/import guidance                             |
| Global token contracts               | Move to maintainer diagnostics; retain the check and its ownership                                                       |

Spacing still defaults to all 64 entries, including 49 component/feature entries. A scale-first default is a useful consumer improvement; retain the full inventory as an advanced reference. Do not remove internal diagnostics from the engineering workflow just because they leave consumer navigation.

The Token finder currently tells readers to add tokens in `01-settings` or bridge PrimeNG variables. Split those authoring actions from consumption guidance. A consumer with a missing token should see the supported request/customization route; the maintainer can follow the detailed implementation rules elsewhere.

## 5. October handoff requirements

The exact departure date and receiving owners have not been supplied. Use the following as proposed milestones, not commitments made on the customer's behalf.

| Stage                           | Target                                                         | Evidence of completion                                                                                        |
| ------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Scope and ownership             | September, before bulk migration                               | Destination platform/space, receiving owner and content map agreed                                            |
| Correctness and migration draft | Before the rehearsal                                           | Priority consumer defects addressed; contradictory setup/process claims corrected; destination pages prepared |
| Receiving-team rehearsal        | Preferably at least one week before the actual October handoff | Another maintainer completes essential tasks using the documentation                                          |
| Cutover and acceptance          | Before Daniel's departure                                      | Links and permissions verified; content owners accept; remaining risks have accountable owners                |

### Minimum maintainer handoff pack

Each runbook should state purpose, prerequisites, steps or source-linked commands, expected outcome, failure/recovery route, owner and verification date.

1. **System map:** package boundaries, upstream dependencies, supported consumers, source-of-truth map and important constraints.
2. **Local setup and contribution:** accurate environment requirements, installation, story development, generated outputs and review responsibilities.
3. **Token change:** input/proposal, validation, reviewed promotion, generation, consumer impact and recovery. Include the actual manual Figma steps and current access constraints.
4. **Component change:** reuse decision, contract/schema, styles, stories, meaningful tests, documentation and compatibility review.
5. **Release and upgrade:** actual versioning/publish workflow, customer-controlled access ownership, consumer smoke check and rollback/recovery procedure. Link to credential management; do not put secrets in documentation.
6. **Quality and troubleshooting:** which checks really block, which are optional, where results live, how to handle an accepted exception, and relevant build/navigation recovery.
7. **Open work:** known defects, pending decisions, incomplete integrations, unreleased changes, next action and accountable owner.
8. **Support and ownership:** receiving teams/roles, request channel, escalation route and backup for essential maintenance tasks. Do not invent people or response-time commitments.

### Rehearsal tasks

Have a receiving maintainer, rather than Daniel narrating every step:

- Set up the repository and render the catalog.
- Make one safe example/component change and run the relevant checks.
- Follow a representative token change through validation without changing production unexpectedly.
- Exercise the packed-consumer/release preparation path using a dry run or review branch as appropriate.
- Locate the response procedure for a failed token check or broken Storybook build.

Have an application developer follow the consumer setup and implement one real component. Record where either person needs undocumented help. That exposes handoff gaps more effectively than increasing page count.

The migration is complete only when destination access, ownership and links work for the receiving team. A copied page with no accountable maintainer is not a completed handoff.

## 6. Revised agent work packages

The first plan's A00–A09 packages are superseded by B00–B08 below. Future agents should not execute both lists. This audit revises the plan only; it does not modify the repository or publish documentation.

### B00 — Pin the baseline and classify the backlog

**Owner:** coordinator. **Priority:** prerequisite. **Depends on:** none.

Read applicable repository instructions and discover actual scripts/paths. Record source commit, deployed build if available, package versions and documentation destinations. Classify R01–R12 as reproduced, already fixed, not reproducible or blocked. Keep old F identifiers only in the change log.

Perform the one-time reconciliation of token metadata reduction and sample the new API tables against source. Do not reopen resolved visible defects merely because the old report mentioned them.

**Deliver:** baseline/evidence matrix, actual file map and ownership assignments. Separate public-site observation, source verification, CI results and user-supplied context.

**Acceptance:** every implementation task has a current reason and a defined owner; no guessed commands or claims of passing checks.

### B01 — Fix cross-page loading reliability

**Owner:** frontend/platform maintainer. **Priority:** P0. **Depends on:** B00.

Reproduce shell-to-shell and shell-to-doc navigation, not only fresh direct URLs. Inspect how the built asset base behaves under the GitHub Pages subpath, including router/decorator effects and deployment consistency. Use the observed host-root requests as evidence, not as a presumed root cause.

**Deliver:** minimal source/configuration fix, cause explanation and targeted navigation smoke coverage.

**Acceptance:** a fresh session can browse NavShell → SubNavShell → TopNav → a docs page without a relevant chunk-load failure; direct links also work under the deployed subpath. If the cause involves deployment transitions, verify the chosen recovery behavior. Hiding the error screen is not a fix.

### B02 — Repair foundation output and recommendation quality

**Owner:** UX engineer / token maintainer. **Priority:** P1 fixes; P2 filtering. **Depends on:** B00.

Fix R02–R04, narrow Border recommendations, sort spacing values numerically and remove irrelevant editable implementation controls. Use real token/class contracts to generate examples. Change prose rather than silently migrating the scale.

**Deliver:** corrected spacing and typography stories, targeted finder filtering, small shared conventions where reuse is justified.

**Acceptance:** gap and padding cannot emit auto; valid margin-auto behavior remains. All displayed typography references resolve. Representative selected values, effective preview styles and copied output agree. Tests exercise invalid combinations and real contract resolution, not a hardcoded copy of the implementation's strings.

### B03 — Verify composed examples and repair accessibility/control issues

**Owner:** component engineer with accessibility reviewer. **Priority:** P1. **Depends on:** B00; B01 if loading blocks verification.

Fix duplicate IDs in embedded Form Field stories and investigate the empty required-label text. Verify label association and error descriptions for each example. Test Profile Drawer focus entry, keyboard containment where modal, Escape, accessible naming and focus return in both standalone and docs contexts. Preserve valid non-modal behavior if supported.

Correct Profile Drawer control-editor types and verify complete consumer data examples. Keep the recently improved API tables; do not rebuild them from scratch.

**Deliver:** focused story/component fixes, behavioral tests and a bounded manual result.

**Acceptance:** labels identify their own fields across the full docs page; IDs are unique; required/error output is intentional. Modal behavior follows the chosen accessible contract and focus returns appropriately. Objects use appropriate editors, booleans are not presented as strings, and examples remain usable after control changes. Actual source/CI evidence is recorded; no blanket accessibility certification.

### B04 — Build the content migration map and maintainer pack

**Owner:** documentation lead with receiving maintainer. **Priority:** P1 handoff. **Depends on:** B00.

Inventory MDX sections and repository references. Apply section 3's keep/move/split rules. Select the existing customer-approved destination, create reviewable migration-ready content and assign canonical ownership. Correct stale Node and conflicting lint/test/release claims before copying them. Preserve links to versioned code, templates and commands. Testing telemetry and Troubleshooting are already retired from Storybook Docs — treat that as an accepted placement decision, not a gap to backfill.

For each item record: current story/page and anchors, section scope, target document, canonical source, owner, access audience, incoming links, migration status and verification evidence.

**Deliver:** migration ledger and ready-to-review handoff pack. If the destination space is not yet known, use clearly labeled unresolved target fields in the draft; do not invent URLs.

**Acceptance:** every removed section has a destination or an explicit retirement reason; consumer content survives the split; maintainers can locate the authoritative commands and rules. Documentation drafting and preparation can proceed before external write authorization; publishing follows the implementation session's actual authorization.

### B05 — Complete the consumer setup and reduce navigation friction

**Owner:** UX engineer / consumer integration engineer. **Priority:** P1 setup; P2 IA polish. **Depends on:** B00 and B04's mapping; final removal depends on B07.

Build one verified first-component path, explain actual package access/version availability, and resolve the install/version/changelog mismatch. If `@solidaris/tokens-cli` is required, include its installation and configuration; if optional, label it accurately. Reuse the existing packed-consumer fixture rather than inventing an unrelated sample.

Shorten the intro, fix Browse components, provide a small unified index, improve common/advanced controls and remove Status-only navigation noise safely. Retain supported CSS-only and upstream options in discovery. Do not introduce a new large documentation framework for this task.

**Deliver:** consumer entry points, runnable example, focused IA changes and a story-link map.

**Acceptance:** a developer can find an endorsed component, implement it and locate support without reading maintainer runbooks. Version language is consistent. Existing deep links resolve or have a deliberate replacement. Customer branding remains appropriate; no personal portfolio material is inserted.

### B06 — Rehearse maintenance and record open risks

**Owner:** receiving maintainer; Daniel supports observation. **Priority:** P1 handoff. **Depends on:** B04 draft; relevant B01–B03 fixes.

Run the rehearsal tasks from section 5. Compare runbook instructions with what actually happens. Correct undocumented steps, clarify access ownership and record blocked work. Execute required gates using the project's actual Angular/PrimeNG tooling; do not prescribe a framework upgrade for appearance.

**Deliver:** rehearsal record, updated runbooks and owner-assigned residual backlog.

**Acceptance:** the receiving team can perform agreed essential tasks without undocumented intervention. Any uncompleted task has a reason, next action and accountable owner. No invented “handoff complete” badge or claimed CI success.

### B07 — Cut over documentation and verify the final customer experience

**Owner:** coordinator / documentation maintainer. **Priority:** P1 completion gate. **Depends on:** destination readiness, B04, B05 and B06.

Only after destination pages exist and are usable by the intended team, update links and remove or replace the temporary Storybook content. Search incoming links in the intro, badge explanations, foundation pages and component docs. A short bridge page is acceptable where it preserves useful old links without duplicating the whole document.

**Deliver:** final consumer navigation, tested destination/link map and handoff acceptance record.

**Acceptance:** no unexplained broken links, placeholder destinations or duplicated authoritative instructions. Consumer examples retain their implementation and accessibility guidance. Required repository checks and targeted deployed navigation checks pass, with exact results recorded. Remaining maintenance knowledge has a reachable, owned home.

### B08 — Capture professional evidence separately

**Owner:** Daniel. **Priority:** optional personal work; never a customer handoff blocker. **Depends on:** real evidence from the work.

Record constraints, choices, tradeoffs, personal contribution, collaboration and outcomes in Daniel's own portfolio material. A focused consumer catalog plus a successful transfer of maintenance is useful evidence of Staff-level judgment. Use only material appropriate to share, with accurate attribution and no invented adoption or time-saved metrics.

**Deliver:** separate portfolio notes or case-study draft if requested. **Acceptance:** nothing personal is added to the customer Storybook to satisfy this audit.

### Sequence

| Stage                          | Packages           | Coordination                                                     |
| ------------------------------ | ------------------ | ---------------------------------------------------------------- |
| Baseline                       | B00                | Required before accepting old findings as implementation work    |
| Correctness and preparation    | B01, B02, B03, B04 | Separate file ownership; shared docs/templates need coordination |
| Consumer journey and rehearsal | B05, B06           | Use corrected behavior and migration draft                       |
| Cutover                        | B07                | Destination/access and receiving ownership must be ready         |
| Personal evidence              | B08                | Independent and outside customer acceptance                      |

This is a planning dependency map, not authorization to spawn agents, modify external platforms or deploy. Future implementation should follow the user's actual authorization and repository instructions.

### Coordinator prompt

> Treat Plectrum as a customer design system preparing for an October 2026 handoff. This revision supersedes the earlier audit plan. Revalidate the current source/build and execute only authorized work. Keep component usage, API, states, accessibility, foundations and consumer setup in Storybook. Prepare architecture, governance and maintenance material for the customer-selected knowledge base, with code and generated contracts remaining authoritative in the repository. Do not remove remaining temporary docs until their destinations, links, access and owners are ready. Do not restore Testing telemetry or Troubleshooting in Storybook Docs. Preserve the recent API/token/status improvements and fix the remaining demonstrated issues. Keep Daniel's personal Staff case study outside the customer deliverable. Return reviewable changes, exact verification results, migration status and owner-assigned remaining risks.

## 7. What “Staff-worthy” means in this context

The customer does not need a bigger Storybook to support Daniel's career. It needs a system that another team can use and maintain confidently.

| Signal                    | Where it should be visible                                                     |
| ------------------------- | ------------------------------------------------------------------------------ |
| Consumer empathy          | Clear discovery, valid examples, useful foundations and minimal setup          |
| Technical judgment        | Reliable contracts, appropriate upstream reuse and maintainable implementation |
| Quality ownership         | Real tests and corrected integration behavior, with known limits               |
| Organizational leverage   | Receiving teams can contribute, operate and release independently              |
| Scope and personal impact | Daniel's separate portfolio/interview narrative                                |

My assessment remains that the project contains credible Staff-level signals. The latest API and status changes improve the consumer artifact materially. A lean final Storybook is compatible with that assessment. Operational details leaving Storybook are not a loss of quality when their destination is reliable and owned.

The highest-value next steps are loading reliability, valid playground output, composed-example accessibility and the handoff migration. A successful October transfer would be more relevant evidence than adding another long engineering page to the customer catalog.

## 8. Nice-to-haves and explicit non-goals

After the priority work, consider shareable playground state, better search aliases, compact preset comparison and targeted usability sessions if real consumer tasks justify them. Versioned docs become useful when multiple released versions actually need support.

Do not require:

- A personal Staff case study inside Storybook.
- A full governance/architecture/AI handbook in consumer navigation.
- A new docs platform when the customer already has an appropriate one.
- A rewrite of the Angular/PrimeNG system or another component renaming campaign.
- A broad dark-mode/theme expansion without customer demand.
- Full-copy migration of generated API/token tables into Confluence.
- More components, prose or badges simply to look more senior.

## 9. Coverage and completion checklist

This was a targeted second-round live audit, not a repeat of every first-round story. Re-read: Introduction, app setup, Contribute, token contracts, spacing docs/playground, typography playground, Form Field, NavShell, SubNavShell, TopNav, Component status, What's new, Toolbar, Token finder, Profile Drawer and PrimeNG Forms. Inspected the intro visually and tested selected controls, navigation, runtime CSS references and drawer behavior.

Not completed: repository/CI review, package installation, external knowledge-base inspection, full mobile/browser/FR-NL matrix, full keyboard/focus-trap testing or screen-reader audit. Broader first-round observations are historical context unless explicitly rechecked here. Destination decisions in this plan are recommendations, not claims that content has already moved.

- [x] Current fixes and remaining findings are classified against a pinned baseline (§10, B00).
- [x] Normal navigation no longer produces relevant chunk-load failures (§10, B01 — root cause fixed, negative and positive proof recorded).
- [x] Spacing and typography output is valid and resolving (§10, B02).
- [x] Embedded forms and drawer integration meet their tested accessibility contract (§10, B03 — Karma + browser checks; not a full screen-reader audit).
- [x] Consumer setup matches available packages and supported versions (§10, B05).
- [x] Storybook retains the information needed to use components correctly (no consumer page removed in this pass).
- [ ] Maintainer content is corrected, migrated and owned before removal — corrected; migration ledger drafted (`docs/handoff/migration-ledger.md`); destination and owners unresolved.
- [ ] Internal/external links and receiving-team access are verified — internal links verified; external destination does not exist yet.
- [ ] Another maintainer completes the agreed rehearsal tasks (B06 — needs a receiving maintainer).
- [ ] Remaining work has an accountable owner and a next action — listed in `docs/handoff/maintainer-pack.md` §7; owners unresolved.
- [x] Personal career evidence remains separate from customer acceptance (nothing added to Storybook).

## 10. Implementation record — revision 2.2

Executed 9 September 2026 against `main` @ `f152b62` (Node 24.13.0, Angular 21.2.16, PrimeNG 21.1.9, Storybook 10.4.2). Nothing committed; nothing deployed; no external platform touched. B06, B07 and B08 were not executed: they need a receiving maintainer, a named destination, or Daniel.

### B00 — classification

| ID | Result | Where |
|---|---|---|
| R01 | reproduced in source + runtime, fixed | `libs/ui/src/storybook/story-router.ts`, nav-shell / sub-nav-shell stories, `tools/scripts/storybook-nav-smoke.mjs`, `ci.yml` |
| R02–R04, R10 | reproduced, fixed | `foundations/spacing*.{ts,mdx}`, `foundations/typography*.ts`, `storybook/token-finder.component.ts`, `token-explorer.component.ts` (`nameFilter` input) |
| R05, R06, R09 | reproduced, fixed | `lib/form-field/*`, `lib/profile-drawer/*`, `storybook/arg-types-from-props.ts` |
| R07, R08, R11, R12 | reproduced, fixed | `docs/introduction*`, `docs/get-started-*`, `docs/component-status.mdx`, `storybook/docs-component-index.component.*`, `storybook/docs-hero.component.ts`, root `package.json` `engines` |
| F02 token metadata reduction (254 → 226) | reconciled | All 28 removed entries were either `--p-*` PrimeNG bridges scoped to BEM wrappers (16, never `:root --pds-*`) or `--pds-*` names not declared anywhere in `libs/styles` (12). No consumed token was dropped; CSS unchanged. |

### B01 — root cause of R01

`iframe.html` ships `<base target="_parent">` with **no href**, so Angular's `PathLocationStrategy` falls back to `location.origin` as base href. NavShell and SubNavShell stories used `provideRouter([])`; the initial navigation to `/…/iframe.html` cannot match, and the router's error recovery calls `replaceState` with the empty URL tree — the iframe URL becomes the **host root** (observed locally: `http://localhost:6006/`). The Pages build uses a relative `publicPath` (`./`), so every later lazy chunk is requested from `https://host/<chunk>.js` instead of `/solidaris-plectrum/storybook/<chunk>.js` and the next page fails. Locally the dev server is at the root, so it never showed.

Fix: `provideStoryRouter()` — `provideRouter` with a componentless `**` route plus `MockLocationStrategy`, so routerLink hosts render and react but the browser URL is never touched. Regression spec `story-router.spec.ts`. Cross-page smoke `npm run test-storybook:nav` stages the build under `/solidaris-plectrum/storybook/` and walks NavShell → SubNavShell → TopNav → Component status → Contribute → NavShell → Form Field, asserting the preview stays at `<deploy path>/iframe.html` and no chunk 404s. Negative proof: with `provideRouter([])` reinstated the smoke reports `preview URL rewritten … http://localhost:6006/` and the next page times out; with the fix it passes. Wired into `ci.yml` `storybook-tests` (build now sets `STORYBOOK_PUBLIC_PATH=./` like the deploy). A `<base href>` pin in `preview.ts` was tried and reverted: it breaks SVG `url(#id)` references (NavShell logo) once Storybook rewrites `?id=`.

### Verification (exact)

| Command | Result |
|---|---|
| `npx ng test ui --watch=false --browsers=ChromeHeadless` | Executed 338 of 338 SUCCESS |
| `npx ng test ishare --watch=false --browsers=ChromeHeadless` | Executed 204 of 204 SUCCESS |
| `npx ng build ishare --configuration=production` | complete, initial 1.07 MB |
| `npm run tokens:audit` / `tokens:check-prefix` / `tokens:lint` | PASS / passed / ok |
| `npm run generate-index` · `npm run changelog:build` · `git diff --stat` on generated files | index unchanged (15 components); 0 releases, 4 changesets; no generated-file diff |
| `STORYBOOK_PUBLIC_PATH=./ npm run build-storybook` then `npm run test-storybook:ci` | Test Suites 52 passed / 52; Tests 252 passed / 252 (was 260 — 8 exported helpers in `spacing.stories.ts` / `typography.stories.ts` were being indexed as stories; moved to `spacing-playground.ts` / `typography-playground.ts`) |
| `npm run test-storybook:nav` | passed, 7 pages under `/solidaris-plectrum/storybook/` |
| `npx tsc -p libs/ui/.storybook/tsconfig.json --noEmit` | clean |

### Facts established (B05)

- `@solidaris/ui`, `@solidaris/plectrum`, `@solidaris/styles`, `@solidaris/tokens-cli` are all `0.1.0` and **unpublished**; `release.yml` (Changesets) is configured but has never produced a release; consumers get packed tarballs (`npm run pack:libs`, smoke in CI). `library-publish.yml` is the parked Figma webhook, not npm.
- `@solidaris/tokens-cli` is optional for consumers.
- Supported Node: `^20.19.0 || ^22.12.0 || ^24.0.0` (Angular 21). CI runs 20, Pages deploy 24. Root `engines` updated from the stale `^18.19.1 || ^20.11.1 || ^22.0.0`.
- There is no lint gate (`ng lint` has no target); Contribute now lists the real gates only.

### Left for the receiving team

- `docs/handoff/migration-ledger.md` and `docs/handoff/maintainer-pack.md` are drafts with every destination/owner field `unresolved`.
- Follow-ups noticed but out of this pass: `p-selectbutton` in profile-drawer references `ariaLabelledBy="c-profile-drawer-view-switch"` with no such element; section heading ids in the drawer are static (duplicate if two drawers coexist); `// 8px` / `// 16px` comments in `_settings.spacing.scss` are wrong for a 14px root.
