# Skills — 03 Component Workflow

---

## Table of Contents

1. [Before Starting a Component](#1-before-starting-a-component)
2. [File Structure to Create](#2-file-structure-to-create)
3. [Scaffold with the Generator](#3-scaffold-with-the-generator)
4. [Component Completion Checklist](#4-component-completion-checklist)

---

## 1. Before Starting a Component

Follow this sequence **every time** before writing any code:

1. **Query PrimeNG MCP** → does an existing component cover the need?
2. **Query Figma MCP** → inspect the Plectrum UI Kit node, extract tokens and states
3. **If Figma maps to a PrimeNG primitive** → use `p-*` with default theme styles; layout via `o-layout`/`o-flex` only (see `.ai/rules/04-primeng.md` §5)
4. **Check `contracts/index.json`** → does a similar component already exist in `libs/ui`?
5. **Check `01-settings/`** → which required tokens already exist? Which are missing?
6. **Add missing tokens** to the correct `01-settings` file before writing any SCSS
7. Only then → scaffold and implement

---

## 2. File Structure to Create

```
libs/ui/src/lib/{component-name}/
├── {component-name}.component.ts       Angular component class — no styleUrl, no colocated stylesheet
├── {component-name}.component.html     Template — semantic HTML, BEM classes
├── {component-name}.component.spec.ts  Unit tests
├── {component-name}.stories.ts         ← REQUIRED — colocated, all states
├── {component-name}.types.ts           Interfaces/types (NavItem, etc.)
└── {component-name}.metadata.ts        ← CONTRACT — required

libs/styles/src/06-components/
├── _components.{component-name}.scss   BEM SCSS — all var(--pds-*), o-flex/o-layout BEM mixes in template
└── _components.core.scss               @forwards the new partial (pds:component appends it)
```

The generator appends the export to `libs/ui/src/index.ts`, forwards the partial from
`_components.core.scss`, and regenerates `.ai/contracts/index.json` — no manual steps.
Exception for colocated SCSS: a `:host` display rule that cannot live in a global sheet
under ViewEncapsulation, added by hand with a justification comment.

> Storybook discovers stories automatically via the glob in `libs/ui/.storybook/main.ts` — no manual registration needed.

---

## 3. Scaffold with the Generator

Use the workspace generator to scaffold the correct file structure:

```bash
npm run PDS:component
```

This creates the component folder (no colocated stylesheet), the metadata contract, the `_components.{name}.scss` partial with its core-barrel `@forward`, and the Storybook story template — then regenerates `.ai/contracts/index.json`.

---

## 4. Component Completion Checklist

A component is **not done** until all of these pass:

### Design

- [ ] Figma MCP queried — tokens and states extracted
- [ ] PrimeNG MCP queried — no existing component reimplemented

### SCSS / Tokens

- [ ] All values reference `var(--pds-*)` — no hardcoded hex/px/rgba
- [ ] No local SCSS `$variables` in the component file
- [ ] Missing tokens added to `01-settings` before use
- [ ] Layout via `o-flex` / `o-layout` template mixes — no Tailwind in HTML, `@apply` never for layout
- [ ] Dimensions content-driven — no arbitrary fixed `width`/`height`

### Component

- [ ] Semantic HTML throughout (`<nav>`, `<ul>`, `<button>`, etc.)
- [ ] ARIA attributes applied (`aria-label`, `aria-current`, `aria-expanded`, etc.)
- [ ] No app-specific logic inside `libs/ui`
- [ ] Exported from `libs/ui/src/index.ts`
- [ ] Types exported from `libs/ui/src/index.ts`

### Metadata

- [ ] `.metadata.ts` created and conforms to `ComponentMetadata` schema
- [ ] `tokens.consumed` lists all `--pds-*` tokens the component reads

### Storybook

- [ ] `.stories.ts` created **colocated** in `libs/ui/src/lib/{component-name}/`
- [ ] Stories cover: default state + all variant states
- [ ] Attached `{name}.mdx` includes Figma node URL and a canvas per story

### Index

- [ ] `.ai/contracts/index.json` regenerated (automatic via `pds:component` / the afterFileEdit hook) and committed
