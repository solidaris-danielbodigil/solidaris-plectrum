# Rules — 03 Storybook

> ⛔ = hard stop — a component without a story is not done
>
> Foundation and token pages must derive their content from the CSSOM rather than
> hardcoded arrays — see [10-css-ssot.md](./10-css-ssot.md).

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

| Export name                   | When required                               |
| ----------------------------- | ------------------------------------------- |
| `Default` or primary state    | Always                                      |
| `Expanded` / `Open`           | When component has an open/expanded state   |
| `WithActiveItem` / `Selected` | When component has an active/selected state |
| `Disabled`                    | When component has a disabled state         |
| `Empty`                       | When component can render with no data      |
| `Loading`                     | When component has a loading state          |
| `Error`                       | When component has an error state           |

---

## 3. Story Documentation Standard

CSF owns the Angular stories. Attached MDX owns all prose.

- Colocate `{name}.mdx` next to `{name}.stories.ts`
- Attach with `<Meta of={Stories} />` and pull canvases with `<Canvas of={Stories.X} />`
- Import blocks from `@storybook/addon-docs/blocks`
- CSF meta uses `tags: ['!dev']` so individual stories stay out of the sidebar
- Do **not** put usage guidance in `parameters.docs.description.component` / `.story`

Each MDX page must include:

- What the component does
- Which Figma node it maps to (with full URL)
- Design constraints or usage rules
- An `h2` / `h3` per canvas so the docs TOC can list sections
- `<Controls of={Stories.X} />` immediately under the primary canvas (usually `Default`)
- An `## API` + `<ArgTypes of={Stories} />` block **at the end of the page**, after every canvas — never before the first canvas

Docs tables use `<DocsTable>` from `libs/ui/.storybook/docs-table.ts` (Storybook ArgTypes chrome, no JSX — Angular's Babel loader cannot parse `.jsx`). Do **not** use Markdown pipe tables — Storybook 10 MDX leaves them as a single unreadable line. Do **not** put a PrimeNG `p-table` in a Canvas iframe; it is clipped. Custom components and UI pages put `<Controls of={Stories.X} />` under the primary canvas so designers can edit args there. Component APIs still use `<ArgTypes of={Stories} />` at the end of the page.

Process and architecture pages (`libs/ui/src/docs/*.mdx`) are read by designers and architects as well as developers. Write them as reference documentation: noun headings (`Definition`, `Architecture`, `Process`, `Roles`, `Rules`, `Glossary`, `Reference`), short declarative sentences, terms defined on first use, engineering detail in a closing **Reference** section. No narrative framing ("the journey of…", "one picture", "roads"), no rhetorical questions.

**Docs figures are PrimeNG components, not custom markup** (see `04-primeng.md` §6). Steps, cards and callouts are Angular components in `libs/ui/src/storybook/` built on PrimeNG — `pds-docs-steps` (`p-timeline` + `p-badge` + `p-tag`), `pds-docs-cards` (`p-card` + `p-tag`), `pds-docs-callout` (`p-message`). MDX cannot pass props to Angular, so each page keeps its figure content in a sibling `*.stories.ts` tagged `['!dev']` (hidden from the sidebar) using the factories in `libs/ui/src/docs/docs-figure-stories.ts`, and embeds it with `<Unstyled><Story of={Figures.X} /></Unstyled>`. The one exception is `<Diagram>` in `libs/ui/.storybook/docs-figures.ts` — an SVG boxes-and-arrows figure with no PrimeNG equivalent. Never draw diagrams in ASCII code blocks; never hand-roll a stepper, badge, card or notice in React or HTML when PrimeNG has one. Tones are fixed across all pages and map to PrimeNG severities: `design` = Figma (`warn`, orange), `system` = this repo (`info`, blue), `app` = products (`success`, green), `neutral` = process (`secondary`); dashed diagram arrows are manual steps. Styles live in `libs/styles/src/06-components/_components.docs-figures.scss`, read `--pds-*` only, and stay structural for the PrimeNG figures (grid, list bullets, text rhythm) — PrimeNG owns their chrome. The SVG carries `fill="none"` / `currentColor` presentation attributes so an unstyled render degrades to a wireframe, never to SVG's default black fill.

---

## 4. File Location

Stories are **colocated** with their component inside `libs/ui`:

```
libs/ui/src/lib/
└── {component-name}/
    ├── {component-name}.component.ts
    ├── {component-name}.component.html
    ├── {component-name}.component.scss
    ├── {component-name}.stories.ts   ← CSF (interactive stories)
    └── {component-name}.mdx          ← attached docs page
```

Storybook discovers them via the glob in `libs/ui/.storybook/main.ts`.
Import the component using its local relative path — **not** `@solidaris/ui` — to avoid circular resolution issues inside the monorepo stories.
