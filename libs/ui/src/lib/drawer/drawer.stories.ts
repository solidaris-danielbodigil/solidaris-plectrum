// c-drawer — headless drawer shell elements. There is no generic Angular
// wrapper: features build inside p-drawer's #headless template with these
// classes. This story shows the shell statically so the structure is
// inspectable without an overlay.
import type { Meta, StoryObj } from '@storybook/angular';
import { statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps, classArgTypes } from '../../storybook/arg-types-from-props';
import { assertTextVisible } from '../../storybook/story-tests';

interface DrawerStoryArgs {
  title: string;
  sectionTitle: string;
}

const meta: Meta<DrawerStoryArgs> = {
  title: 'Custom components/Drawer',
  parameters: { layout: 'padded' },
  argTypes: {
    ...argTypesFromProps([
      { name: 'title', type: 'string', required: false, default: 'Drawer title', description: 'Header heading in the static shell demo.', category: 'Story knobs' },
      { name: 'sectionTitle', type: 'string', required: false, default: 'Section title', description: 'First section heading in the static shell demo.', category: 'Story knobs' },
    ]),
    ...classArgTypes([
      { name: '.c-drawer__header', description: 'Header row — identity, actions, bottom border via u-border-bottom.' },
      { name: '.c-drawer__section', description: 'One content section — vertical flex, shrink-0, inline padding.' },
      { name: '.c-drawer__section-title', description: 'Section heading typography.' },
      { name: '.c-drawer__{feature}-{part}', description: 'Feature children prefix the element name on the shared block — never a nested block.' },
    ]),
  },
  args: {
    title: 'Drawer title',
    sectionTitle: 'Section title',
  },
};

export default meta;
type Story = StoryObj<DrawerStoryArgs>;

/** Ownership badge for the docs page — CSS-only block, so declared inline. */
export const Status = statusStory({ status: 'core', owner: 'design-system' });

export const Shell: Story = {
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Drawer title');
    await assertTextVisible(canvasElement, 'Section title');
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="u-shadow-xl u-radius-md o-flex o-flex--y o-layout--overflow-hidden"
           style="width: 24rem; height: 26rem; background: var(--pds-color-surface-0);">

        <header class="c-drawer__header u-border-bottom o-flex o-flex--align-items-center o-flex--justify-content-space-between o-layout--gap-2 o-flex__item--shrink-0 o-layout--padding-2"
                style="--pds-border-color: var(--pds-color-panel-border);">
          <h2 class="c-drawer__section-title o-layout--margin-0">{{ title }}</h2>
          <span aria-hidden="true">✕</span>
        </header>

        <div class="o-flex o-flex--y o-layout--gap-3 o-layout--overflow-y-auto o-layout--min-h-0 o-layout--padding-block-2">
          <section class="c-drawer__section o-flex o-flex--y o-layout--gap-2 o-flex__item--shrink-0 o-layout--padding-inline-2" aria-labelledby="drawer-demo-section-1">
            <h3 id="drawer-demo-section-1" class="c-drawer__section-title o-layout--margin-0">{{ sectionTitle }}</h3>
            <dl class="c-detail-list o-flex o-flex--y o-layout--gap-2 o-layout--margin-0">
              <div class="o-flex o-flex--align-items-baseline o-layout--gap-2">
                <dt class="c-detail-list__label">Label</dt>
                <dd class="c-detail-list__value o-layout--margin-0">Value</dd>
              </div>
              <div class="o-flex o-flex--align-items-baseline o-layout--gap-2">
                <dt class="c-detail-list__label">Label</dt>
                <dd class="c-detail-list__value o-layout--margin-0">Value</dd>
              </div>
            </dl>
          </section>

          <section class="c-drawer__section o-flex o-flex--y o-layout--gap-2 o-flex__item--shrink-0 o-layout--padding-inline-2" aria-labelledby="drawer-demo-section-2">
            <h3 id="drawer-demo-section-2" class="c-drawer__section-title o-layout--margin-0">Second section</h3>
            <p class="o-layout--margin-0">Feature content composed from PrimeNG and object classes.</p>
          </section>
        </div>
      </div>`,
  }),
};
