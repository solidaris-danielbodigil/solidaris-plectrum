# Plectrum Design System — Agent Query Protocol

## Purpose

This protocol defines how AI agents should navigate the Plectrum Design System.
Load this once per conversation. Follow these rules deterministically.

---

## Context Loading Order

1. **Read `.ai/contracts/index.json`** — workspace map, component inventory, relationships
2. **Read `.ai/DESIGN_TOKENS_GOVERNANCE.md`** — token architecture rules
3. **Read relevant `.metadata.ts`** — only for components you're about to use or create

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
1. Check index.json → components section
2. Search for similar names/purposes
3. If match found → read its .metadata.ts → check if it covers the use case
4. If no match → check PrimeNG MCP for an existing component
5. If neither → create new component in libs/ui with .metadata.ts
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
1. Check if PrimeNG --p-* variable override is sufficient
2. If not → create/extend BEM class in libs/styles/src/06-components/
3. Use @apply with Tailwind utilities inside SCSS only (never in HTML)
4. Reference --pds-* semantic tokens via var()
5. Never use !important
6. Never write inline styles
```

---

## Validation Before Shipping

Before marking any implementation complete, verify:

- [ ] Component uses semantic tokens, not primitives
- [ ] No Tailwind classes in HTML templates
- [ ] BEM naming follows c-{block}__{element}--{modifier}
- [ ] PrimeNG component used where possible
- [ ] .metadata.ts exists and covers all states
- [ ] Storybook story exists
- [ ] SCSS lives in correct ITCSS layer
- [ ] Accessibility: ARIA attributes, keyboard support, contrast
- [ ] No dead code or duplicated patterns

---

## Anti-Drift Rules

1. If you see a component without .metadata.ts → flag it, don't silently proceed
2. If you see hardcoded hex values → replace with token reference
3. If you see Tailwind classes in HTML → refactor to BEM + SCSS
4. If you see a duplicated component → propose consolidation
5. If you see --pds-* hardcoded without #{$pds-prefix} → fix it
