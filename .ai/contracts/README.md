# Contracts — Contract-Driven Development (CDD)

> Machine-readable codebase map and component metadata system for the Solidaris design system.
> Based on the "Agentic Design Systems" pattern by Cristian Morales Achiardi, adapted for Angular CLI + PrimeNG + Plectrum.

---

## Table of Contents

1. [Architecture](#1-architecture)
2. [Three Layers](#2-three-layers)
3. [How Agents Use This](#3-how-agents-use-this)
4. [Key Decisions](#4-key-decisions)
5. [Maintenance](#5-maintenance)
6. [Future Automation](#6-future-automation)

---

## 1. Architecture

```
.ai/contracts/
├── schema/                          Type definitions — the "shape" of contracts
│   ├── component.metadata.ts        ComponentMetadata interface
│   ├── token.contract.ts            TokenContract interface
│   └── index.ts                     Barrel export
│
├── protocols/                       Agent instructions — the "how"
│   ├── component-creation.md        How to create new components correctly
│   ├── query-protocol.md            How to navigate the codebase
│   ├── token-audit.md               How to validate token health
│   └── ai-prompts.md                AI prompt templates for token review and Figma translation
│
├── index.json                       Live codebase map — regenerate with npm run generate-index
│
└── README.md                        This file
```

---

## 2. Three Layers

| Layer | Purpose | File(s) |
|---|---|---|
| **Index (WHAT/WHERE)** | Component inventory, relationships, paths | `index.json` |
| **Metadata (HOW/WHY)** | Per-component usage, anti-patterns, token consumption | `*.metadata.ts` (colocated in `libs/ui`) |
| **Protocols (RULES)** | Decision trees, validation checklists, audit rules | `protocols/*.md` |

---

## 3. How Agents Use This

1. **Start of conversation** → load `index.json` for the full component map
2. **Component question** → check index → read the specific `.metadata.ts`
3. **Token question** → follow `protocols/query-protocol.md` decision tree
4. **Creating a component** → follow `protocols/component-creation.md`
5. **Reviewing token changes** → follow `protocols/token-audit.md`
6. **AI prompt needed** → see `protocols/ai-prompts.md`

---

## 4. Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Schema format | TypeScript | Type-safe, importable, real code snippets |
| Index format | JSON | Native to the TS ecosystem, importable, schema-validatable |
| Protocol format | Markdown | Readable by both humans and agents |
| Metadata location | Colocated with component | Single responsibility, easy to find |

---

## 5. Maintenance

| Artifact | When to update |
|---|---|
| `index.json` | After adding or removing any component — run `npm run generate-index` |
| `*.metadata.ts` | Create with every new component; update on API or token changes |
| `protocols/` | When architectural decisions change |
| `schema/` | When metadata structure needs new fields |

---

## 6. Future Automation

- [x] Generator to scaffold `.metadata.ts` with component (`npm run sds:component`)
- [x] Script to regenerate `index.json` (`npm run generate-index`)
- [ ] CI hook: regenerate index on component changes + fail if stale
- [ ] Drift detection: compare `.metadata.ts` against actual component API
- [ ] Token audit runner in CI (prefix compliance, semantic coverage, contrast)
- [ ] Storybook plugin to render metadata alongside stories
