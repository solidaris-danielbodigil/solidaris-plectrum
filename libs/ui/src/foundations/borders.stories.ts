// =============================================================================
// libs/ui/src/foundations/borders.stories.ts
// Foundations / Borders — u-radius-* and u-border-* utility docs.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';

const RADII = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'pill'];
const SIDES = ['all', 'top', 'bottom', 'inline-start', 'inline-end', 'block', 'inline'];
const STATUSES = ['success', 'warning', 'danger', 'info'];

export default {
  title: 'Foundations/Borders',
  tags: ['!autodocs'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven **border** and **radius** utilities in \`07-utilities/\`. Geometry is defined once in \`02-tools/_tools.radius.scss\` and \`_tools.borders.scss\` — components \`@include\` the same mixins.

**Radius:** \`.u-radius-{stop}\` (all corners) · \`.u-radius-{side|corner}-{stop}\` (per edge/corner)

**Border sides:** \`.u-border-{side}\` — default \`1px solid\` using \`--pds-color-content-border\`

**Orthogonal modifiers** (compose freely): \`.u-border-thick\` · \`.u-border-dashed\` · \`.u-border-{status}\`

Override color per instance: \`style="--pds-border-color: var(--pds-color-panel-border);"\`

Styles: \`libs/styles/src/07-utilities/_utilities.radius.scss\` · \`_utilities.borders.scss\`
        `,
      },
    },
  },
} as Meta;

// ── Radius ────────────────────────────────────────────────────────────────────
export const Radius = {
  name: 'Radius',
  parameters: {
    docs: {
      description: {
        story: `
All-corner radius stops from the \`--pds-radius-*\` token scale.

| Class | Token |
|---|---|
${RADII.map((r) => `| \`.u-radius-${r}\` | \`--pds-radius-${r}\` |`).join('\n')}
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-2">
      ${RADII.map(
        (r) => `
      <div class="c-demo-cell u-radius-${r} o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-2" style="width: 6rem; height: 4rem;">
        ${r}
      </div>`,
      ).join('')}
    </div>`,
  }),
};

export const RadiusTargets = {
  name: 'Radius Targets',
  parameters: {
    docs: {
      description: {
        story: `
Per-edge and per-corner radius targets on a single box. Useful when only one edge needs rounding.

| Pattern | Example |
|---|---|
| Edge | \`.u-radius-top-lg\` · \`.u-radius-bottom-md\` |
| Corner | \`.u-radius-top-start-xl\` · \`.u-radius-bottom-end-none\` |
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-3">
      <div class="c-demo-cell u-radius-top-lg o-layout--padding-3" style="width: 10rem; height: 6rem;">
        top-lg
      </div>
      <div class="c-demo-cell u-radius-bottom-md o-layout--padding-3" style="width: 10rem; height: 6rem;">
        bottom-md
      </div>
      <div class="c-demo-cell u-radius-top-start-xl u-radius-bottom-end-none o-layout--padding-3" style="width: 10rem; height: 6rem;">
        top-start-xl + bottom-end-none
      </div>
    </div>`,
  }),
};

// ── Border sides ──────────────────────────────────────────────────────────────
export const BorderSides = {
  name: 'Border Sides',
  parameters: {
    docs: {
      description: {
        story: `
Side classes delegate to the shared \`border()\` mixin. Default width/style/color come from overridable custom properties.

| Class | Property |
|---|---|
${SIDES.map((s) => `| \`.u-border-${s}\` | \`${s === 'all' ? 'border' : s}\` |`).join('\n')}
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-3">
      ${SIDES.map(
        (s) => `
      <div class="c-demo-cell u-border-${s} o-layout--padding-3" style="width: 8rem; height: 4rem;">
        ${s}
      </div>`,
      ).join('')}
    </div>`,
  }),
};

export const BorderModifiers = {
  name: 'Border Modifiers',
  parameters: {
    docs: {
      description: {
        story: `
Orthogonal modifiers set custom properties only — combine with any side class.

\`\`\`html
<div class="u-border-top u-border-thick u-border-dashed u-border-danger"></div>
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout--gap-3">
      <div class="c-demo-cell u-border-all u-border-thick o-layout--padding-3">u-border-all + u-border-thick</div>
      <div class="c-demo-cell u-border-bottom u-border-dashed o-layout--padding-3">u-border-bottom + u-border-dashed</div>
      <div class="c-demo-cell u-border-top u-border-thick u-border-dashed u-border-danger o-layout--padding-3">
        composed: top + thick + dashed + danger
      </div>
    </div>`,
  }),
};

export const BorderStatus = {
  name: 'Border Status Colors',
  parameters: {
    docs: {
      description: {
        story: `
Status modifiers set \`--pds-border-color\` to the canonical \`--pds-color-{status}\` token — no per-color matrix.

| Class | Token |
|---|---|
${STATUSES.map((s) => `| \`.u-border-${s}\` | \`--pds-color-${s}\` |`).join('\n')}
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-3">
      ${STATUSES.map(
        (s) => `
      <div class="c-demo-cell u-border-all u-border-${s} o-layout--padding-3" style="width: 8rem;">
        ${s}
      </div>`,
      ).join('')}
    </div>`,
  }),
};

export const BorderColorOverride = {
  name: 'Border Color Override',
  parameters: {
    docs: {
      description: {
        story: `
Default border color is \`--pds-color-content-border\`. Override per instance via \`--pds-border-color\`:

| Inline style | Role |
|---|---|
| \`var(--pds-color-panel-border)\` | Flat panel chrome |
| \`var(--pds-color-card-border)\` | Elevated card outline |
| \`var(--pds-color-content-border)\` | Subtle inset (default) |
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout--gap-3">
      <div class="c-demo-cell u-border-bottom o-layout--padding-3">
        default (content-border)
      </div>
      <div class="c-demo-cell u-border-bottom o-layout--padding-3" style="--pds-border-color: var(--pds-color-panel-border);">
        panel-border override
      </div>
      <div class="c-demo-cell u-border-all o-layout--padding-3" style="--pds-border-color: var(--pds-color-card-border);">
        card-border override
      </div>
    </div>`,
  }),
};
