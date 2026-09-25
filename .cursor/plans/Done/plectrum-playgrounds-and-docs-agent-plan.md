# Plectrum playgrounds and documentation: agent implementation plan

Date: 11 September 2026  
Basis: the latest live review in this conversation.  
Target: [Plectrum Storybook](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/introduction--docs)

## Objective and scope

Make Plectrum easier for application developers and designers to use: clear playground choices, understandable output, shorter introductory copy, and complete component guidance without repetition.

Plectrum is a customer deliverable preparing for an October handoff. Keep personal career material outside the customer's Storybook. General architecture, governance and maintenance documentation will move to a customer-owned knowledge base; retain consumer implementation guidance beside the live examples.

This is a focused follow-up to the broader consumer Storybook and October handoff plan. Its newer observations take precedence for the playground and copy issues covered here. It does not close unrelated reliability or accessibility findings that were not retested on 11 September, and it does not replace the handoff migration requirements.

## Baseline: preserve the improvements already made

The latest inspection confirmed:

- Introduction now has Use Plectrum in an app, Find a component and Pick a token entry links.
- Package status is explicitly unreleased, with tarball distribution explained.
- App onboarding includes a concrete first-component example.
- Spacing no longer offers auto for gap, while margin offers it.
- Spacing documentation now describes its actual half-base-unit arithmetic.
- Typography output now includes the line-height and letter-spacing references.
- Borders has useful control descriptions and a dependency between radius selection and corner selection.
- Component pages have more complete API information and structured usage/accessibility guidance.

Do not reopen the old spacing-auto or typography-suffix tickets without a new reproduction. Preserve those behaviors while improving presentation.

The review was a public-site inspection with selected interactions, not a source-code review or complete test run. Agents must verify the actual checkout and current deployment before editing.

## Working rules

1. Read applicable repository instructions and existing design-system rules. Discover actual file locations and scripts; do not invent paths or commands.
2. Record the commit and relevant Storybook version. Classify each finding as current, already fixed, not reproducible or blocked.
3. Edit authoritative source and regenerate derived output where required. Do not patch generated documentation to conceal source inconsistencies.
4. Preserve public Angular inputs, outputs, token names, utility classes and package boundaries. A clearer control label does not require an API rename.
5. Reuse existing Storybook and Angular/PrimeNG tooling. Avoid a new playground framework or mandatory multi-step wizard.
6. Keep complete consumer APIs, accessibility responsibilities and runnable examples. Shorter docs must not become incomplete docs.
7. Preserve meaningful interactive stories and their tests when changing navigation or controls.
8. Do not add invented usage recommendations, release claims, accessibility certification or impact metrics. Verify recommendations against existing design intent; flag unresolved design decisions.
9. Do not remove temporary handoff content until its destination, ownership, access and links are ready. Preparing a split does not require publishing it immediately.
10. Follow the implementation session's authorization for external writes, PRs and deployments. This file itself does not publish or modify the customer project.

## Priority overview

| Task | Priority | Outcome |
|---|---|---|
| C00 | Prerequisite | Current source and finding baseline |
| C01 | P1 | Only relevant consumer controls in foundation playgrounds |
| C02 | P1 | Clear choose → preview → copy experience |
| C03 | P1 | Shorter, task-oriented intro and onboarding |
| C04 | P1 | Component/foundation copy consolidated without losing requirements |
| C05 | P1 | Consistent, plain language and accurate accessibility wording |
| C06 | Final gate | Verified interactions, content and links |
| C07 | P2 optional | Context presets, width exploration and shareable settings |

P1 means the next improvement pass. P2 is optional and should not delay the October handoff.

## C00 — Establish the current baseline

**Suggested owner:** coordinator or frontend maintainer. **Depends on:** none.

Inspect the current stories, documentation templates, shared explorer, argTypes and token sources. Record where each displayed control and each repeated paragraph originates.

Create a small finding table with page, source file, status, intended change and owner. Check whether shared metadata extraction is exposing explorer inputs automatically before choosing a local or shared fix.

**Acceptance criteria**

- The plan is mapped to real source files.
- Already corrected behavior is recorded as preserved, not assigned as new work.
- The source of controls, code output, public API and prose is explicit.
- The October documentation migration remains separate from this editing pass.

## C01 — Remove internal controls from consumer playgrounds

**Suggested owner:** UX engineer. **Depends on:** C00.

### Observed problem

Spacing, typography and color playgrounds expose internal explorer inputs alongside their meaningful controls, including `bundle`, `category`, `groups`, `nameFilter`, `stubPrime` and a generic `view` input.

These controls ask consumers to understand the explorer implementation and can imply that unsupported configurations are intended.

### Changes

- Define the intentional consumer control surface for each playground.
- Hide internal explorer inputs from that story's Controls panel and irrelevant generated reference rows, using the project's supported Storybook configuration.
- Preserve the actual internal component inputs and their behavior.
- Preserve any deliberate view switch built into the explorer UI; remove only redundant or inappropriate generic controls.
- Avoid an empty or misleading Inputs group after filtering.
- Verify that changes to shared metadata do not hide legitimate inputs on customer component pages.

### Intended controls

| Playground | Primary controls |
|---|---|
| Spacing | Property and Spacing size |
| Typography | Text role and Preview text |
| Colors | Background and Text color; optional recommended combination |
| Borders | Side, status/color role, weight, style, radius and corners |

**Acceptance criteria**

- No internal explorer props appear in the inspected consumer playgrounds.
- Relevant controls continue to update the preview and output.
- Public component API documentation remains complete.
- No dead groups, placeholder controls or duplicated view choices remain.

## C02 — Make each playground explain the choice and result

**Suggested owner:** UX engineer with design-system reviewer. **Depends on:** C01.

Use a single-screen flow: a short purpose statement, supported choices, live preview, readable result and copy action. Borders' existing descriptions and dependent controls are the starting reference. Adapt the pattern to each foundation rather than forcing identical UI everywhere.

### Spacing

- Display `Spacing size` instead of `stop`; avoid exposing implementation labels such as `gapStop` or `marginStop` to consumers.
- Sort fractional stops numerically: 0, 0.25, 0.5, 0.75, 1, 1.5, 2, and so on; place auto separately where supported.
- Show the token step with a readable resolved value, for example `2 — 14px` in the currently documented 14px-root context. Derive values from the actual stylesheet; do not hardcode the assumption globally.
- Explain the property: gap is space between layout items, padding is inside the element, margin is outside it.
- Keep auto restricted to valid margin use and demonstrate it in a layout where its effect is meaningful.
- Show the supported utility class and a useful complete template example. Preserve required companion layout classes.

Suggested introductory copy:

> Choose the space between items, inside a container, or around an element. Preview the result, then copy the utility class.

### Typography

- Display `Text role` instead of `style`, and `Preview text` instead of `sample`.
- Show resolved font family, size, weight, line height and letter spacing beside the preview.
- Give each role a short intended-use hint grounded in the existing design-system guidance.
- Offer the utility class as the primary consumer output where it is the endorsed API; keep full token references available.
- Keep the corrected line-height and letter-spacing names generated from the real contract.

### Colors

- Group choices by purpose and lead with recommended semantic roles.
- Add a small set of approved text/background combinations, derived from existing guidance rather than invented visual pairings.
- Keep broader exploration available behind an explicit advanced choice.
- Show contrast information next to the selected pair. Reuse the existing contrast calculation if suitable.
- Label contrast results for the relevant text size/use; a passing ratio is not whole-component accessibility certification.
- Show the selected roles, resolved colors and exact copyable CSS together.

### Borders

- Preserve the current explanations and disabled-corner dependency.
- Provide a clear copy action for the generated class output if one is not already present.
- Offer a complete element snippet alongside the class-only result.
- Show a simple applied example so the user understands the border's purpose and appearance.
- Keep source class names stable while improving human labels.

### Shared behavior

- Defaults should produce meaningful examples.
- Reset should return the whole playground to its intended default, with preview and output synchronized.
- Copy feedback should identify what was copied.
- Controls and copy/reset actions must work by keyboard and have clear names.
- Empty results or unavailable options should explain the next useful action.

**Acceptance criteria**

- Each playground explains what the user can do without requiring a separate maintenance document.
- Displayed values, effective preview styles and generated output agree for representative choices.
- Copied examples use real supported classes/tokens.
- The corrected spacing and typography behaviors remain intact.
- Contrast guidance is accurate and does not imply blanket conformance.
- Keyboard operation, reset and copy work in the updated flows.

## C03 — Shorten the introduction and streamline onboarding

**Suggested owner:** documentation/UX engineer. **Depends on:** C00.

### Introduction

The inspected page contained approximately 760 rendered words, including table and navigation text. This is a descriptive measurement, not a prose-only count or a quality threshold.

The hero actions, Start here, audience cards, organization table and Maintainers section repeat several routes. Consolidate them into:

1. Purpose and current availability.
2. Existing primary actions: use in an app, find a component, pick a token.
3. One short start path ending in a rendered component.
4. Compact design, support and maintainer links.

Aim for roughly 250–350 words of introductory content if the required information fits. Treat this as an editorial target, not an automated limit. Remove the detailed explanation of the sidebar when navigation already makes the destinations clear.

Keep unreleased/tarball status truthful and near the installation path. Move the explanation of how versions are extracted from source out of the main consumer introduction.

### App onboarding

- Keep the exact installation, stylesheet/provider configuration and working first-component example.
- Keep current tarball installation distinct from future registry installation.
- Shorten the repeated opening overview; a compact contents list can replace a second walkthrough.
- Move release-workflow mechanics to maintainer documentation.
- Reduce discussion of the CI sample application to a brief verification/reference note.
- Retain a clear expected result after running the example and a useful next destination.

**Acceptance criteria**

- A new consumer can identify how to start and understand current package availability.
- Intro sections do not repeat the same routing explanation.
- The working example and required setup remain complete.
- Maintainer details are moved or linked according to the existing migration plan, with no broken or invented destinations.
- No personal portfolio content is introduced.

## C04 — Consolidate repeated component and foundation guidance

**Suggested owner:** documentation engineer with component reviewer. **Depends on:** C00; coordinate shared templates with C03.

| Page | Current repetition or friction | Intended edit |
|---|---|---|
| Spacing | Introduction, Usage and How to use repeat the class-versus-variable rule | State the consumer rule once; retain one explanation of the scale and an example |
| Form Field | Labeling requirements occur in Usage, Anatomy, Behavior and Accessibility | Give the complete labeling responsibility once and cross-reference where helpful |
| Copyable Text | Several sections repeat that it copies and the parent owns confirmation | State the event/feedback contract once, then use examples to demonstrate it |
| Borders | Internal file/mixin explanation precedes the useful composition task | Lead with choosing and composing a border; move internal implementation detail |
| Component pages generally | Implementation anatomy can delay the first working example | Put the example earlier; keep supported slots and consumer-relevant anatomy accessible |

Use a compact structure suited to the component:

- Purpose and meaningful usage decisions.
- Working example and essential controls.
- Relevant states and compositions.
- Complete API and supported customization.
- Accessibility and behavioral responsibilities.
- Design/upstream and support links.

Do not require every simple component to have every possible section. Keep Do/Don't guidance when it prevents a likely mistake or resolves a real choice. For Copyable Text, the warning against duplicate clipboard writes is useful; a warning against plain text largely restates the component's purpose.

Do not remove critical details such as required labeling, outputs, copy confirmation ownership, disabled behavior, controlled state or projected content simply to meet a length target.

**Acceptance criteria**

- Each important instruction has a clear canonical location on the page.
- Repetition is reduced without changing behavior or requirements.
- A useful example appears before long internal implementation detail.
- Full API/reference content remains searchable and directly reachable.
- No consumer requirement is lost during a maintainer-content split.

## C05 — Apply a plain-language copy pass

**Suggested owner:** documentation reviewer. **Depends on:** C02–C04 drafts.

### Preferred rewrites

These are editorial suggestions. Preserve actual technical rules and adapt grammar to the surrounding sentence.

| Existing wording | Preferred wording |
|---|---|
| Core is safe everywhere | Core components are maintained for reuse across Solidaris applications. |
| packed-consumer fixture | A sample application used to verify package installation. |
| object-class BEM mixes | Combine layout classes on the element. |
| Static chrome | Borders, corners and shadows that stay the same across interaction states. |
| Orthogonal modifiers | Combine these options independently. |
| stop | Spacing size or Scale value, depending on context. |
| style, in typography controls | Text role. |
| sample, in typography controls | Preview text. |

### Editorial rules

- Explain the action and expected result before the implementation mechanism.
- Prefer concrete component/token examples over abstract terminology.
- Define necessary jargon once. Do not require readers to understand CSSOM, ITCSS or metadata generation to use a component.
- Keep familiar developer terms such as input, output, provider and CSS variable where they are precise.
- Use positive instructions; reserve prohibitions for real constraints, with a usable alternative.
- Avoid absolute guarantees such as safe everywhere or always current. Describe the supported scope or the stylesheet/version being shown.
- Remove repair-history explanations from consumer guidance. Spacing can explain its scale without discussing the former 8-point wording. Form Field does not need to explain how story IDs were fixed.
- Keep copy consistent with the customer's established English style and glossary; do not turn this task into an unrequested translation project.
- Use Accessibility requirements when a section describes expectations. Do not present a WCAG level as certification without a defined assessment and evidence.
- Keep role hints accurate. If the system has no approved recommendation for a role, record the question rather than inventing a usage rule.

**Acceptance criteria**

- The named phrases and comparable jargon are reviewed in source, not blindly replaced globally.
- Display labels improve without renaming public APIs.
- Copy communicates consumer actions and outcomes.
- Accessibility/status wording describes what is actually known.
- Bug-fix history and generation mechanics do not distract from normal usage.

## C06 — Verify the integrated result

**Suggested owner:** tester/coordinator. **Depends on:** C01–C05.

Use existing required repository gates and focused checks for changed behavior. Do not write tests for word counts or every sentence edit.

### Interaction checks

- Spacing: change gap/padding/margin, confirm valid choices and numeric ordering, compare preview and output, reset and copy.
- Typography: switch representative roles, edit sample text, inspect resolved metrics and token references, reset and copy.
- Colors: choose an approved combination and an intentionally failing pair; verify preview, output and contrast feedback.
- Borders: choose radius/corners and another border side/style; verify output, dependency behavior and copy.
- Verify hidden internal props have not disappeared from legitimate public component APIs.
- Check representative narrow layouts and keyboard use for the modified controls.

### Content checks

- Follow the intro to the first working example.
- Confirm installation instructions still match actual availability and repository scripts.
- Check relevant story links and any new documentation destination.
- Review one small component and one more complex component for information loss or repetition.
- Keep any acceptance result scoped to what was actually tested; no claims of full accessibility or browser coverage.

**Deliver:** changed files, relevant source/build identity, exact commands and outcomes, manual checks, unresolved questions and remaining risks.

**Acceptance criteria**

- Required gates and targeted checks pass, or failures are reported honestly with a next action.
- Consumer tasks remain complete after shortening.
- No duplicate authoritative documentation or broken migration links are introduced.
- Optional testing stops once required gates and concrete remaining risks are covered.

## C07 — Optional improvements after the main pass

Implement only when useful to actual consumer work and within the agreed scope.

| Enhancement | Useful outcome | Constraint |
|---|---|---|
| Context presets | See spacing/type in a compact toolbar, form stack or card | Use existing tokens/components; avoid a second design surface |
| Preview container width | Explore wrapping and longer content | Reuse existing viewport capability when adequate; expose a simpler width control only if it helps |
| Share current settings | Reproduce the same choice during a review | Prefer existing story args/deep-link behavior; exclude private sample content |
| Default comparison | Understand what changed from the recommended state | Keep the normal playground uncluttered |

These are not prerequisites for completing C01–C06 or the October handoff.

## Execution sequence and coordinator prompt

C00 establishes the baseline. C01 precedes C02. C03 and C04 can be prepared independently where source ownership permits, but shared templates need one integration owner. C05 reviews the resulting experience. C06 verifies it. C07 remains optional.

Suggested prompt:

> Read this plan and the repository instructions. Revalidate the latest source/build before editing. Improve foundation playgrounds with relevant controls, clear choices, useful resolved values and valid copy output. Preserve the recent spacing, typography, API and onboarding fixes. Shorten documentation by removing repetition and internal explanations, while retaining complete consumer contracts and accessibility responsibilities. Keep customer Storybook content separate from maintainer handoff and personal portfolio material. Use existing tooling, edit authoritative sources, and return reviewable changes with exact validation evidence. Execute only work authorized in this implementation session.

## Reviewed references

- [Introduction](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/introduction--docs)
- [App onboarding](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/get-started-use-plectrum-in-an-app--docs)
- [Spacing documentation](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-spacing--docs)
- [Spacing playground, inspected margin state](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/story/foundations-spacing--playground&args=property:margin)
- [Typography playground](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/story/foundations-typography--playground)
- [Colors playground](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/story/foundations-colors--playground)
- [Borders](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-borders--docs)
- [Token finder](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/foundations-token-finder--docs)
- [Form Field](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-form-field--docs)
- [Copyable Text](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/?path=/docs/custom-components-copyable-text--docs)
