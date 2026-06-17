// =============================================================================
// libs/ui/src/foundations/o-grid.stories.ts
// Foundations / Grid (CSS) — o-grid / o-grid__item CSS Grid object docs.
// Each export is a self-contained live demo wrapped in .sb-demo-wrapper.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';

const COLS        = [1,2,3,4,5,6,7,8,9,10,11,12];
const AUTO_FLOW   = ['row','col','row-dense','col-dense'];
const ITEMS       = ['center','start','end','stretch','baseline','flex-start','flex-end'];
const CONTENT     = ['center','start','end','stretch','space-between','flex-start','flex-end','space-around','space-evenly'];
const PLACE       = ['center','start','end','stretch'];
const SELF        = ['center','start','end','stretch'];
const BREAKPOINTS = ['@xs','@sm','@md','@lg','@xl'];

export default {
  title: 'Foundations/Grid (CSS)',
  tags: ['!autodocs'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A **CSS Grid object** — the column-system companion to the flex-based [Foundations/Flex Grid](?path=/story/foundations-flex-grid--responsive-layout).

- \`.o-grid\` — grid container (\`display: grid\`)
- \`.o-grid__item\` — grid child / cell (span + self-alignment)

### Three-tier model — bounded utilities + escape hatch (not 12-cols-only)

CSS Grid's strength is custom track definitions, not fixed 12-column layouts, so \`o-grid\` is built in three tiers:

1. **Bounded utility classes** for the common ~90% — equal columns \`.o-grid--cols-{1–12}\` and responsive auto grids \`.o-grid--auto-fit\` / \`.o-grid--auto-fill\` (driven by \`--sds-grid-min\`).
2. **Custom-property escape hatch** — set \`--sds-grid-template-columns\` (and \`--sds-grid-template-rows\`) to any arbitrary track list (\`200px 1fr 2fr\`, \`auto 1fr auto\`) while still getting every alignment modifier + \`o-layout--gap-*\`. No class explosion.
3. **Case-by-case in component SCSS** for the genuinely bespoke (named \`grid-template-areas\`, complex row templates) — the component owns its template, exactly like the accordion owns its radii.

> **Mutually exclusive** — \`.o-grid--cols-*\` and the \`--sds-grid-template-columns\` escape hatch both set \`grid-template-columns\`. Use one or the other; if both are present, **source order wins** (the \`--cols-*\` rule comes later, so it overrides the custom property).

> **Gap** — gap is *not* defined on \`o-grid\`. Reuse \`.o-layout--gap-{scale}\` as a BEM mix on the same element, the same contract as \`.o-flex\`.

Responsive suffixes \`@sm\` \`@md\` \`@lg\` \`@xl\` apply to \`--cols-*\`, auto-flow, item spans, and all alignment modifiers.

Styles: \`libs/styles/src/05-objects/_objects.grid.scss\`
        `,
      },
    },
  },
  argTypes: {
    'o-grid':                    { name: '.o-grid',                          description: 'CSS Grid container initializer (display: grid)',                              table: { category: 'Grid Container', subcategory: 'Block' } },
    'o-grid--cols-xx':           { name: '.o-grid--cols-{1–12}',  options: COLS,        description: 'Tier 1a — equal columns: repeat(n, minmax(0, 1fr))',            table: { category: 'Grid Container', subcategory: 'Track template', type: { summary: '1 to 12' } } },
    'o-grid--auto-fit':          { name: '.o-grid--auto-fit',                description: 'Tier 1b — auto-fit columns sized by --sds-grid-min (collapses empty tracks)',  table: { category: 'Grid Container', subcategory: 'Track template', defaultValue: { summary: '--sds-grid-min: 16rem' } } },
    'o-grid--auto-fill':         { name: '.o-grid--auto-fill',               description: 'Tier 1b — auto-fill columns sized by --sds-grid-min (keeps empty tracks)',      table: { category: 'Grid Container', subcategory: 'Track template', defaultValue: { summary: '--sds-grid-min: 16rem' } } },
    '--sds-grid-template-columns':{ name: '--sds-grid-template-columns',      description: 'Tier 2 — escape hatch: arbitrary column track list (custom property)',          table: { category: 'Grid Container', subcategory: 'Track template', defaultValue: { summary: 'none' } } },
    '--sds-grid-template-rows':  { name: '--sds-grid-template-rows',          description: 'Tier 2 — escape hatch: arbitrary row track list (custom property)',             table: { category: 'Grid Container', subcategory: 'Track template', defaultValue: { summary: 'none' } } },
    '--sds-grid-min':            { name: '--sds-grid-min',                    description: 'Min column width for --auto-fit / --auto-fill (override per instance)',          table: { category: 'Grid Container', subcategory: 'Track template', defaultValue: { summary: '16rem' } } },
    'auto-flow':                 { name: '.o-grid--{flow}',       options: AUTO_FLOW,   description: 'grid-auto-flow shorthand',                                      table: { category: 'Grid Container', subcategory: 'Block-modifier', type: { summary: AUTO_FLOW.join(' | ') }, defaultValue: { summary: 'row' } } },
    'justify-items':             { name: '.o-grid--justify-items-xxx',  options: ITEMS,  description: 'Inline-axis alignment of items within their grid area',          table: { category: 'Grid Container', subcategory: 'Alignment', type: { summary: ITEMS.join(' | ') }, defaultValue: { summary: 'stretch' } } },
    'align-items':               { name: '.o-grid--align-items-xxx',    options: ITEMS,  description: 'Block-axis alignment of items within their grid area',            table: { category: 'Grid Container', subcategory: 'Alignment', type: { summary: ITEMS.join(' | ') }, defaultValue: { summary: 'stretch' } } },
    'place-items':               { name: '.o-grid--place-items-xxx',    options: PLACE,  description: 'Shorthand for align-items + justify-items (curated subset)',      table: { category: 'Grid Container', subcategory: 'Alignment', type: { summary: PLACE.join(' | ') } } },
    'justify-content':           { name: '.o-grid--justify-content-xxx',options: CONTENT,description: 'Inline-axis alignment of the whole grid within the container',    table: { category: 'Grid Container', subcategory: 'Alignment', type: { summary: CONTENT.join(' | ') } } },
    'align-content':             { name: '.o-grid--align-content-xxx',  options: CONTENT,description: 'Block-axis alignment of the whole grid within the container',     table: { category: 'Grid Container', subcategory: 'Alignment', type: { summary: CONTENT.join(' | ') } } },
    'place-content':             { name: '.o-grid--place-content-xxx',  options: [...PLACE, 'space-between'], description: 'Shorthand for align-content + justify-content (curated subset)', table: { category: 'Grid Container', subcategory: 'Alignment', type: { summary: [...PLACE, 'space-between'].join(' | ') } } },
    'o-grid__item':              { name: '.o-grid__item',                    description: 'Grid item initializer (for span + self-alignment modifiers)',                  table: { category: 'Grid Items', subcategory: 'Element' } },
    'o-grid__item--col-span-xx': { name: '.o-grid__item--col-span-{1–12}', options: COLS, description: 'Item spans n columns (grid-column: span n)',                  table: { category: 'Grid Items', subcategory: 'Element-Modifier', type: { summary: '1 to 12' } } },
    'o-grid__item--row-span-xx': { name: '.o-grid__item--row-span-{1–12}', options: COLS, description: 'Item spans n rows (grid-row: span n)',                        table: { category: 'Grid Items', subcategory: 'Element-Modifier', type: { summary: '1 to 12' } } },
    'o-grid__item--col-start-xx':{ name: '.o-grid__item--col-start-{1–12}', options: COLS, description: 'Item starts at column line n (grid-column-start)',            table: { category: 'Grid Items', subcategory: 'Element-Modifier', type: { summary: '1 to 12' } } },
    'justify-self':              { name: '.o-grid__item--justify-self-xxx', options: ITEMS, description: 'Inline-axis alignment of one item, overriding justify-items',  table: { category: 'Grid Items', subcategory: 'Element-Modifier', type: { summary: ITEMS.join(' | ') } } },
    'align-self':                { name: '.o-grid__item--align-self-xxx',   options: SELF,  description: 'Block-axis alignment of one item, overriding align-items',      table: { category: 'Grid Items', subcategory: 'Element-Modifier', type: { summary: SELF.join(' | ') } } },
    'place-self':                { name: '.o-grid__item--place-self-xxx',   options: PLACE, description: 'Shorthand for align-self + justify-self (curated subset)',      table: { category: 'Grid Items', subcategory: 'Element-Modifier', type: { summary: PLACE.join(' | ') } } },
    'suffixes':                  { name: '@xxx',                  options: BREAKPOINTS, description: 'Responsive suffixes for cols, auto-flow, spans, and alignment classes', table: { category: 'Responsive Suffixes', type: { summary: BREAKPOINTS.join(' | ') }, defaultValue: { summary: '@xs' } } },
  },
} as Meta;

// ── Tier 1a — Template Columns ────────────────────────────────────────────────
export const TemplateColumns = {
  name: 'Template Columns',
  parameters: { docs: { description: { story: '**Tier 1a.** `.o-grid--cols-{1–12}` creates *n* equal columns via `repeat(n, minmax(0, 1fr))`. `minmax(0, 1fr)` lets columns shrink below their content size (prevents overflow). Gap via `.o-layout--gap-*`.' } } },
  render: () => ({ template: `
    <div class="o-grid o-grid--cols-2 o-layout--gap-2">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
    </div>
    <div class="o-grid o-grid--cols-3 o-layout--gap-2" style="margin-top: 1rem;">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>
    <div class="o-grid o-grid--cols-4 o-layout--gap-2" style="margin-top: 1rem;">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">4</div>
    </div>` }),
};

// ── Tier 1b — Auto Grid ───────────────────────────────────────────────────────
export const AutoGrid = {
  name: 'Auto Grid (auto-fit / auto-fill)',
  parameters: { docs: { description: { story: `
**Tier 1b.** Responsive grids that reflow by *container width* — no breakpoints needed.

- \`.o-grid--auto-fit\` — collapses empty tracks so items stretch to fill the row.
- \`.o-grid--auto-fill\` — keeps empty tracks reserved (items keep their min width).

Both derive column count from \`--sds-grid-min\` (default \`16rem\`). Override per instance with an inline \`style="--sds-grid-min: 12rem;"\`. Resize the viewport to watch columns reflow.
  ` } } },
  render: () => ({ template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">auto-fit · --sds-grid-min: 10rem</p>
    <ul class="o-grid o-grid--auto-fit o-layout--gap-2" style="--sds-grid-min: 10rem; list-style: none; padding: 0; margin: 0;">
      <li class="c-demo-cell o-layout--padding-2">1</li>
      <li class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</li>
      <li class="c-demo-cell o-layout--padding-2">3</li>
      <li class="c-demo-cell c-demo-cell--accent o-layout--padding-2">4</li>
      <li class="c-demo-cell o-layout--padding-2">5</li>
    </ul>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">auto-fill · --sds-grid-min: 10rem</p>
    <ul class="o-grid o-grid--auto-fill o-layout--gap-2" style="--sds-grid-min: 10rem; list-style: none; padding: 0; margin: 0;">
      <li class="c-demo-cell o-layout--padding-2">1</li>
      <li class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</li>
      <li class="c-demo-cell o-layout--padding-2">3</li>
    </ul>` }),
};

// ── Tier 2 — Custom Template (escape hatch) ───────────────────────────────────
export const CustomTemplate = {
  name: 'Custom Template (escape hatch)',
  parameters: { docs: { description: { story: `
**Tier 2.** For arbitrary track lists, set \`--sds-grid-template-columns\` (and/or \`--sds-grid-template-rows\`) inline. The element still gets every alignment modifier and \`o-layout--gap-*\` — no class explosion.

\`\`\`html
<div class="o-grid o-layout--gap-3" style="--sds-grid-template-columns: 200px 1fr 2fr;">…</div>
<div class="o-grid o-layout--gap-3" style="--sds-grid-template-columns: auto 1fr auto;">…</div>
\`\`\`
  ` } } },
  render: () => ({ template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">--sds-grid-template-columns: 200px 1fr 2fr</p>
    <div class="o-grid o-layout--gap-2" style="--sds-grid-template-columns: 200px 1fr 2fr;">
      <div class="c-demo-cell o-layout--padding-2">200px</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">1fr</div>
      <div class="c-demo-cell o-layout--padding-2">2fr</div>
    </div>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">--sds-grid-template-columns: auto 1fr auto</p>
    <div class="o-grid o-layout--gap-2" style="--sds-grid-template-columns: auto 1fr auto;">
      <div class="c-demo-cell o-layout--padding-2">auto</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">1fr</div>
      <div class="c-demo-cell o-layout--padding-2">auto</div>
    </div>` }),
};

// ── Column / Row Span ─────────────────────────────────────────────────────────
export const ColRowSpan = {
  name: 'Column / Row Span',
  parameters: { docs: { description: { story: 'Items span tracks with `.o-grid__item--col-span-{1–12}` / `--row-span-{1–12}`, and can be placed at a specific column line with `--col-start-{1–12}`. All support `@{breakpoint}` suffixes.' } } },
  render: () => ({ template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">col-span on a 4-column grid</p>
    <div class="o-grid o-grid--cols-4 o-layout--gap-2">
      <div class="o-grid__item o-grid__item--col-span-2 c-demo-cell c-demo-cell--accent o-layout--padding-2">col-span-2</div>
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="o-grid__item o-grid__item--col-span-4 c-demo-cell c-demo-cell--accent o-layout--padding-2">col-span-4 (full row)</div>
    </div>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">row-span + col-start on a 3-column grid</p>
    <div class="o-grid o-grid--cols-3 o-layout--gap-2" style="grid-auto-rows: 48px;">
      <div class="o-grid__item o-grid__item--row-span-2 c-demo-cell c-demo-cell--accent o-layout--padding-2">row-span-2</div>
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="o-grid__item o-grid__item--col-start-3 c-demo-cell c-demo-cell--accent o-layout--padding-2">col-start-3</div>
    </div>` }),
};

// ── Auto-flow ─────────────────────────────────────────────────────────────────
export const AutoFlow = {
  name: 'Auto-flow',
  parameters: { docs: { description: { story: 'Controls how auto-placed items fill the grid. `.o-grid--row` (default) · `.o-grid--col` · `.o-grid--row-dense` · `.o-grid--col-dense`. `dense` backfills holes left by spanning items.' } } },
  render: () => ({ template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">.o-grid--col — items flow down columns first (3 rows fixed)</p>
    <div class="o-grid o-grid--col o-layout--gap-2" style="grid-template-rows: repeat(2, auto); grid-auto-flow: column;">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">4</div>
    </div>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">.o-grid--row-dense — backfills gaps from spanning items</p>
    <div class="o-grid o-grid--cols-4 o-grid--row-dense o-layout--gap-2">
      <div class="o-grid__item o-grid__item--col-span-3 c-demo-cell c-demo-cell--accent o-layout--padding-2">col-span-3</div>
      <div class="c-demo-cell o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">4</div>
    </div>` }),
};

// ── Justify / Align / Place Items ─────────────────────────────────────────────
export const ItemsAlignment = {
  name: 'Justify / Align / Place Items',
  parameters: { docs: { description: { story: `
Aligns each item *within its own grid area* (the cells are taller/wider than their content here so alignment is visible).

- \`justify-items\` — inline (horizontal) axis · \`align-items\` — block (vertical) axis
- \`place-items\` — shorthand for both. Curated keys: \`center\` \`start\` \`end\` \`stretch\`.
  ` } } },
  render: () => ({ template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">justify-items-center (inline axis)</p>
    <div class="o-grid o-grid--cols-3 o-grid--justify-items-center o-layout--gap-2">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">align-items-center (block axis, fixed-height rows)</p>
    <div class="o-grid o-grid--cols-3 o-grid--align-items-center o-layout--gap-2" style="grid-auto-rows: 80px;">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">place-items-center (both axes)</p>
    <div class="o-grid o-grid--cols-3 o-grid--place-items-center o-layout--gap-2" style="grid-auto-rows: 80px;">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>` }),
};

// ── Justify / Align / Place Content ───────────────────────────────────────────
export const ContentAlignment = {
  name: 'Justify / Align / Place Content',
  parameters: { docs: { description: { story: `
Aligns the *whole grid* within the container when the tracks are smaller than the container.

- \`justify-content\` — inline axis · \`align-content\` — block axis
- \`place-content\` — shorthand. Curated keys: \`center\` \`start\` \`end\` \`stretch\` \`space-between\`.
  ` } } },
  render: () => ({ template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">justify-content-space-between (fixed-width columns)</p>
    <div class="o-grid o-grid--justify-content-space-between o-layout--gap-2" style="grid-template-columns: repeat(3, 80px);">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">align-content-center (tall container)</p>
    <div class="o-grid o-grid--cols-3 o-grid--align-content-center o-layout--gap-2" style="height: 160px;">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">place-content-center (both axes)</p>
    <div class="o-grid o-grid--place-content-center o-layout--gap-2" style="grid-template-columns: repeat(3, 80px); height: 160px;">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>` }),
};

// ── Item self-alignment ───────────────────────────────────────────────────────
export const ItemSelfAlignment = {
  name: 'Item Self-Alignment',
  parameters: { docs: { description: { story: 'A single item can override the container with `.o-grid__item--justify-self-*`, `--align-self-*`, or `--place-self-*` (curated keys: `center` `start` `end` `stretch`).' } } },
  render: () => ({ template: `
    <div class="o-grid o-grid--cols-3 o-grid--align-items-stretch o-layout--gap-2" style="grid-auto-rows: 80px;">
      <div class="c-demo-cell o-layout--padding-2">stretch (default)</div>
      <div class="o-grid__item o-grid__item--place-self-center c-demo-cell c-demo-cell--accent o-layout--padding-2">place-self-center</div>
      <div class="o-grid__item o-grid__item--align-self-end c-demo-cell o-layout--padding-2">align-self-end</div>
    </div>` }),
};

// ── Responsive ────────────────────────────────────────────────────────────────
export const Responsive = {
  name: 'Responsive',
  parameters: { docs: { description: { story: 'Mobile-first. Column counts, spans, auto-flow, and alignment all accept `@{breakpoint}` suffixes (`@sm` `@md` `@lg` `@xl`), applied from that breakpoint **upward**. Example below: 2 columns by default, 4 from `@md` up. Resize the viewport.' } } },
  render: () => ({ template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">.o-grid--cols-2 .o-grid--cols-4&#64;md</p>
    <div class="o-grid o-grid--cols-2 o-grid--cols-4@md o-layout--gap-2">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">4</div>
      <div class="c-demo-cell o-layout--padding-2">5</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">6</div>
      <div class="c-demo-cell o-layout--padding-2">7</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">8</div>
    </div>` }),
};

// ── Gap ───────────────────────────────────────────────────────────────────────
export const Gap = {
  name: 'Gap',
  parameters: { docs: { description: { story: 'Gap is **not** an `o-grid` modifier. Reuse `.o-layout--gap-{scale}` (and `--row-gap-*` / `--column-gap-*`) as a BEM mix — identical contract to `.o-flex`. Scale + responsive suffixes apply.' } } },
  render: () => ({ template: `
    <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">o-layout--gap-1</p>
    <div class="o-grid o-grid--cols-3 o-layout--gap-1">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>
    <p style="font-size: 0.85rem; color: #666; margin: 1rem 0 0.5rem;">o-layout--gap-4</p>
    <div class="o-grid o-grid--cols-3 o-layout--gap-4">
      <div class="c-demo-cell o-layout--padding-2">1</div>
      <div class="c-demo-cell c-demo-cell--accent o-layout--padding-2">2</div>
      <div class="c-demo-cell o-layout--padding-2">3</div>
    </div>` }),
};
