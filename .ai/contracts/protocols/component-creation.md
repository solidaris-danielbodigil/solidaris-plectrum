# Component Creation Protocol

## Pre-flight

1. Query **PrimeNG MCP** — does a component already exist?
2. Query **Figma MCP** — extract design specs from Plectrum UI Kit (tokens, spacing, typography, states)
3. Check **index.json** — does a similar component already exist in `libs/ui`?
4. Check **`libs/styles/src/01-settings/`** — do the required tokens already exist?
   - If missing → add them to the correct `01-settings` file **first**, before writing any SCSS
5. If all clear → proceed with creation

## File Structure

```
libs/ui/src/lib/{component-name}/
├── {component-name}.component.ts
├── {component-name}.component.html
├── {component-name}.component.scss   → empty or minimal; all real styles in libs/styles
├── {component-name}.component.spec.ts
├── {component-name}.stories.ts        ← REQUIRED — colocated, all states documented
└── {component-name}.metadata.ts       ← CONTRACT FILE

libs/styles/src/06-components/
└── _components.{component-name}.scss  ← BEM styles — CSS custom properties only, o-flex/o-layout BEM mixes in template
```

> Storybook discovers stories automatically via `libs/ui/src/**/*.stories.*` in `storybook/.storybook/main.ts` — no manual registration needed.

## SCSS Rules (enforced)

### 1 — No local SCSS `$variables` in component files
All values **must** live in `libs/styles/src/01-settings/`. If a token is missing, add it there first.

```scss
// ❌ Wrong — local variable
$nav-bg: #f6f6f6;
.c-nav { background: $nav-bg; }

// ✅ Correct — token in 01-settings/_settings.colors-semantic.scss
.c-nav { background: var(--sds-color-nav-shell-bg); }
```

### 2 — CSS custom properties only in components
Use `var(--sds-*)` throughout. Never hardcode hex, rgba, px, or rem values in `06-components`.

```scss
// ❌ Wrong
.c-nav__item { padding: 10px; border-radius: 10px; }

// ✅ Correct
.c-nav__item {
  padding: var(--sds-space-nav-shell-item-p);
  border-radius: var(--sds-radius-lg);
}
```

### 3 — Template-first layout via `o-flex` / `o-layout` ⛔
Layout properties (`display: flex`, `flex-direction`, `align-items`, `overflow`, `width: 100%`, etc.)
must be expressed as **object-class BEM mixes in the HTML template** when an equivalent class exists.

Tailwind utility classes must **never** appear in HTML templates.

```html
<!-- ❌ Wrong — flex/overflow in component SCSS -->
.c-card__body { display: flex; flex-direction: column; overflow-y: auto; }

<!-- ✅ Correct — object classes in template -->
<div class="c-card__body o-flex o-flex--col o-layout--overflow-y-auto">
```

**Priority order:**
1. `o-flex` / `o-layout` class in template — always first if one exists
2. `@apply` in SCSS — only for properties with no `o-*` equivalent (e.g. `list-none`, `cursor-pointer`, `truncate`)
3. `var(--sds-*)` in SCSS — for component-specific spacing that's token-backed

### 4 — PrimeNG token bridge in `01-settings/` ⛔
All PrimeNG `--p-*` variable overrides belong in `libs/styles/src/01-settings/_settings.{primeng-component}.scss`.
Never declare `--p-*` variables inline in `06-components/`.

```scss
// ❌ Wrong — --p-* in 06-components
.c-sub-nav-shell__accordion {
  --p-accordion-header-background: transparent;
}

// ✅ Correct — in 01-settings/_settings.accordion.scss
.c-sub-nav-shell__accordion {
  --p-accordion-header-background: transparent;
  --p-accordion-header-color: var(--color-sub-nav-shell-section-text);
}
```

### 5 — Content-first sizing ⛔
Components must **never** have arbitrary fixed `width` or `height`.
Heights must emerge from `padding` + `line-height`. Widths must emerge from `flex`/`grid`/`max-content`.

Only two categories justify a fixed dimension — both require a justification comment in the SCSS:
1. **Icon/asset constraints** — icon fonts and SVGs collapse to 0 without a size
2. **Structural collapsed/icon-only states** — the entire layout depends on the dimension

```scss
// ❌ Wrong — arbitrary fixed sizes
.c-nav-shell__logo { height: 52px; }
.c-nav-shell__link { min-height: 40px; }

// ✅ Correct — content-driven
.c-nav-shell__logo { padding: var(--sds-space-nav-shell-item-px); }
.c-nav-shell__link { padding: var(--sds-space-nav-shell-item-py) var(--sds-space-nav-shell-item-px); }

// ✅ Acceptable — structurally required, with comment
.c-nav-shell__icon {
  // Fixed size required — icon fonts collapse to 0 without an explicit constraint
  width: var(--sds-size-nav-shell-icon);
  height: var(--sds-size-nav-shell-icon);
}
```

### 6 — Token creation when values are missing
If Figma specifies a value that has no existing `--sds-*` token:
1. Add it to the correct `01-settings` file with a descriptive comment citing the Figma node
2. Reference it in the component SCSS via `var(--sds-*)`
3. Note the new token in the `.metadata.ts` under `tokens.consumed`

## Storybook Rule (mandatory)

Every component in `libs/ui` **must** have a `.stories.ts` file **colocated** in its component folder (`libs/ui/src/lib/{component-name}/`).
A component is **not complete** without it.

Required story exports:
- `Default` / the primary resting state
- `Expanded` / `Open` / variant states (where applicable)
- `WithActiveItem` / `Selected` (where applicable)
- `Disabled` (where applicable)
- `Empty` (where applicable)
- `Loading` (where applicable)

Story `parameters.docs.description` must explain:
- What the component does
- Which Figma node it maps to (with URL)
- Any design constraints or usage rules

## Metadata Contract Template

```typescript
import { ComponentMetadata } from '@solidaris/contracts';

export const {Name}Metadata: ComponentMetadata = {
  component: {
    name: '{Name}',
    category: '{atoms|molecules|organisms|templates}',
    description: '',
    type: '{interactive|display|container|input|navigation|feedback}',
    path: 'libs/ui/src/lib/{name}/{name}.component.ts',
    primeNgComponent: undefined, // or 'Button', 'DataTable', etc.
    bemBlock: 'c-{name}',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_{name}.scss',
    created: '{ISO date}',
    modified: '{ISO date}',
  },
  usage: {
    useCases: [],
    commonPatterns: [],
    antiPatterns: [],
  },
  accessibility: {
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [], // list all --sds-* tokens this component reads
  },
  aiHints: {
    priority: 'medium',
    context: '',
    selectionCriteria: {},
    keywords: [],
  },
  examples: [],
};
```

## Post-creation Checklist

- [ ] Storybook story created **colocated** in `libs/ui/src/lib/{component-name}/` covering all states
- [ ] Component exported from `libs/ui/src/index.ts`
- [ ] `.metadata.ts` conforms to schema
- [ ] All SCSS values use `var(--sds-*)` — no local `$variables`, no hardcoded values
- [ ] New tokens added to `libs/styles/src/01-settings/` before use (not inline in component)
- [ ] Layout via `o-flex`/`o-layout` in template — no `display: flex`, `overflow`, `width: 100%` in SCSS
- [ ] PrimeNG `--p-*` overrides in `01-settings/_settings.{component}.scss` — never in `06-components/`
- [ ] `@apply` only for non-layout concerns (`list-none`, `cursor-pointer`, `truncate`)
- [ ] Dimensions content-driven; no arbitrary fixed `width`/`height`
- [ ] No Tailwind classes in HTML templates
- [ ] `npm run generate-index` run after creation
- [ ] No app-specific logic in `libs/ui`
