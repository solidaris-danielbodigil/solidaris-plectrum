// =============================================================================
// libs/ui/src/foundations/borders.stories.ts
// Foundations / Borders — u-radius-* and u-border-* utility docs.
//
// Class lists are read from the compiled stylesheet at render time, never
// retyped here (.ai/rules/10-css-ssot.md).
// =============================================================================

import type { Meta, StoryObj } from '@storybook/angular-vite';
import { doDontStory } from '../docs/docs-figure-stories';
import { DocsTokenGalleryComponent } from '../storybook/docs-token-gallery.component';
import { assertTextVisible } from '../storybook/story-tests';
import {
  allCornerRadii,
  borderGroups,
  BordersPlaygroundComponent,
  borderSideCards,
  borderStatusCards,
  radiusCards,
  radiusTargets,
} from './borders-playground';

const meta: Meta = {
  title: 'Foundations/Borders',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;

export const Usage = {
  tags: ['!dev'],
  ...doDontStory({
    dos: [
      {
        title: 'Static chrome in the template',
        detail:
          'u-border-{side} plus optional thick / dashed / status. Colour from a shared role (panel-border, card-border, content-border).',
      },
      {
        title: 'Radius utilities when the corner is not state-driven',
        detail: 'u-radius-{stop} or a per-edge target. Compose a class in the playground, then paste it.',
      },
    ],
    donts: [
      {
        title: 'border: 1px solid … in 06-components',
        detail: 'A hardcoded stroke will not track the role tokens or the shared mixin.',
        alternative: 'u-border-* in the template; state-driven borders stay in SCSS as var(--pds-*).',
      },
      {
        title: 'A feature-specific border colour alias',
        detail: 'Every surface then invents its own gray.',
        alternative: 'panel-border / card-border / content-border, overridden with --pds-border-color when needed.',
      },
    ],
  }),
};

export const Generate: StoryObj = {
  name: 'Generate',
  tags: ['dev'],
  render: () => ({
    moduleMetadata: { imports: [BordersPlaygroundComponent] },
    template: `<pds-borders-playground />`,
  }),
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Side');
    await assertTextVisible(canvasElement, 'Result');
  },
};

export const Radius: StoryObj = {
  name: 'Radius',
  render: () => ({
    moduleMetadata: { imports: [DocsTokenGalleryComponent] },
    props: { source: () => radiusCards(allCornerRadii()) },
    template: `<pds-docs-token-gallery [source]="source" />`,
  }),
};

export const RadiusTargets: StoryObj = {
  name: 'Radius Targets',
  render: () => ({
    moduleMetadata: { imports: [DocsTokenGalleryComponent] },
    props: { source: () => radiusCards(radiusTargets()) },
    template: `<pds-docs-token-gallery [source]="source" />`,
  }),
};

export const BorderSides: StoryObj = {
  name: 'Border Sides',
  render: () => ({
    moduleMetadata: { imports: [DocsTokenGalleryComponent] },
    props: { source: () => borderSideCards() },
    template: `<pds-docs-token-gallery [source]="source" />`,
  }),
};

export const BorderModifiers: StoryObj = {
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

export const BorderStatus: StoryObj = {
  name: 'Border Status Colors',
  render: () => ({
    moduleMetadata: { imports: [DocsTokenGalleryComponent] },
    props: { source: () => borderStatusCards() },
    template: `<pds-docs-token-gallery [source]="source" />`,
  }),
};

export const BorderColorOverride: StoryObj = {
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
