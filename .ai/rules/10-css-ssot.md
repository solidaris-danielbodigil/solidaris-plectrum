# Rules — 10 CSS is the Single Source of Truth

> ⛔ = hard stop — a second copy of a token value or class list blocks merge
>
> Companion to [02-scss-tokens.md](./02-scss-tokens.md) (where tokens are declared) and
> [03-storybook.md](./03-storybook.md) (how components are documented and tested). This file governs
> everything that *reads* the design system: docs pages, audits, and generators.

---

## Table of Contents

1. [The Rule](#1-the-rule-)
2. [Why](#2-why)
3. [Read the CSSOM](#3-read-the-cssom)
4. [What a Generated Artifact May Contain](#4-what-a-generated-artifact-may-contain-)
5. [Never Hardcode a Token or Class List](#5-never-hardcode-a-token-or-class-list-)
6. [Derived, Not Duplicated](#6-derived-not-duplicated)
7. [Review Checklist](#7-review-checklist)

---

## 1. The Rule ⛔

**The compiled stylesheet is the single source of truth for which tokens and classes exist and what they resolve to.**

Anything that documents, audits or lists the design system must **read** that truth at runtime — never restate it.

| Question | Answer comes from |
|---|---|
| Which `--pds-*` tokens exist? | `document.styleSheets` → `:root` declarations |
| What does a token resolve to? | `getComputedStyle(el).getPropertyValue(name)` |
| What was it authored as (alias + fallback)? | `cssRule.style.getPropertyValue(name)` |
| Which `o-*` / `u-*` / `c-*` classes exist? | `cssRule.selectorText` |
| Which Figma node did it come from? | Generated manifest — CSS cannot express provenance |
| When should I use it? | Hand-authored prose — CSS cannot express intent |

---

## 2. Why

`libs/styles` already generates far more than any hand-written list keeps up with. Measured on the current tree:

| Surface | In CSS | In the TS manifest / story arrays |
|---|---|---|
| `--pds-*` declared on `:root` | **636** | 336 |
| `u-radius-*` classes | **72** | 8 (`RADII` in `borders.stories.ts`) |
| `u-shadow-*` classes | **8** | 8, with hand-written token names |

A hardcoded list is not a shortcut — it is a silent bug. Add `--pds-radius-3xl` and the Radius page keeps showing the old set with no error, no failing test, and no reviewer signal. The docs quietly become wrong.

Reading the CSSOM inverts that: a new token appears in Storybook the moment it compiles, and a deleted one disappears. Zero maintenance, and drift becomes structurally impossible rather than something CI has to chase.

---

## 3. Read the CSSOM

Same-origin stylesheets expose everything needed. Custom properties **are** enumerable on a rule's `style`, and the authored value keeps the `var(--p-*, <literal>)` shape, so a hybrid token yields both its PrimeNG alias and its fallback from CSS alone.

```ts
// Authored declarations — the alias + fallback, exactly as written
for (const rule of styleRules()) {
  if (!/^(:root|html)\b/.test(rule.selectorText)) continue;
  for (let i = 0; i < rule.style.length; i += 1) {
    const prop = rule.style.item(i);
    if (prop.startsWith('--pds-')) {
      declarations.set(prop, rule.style.getPropertyValue(prop).trim());
    }
  }
}

// Resolved value — what the browser actually paints
getComputedStyle(host).getPropertyValue('--pds-color-primary-600');

// Generated class names
rule.selectorText.matchAll(/\.(u-radius-[a-z0-9-]+)/g);
```

Rules:

- Walk nested `CSSGroupingRule` (`@media`, `@layer`, `@supports`) recursively.
- Wrap `sheet.cssRules` in `try/catch` — a cross-origin sheet throws.
- Collect **in document order** and let later declarations overwrite earlier ones, so the effective cascade value wins (generated file first, hand-authored extras last).
- Resolve values against the **host element**, not `document.documentElement`, so a scoped override or a stubbed `--p-*` is honoured.

---

## 4. What a Generated Artifact May Contain ⛔

A build step may emit a manifest **only** for facts CSS cannot carry:

| Allowed | Forbidden |
|---|---|
| Figma node / variable reference | Token value or fallback literal |
| Category and group taxonomy | The list of tokens that exist |
| Deprecation notes, owner | Class names |

If a field can be read from the stylesheet, it does not belong in the manifest. Two artifacts holding the same value — even when both are generated from one source — is still two things to build, ship, review and keep aligned.

Usage guidance (how and when to reach for a token) is hand-authored prose and belongs in a dedicated file, keyed by category. It is not duplication: CSS cannot express intent.

---

## 5. Never Hardcode a Token or Class List ⛔

```ts
// ❌ Wrong — drifts silently the moment a stop is added or renamed
const RADII = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'pill'];
const SHADOWS = [{ cls: 'sm', token: '--pds-shadow-sm', use: 'Subtle card chrome' }];

// ✅ Correct — the stylesheet decides
const radii = readUtilityClasses(/^u-radius-(?<stop>[a-z0-9]+)$/);
const shadows = readTokenDeclarations().filter((t) => t.name.startsWith('shadow-'));
```

This applies to every consumer: Storybook pages, audit scripts, token tables, linters, and generators.

### Exception A — ordering and emphasis

A curated *subset* used to make a page readable ("show these four ramps first") is allowed when it is an ordering or emphasis hint, never the source of existence. It must degrade gracefully: unknown entries ignored, unlisted tokens still rendered.

### Exception B — static metadata consumed before the CSSOM exists

Some tooling reads its configuration at module-evaluation time, before the stylesheet is guaranteed to be parsed. Storybook's `meta.argTypes` is the case in this repo: it cannot be derived at render time the way a demo template can.

Such a list may stay static **only if a test asserts it against the stylesheet**, so drift fails CI instead of passing silently:

```ts
// object-class-lists.spec.ts
expect(documentedValues(list)).toEqual(generatedValues(list));
```

Requirements:

- The list lives in its own module, not inside a `.stories.ts` (every named export there becomes a story).
- It carries the selector pattern that proves it, so the test is data-driven rather than hand-mirrored.
- Filter by the properties a rule declares when the class shape is ambiguous, and use **longhands** — the CSSOM expands shorthands, so `flex-flow: wrap` enumerates as `flex-wrap` / `flex-direction`.

Anything that can be read at render time must be. Exception B is not a general licence to keep lists.

---

## 6. Derived, Not Duplicated

Two acceptable directions of flow:

```
tokens.json ──build──► *.generated.scss ──CSSOM──► docs / audits
                  └──► manifest (Figma refs only)
```

- **Build time:** one source generates the stylesheet. Fine.
- **Run time:** the stylesheet is read by everything that documents it. Fine.

What is not acceptable is a second *sibling* of the stylesheet carrying the same values, or a build step that regex-parses SCSS to recover values the browser would hand over for free.

---

## 7. Review Checklist

- [ ] Does this list of tokens or classes come from the stylesheet, not an array?
- [ ] Does the manifest carry only Figma refs, taxonomy or prose?
- [ ] Are values read via `getComputedStyle`, not copied?
- [ ] Is the authored declaration parsed for the `--p-*` alias and fallback, rather than restated?
- [ ] Would adding a token to `01-settings` show up in Storybook with no other edit?
- [ ] Would deleting a token remove it from Storybook with no other edit?
- [ ] Is cross-origin stylesheet access guarded?
- [ ] If a list had to stay static (Exception B), does a spec assert it against the stylesheet?
