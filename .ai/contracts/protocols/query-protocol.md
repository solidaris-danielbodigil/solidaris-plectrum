# Plectrum Design System — Agent Query Protocol

## Purpose

This protocol defines how AI agents should navigate the Plectrum Design System.
Load this once per conversation. Follow these rules deterministically.

---

## Context Loading Order

1. **Read `.ai/contracts/index.json`** — workspace map, component inventory, relationships (offline). When `npm run storybook` is up, Storybook MCP at `http://localhost:6006/mcp` is the live catalogue next to the index.
2. **Read `.ai/rules/02-scss-tokens.md` and `.ai/rules/10-css-ssot.md`** — token architecture rules (governance: risk levels, deprecation and review live in `.ai/contracts/protocols/token-audit.md`)
3. **Read relevant `.metadata.ts`** — only for components you're about to use or create

---

## Storybook MCP

`@storybook/addon-mcp` is registered in `.cursor/mcp.json` and `.vscode/mcp.json` as `storybook` → `http://localhost:6006/mcp`. It is live only while `npm run storybook` is running. When the server is down, stay on `index.json` and the colocated `.metadata.ts`.

MCP does **not** replace the index. The index has paths, BEM, PrimeNG wraps, `uses` / `usedBy`, status, and owner. MCP has live docs pages, Controls, and story previews. `tokens.consumed` and `aiHints` stay in `.metadata.ts`. MCP does not scaffold — that is `npm run pds:component`.

| Toolset | Tools | When |
|---|---|---|
| Docs | `docs-list`, `docs-show`, `docs-show-story` | Find a Plectrum page and read props / canvases before writing UI or stories |
| Development | `get-storybook-story-instructions`, `stories-find-by-component`, `stories-preview` | Author CSF; preview Default / Disabled / Empty. Then follow `.ai/rules/03-storybook.md` |
| Testing | `test-run` | **Not wired.** Needs `@storybook/addon-vitest`. Run `npm run test-storybook` |

Do not invent a Control that is missing from `.metadata.ts` `props`. After `stories-preview`, gate with `npm run contracts:check`, `npm run docs:check`, and `npm run test-storybook`.

---

## Query Optimization Rules

1. **Check context first.** Before any file read, verify if data exists from previous tool calls.
2. **Never re-read relationship files.** If index.json was loaded earlier, use that data.
3. **Follow-up questions should be cheap.** Reason over cached data, not trigger new reads.
4. **Prefer semantic tokens.** Never use primitive tokens directly in components.
5. **Check PrimeNG first.** Before creating a custom component, verify no PrimeNG equivalent exists.

---

## Decision Trees

### "Should I create a new component?"

```
1. Check PrimeNG MCP — does a vendor control cover the need?
2. Check Figma MCP — extract the Plectrum UI Kit node
3. Check index.json → components section (always; offline)
4. When npm run storybook is up → docs-list / docs-show the catalogue
5. If match found → read its .metadata.ts → check if it covers the use case
6. If none cover it → npm run pds:component (MCP does not scaffold)
7. After the stub → docs-show a sibling (Copyable Text, Form Field) and copy that CSF + MDX shape
```

### "How do I write stories for this component?"

```
1. docs-show the component page (or the sibling if the page is a stub)
2. get-storybook-story-instructions
3. Write colocated CSF + attached MDX per .ai/rules/03-storybook.md
   — do not add a Control missing from .metadata.ts props
4. stories-preview the new canvases
5. npm run test-storybook — do not call test-run
```

### "Which token should I use?"

```
1. Never use primitive tokens (--pds-color-primary-500) in components
2. Find the semantic token (--pds-color-brand) in _semantic-*.scss
3. If no semantic token exists → propose one in _semantic-*.scss referencing the primitive
4. Map to PrimeNG --p-* variable if needed
5. Always use #{$pds-prefix} interpolation, never hardcode --pds-
```

### "Which variant should I use?"

```
1. Read component .metadata.ts → variants section
2. Check aiHints.selectionCriteria
3. Match user intent to variant purpose
4. If ambiguous → check antiPatterns to eliminate wrong choices
```

### "How do I style this?"

```
1. Check if PrimeNG --p-* variable override is sufficient (bridge in 01-settings)
2. Layout (flex, columns, align) → o-flex in the template (Foundations / Flex Grid)
3. Gap, padding, margin, overflow, min-size → o-layout in the template (Foundations / Layout)
4. Overflowing content users might miss → o-scroll-shadow / o-scroll-shadow--inline
   on the owned scroll container (Foundations / Scroll Shadow) — not a JS fade
5. Static border / radius / resting shadow → u-* utilities in the template
6. If not covered → create/extend BEM class in libs/styles/src/06-components/
7. Reference --pds-* semantic tokens via var(); @apply only for non-layout helpers, never in HTML
8. Never use !important
9. Never write inline styles
```

### "Which foundation should I use?"

Not a component. Do not invent a wrapper. Match intent to the Storybook page;
Do / Don't and examples live on that page (`doDontStory`, not `.metadata.ts`).

| Keywords                                                         | Reach for                                                        |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| scroll, overflow, fade, more content, edge shadow, clipped, hint | Foundations / Scroll Shadow — `o-scroll-shadow` / `--inline`     |
| flex, columns, span, align, wrap, grid                           | Foundations / Flex Grid — `o-flex`                               |
| gap, padding, margin, overflow, min-h-0, min-w-0, hidden@md      | Foundations / Layout — `o-layout`                                |
| spacing scale, rem, 14px                                         | Foundations / Spacing                                            |
| text colour, surface, border colour, semantic role, hue step     | Foundations / Colors / Semantic Common (ramps only on Primitive) |
| font-size, heading, body, Agenda, Open Sans                      | Foundations / Typography / Roles                                 |
| focus, outline, ring                                             | Foundations / Focus                                              |
| elevation, box-shadow, overlay, modal shadow                     | Foundations / Elevation + Shadows                                |
| border, radius, u-border, u-radius                               | Foundations / Borders + Radius                                   |
| transition, duration, 200ms, easing                              | Foundations / Transitions                                        |
| icon, bi-\*, glyph, icon size                                    | Foundations / Iconography + Custom components / Icon             |

---

## Validation Before Shipping

Before marking any implementation complete, verify:

- [ ] Component uses semantic tokens, not primitives
- [ ] No Tailwind classes in HTML templates
- [ ] BEM naming follows c-{block}\_\_{element}--{modifier}
- [ ] PrimeNG component used where possible
- [ ] .metadata.ts exists and covers all states
- [ ] Storybook story exists, colocated, covering required states
- [ ] Required canvas stories have a `play` function (`.ai/rules/03-storybook.md` §5); `npm run test-storybook` passes (do not call Storybook MCP `test-run`)
- [ ] Accessibility: ARIA attributes, keyboard support, contrast; a11y not disabled on the story
- [ ] SCSS lives in correct ITCSS layer
- [ ] No dead code or duplicated patterns

---

## Anti-Drift Rules

1. If you see a component without .metadata.ts → flag it, don't silently proceed
2. If you see a required canvas story without a `play` function → add it (`.ai/rules/03-storybook.md` §5); the component is not done
3. If you see hardcoded hex values → replace with token reference
4. If you see Tailwind classes in HTML → refactor to BEM + SCSS
5. If you see a duplicated component → propose consolidation
6. If you see --pds-\* hardcoded without #{$pds-prefix} → fix it
