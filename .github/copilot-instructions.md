# Solidaris — GitHub Copilot Instructions

## Project

Angular latest · PrimeNG latest · Plectrum design system

```
apps/ishare/    apps/icrm/
libs/ui/         ← SSOT: all shared Angular components
libs/styles/     ← SSOT: all SCSS tokens and utilities (ITCSS 01-settings → 08-trumps)
libs/plectrum/   ← SSOT: design system integration (providePlectrum)
.github/agents/  ← VS Code custom agents (Solidaris coordinator + 6 specialists)
.ai/             ← Knowledge base: rules, skills, contracts
```

## Agents

Switch to the **Solidaris** agent in the chat dropdown to run the full
orchestrated workflow (research → engineering → implementation → QA in parallel).

All agents live in `.github/agents/` — see `.ai/README.md` for the full agent map.

## MCP Servers

| Server | URL |
|---|---|
| Figma (Plectrum UI Kit) | `http://127.0.0.1:3845/mcp` |
| PrimeNG | `https://primeng.org/mcp` |

Always query both before implementing any component.

## Hard rules (full detail in `.ai/rules/`)

- All values in `06-components/` SCSS via `var(--pds-*)` — no hardcoded hex/px/rem
- No Tailwind classes in HTML templates — `@apply` in SCSS only
- Layout/spacing via `o-flex`/`o-layout` BEM mixes in the template, not in SCSS
- Every component in `libs/ui` needs a colocated `.stories.ts` — not done without it
- PrimeNG first — never reimplement what PrimeNG provides
- Missing token → add to `libs/styles/src/01-settings/` first, then use it
- SCSS file naming: `_{layer-folder}.{description}.scss` (e.g. `_components.toolbar.scss`)

## Knowledge base

Full rules, skills, and contracts: `.ai/README.md`

<!-- The full rule and skill set is intentionally kept in .ai/ — this file is the
     baseline context injected into every session. Agents in .github/agents/ carry
     their own role-specific instructions on top of this baseline. -->
