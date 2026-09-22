# Plectrum Storybook: UX audit and implementation plan

Reviewed 22 September 2026. Intended role, confirmed by the owner: **the main documentation home for both designers and developers**.

**Verdict: useful today, but not yet a consistently reliable self-service design-system home.** The strongest custom-component pages and token tools are substantial. The gaps are audience onboarding, finding the right solution, consistent UX decision guidance, and trust in installation and example code.

My indicative documentation maturity rating is **6/10**. This is an expert-review judgment, not a measured usability score, industry ranking, or component-quality certification.

| Dimension | Score | Reason |
|---|---:|---|
| Designer onboarding | 4/10 | Figma links exist, but the first-hour journey is entirely developer-oriented. |
| Developer onboarding and reuse | 6/10 | Detailed setup and architecture; conflicting release instructions and an incomplete generated example interrupt reuse. |
| Discovery and navigation | 5/10 | Name search works, but the catalogue is fragmented and task-oriented search misses existing content. |
| Component usage guidance | 7/10 | Form Field, Empty State and Drawer contain useful guidance; PrimeNG family pages are substantially thinner. |
| Foundations | 7/10 | Strong live token exploration; weaker guidance for composing actual designs. |
| Accessibility guidance and evidence | 6/10 | Concrete ARIA and keyboard advice exists; target labels need a clearer relationship to verified results. |
| Governance and contribution | 7/10 | Ownership and proposal rules are explicit; contribution is lengthy and mixes reader roles. |
| Workflow patterns | 4/10 | The visible Patterns section contains two iSHARE-specific components rather than reusable workflow guides. |

The equal-weight average rounds to 6/10. Scores identify relative gaps; a one-point difference should not be treated as statistically meaningful.

**What was reviewed**

I read 19 Plectrum pages: Introduction; Use Plectrum in an app; Component status; Contribute; What's new; PrimeNG Actions and Forms; Form Field; Empty State; Drawer; Delay Prediction Card; Token finder; Semantic Common colors; Typography Roles; Layout; Focus; Transitions; Spacing; Iconography. I also inspected the navigation tree, rendered layouts, expanded example source, and Figma link destinations.

Interaction checks: searching `button` returned relevant components; searching `error` returned no components despite error documentation on Form Field. Changing the visible Form Field invalid control to True updated the example's `aria-invalid` and error-description association. Its generated source was inspected, not compiled in a consumer project.

This was a desktop documentation and heuristic UX audit. It was not an exhaustive component-state review, performance test, mobile review, screen-reader audit, repository/CI verification, registry-publication verification, or Figma/code parity audit. Statements about existing CI describe what the documentation says, not independently verified runs. “Missing” means absent from the inspected documentation or not discoverable through the visible navigation; it does not prove the organization has no guidance elsewhere.

**Keep the strong parts**

- [Form Field][form-field] already has anatomy, do/don't guidance, composition, validation behavior, ARIA instructions and controls. Use its structure as a starting point for a shared template.
- [Empty State][empty-state] clearly distinguishes descriptive empty content from actionable error recovery. [Drawer][drawer] distinguishes overlays from persistent side panels.
- [Token finder][token-finder] starts with what the user is styling and supplies matching roles and snippet shapes. This is a valuable interaction model to extend.
- [Semantic colors][colors] offers live values, copying modes and a contrast checker; typography accepts realistic text; spacing explains its unusual half-unit scale.
- [Contribute][contribute] defines Core, Candidate, App-specific and Deprecated, assigns ownership, and explains the proposal route. Avoid replacing this with a vague contribution page.

**Priority findings**

P1 below means a high-impact adoption or guidance problem. P2 means a meaningful improvement after the first blockers. These are audit priorities, not production incident severities.

**F01 — P1: release and installation guidance contradict each other.**

[Introduction][intro] advertises v1.0.0 but also says the packages are unreleased at 0.1.0. [Use Plectrum in an app][install] says no version has been published, recommends packed 0.1.0 tarballs, and describes What's new as having an empty Released section. [What's new][whats-new] actually lists v1.0.0 under Released and says there are no pending changesets.

Impact: developers cannot confidently choose the installation command or tell which documentation matches their application. I have not independently established whether the registry or the changelog is authoritative.

Build: verify publication first; generate package version, publication state and supported dependency versions from one release manifest. Separate package version from preset version. Keep a clearly labelled contributor tarball workflow only where relevant. Add a release date and a short consumer migration example for the v1 API renames.

**F02 — P1: the generated example is not ready to paste into an application.**

On [Form Field → Vertical][form-field], expanded source imports `FormFieldComponent` from `./form-field.component`, rather than the public package. The template uses `pInputText` and `ngModel`, but the shown imports omit their dependencies. It references `hint` and `inputId`, which are absent from the displayed class. Storybook exposes an “Incomplete code snippet” indicator; that acknowledges the limitation but does not complete the user's task.

Impact: a working canvas can give a new consumer more confidence in the example than the source merits. The installation page's first component example is more complete, but readers arriving directly at the component should not have to discover that workaround.

Build: provide a maintained “Use in an application” example with public imports, required Angular dependencies, explicit IDs and all bindings. Keep internal story source separately available. Compile the actual published example in the existing consumer smoke application. Check other generated examples for the same failure mode before assuming this is isolated.

**F03 — P1: designers do not get a first-hour journey.**

All three first-hour cards on [Introduction][intro] are marked Dev. Figma and Zeroheight are links below that journey. Designer responsibilities appear deep in [Contribute][contribute], mixed with proposals, token governance and development instructions. The Form Field “Open in Figma” link points to the entire UI Kit file without a component node ID; the Actions page demonstrates that precise Figma links are possible.

Build: add equal “Design with Plectrum” and “Build with Plectrum” entry points. The designer route should explain library access/activation, fonts, choosing approved variants, using the preview, responsive and error states, inspecting exact Figma components, handing off decisions, and proposing gaps. Specify that Storybook owns published guidance; Figma is the authoring library. Decide which Zeroheight content to migrate or redirect so the main-home promise is true.

**F04 — P1: finding a component requires understanding its implementation origin.**

The sidebar splits PrimeNG, Custom components and Shell. The homepage's “Find a component” opens [Component status][status], which explicitly lists only Angular components in `libs/ui`: 15 items, including two app-specific entries. It excludes PrimeNG and CSS-only blocks such as the generic Drawer shell. The scope is honestly explained, but does not match the broad action label. Search found `button`; `error` produced “No components found.”

Build: create one visual catalogue grouped by user purpose, with implementation type, ownership and reuse restrictions as metadata. Include PrimeNG, Angular and CSS compositions, and expose app examples with a clear scope filter. Keep the governance index as a maintainer view. Add task keywords and synonyms, and a documentation search/index for concepts such as validation and error recovery. Do not assume Storybook's default name/path search indexes MDX prose.

**F05 — P1: the most common controls have less UX guidance than custom components.**

[Actions][actions] shows severities, outlines, text buttons, sizes, icons and loading. It provides useful icon and size rules, but does not explain action hierarchy, when to use a link, when a destructive action requires confirmation, or how to choose ToggleButton versus SelectButton. [Forms][forms] explains endorsed composition but gives little selection guidance between controls or complete validation workflows.

Build: give each common control a canonical documentation landing page, even if it remains stock PrimeNG. Lead with when to use it, alternatives and a recommended default; then show variants, content, behavior, accessibility and implementation. Link upstream for exhaustive API details while retaining Solidaris UX decisions locally. The implementation can stay stock while its usage guidance becomes specific.

**F06 — P1: the foundations need more design decisions and fewer unexplained authoring rules.**

[Semantic Common][colors] begins with runtime mappings and SCSS-layer rules. Its catalogue mixes reusable roles, component tokens, feature tokens and documentation tokens. [Spacing][spacing] explains units well, but mostly tells developers which class to use. [Layout][layout] contains responsive breakpoints and useful examples, so responsiveness is not absent; the missing layer is how a page should adapt. [Typography Roles][typography] explains display/heading/label/body but lacks a complete example of a readable, responsive page hierarchy.

There is also a role ambiguity: foundations tell the reader to add a missing token in `01-settings`, while [Contribute][contribute] says application teams must propose missing tokens and must not add primitives or semantic tokens. That distinction must be visible where the instruction appears.

Build: place a short designer-facing decision guide before each explorer. Show recommended text/surface pairs, spacing recipes for related versus unrelated content, form density, page gutters, heading hierarchy and narrow-layout transformations. Provide exact Figma style/variable mappings and resolved dimensions alongside code expressions. Default explorers to reusable roles, with feature/internal tokens available through filters. Label authoring instructions with the responsible role.

**F07 — P1: accessibility guidance needs a shared entry point and explicit verification status.**

Sampled components show a WCAG 2.1 AA label and useful names/ARIA/keyboard instructions. [Focus][focus] gives a shared focus-ring recipe. [Contribute][contribute] describes automated accessibility gates and optional visual tests. The component pages do not make it equally clear whether their WCAG label is a target, a completed assessment, or a statement with known gaps.

Build: add an accessibility overview linked from Start here and component pages. Explain target versus test evidence, component guarantees versus consumer responsibilities, keyboard/focus, headings and labels, error announcements, contrast, reflow/zoom, reduced motion and target sizing. Show automated status, manual keyboard/screen-reader status, tested version/date, known limitations and responsibility. Use “Not assessed” when evidence is unavailable.

Consider WCAG 2.2 AA as the updated product target after confirming scope. Its AA additions include focus not being entirely obscured and minimum target size with defined exceptions. This recommendation is not a claim that Plectrum violates those criteria. Sources: [W3C focus guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

**F08 — P1: reusable workflow guidance is not established.**

The visible Patterns/iSHARE branch contains Delay Prediction Card and Transactions CICS Modal. [Delay Prediction Card][delay] is correctly identified as app-specific. These references are useful but do not teach other teams how to compose general workflows.

Build three initial patterns using existing components: search/filter/results; form submission and validation; detail view with drawer. Cover initial, loading, successful, empty/no-results, error and permission states where applicable. Include recovery actions, keyboard behavior, focus movement and responsive examples. Keep iSHARE examples under a clearly named application-examples section. Additional patterns should follow actual team demand.

**F09 — P2: content and localization need a discoverable foundation.**

The documentation is English; examples commonly use French; the toolbar advertises a UI locale; [Contribute][contribute] explains FR/NL implementation. [Forms → Invalid][forms] displays the English required marker alongside a French label/error, while Form Field's own example uses the French marker. There is no visible top-level content/localization guide. Domain abbreviations such as O.A. and NISS also assume background knowledge.

Build: explicitly distinguish documentation language from example UI locale. Add a reviewed FR/NL glossary, action-label and error-message conventions, dates/numbers/currency guidance, abbreviation explanations, and long-translation examples. Label the toolbar “Example language” and document what changes. Verify localized required labels and control text in both example locales. Do not translate all documentation automatically without confirming the audience need.

**F10 — P2: long pages and governance language increase reading effort.**

The sampled pages offer heading anchors but no visible persistent in-page contents. Technical material sits high in navigation under the generic “Docs” group. Contributor text repeatedly emphasizes prohibited actions; it explains the process but does not provide an equally concise route for a small documentation correction or a simple question. Setup uses `git clone <repo> && cd solidaris-nx`, leaving a placeholder and a directory name unexplained.

Build: move maintainer material into an explicit group; add compact in-page navigation on long docs and a “Next step” footer. Define a concise glossary for token, preset, Core, shell and wrapper. Keep restrictions but explain the reason and immediate next action once. Publish an agreed triage response expectation, named contact route, and a lightweight correction/bug path. Replace the repository placeholder with verified setup instructions.

**Secondary design questions worth resolving**

- Empty State defaults to a random illustration. Document recommended illustrations by context and whether production screens should pin them; a no-results state and a sensitive service problem may warrant different tone. This is a design recommendation, not a demonstrated defect.
- Transitions documents reduced-motion previews, but application teams need the supported runtime recipe too. Explain which changes stop or simplify when reduced motion is requested; keep essential state feedback.
- Typography's fixed `h3` in Empty State is documented. Provide a composition example with a valid heading hierarchy and decide whether a configurable heading level is needed. Do not force unrelated pages into an arbitrary hierarchy to fit a component.
- Add a support matrix for Angular/PrimeNG/package versions and supported browsers. Keep font and icon asset setup accessible from the consumer quick start.

**Comparison with established design systems**

The comparison is of documentation capabilities, not package popularity, component count or company size. Carbon uses a documentation site alongside Storybook; its ecosystem is a benchmark for the experience Plectrum wants to deliver, not evidence that every feature is inside its Storybook shell.

| Reference inspected | Useful practice | Plectrum implication |
|---|---|---|
| [IBM Carbon Button](https://carbondesignsystem.com/components/button/usage/) and [accessibility](https://carbondesignsystem.com/components/button/accessibility/) | Separate usage, style, code and accessibility; explain variant decisions; distinguish automated and manual test evidence. | Match depth of decision guidance and clarity of evidence for common controls. |
| [Telekom Scale designer start page](https://telekom.github.io/scale/?path=/story/setup-info-getting-started-for-designers--page) | Separate designer/developer entry points, concrete font and Figma-library setup; accessibility and browser support visible in navigation. | Provide a complete designer journey inside Storybook. |
| [monday.com Vibe](https://vibe.monday.com/?path=/docs/welcome--docs) | Prominent catalogue, migration guide, foundations, and feedback routes. | Make choosing, upgrading and asking for help easy to find. This was a navigation/homepage comparison, not an audit of all Vibe components. |

Plectrum already has several mature documentation features. Its best pages approach the structure of established systems. Its current overall experience is less consistent: a user can move from detailed guidance to an implementation gallery, an incomplete source example or a stale installation paragraph. Improving those transitions is more valuable than a broad visual redesign.

**Proposed information architecture**

| Group | Contents |
|---|---|
| Start here | Overview; Design with Plectrum; Build with Plectrum; How to use this Storybook; Get help |
| Foundations | Design principles; Color; Typography; Spacing and layout; Icons and illustrations; Borders and elevation; Motion; Accessibility; Content and localization; Token finder |
| Components | One catalogue grouped by purpose: Actions, Forms, Navigation, Data, Feedback, Overlays. Each page carries implementation and reuse metadata. |
| Patterns | Search and results; Forms and validation; Detail views and drawers; additional patterns selected by demand |
| Application examples | iSHARE-specific examples and future application references |
| Releases and support | Current version; compatibility; What's new; migration guidance; known limitations |
| Contribute and maintain | Proposals; writing docs/stories; architecture; token authoring/pipeline; testing; release process; AI tooling |

This is a grouping proposal, not a request to expose every leaf immediately. Preserve existing story IDs where possible; otherwise maintain old deep links or documented redirects. Do not leave a large tree of empty “coming soon” pages.

**Standard component page**

Use a consistent sequence with anchor navigation: purpose and recommended default; when to use/alternatives; anatomy; variants with selection guidance; behavior and states; content/localization; accessibility and tested status; complete application example and API; related components/patterns; owner, version and change history.

Keep Figma, code package and compatibility visible near the top. Allow developers to jump directly to code/API. Use concrete examples such as “Save changes”, “Cancel” and “Delete document” to explain decisions before introducing implementation properties such as `severity`.

**Implementation plan**

The work below is ready to turn into implementation tickets. Owners are roles to assign, not claims about current staffing. Effort bands are preliminary combined person-days, assuming an existing Storybook/MDX system; validate them against the repository. Accessibility remediation beyond documentation may increase scope.

| Phase | Work packages | Suggested owners | Effort | Exit condition |
|---|---|---|---:|---|
| 1. Restore trust | T01–T03: release truth, complete example, audience/terminology corrections | DS developer + content/design owner | 3–5 days | New developer can follow one valid install path and reuse the first example. |
| 2. Make guidance discoverable | T04–T05: designer onboarding, catalogue/search/navigation/template | DS designer + Storybook developer | 5–8 days | A new designer can start, select a component and reach its exact design reference. |
| 3. Complete the essential guidance | T06–T08: common controls, foundation decisions, accessibility/localization | DS designer + developer + accessibility reviewer | 8–13 days | Priority controls and foundations answer both design and implementation questions. |
| 4. Teach composition and validate | T09–T10: three patterns, research, maintenance checks | Designer + developer + QA/research | 6–10 days | Representative users complete the key tasks and documentation regressions are caught. |

Total initial planning band: **22–36 combined person-days**, excluding a whole-library component redesign or unbounded accessibility remediation. This is not an elapsed-time commitment. Start with Phase 1; do not delay its fixes until navigation work is complete.

**T01 — Reconcile release state (F01).** Verify the registry/package artifacts, then drive the hero, installation guidance and release list from one manifest. Show the exact supported dependency range and current installation method. Acceptance: all three pages agree; the documented install command succeeds in a clean supported consumer environment; package and preset versions are clearly distinguished.

**T02 — Publish complete consumer examples (F02).** Begin with Form Field, then inspect other source generators. Use the public API, all required imports and explicit sample data. Acceptance: the exact snippet published on the page compiles and renders in the consumer app; every advertised state is reproducible; internal story source is labelled. The existing incomplete-source warning may remain for supplementary examples.

**T03 — Fix contradictory and unclear instructions (F06, F09, F10).** Mark consumer versus maintainer token actions; fix setup placeholders and language mismatches; define version vocabulary. Acceptance: no consumer instruction silently asks an app team to perform a restricted core-authoring action; FR/NL examples have consistent required/error text; setup locations are actionable.

**T04 — Build the designer start route (F03).** Write a first-screen walkthrough, exact Figma links, library/font setup, state selection and handoff. Acceptance: a designer unfamiliar with the repository can assemble and explain a simple approved form without reading SCSS architecture. Storybook contains the guidance needed for the task; external links open the relevant authoring resource.

**T05 — Implement catalogue, navigation and page template (F04, F10).** Create one searchable catalogue with human-readable names, thumbnails, purpose descriptions, scope/status and implementation filters. Add task terms such as error, validation, no results and side panel. Add long-page contents and canonical component pages. Acceptance: Button, Form Field, Drawer and Empty State are all discoverable from the same catalogue; `error` leads to useful guidance; old links still resolve; page navigation is keyboard operable.

**T06 — Bring common controls up to the template (F05).** First tranche: Button, selection controls, InputText, Select/AutoComplete, Dialog/Drawer and feedback/empty content. Select final ordering using actual usage. Acceptance: each page states when to use it, alternatives, variant decisions, content rules, behavior, accessibility responsibilities, a complete example and related patterns. Preserve existing PrimeNG implementation where sufficient.

**T07 — Add design decision layers to foundations (F06 and secondary findings).** Start with color pairing, spacing/layout and typography; follow with icon/illustration selection and reduced-motion guidance. Acceptance: a designer can choose an approved pair, page hierarchy and spacing recipe, identify matching Figma references, and explain their narrow-layout behavior; a developer can map each decision to the existing public token/class surface. Keep internal/feature tokens accessible but not the default.

**T08 — Publish accessibility and content guidance (F07, F09).** Confirm accessibility target; add a tested-status model, manual checklists and component/consumer responsibilities. Add FR/NL glossary, formatting and UI-copy examples. Acceptance: every priority component distinguishes target from evidence and lists known limitations; unknown results are labelled honestly; examples cover long translated text, keyboard use, zoom/reflow and error recovery. Do not mark a component compliant solely because automated checks pass.

**T09 — Build three reusable workflow patterns (F08).** Compose existing components into search/results, form submission, and detail/drawer flows. Document the user goal, decision rationale, state transitions, content and responsive behavior. Acceptance: readers can run the main path and its loading/empty/error alternatives; forms preserve entered data on recoverable errors; overlays have documented opening/closing and focus behavior. Link patterns from their constituent components.

**T10 — Validate and prevent drift (all findings).** Run task-based sessions with three designers and three developers unfamiliar with these changes. Treat this as formative research, not a statistically representative study. Add checks for broken internal links, incomplete designated quick-start snippets, missing required documentation metadata, and release-state consistency. Reuse existing test infrastructure after confirming what actually runs.

**Validation tasks and proposed success criteria**

| Task | Proposed success criterion |
|---|---|
| Designer: start a form in Figma from Storybook | Finds the approved library, matching component and relevant variants unaided. |
| Either audience: choose an action hierarchy | Can explain the recommended primary/secondary/destructive choices from the docs. |
| Either audience: find error guidance | Finds the appropriate component or pattern through catalogue/search within two minutes. |
| Designer: select tokens and responsive behavior | Uses an approved text/surface pair and spacing recipe and can explain the narrow-layout change. |
| Developer: install and render Form Field | Completes the documented clean setup without importing repository source or repairing the example. |
| Either audience: interpret Core and accessibility status | Correctly distinguishes reuse ownership, release maturity and actual testing evidence. |
| Either audience: propose a missing capability | Finds the proposal/contact route and knows what information to provide and what happens next. |

Proposed launch bar: at least five of six participants complete each applicable shared discovery task unaided; all documented quick-start examples pass automated compilation. Record failures and confidence, not just completion times. Use the baseline sessions to calibrate targets rather than claiming improvement from this audit alone.

**Decisions to confirm during implementation**

Storybook's main-home role is already confirmed. Remaining decisions are the actual published package state; the supported product/device scope; whether docs stay English while examples support FR/NL; the agreed accessibility target; ownership/response expectations for support; and which workflows have the highest adoption demand. These affect implementation details, but do not block fixing the documented contradictions or building the audience entry points.

[intro]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/introduction--docs
[install]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/get-started-use-plectrum-in-an-app--docs
[status]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-component-status--docs
[contribute]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/get-started-contribute--docs
[whats-new]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/docs-what-s-new--docs
[form-field]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-form-field--docs
[empty-state]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-empty-state--docs
[drawer]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-drawer--docs
[delay]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/patterns-ishare-delay-prediction-card--docs
[actions]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/primeng-actions--docs
[forms]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/primeng-forms--docs
[token-finder]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-token-finder--docs
[colors]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-colors-semantic-common--docs
[typography]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-typography-roles--docs
[layout]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-layout--docs
[spacing]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-spacing--docs
[focus]: https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-focus--docs
