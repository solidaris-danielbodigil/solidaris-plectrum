# Rules — 03 Storybook

> ⛔ = hard stop — a component without a story is not done

---

## Table of Contents

1. [Mandatory Story Rule](#1-mandatory-story-rule-)
2. [Required Story Exports](#2-required-story-exports)
3. [Story Documentation Standard](#3-story-documentation-standard)
4. [File Location](#4-file-location)

---

## 1. Mandatory Story Rule ⛔

Every component in `libs/ui` **must** have a `.stories.ts` file **colocated with its component** in `libs/ui/src/lib/{component-name}/`.

**A component is not complete without a Storybook story.**

- Develop and validate in Storybook **before** integrating into any app
- Stories are the living documentation — keep them up to date with the component

---

## 2. Required Story Exports

| Export name | When required |
|---|---|
| `Default` or primary state | Always |
| `Expanded` / `Open` | When component has an open/expanded state |
| `WithActiveItem` / `Selected` | When component has an active/selected state |
| `Disabled` | When component has a disabled state |
| `Empty` | When component can render with no data |
| `Loading` | When component has a loading state |
| `Error` | When component has an error state |

---

## 3. Story Documentation Standard

Every story file must include `parameters.docs.description.component` with:

- What the component does
- Which Figma node it maps to (with full URL)
- Any design constraints or usage rules

```typescript
parameters: {
  docs: {
    description: {
      component: `
**NavShell** — first-level navigation sidebar.
- Collapsed (icon-only) by default; expands on hover
- Figma: [Collapsed](https://figma.com/...?node-id=1-1433) · [Expanded](https://figma.com/...?node-id=1-1463)
- No PrimeNG equivalent — uses semantic \`<nav>\` + \`<ul>\`
      `,
    },
  },
},
```

Individual stories should include `parameters.docs.description.story` describing that specific state.

---

## 4. File Location

Stories are **colocated** with their component inside `libs/ui`:

```
libs/ui/src/lib/
└── {component-name}/
    ├── {component-name}.component.ts
    ├── {component-name}.component.html
    ├── {component-name}.component.scss
    └── {component-name}.stories.ts   ← colocated here
```

Storybook discovers them automatically via the glob `libs/ui/src/**/*.stories.*` configured in `storybook/.storybook/main.ts`.  
Import the component using its local relative path — **not** `@solidaris/ui` — to avoid circular resolution issues inside the monorepo stories.
