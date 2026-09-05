// =============================================================================
// libs/ui/src/foundations/borders.stories.ts
// Foundations / Borders — u-radius-* and u-border-* utility docs.
//
// Class lists are read from the compiled stylesheet at render time, never
// retyped here (.ai/rules/10-css-ssot.md). Border classes are grouped by the
// properties their rule declares, so a new side, modifier or status appears in
// the right section with no edit to this file.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';
import { readClassRules, readClassSuffixes } from '../storybook/cssom';

/** All-corner stops: a single segment after the prefix (`md`, `2xl`, `pill`). */
const allCornerRadii = () => readClassSuffixes(/^u-radius-([a-z0-9]+)$/);

/** Per-edge and per-corner targets: everything else. */
const radiusTargets = () =>
  readClassSuffixes(/^u-radius-([a-z0-9]+(?:-[a-z0-9]+)+)$/);

interface BorderGroups {
  sides: string[];
  modifiers: string[];
  statuses: string[];
}

/**
 * Split `u-border-*` by what each rule sets:
 *   side     → a `border*` longhand
 *   status   → only `--pds-border-color`
 *   modifier → only `--pds-border-width` / `--pds-border-style`
 */
function borderGroups(): BorderGroups {
  const groups: BorderGroups = { sides: [], modifiers: [], statuses: [] };

  for (const rule of readClassRules(/^u-border-(.+)$/)) {
    const setsBorder = rule.properties.some((prop) => /^border($|-)/.test(prop));
    const setsColor = rule.properties.includes('--pds-border-color');

    if (setsBorder) groups.sides.push(rule.suffix);
    else if (setsColor) groups.statuses.push(rule.suffix);
    else groups.modifiers.push(rule.suffix);
  }

  return groups;
}

function cells(items: string[], className: (item: string) => string, style = ''): string {
  return items
    .map(
      (item) => `
      <div class="c-demo-cell ${className(item)} o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-2" style="${style}">
        ${item}
      </div>`,
    )
    .join('');
}

export default {
  title: 'Foundations/Borders',
  tags: ['!dev'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: { layout: 'padded' },
} as Meta;

// ── Radius ────────────────────────────────────────────────────────────────────
export const Radius = {
  name: 'Radius',
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-2">
      ${cells(allCornerRadii(), (r) => `u-radius-${r}`, 'width: 6rem; height: 4rem;')}
    </div>`,
  }),
};

export const RadiusTargets = {
  name: 'Radius Targets',
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-2">
      ${cells(radiusTargets(), (r) => `u-radius-${r}`, 'width: 11rem; height: 3.5rem;')}
    </div>`,
  }),
};

// ── Border sides ──────────────────────────────────────────────────────────────
export const BorderSides = {
  name: 'Border Sides',
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-3">
      ${cells(borderGroups().sides, (s) => `u-border-${s}`, 'width: 8rem; height: 4rem;')}
    </div>`,
  }),
};

export const BorderModifiers = {
  name: 'Border Modifiers',
  render: () => ({
    template: `
    <div class="o-flex o-flex--col o-layout--gap-3">
      ${borderGroups()
        .modifiers.map(
          (m) => `
      <div class="c-demo-cell u-border-all u-border-${m} o-layout--padding-3">u-border-all + u-border-${m}</div>`,
        )
        .join('')}
      <div class="c-demo-cell u-border-top u-border-thick u-border-dashed u-border-danger o-layout--padding-3">
        composed: top + thick + dashed + danger
      </div>
    </div>`,
  }),
};

export const BorderStatus = {
  name: 'Border Status Colors',
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-3">
      ${cells(borderGroups().statuses, (s) => `u-border-all u-border-${s}`, 'width: 8rem;')}
    </div>`,
  }),
};

// ── Generate — compose a border from Controls ────────────────────────────────
export const Generate = {
  name: 'Generate',
  tags: ['dev'],
  args: { side: 'all', status: 'default', thick: false, dashed: false, radius: 'none' },
  argTypes: {
    side: { control: 'select', options: borderGroups().sides, description: 'u-border-{side}' },
    status: {
      control: 'select',
      options: ['default', ...borderGroups().statuses],
      description: 'Status colour — sets --pds-border-color.',
    },
    thick: { control: 'boolean', description: 'Adds u-border-thick.' },
    dashed: { control: 'boolean', description: 'Adds u-border-dashed.' },
    radius: {
      control: 'select',
      options: [...new Set(['none', ...allCornerRadii()])],
      description: 'u-radius-{stop} on the same element.',
    },
  },
  parameters: { layout: 'padded' },
  render: (args: { side: string; status: string; thick: boolean; dashed: boolean; radius: string }) => {
    const classes = [
      `u-border-${args.side}`,
      args.status !== 'default' ? `u-border-${args.status}` : '',
      args.thick ? 'u-border-thick' : '',
      args.dashed ? 'u-border-dashed' : '',
      args.radius !== 'none' ? `u-radius-${args.radius}` : '',
    ]
      .filter(Boolean)
      .join(' ');
    return {
      template: `
        <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3">
          <div class="c-demo-cell ${classes} o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-4"
               style="width: 16rem; height: 6rem; background: var(--pds-color-surface-0);">
            preview
          </div>
          <code>class="${classes}"</code>
        </div>`,
    };
  },
};

export const BorderColorOverride = {
  name: 'Border Color Override',
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
