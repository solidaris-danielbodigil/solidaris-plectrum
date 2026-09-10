# Contracts — Contract-Driven Development (CDD)

> Machine-readable codebase map and component metadata system for the Plectrum Design System.
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
├── index.json                       Offline codebase map — regenerate with npm run generate-index
│                                    Live catalogue: Storybook MCP at http://localhost:6006/mcp
│
└── README.md                        This file
```

---

## 2. Three Layers

| Layer                  | Purpose                                                                                   | File(s)                                  |
| ---------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Index (WHAT/WHERE)** | Offline inventory: paths, BEM, PrimeNG wraps, `uses` / `usedBy`, `status` / `owner`       | `index.json` (Storybook MCP is the live catalogue) |
| **Metadata (HOW/WHY)** | Per-component usage, anti-patterns, token consumption, `governance` (status, owner, note) | `*.metadata.ts` (colocated in `libs/ui`) |
| **Protocols (RULES)**  | Decision trees, validation checklists, audit rules                                        | `protocols/*.md`                         |

---

## 3. How Agents Use This

1. **Start of conversation** → load `index.json` (offline map). When `npm run storybook` is up, Storybook MCP at `http://localhost:6006/mcp` is the live catalogue (`docs-list`, `docs-show`).
2. **Component question** → check index → `docs-show` the page if MCP is up → read the specific `.metadata.ts`
3. **Token question** → follow `protocols/query-protocol.md` decision tree
4. **Creating a component** → follow `protocols/component-creation.md` (PrimeNG → Figma → index → `docs-list` → `pds:component`)
5. **Writing stories** → `docs-show` + `get-storybook-story-instructions` → CSF per `.ai/rules/03-storybook.md` → `stories-preview` → `npm run test-storybook` (do not call `test-run`)
6. **Reviewing token changes** → follow `protocols/token-audit.md`
7. **AI prompt needed** → see `protocols/ai-prompts.md`

`index.json` stays committed. MCP does not replace it: the index has paths, BEM, PrimeNG wraps, `uses` / `usedBy`, status, and owner. MCP has live stories, Controls, and docs pages. `tokens.consumed` and `aiHints` stay in `.metadata.ts`.

---

## 4. Key Decisions

| Decision          | Choice                   | Rationale                                                  |
| ----------------- | ------------------------ | ---------------------------------------------------------- |
| Schema format     | TypeScript               | Type-safe, importable, real code snippets                  |
| Index format      | JSON                     | Native to the TS ecosystem, importable, schema-validatable |
| Protocol format   | Markdown                 | Readable by both humans and agents                         |
| Metadata location | Colocated with component | Single responsibility, easy to find                        |

---

## 5. Maintenance

| Artifact        | When to update                                                                                                                                                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.json`    | Automatic — `pds:component` regenerates it on scaffold and the `afterFileEdit` Cursor hook regenerates it on edits under `libs/ui`; CI fails when the committed file is stale. Run `npm run generate-index` manually only after hand-deleting files. Not replaced by Storybook MCP. |
| `*.metadata.ts` | Create with every new component; update on API or token changes                                                                                                                                                                                     |
| `protocols/`    | When architectural decisions change                                                                                                                                                                                                                 |
| `schema/`       | When metadata structure needs new fields                                                                                                                                                                                                            |

---

## 6. Future Automation

- [x] Generator to scaffold `.metadata.ts` with component (`npm run PDS:component`) — also regenerates `index.json`
- [x] Script to regenerate `index.json` (`npm run generate-index`) — content-stable output
- [x] CI hook: regenerate index on component changes + fail if stale (`ci.yml` diff gate + `.cursor/hooks/regenerate-contracts-index.mjs` locally)
- [x] Token scripts in CI: audit, prefix, build, lint (`ci.yml`)
- [x] Storybook test-runner: play + a11y + coverage (`npm run test-storybook` / `test-storybook:ci`) — required per component (`.ai/rules/03-storybook.md` §5)
- [x] Storybook metadata figures (`pds-docs-status`, `pds-docs-contract`) + `npm run docs:check` (fails hand-written copies)
- [x] Drift detection: compare `.metadata.ts` `props` against Angular inputs (`npm run contracts:check`)
- [x] `tokens.consumed` vs CSSOM as a CI gate (Foundations / Token contracts `Consumed` play test)
- [ ] Token CI: semantic coverage and contrast
- [x] Storybook MCP components manifest (`@storybook/angular-vite` + `@storybook/addon-mcp` at `http://localhost:6006/mcp`) — `test-run` not wired (needs `@storybook/addon-vitest`; keep `npm run test-storybook`)
