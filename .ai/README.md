# Solidaris Design System — AI Knowledge Base

This folder is the single source of truth for all AI agent context.
Load the relevant files at the start of every conversation.

---

## Agents

The same seven roles are defined for both editors:

- **Cursor** → `.cursor/agents/*.md` (Cursor frontmatter: `name`, `description`, `readonly`).
  The **Solidaris** coordinator spawns specialists via the Task tool (multiple Task
  calls in one message = parallel).
- **VS Code / Copilot** → `.github/agents/*.agent.md` (VS Code frontmatter: `tools`,
  `agents`, `user-invocable`), auto-discovered by VS Code.

Keep the two sets in sync when a role's instructions change. Switch to the
**Solidaris** agent to start the full orchestrated workflow.

| Agent | File | Role |
|---|---|---|
| Solidaris *(coordinator)* | `.github/agents/solidaris.agent.md` | Orchestrates all subagents for component creation and QA |
| UX Researcher | `.github/agents/ux-researcher.agent.md` | Figma inspection, token extraction, design briefs |
| UX Engineer | `.github/agents/ux-engineer.agent.md` | Storybook-first, SCSS authoring, token bridging, design QA |
| Frontend Dev | `.github/agents/frontend-dev.agent.md` | Angular implementation, PrimeNG, BEMIT, accessibility |
| Tester | `.github/agents/tester.agent.md` | Story coverage, unit tests, a11y audit, token validation |
| Token Auditor | `.github/agents/token-auditor.agent.md` | Token drift, ITCSS discipline, PrimeNG sync, Figma drift |
| Architect | `.github/agents/architect.agent.md` | SSOT enforcement, refactoring, dependency boundaries, decisions |

Worker agents (`user-invocable: false`) only appear as subagents — they are not
shown in the chat dropdown. Only the **Solidaris** coordinator is user-facing.

### How parallel subagents actually work

VS Code runs subagents in parallel when the coordinator invokes **multiple
`runSubagent` (`agent` tool) calls before waiting for any result**. This is
not automatic — the coordinator's instructions must explicitly tell the model
to fire all subagents at once.

The coordinator uses imperative phrasing like:
> "Invoke the UX Researcher subagent … **and at the same time** invoke the
> Architect subagent … **Do not wait for one to finish before starting the other.**"

This produces the "Planned running subagents…" indicator in VS Code chat (shown
as a planning step listing all parallel subagents before any result arrives).

```
Step 1 (parallel):  UX Researcher + Architect      ← both fire before any result
Step 2:             UX Engineer                     ← waits for Step 1
Step 3:             Frontend Dev                    ← waits for Step 2
Step 4 (parallel):  Tester + Token Auditor          ← both fire before any result
Step 5:             Consolidate → summary
```

**Prerequisites for parallel subagents to work:**
- Coordinator has `tools: [agent]` in frontmatter ✅
- Coordinator has `agents: [list]` restricting which subagents are allowed ✅
- Worker agents have `user-invocable: false` (hidden from dropdown) ✅
- Worker agents do **not** have `tools: [agent]` (they are workers, not orchestrators) ✅
- Coordinator instructions say **invoke before waiting** — not just "run in parallel" ✅

### When to invoke the Architect directly

The Architect is also available as a standalone subagent for:
- New pattern introduction
- Refactoring existing code
- Structural ambiguity blocking another agent
- File naming / layer violations

---

## Rules

Architectural constraints that must never be violated.

| File | Topic |
|---|---|
| `.ai/rules/01-architecture.md` | SSOT, monorepo boundaries, quality principles |
| `.ai/rules/02-scss-tokens.md` | Token layers, ITCSS, CSS variable strategy |
| `.ai/rules/03-storybook.md` | Storybook-first development |
| `.ai/rules/04-primeng.md` | PrimeNG-first component policy |
| `.ai/rules/05-bemit-naming.md` | BEMIT class naming conventions |
| `.ai/rules/06-accessibility.md` | WCAG AA, focus rings, ARIA |
| `.ai/rules/07-version-control.md` | Branching, commits, PR hygiene |
| `.ai/rules/08-object-classes.md` | `o-flex` / `o-layout` — layout in templates, not component SCSS |
| `.ai/rules/09-styling-policy.md` | `o-grid`, `u-border-*` / `u-radius-*` / `u-shadow-*`, overlays, custom-class registry |

---

## Skills

How to accomplish tasks correctly.

| File | Topic |
|---|---|
| `.ai/skills/01-design-system.md` | Working with Plectrum, Figma MCP, PrimeNG MCP |
| `.ai/skills/02-scss-architecture.md` | ITCSS layers, token authoring patterns |
| `.ai/skills/03-component-workflow.md` | End-to-end component creation workflow |
| `.ai/skills/04-token-checklist.md` | Token review and validation checklist |

---

## Contracts

Machine-readable schemas and AI protocols.

| File | Topic |
|---|---|
| `.ai/contracts/protocols/component-creation.md` | How to create components correctly |
| `.ai/contracts/protocols/token-audit.md` | How to validate token health |
| `.ai/contracts/protocols/query-protocol.md` | How agents navigate the codebase |
| `.ai/contracts/protocols/ai-prompts.md` | Ready-to-use AI prompt templates |
| `.ai/contracts/schema/component.metadata.ts` | TypeScript interface for component metadata |
| `.ai/contracts/schema/token.contract.ts` | TypeScript interface for token governance |
| `.ai/contracts/index.json` | Codebase map for agent navigation |

---

## Output Folders

Agents write their outputs here.

| Folder | Written by | Contains |
|---|---|---|
| `.ai/briefs/` | UX Researcher | `{component}.brief.md` — design specs |
| `.ai/decisions/` | Architect | `{date}-{title}.md` — ADRs |
| `.ai/questions/` | Any agent | Open questions requiring human input |
| `.ai/test-reports/` | Tester | `{component}.report.md` — test results |
