// =============================================================================
// libs/ui/src/foundations/elevation.stories.ts
// Foundations / Elevation — u-shadow-* utility docs.
// =============================================================================

import { componentWrapperDecorator, type Meta } from '@storybook/angular';

const SHADOWS = [
  { cls: 'none', token: '—', use: 'Remove elevation' },
  { cls: 'sm', token: '--sds-shadow-sm', use: 'Subtle card chrome' },
  { cls: 'md', token: '--sds-shadow-md', use: 'Raised panels, dropdowns' },
  { cls: 'xl', token: '--sds-shadow-xl', use: 'Prominent elevation (drawers)' },
  { cls: 'overlay-modal', token: '--sds-shadow-overlay-modal', use: 'Modal dialogs' },
  { cls: 'overlay-select', token: '--sds-shadow-overlay-select', use: 'Select / autocomplete panels' },
  { cls: 'overlay-popover', token: '--sds-shadow-overlay-popover', use: 'Popovers, tooltips' },
  { cls: 'overlay-navigation', token: '--sds-shadow-overlay-navigation', use: 'Navigation overlays' },
];

export default {
  title: 'Foundations/Elevation',
  tags: ['!autodocs'],
  decorators: [
    componentWrapperDecorator((story) => `<div class="sb-demo-wrapper">${story}</div>`),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Elevation utilities map directly to \`--sds-shadow-*\` tokens from \`01-settings/_settings.shadows.scss\`.

Elevation only — status/focus rings are handled separately in \`_settings.focus.scss\`.

Styles: \`libs/styles/src/07-utilities/_utilities.shadows.scss\`
        `,
      },
    },
  },
} as Meta;

export const Shadows = {
  name: 'Shadows',
  parameters: {
    docs: {
      description: {
        story: `
| Class | Token | Use case |
|---|---|---|
${SHADOWS.map((s) => `| \`.u-shadow-${s.cls}\` | \`${s.token}\` | ${s.use} |`).join('\n')}
        `,
      },
    },
  },
  render: () => ({
    template: `
    <div class="o-flex o-flex--wrap o-layout--gap-4 o-layout--padding-4" style="background: var(--sds-color-surface-100, #f5f5f5);">
      ${SHADOWS.map(
        (s) => `
      <div class="c-demo-cell u-shadow-${s.cls} o-flex o-flex--align-items-center o-flex--justify-content-center o-layout--padding-4" style="width: 10rem; height: 6rem; background: white;">
        ${s.cls}
      </div>`,
      ).join('')}
    </div>`,
  }),
};
