// =============================================================================
// libs/ui/src/foundations/elevation.stories.ts
// Foundations / Elevation — u-shadow-* utility docs.
//
// The class list is enumerated from the compiled stylesheet at render time
// (.ai/rules/10-css-ssot.md). Only the "when to use it" prose is authored here,
// keyed by stop, with a fallback so a new stop still renders.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';
import { readClassSuffixes } from '../storybook/cssom';

/** Prose only — CSS cannot express intent. Unknown stops fall back gracefully. */
const USE_CASE: Record<string, string> = {
  none: 'Remove elevation',
  sm: 'Subtle card chrome',
  md: 'Raised panels, dropdowns',
  xl: 'Prominent elevation (drawers)',
  'overlay-modal': 'Modal dialogs',
  'overlay-select': 'Select / autocomplete panels',
  'overlay-popover': 'Popovers, tooltips',
  'overlay-navigation': 'Navigation overlays',
};

const stops = () => readClassSuffixes(/^u-shadow-(.+)$/);

export default {
  title: 'Foundations/Elevation',
  tags: ['!dev'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: { layout: 'padded' },
} as Meta;

export const Playground = {
  name: 'Playground',
  tags: ['dev'],
  args: { level: 'md' },
  argTypes: {
    level: {
      control: 'select',
      options: stops(),
      description: 'u-shadow-{stop} — every stop generated in the stylesheet.',
    },
  },
  render: (args: { level: string }) => ({
    template: `
      <div class="sb-demo-wrapper o-flex o-flex--col o-layout--gap-3 o-layout--padding-4" style="background: var(--pds-color-surface-100);">
        <div class="c-demo-cell u-shadow-${args.level} o-flex o-flex--col o-flex--align-items-center o-flex--justify-content-center o-layout--gap-1 o-layout--padding-4"
             style="width: 14rem; height: 7rem; background: var(--pds-color-surface-0);">
          <strong>${USE_CASE[args.level] ?? 'Elevation'}</strong>
        </div>
        <div class="o-flex o-flex--col o-layout--gap-1">
          <code>class="u-shadow-${args.level}"</code>
          <code>var(--pds-shadow-${args.level})</code>
        </div>
      </div>`,
  }),
};

export const Shadows = {
  name: 'Shadows',
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-4 o-layout--padding-4" style="background: var(--pds-color-surface-100);">
      ${stops()
        .map(
          (stop) => `
      <div class="c-demo-cell u-shadow-${stop} o-flex o-flex--col o-flex--align-items-center o-flex--justify-content-center o-layout--gap-1 o-layout--padding-4"
           style="width: 11rem; height: 6.5rem; background: var(--pds-color-surface-0);">
        <code>u-shadow-${stop}</code>
        <small>${USE_CASE[stop] ?? 'See Foundations / Shadows'}</small>
      </div>`,
        )
        .join('')}
    </div>`,
  }),
};
