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
├── {component-name}.component.ts      → no styleUrl — components have no colocated stylesheet
├── {component-name}.component.html
├── {component-name}.component.spec.ts
├── {component-name}.stories.ts        ← REQUIRED — colocated, all states documented
└── {component-name}.metadata.ts       ← CONTRACT FILE

libs/styles/src/06-components/
├── _components.{component-name}.scss  ← BEM styles — CSS custom properties only, o-flex/o-layout BEM mixes in template
└── _components.core.scss              ← must @forward the new partial (pds:component appends it)
```

> No colocated `.component.scss`. The only allowed exception is a `:host` display rule
> that cannot live in a global sheet under ViewEncapsulation — added by hand, with a
> justification comment.

> Storybook discovers stories automatically via the glob in `libs/ui/.storybook/main.ts` — no manual registration needed.

## SCSS Rules

Enforced in detail by `.ai/rules/` — this protocol points at them instead of restating them:

| Rule | File | Essence |
|---|---|---|
| Token-first, no local `$variables` | `02-scss-tokens.md` §1–3 | Every value lives in `01-settings` as `--pds-*`; add missing tokens there first |
| CSS custom properties only | `02-scss-tokens.md` §2 | `var(--pds-*)` throughout — no hex/px/rem in `06-components` |
| Layout via `o-flex` / `o-layout` template mixes ⛔ | `08-object-classes.md` | No flex/gap/padding/overflow CSS in `06-components` when a class exists; no Tailwind in templates; `@apply` never for layout |
| PrimeNG `--p-*` bridges in `01-settings` ⛔ | `02-scss-tokens.md` §7 · `04-primeng.md` §5 | `_settings.{primeng-component}.scss`, scoped to the BEM wrapper — never inline in `06-components` |
| Content-first sizing ⛔ | `02-scss-tokens.md` §6 | No arbitrary fixed width/height; the two justified exceptions carry a comment |
| Static chrome via utilities | `09-styling-policy.md` §4 | Borders, radius, resting shadows as `u-*` classes in templates |

New token: add it to the correct `01-settings` file with a comment citing the Figma variable and node, reference it via `var(--pds-*)`, and list it under `tokens.consumed` in the `.metadata.ts`.

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

Attached `{name}.mdx` (not CSF `parameters.docs.description`) must explain:

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
    scssPath: 'libs/styles/src/06-components/_components.{name}.scss',
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
    consumed: [], // list all --pds-* tokens this component reads
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
- [ ] All SCSS values use `var(--pds-*)` — no local `$variables`, no hardcoded values
- [ ] New tokens added to `libs/styles/src/01-settings/` before use (not inline in component)
- [ ] Layout via `o-flex`/`o-layout` in template — no `display: flex`, `overflow`, `width: 100%` in SCSS
- [ ] PrimeNG `--p-*` overrides in `01-settings/_settings.{component}.scss` — never in `06-components/`
- [ ] `@apply` only for non-layout concerns (`list-none`, `cursor-pointer`, `truncate`)
- [ ] Dimensions content-driven; no arbitrary fixed `width`/`height`
- [ ] No Tailwind classes in HTML templates
- [ ] `_components.core.scss` forwards the new partial (automatic via `pds:component`)
- [ ] `.ai/contracts/index.json` regenerated (automatic via `pds:component` and the afterFileEdit hook) and committed
- [ ] No app-specific logic in `libs/ui`
