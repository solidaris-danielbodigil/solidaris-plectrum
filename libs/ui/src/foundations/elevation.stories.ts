// =============================================================================
// libs/ui/src/foundations/elevation.stories.ts
// Foundations / Elevation — u-shadow-* utility docs.
//
// The class list is enumerated from the compiled stylesheet at render time
// (.ai/rules/10-css-ssot.md). Only the "when to use it" prose is authored here,
// keyed by stop, with a fallback so a new stop still renders.
// Cards reuse the token-explorer grid chrome (c-token-explorer__item).
// =============================================================================

import type { Meta } from '@storybook/angular';
import { readClassSuffixes } from '../storybook/cssom';
import { tokenExplorerCards } from '../storybook/docs-token-cards';

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

function shadowCards(levels: readonly string[]): string {
  return tokenExplorerCards(
    levels.map((stop) => ({
      name: `u-shadow-${stop}`,
      value: USE_CASE[stop] ?? 'See Foundations / Shadows',
      tag: `var(--pds-shadow-${stop})`,
      previewClass: 'c-token-explorer__preview--shadow',
      previewStyle: `--pds-token-explorer-shadow: var(--pds-shadow-${stop})`,
    })),
  );
}

export default {
  title: 'Foundations/Elevation',
  tags: ['!dev'],
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
      <div class="c-token-explorer o-flex o-flex--col o-layout--gap-3 o-layout--padding-4">
        ${shadowCards([args.level])}
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
    <div class="c-token-explorer o-layout--padding-4">
      ${shadowCards(stops())}
    </div>`,
  }),
};
