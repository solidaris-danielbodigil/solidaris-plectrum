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

**If a token is missing from `libs/styles`, add it there first — never inline it.**

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
3. Ensure all tests pass before making changes
4. Run `npm run generate-index` after adding or modifying any component
