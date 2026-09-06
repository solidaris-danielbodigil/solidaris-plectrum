// =============================================================================
// libs/ui/src/foundations/borders.stories.ts
// Foundations / Borders — u-radius-* and u-border-* utility docs.
//
// Class lists are read from the compiled stylesheet at render time, never
// retyped here (.ai/rules/10-css-ssot.md). Border classes are grouped by the
// properties their rule declares, so a new side, modifier or status appears in
// the right section with no edit to this file.
// Token catalogues reuse the token-explorer grid chrome (c-token-explorer__item).
// =============================================================================

import type { Meta } from '@storybook/angular';
import { readClassRules, readClassSuffixes } from '../storybook/cssom';
import { tokenExplorerCards } from '../storybook/docs-token-cards';

/** Longest stop first so `top-2xl` resolves to `2xl`, not `xl`. */
const RADIUS_STOPS = [
  '2xl',
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'pill',
] as const;

function radiusVar(suffix: string): string {
  const stop = RADIUS_STOPS.find(
    (item) => suffix === item || suffix.endsWith(`-${item}`),
  );
  return `var(--pds-radius-${stop ?? suffix})`;
}

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
    const setsBorder = rule.properties.some((prop) =>
      /^border($|-)/.test(prop),
    );
    const setsColor = rule.properties.includes('--pds-border-color');

    if (setsBorder) groups.sides.push(rule.suffix);
    else if (setsColor) groups.statuses.push(rule.suffix);
    else groups.modifiers.push(rule.suffix);
  }

  return groups;
}

function utilityCards(
  items: string[],
  className: (item: string) => string,
  previewClass: (item: string) => string,
  tag?: (item: string) => string,
): string {
  return tokenExplorerCards(
    items.map((item) => ({
      name: className(item),
      tag: tag?.(item),
      previewClass: previewClass(item),
    })),
  );
}

export default {
  title: 'Foundations/Borders',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
} as Meta;

// ── Radius ────────────────────────────────────────────────────────────────────
export const Radius = {
  name: 'Radius',
  render: () => ({
    template: `
    <div class="c-token-explorer">
      ${utilityCards(
        allCornerRadii(),
        (stop) => `u-radius-${stop}`,
        (stop) => `c-token-explorer__preview--shape u-radius-${stop}`,
        (stop) => radiusVar(stop),
      )}
    </div>`,
  }),
};

export const RadiusTargets = {
  name: 'Radius Targets',
  render: () => ({
    template: `
    <div class="c-token-explorer">
      ${utilityCards(
        radiusTargets(),
        (stop) => `u-radius-${stop}`,
        (stop) => `c-token-explorer__preview--shape u-radius-${stop}`,
        (stop) => radiusVar(stop),
      )}
    </div>`,
  }),
};

// ── Border sides ──────────────────────────────────────────────────────────────
export const BorderSides = {
  name: 'Border Sides',
  render: () => ({
    template: `
    <div class="c-token-explorer">
      ${utilityCards(
        borderGroups().sides,
        (side) => `u-border-${side}`,
        (side) => `c-token-explorer__preview--box u-border-${side}`,
      )}
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
    <div class="c-token-explorer">
      ${utilityCards(
        borderGroups().statuses,
        (status) => `u-border-${status}`,
        (status) =>
          `c-token-explorer__preview--box u-border-all u-border-${status}`,
        (status) => `var(--pds-color-${status})`,
      )}
    </div>`,
  }),
};

// ── Generate — compose a border from Controls ────────────────────────────────
export const Generate = {
  name: 'Generate',
  tags: ['dev'],
  args: {
    side: 'all',
    status: 'default',
    thick: false,
    dashed: false,
    radius: 'none',
  },
  argTypes: {
    side: {
      control: 'select',
      options: borderGroups().sides,
      description: 'u-border-{side}',
    },
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
  render: (args: {
    side: string;
    status: string;
    thick: boolean;
    dashed: boolean;
    radius: string;
  }) => {
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
