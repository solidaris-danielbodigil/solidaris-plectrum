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
3. **Check `contracts/index.json`** → does a similar component already exist in `libs/ui`?
4. **Check `01-settings/`** → which required tokens already exist? Which are missing?
5. **Add missing tokens** to the correct `01-settings` file before writing any SCSS
6. Only then → scaffold and implement

---

## 2. File Structure to Create

```
libs/ui/src/lib/{component-name}/
├── {component-name}.component.ts       Angular component class
├── {component-name}.component.html     Template — semantic HTML, BEM classes
├── {component-name}.component.scss     Empty or @use only — real styles in libs/styles
├── {component-name}.component.spec.ts  Unit tests
├── {component-name}.stories.ts         ← REQUIRED — colocated, all states
├── {component-name}.types.ts           Interfaces/types (NavItem, etc.)
└── {component-name}.metadata.ts        ← CONTRACT — required

libs/styles/src/06-components/
└── _components.{component-name}.scss   BEM SCSS — all var(--sds-*), o-flex/o-layout BEM mixes in template
```

After creating, export from `libs/ui/src/index.ts` and run `npm run generate-index`.

> Storybook discovers stories automatically via `libs/ui/src/**/*.stories.*` in `storybook/.storybook/main.ts` — no manual registration needed.

---

## 3. Scaffold with the Generator

Use the workspace generator to scaffold the correct file structure:

```bash
npm run sds:component
```

This creates the component folder, metadata contract, SCSS stub, and Storybook story template.

---

## 4. Component Completion Checklist

A component is **not done** until all of these pass:

### Design
- [ ] Figma MCP queried — tokens and states extracted
- [ ] PrimeNG MCP queried — no existing component reimplemented

### SCSS / Tokens
- [ ] All values reference `var(--sds-*)` — no hardcoded hex/px/rgba
- [ ] No local SCSS `$variables` in the component file
- [ ] Missing tokens added to `01-settings` before use
- [ ] `@apply` used for layout helpers — no Tailwind in HTML templates
- [ ] Dimensions content-driven — no arbitrary fixed `width`/`height`

### Component
- [ ] Semantic HTML throughout (`<nav>`, `<ul>`, `<button>`, etc.)
- [ ] ARIA attributes applied (`aria-label`, `aria-current`, `aria-expanded`, etc.)
- [ ] No app-specific logic inside `libs/ui`
- [ ] Exported from `libs/ui/src/index.ts`
- [ ] Types exported from `libs/ui/src/index.ts`

### Metadata
- [ ] `.metadata.ts` created and conforms to `ComponentMetadata` schema
- [ ] `tokens.consumed` lists all `--sds-*` tokens the component reads

### Storybook
- [ ] `.stories.ts` created **colocated** in `libs/ui/src/lib/{component-name}/`
- [ ] Stories cover: default state + all variant states
- [ ] `parameters.docs.description.component` includes Figma node URL

### Index
- [ ] `npm run generate-index` run and `index.json` committed
