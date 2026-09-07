# AI Prompt Templates

Reusable prompts for AI agents working on the Plectrum/Plectrum Design System.

---

## Table of Contents

1. [Prompt A — Reviewing Token Changes](#prompt-a--reviewing-token-changes)
2. [Prompt B — Translating Figma Decisions into Tokens](#prompt-b--translating-figma-decisions-into-tokens)
3. [Prompt C — General Copilot / Agent Rules](#prompt-c--general-copilot--agent-rules)
4. [Prompt D — Requesting a Component](#prompt-d--requesting-a-component)
5. [Prompt E — Figma Sync Requests](#prompt-e--figma-sync-requests)

Prompts A–C are written for the agent. Prompts D–E are what a developer sends to the **Solidaris** coordinator — Cursor: `/Solidaris …` or "Use the Solidaris subagent to …"; VS Code: select Solidaris in the chat agent picker. Storybook shows them filled in: Docs → AI strategy → Prompts, and Docs → Token pipeline → Figma sync → Agents.

---

## Prompt A — Reviewing Token Changes

Use this when asking an AI to review a proposed token change before merge.

```
You are helping review a design-token change for the Plectrum/Plectrum Design System.

Context:
- Figma is the shared design reference for designers.
- The repository is the controlled implementation layer.
- PrimeNG is the component library. Plectrum/Solidaris owns the custom design layer.
- All Solidaris CSS variables use the --pds-* prefix, controlled by $pds-prefix in 01-settings/_settings.prefix.scss.
- PrimeNG variables keep the --p-* prefix.
- The PrimeNG TypeScript preset is a small adapter — not the main design authoring layer.
- SCSS/CSS owns most Solidaris design implementation.
- The codebase uses ITCSS. All tokens live in 01-settings/ split into primitive and semantic files per category (naming: _settings.{description}.scss).
- Custom components and wrappers use BEM naming with the c- block prefix.
- Storybook is used for documentation and validation.

Please review the following token change. Check for:
1. Token naming quality — is it intent-based, lowercase, kebab-case?
2. Whether the token is primitive, semantic or component-level
3. Whether it duplicates an existing token
4. Whether it should be in a _settings.*-primitive or _settings.*-semantic file
5. Whether the value is accessible (contrast, focus visibility)
6. Whether it maps to a PrimeNG --p-* variable
7. Whether the change affects multiple components
8. Whether Storybook should be updated
9. Risk level (Low / Medium / High)
10. Whether a migration or deprecation note is needed
11. Whether the ITCSS layer is correct
12. Whether custom component CSS follows BEM conventions

Response format:
## Summary
## Token Classification  (Primitive | Semantic | Component | Deprecated | Unclear)
## Review Findings
## PrimeNG / Plectrum Impact
## ITCSS / BEM Impact
## Risk Level
## Required Validation
## Recommendation  (Accept | Accept with small changes | Revise before merge | Reject)
## Suggested Improvements

Token change to review:
[PASTE HERE]
```

---

## Prompt B — Translating Figma Decisions into Tokens

Use this when a Figma design decision needs to be translated into `--pds-*` tokens.

```
You are helping translate a Figma design decision into a clean design-token structure for Plectrum/Solidaris.

Context:
- Figma is the shared design reference.
- All Solidaris tokens use the --pds-* prefix via $pds-prefix in 01-settings/_settings.prefix.scss.
- Tokens are split: primitive values in _settings.*-primitive.scss, semantic roles in _settings.*-semantic.scss.
- PrimeNG variables use --p-* prefix.
- The PrimeNG TypeScript preset is a minimal adapter.
- SCSS/CSS owns most Solidaris implementation.
- The codebase uses ITCSS — suggest the correct layer and file.
- Custom components use BEM naming with the c- block prefix.
- 1rem = 14px (Plectrum base).

Given the following Figma decision, propose:
1. Primitive tokens (if new raw values are needed)
2. Semantic tokens
3. Component tokens (if component-specific)
4. CSS custom properties using --pds-* with $pds-prefix interpolation
5. PrimeNG --p-* mappings (if relevant)
6. SCSS implementation snippet
7. ITCSS file location
8. BEM naming (if a wrapper or custom component is needed)
9. Figma naming recommendation
10. Storybook validation checklist
11. Accessibility checks
12. Risk level
13. Migration notes (if replacing existing tokens)

Figma decision:
[PASTE HERE]
```

---

## Prompt C — General Copilot / Agent Rules

Use this as a system-level context injection for any AI agent working on the codebase.

```
Use these rules when working on the Plectrum/Plectrum Design System.

Architecture:
- Figma = shared design reference
- Repository = controlled implementation layer
- Storybook = documentation, validation, and tests  (every component MUST have a story + play tests — `.ai/rules/03-storybook.md` §5)
- PrimeNG = vendor component system  (check before building anything custom)
- Plectrum/Solidaris = design layer owner
- ITCSS = cascade organization (01-settings → 08-trumps; file naming: _{layer-folder}.{description}.scss)
- BEM = custom component naming (c- block prefix)

SCSS rules (hard stops):
- No local $variables in component files — all values in 01-settings/
- No hardcoded hex/rgba/px in 06-components — always var(--pds-*)
- If a token is missing, add it to 01-settings FIRST, then use it
- @apply for layout/spacing — never Tailwind classes in HTML templates
- Dimensions content-driven — no arbitrary fixed width/height

Preferred flow:
Figma MCP → PrimeNG MCP → add missing tokens → implement component → Storybook story + play tests → test-storybook → generate-index

CSS variable naming:
- All Solidaris/Plectrum tokens: --pds-* (controlled by $pds-prefix in 01-settings/_settings.prefix.scss)
- PrimeNG tokens: --p-* (never rename)
- Always @use 'settings.prefix' as * in files that emit tokens
- Emit tokens as: --#{$pds-prefix}-token-name

Token layers:
1. Primitive  — raw values, _settings.*-primitive.scss files  (never use in components)
2. Semantic   — design intent, _settings.*-semantic.scss files  (use these in components)
3. Component  — component decisions, 06-components/_components.*.scss files

01-settings/ file map (naming: _settings.{description}.scss):
- _settings.prefix.scss                — $pds-prefix config
- _settings.colors-primitive.scss      — --pds-color-{palette}-{shade}
- _settings.colors-semantic.scss       — --pds-color-{role}
- _settings.typography-primitive.scss  — --pds-font-*, --pds-line-height-*, --pds-letter-spacing-*
- _settings.typography-semantic.scss   — --pds-text-{category}-{size}-{property}
- _settings.spacing.scss               — --pds-space-*, --pds-size-*
- _settings.radius.scss                — --pds-radius-*
- _settings.shadows.scss               — --pds-shadow-*
- _settings.transitions.scss           — --pds-transition-*
- _settings.focus.scss                 — --pds-focus-ring-*
- _settings.globals.scss               — --pds-disabled-opacity, --pds-icon-size, --pds-anchor-gutter
- _settings.{primeng-component}.scss   — PrimeNG --p-* token bridge (e.g. _settings.accordion.scss)

Bridge pattern (preferred):
:root {
  --pds-color-brand: var(--pds-color-primary-500);
  --p-button-primary-background: var(--pds-color-brand);
}

Never:
.p-button { background: #527191 !important; }
```

---

## Prompt D — Requesting a Component

Use this when a developer asks the coordinator for a new component, a variant, tests, a review, or a promotion. The prompt carries what the agent cannot read from the repository; protocol (`component-creation.md`), rules, scaffolder, token scripts and story tests it loads itself.

Required inputs for a new component — the coordinator asks for a missing one and files `.ai/questions/` when the owner decision is absent:

| Input                  | Why                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Owner decision         | `design-system` → Core, `ishare` / `icrm` → Candidate. Comes from the core team (`Get started → Contribute → Three answers to a proposal`) |
| Figma node URL         | The UX Researcher reads exactly this node through the Figma MCP                                                                            |
| Name and purpose       | One sentence; becomes `usage` in the `.metadata.ts` and the Storybook title                                                                |
| States and variants    | Each is a story with a `play` test (`rules/03-storybook.md` §5)                                                                            |
| PrimeNG base, if known | Shortens the PrimeNG MCP check; "custom" is a valid answer                                                                                 |
| Consumers              | Screens / applications — decides `Patterns/{App}` vs `Custom components`                                                                   |

Keep out of the prompt: token values (hex / px), class names or SCSS, a request to skip the proposal, a screenshot as the only reference.

### New component

```
/Solidaris Create the component {Name} in libs/ui.

Owner: {design-system | ishare | icrm} — core-team decision of {date}
  ({system-level | app-specific}: {reason}).
Figma: {figma-node-url}
Purpose: {one sentence}.
PrimeNG base: {p-component | custom} — if PrimeNG does not cover the design, say so
  before building custom.
States: {list}.
Consumers: {screens / applications}.

Follow .ai/contracts/protocols/component-creation.md. Missing --pds-* tokens go to
01-settings first, cited with the Figma variable. Every state is a story with a play
test; run npm run test-storybook before you report. End with the changed files, the
new tokens and the open questions.
```

### Existence check

```
/Solidaris Before I propose anything: does Plectrum already cover {need}?
Check .ai/contracts/index.json, the PrimeNG MCP ({candidate components}) and the
Plectrum UI Kit. Answer with one of: exists (where), variant of an existing
component (which, and the modifier), missing. No code.
```

### Variant of an existing component

```
/Solidaris Add a {variant} variant to {Component} (libs/ui/src/lib/{name}).
Figma: {figma-node-url}
Difference: {what changes}, from the Figma node. {New inputs, if any}; the modifier
is c-{name}--{variant}.
Add the story {Variant} with a play test, update {name}.metadata.ts (variants,
tokens.consumed) and rerun npm run test-storybook.
```

### Stories and tests

```
/Solidaris Run the Tester on {Component} (libs/ui/src/lib/{name}).
Every required canvas story needs a play function (.ai/rules/03-storybook.md §5).
Report the addon-a11y violations and fix the ones inside the component; do not set
a11y.test to off. End with the npm run test-storybook output.
```

### Review

```
/Solidaris Review {paths}.
Review workflow: Token Auditor, Architect and Tester in parallel. One prioritised
list — Critical, Warning, Suggestion — with file and line. Fix nothing yet.
```

### Promotion

```
/Solidaris Promote {Component} from Candidate (owner {app}) to Core.
Core-team decision: {date}. Generic name and inputs (no {app} vocabulary), tokens
from its _settings.{feature}.scss into the shared settings files, Storybook title
Custom components/{Component}, governance status core and owner design-system. Add a
changeset. List the {app} usages that must migrate after the release.
```

---

## Prompt E — Figma Sync Requests

Use this for token work on either transport of the Figma sync (`Docs → Token pipeline → Figma sync`). Agents read the UI Kit through the Figma MCP and never write to it: no agent holds a Variables scope and `tokens:apply` is parked. UX Researcher reads the node, UX Engineer declares tokens in `01-settings` and runs `tokens:propose`, Token Auditor reports drift and reviews the promotion pull request.

### Token from a Figma decision

```
/Solidaris Translate the Figma decision at {figma-node-url} into --pds-* tokens.
Use Prompt B from .ai/contracts/protocols/ai-prompts.md. For each value: the Figma
variable, the closest existing --pds-* token or MISSING, primitive or semantic, the
01-settings file, and the --p-* bridge when a PrimeNG component is involved.
Propose first; write nothing until I confirm.
```

### Promotion pull request review

```
/Solidaris Review the token promotion pull request #{number}
(design-tokens/sync → libs/plectrum/src/tokens.json).
Use Prompt A. Compare the sync report with the diff, classify each changed token,
and flag renamed or removed variables that a component consumes (tokens.consumed
in the .metadata.ts files). Recommendation: Accept, Accept with small changes,
Revise before merge, or Reject.
```

### Drift check

```
/Solidaris Run the Token Auditor on libs/styles/src/01-settings.
Prefix compliance, semantic coverage, PrimeNG sync, and Figma drift against the
Primitive and Semantic collections of the Plectrum UI Kit. Report only; no fixes.
```

### Code-owned token proposal

```
/Solidaris {App} needs {token need} for {where it is used}.
Declare --pds-{name} in 01-settings with a comment naming the intended Figma
variable ({figma/path}), use it in {06-components partial}, and run
npm run tokens:propose. Give me the proposed.dtcg.json entry the designer enters on
the branch proposals/{app}. Do not run tokens:apply.
```
