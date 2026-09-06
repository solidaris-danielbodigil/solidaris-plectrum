# Rules — 01 Architecture & Quality

> ⛔ = hard stop — violations block merge

---

## Table of Contents

1. [Quality Over Speed](#1-quality-over-speed)
2. [Single Source of Truth](#2-single-source-of-truth)
3. [No Dead Code](#3-no-dead-code)
4. [Ask Questions Early](#4-ask-questions-early)
5. [Before Starting Work](#5-before-starting-work)

---

## 1. Quality Over Speed

- Take the correct architectural path — never the shortcut
- Prefer clean, debt-free solutions over quick fixes
- Avoid wrappers, shims, or indirection unless truly necessary
- Leave the codebase better than you found it

---

## 2. Single Source of Truth

| Concern | SSOT location |
|---|---|
| Shared Angular components | `libs/ui` — never duplicated in `apps/` |
| SCSS tokens and utilities | `libs/styles` — never redefined at app level |
| Design decisions | Plectrum DS + Figma UI Kit |
| Shared routes, utils, services | `libs/` |
| Component ownership and reuse scope | `governance` in the component's `.metadata.ts` → `.ai/contracts/index.json` → badge on its docs page |

**If a token is missing from `libs/styles`, add it there first — never inline it.**

### Ownership ⛔

Being in `libs/ui` does not make a component part of the design system. `governance.status` does:

- `core` — generic, owned by `design-system`; the only status allowed under `Custom components/…` and `Shell/…`
- `candidate` / `app` — owned by an application team (`ishare`, `icrm`); titled `Patterns/{App}/…`; other applications propose instead of importing
- `deprecated` — scheduled for removal, `note` names the replacement

Every component starts as a proposal to the core design-system team, which answers *exists / system-level / app-specific*.
Promotion (`candidate` → `core`) is a core-team move, not a rename: generic API, tokens into shared settings, Storybook title into the core sections (`docs/component-promotion.md`).

---

## 3. No Dead Code ⛔

- Remove unused functions, imports, and commented-out blocks
- Do not leave "kept for reference" code in the repo
- Use git history instead — it's always recoverable

---

## 4. Ask Questions Early

- Ambiguous decisions → create a file in `.ai/questions/` and surface it
- Never guess on major architectural decisions
- If requirements conflict, flag before writing code

---

## 5. Before Starting Work

1. Read the project overview and current phase
2. Check `.ai/questions/` for open decisions
3. For a new component, confirm the core-team decision and the owner (`.ai/contracts/protocols/component-creation.md` → Pre-flight 0)
4. Ensure all tests pass before making changes (`npm test` and, for `libs/ui` work, `npm run test-storybook`)
5. Run `npm run generate-index` after adding or modifying any component
