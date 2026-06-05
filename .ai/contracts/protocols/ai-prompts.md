# AI Prompt Templates

Reusable prompts for AI agents working on the Plectrum/Solidaris design system.

---

## Table of Contents

1. [Prompt A — Reviewing Token Changes](#prompt-a--reviewing-token-changes)
2. [Prompt B — Translating Figma Decisions into Tokens](#prompt-b--translating-figma-decisions-into-tokens)
3. [Prompt C — General Copilot / Agent Rules](#prompt-c--general-copilot--agent-rules)

---

## Prompt A — Reviewing Token Changes

Use this when asking an AI to review a proposed token change before merge.

```
You are helping review a design-token change for the Plectrum/Solidaris design system.

Context:
- Figma is the shared design reference for designers.
- The repository is the controlled implementation layer.
- PrimeNG is the component library. Plectrum/Solidaris owns the custom design layer.
- All Solidaris CSS variables use the --sds-* prefix, controlled by $sds-prefix in 01-settings/_settings.prefix.scss.
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

Use this when a Figma design decision needs to be translated into `--sds-*` tokens.

```
You are helping translate a Figma design decision into a clean design-token structure for Plectrum/Solidaris.

Context:
- Figma is the shared design reference.
- All Solidaris tokens use the --sds-* prefix via $sds-prefix in 01-settings/_settings.prefix.scss.
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
4. CSS custom properties using --sds-* with $sds-prefix interpolation
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
Use these rules when working on the Plectrum/Solidaris design system.

Architecture:
- Figma = shared design reference
- Repository = controlled implementation layer
- Storybook = documentation and validation  (every component MUST have a story)
- PrimeNG = vendor component system  (check before building anything custom)
- Plectrum/Solidaris = design layer owner
- ITCSS = cascade organization (01-settings → 08-trumps; file naming: _{layer-folder}.{description}.scss)
- BEM = custom component naming (c- block prefix)

SCSS rules (hard stops):
- No local $variables in component files — all values in 01-settings/
- No hardcoded hex/rgba/px in 06-components — always var(--sds-*)
- If a token is missing, add it to 01-settings FIRST, then use it
- @apply for layout/spacing — never Tailwind classes in HTML templates
- Dimensions content-driven — no arbitrary fixed width/height

Preferred flow:
Figma MCP → PrimeNG MCP → add missing tokens → implement component → Storybook story → generate-index

CSS variable naming:
- All Solidaris/Plectrum tokens: --sds-* (controlled by $sds-prefix in 01-settings/_settings.prefix.scss)
- PrimeNG tokens: --p-* (never rename)
- Always @use 'settings.prefix' as * in files that emit tokens
- Emit tokens as: --#{$sds-prefix}-token-name

Token layers:
1. Primitive  — raw values, _settings.*-primitive.scss files  (never use in components)
2. Semantic   — design intent, _settings.*-semantic.scss files  (use these in components)
3. Component  — component decisions, 06-components/_components.*.scss files

01-settings/ file map (naming: _settings.{description}.scss):
- _settings.prefix.scss                — $sds-prefix config
- _settings.colors-primitive.scss      — --sds-color-{palette}-{shade}
- _settings.colors-semantic.scss       — --sds-color-{role}
- _settings.typography-primitive.scss  — --sds-font-*, --sds-line-height-*, --sds-letter-spacing-*
- _settings.typography-semantic.scss   — --sds-text-{category}-{size}-{property}
- _settings.spacing.scss               — --sds-space-*, --sds-size-*
- _settings.radius.scss                — --sds-radius-*
- _settings.shadows.scss               — --sds-shadow-*
- _settings.transitions.scss           — --sds-transition-*
- _settings.focus.scss                 — --sds-focus-ring-*
- _settings.globals.scss               — --sds-disabled-opacity, --sds-icon-size, --sds-anchor-gutter
- _settings.{primeng-component}.scss   — PrimeNG --p-* token bridge (e.g. _settings.accordion.scss)

Bridge pattern (preferred):
:root {
  --sds-color-brand: var(--sds-color-primary-500);
  --p-button-primary-background: var(--sds-color-brand);
}

Never:
.p-button { background: #527191 !important; }
```
