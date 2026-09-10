// c-detail-list — label / value description rows. CSS-only block on <dl>:
// stories carry the markup directly (same pattern as Accordion).
import type { Meta, StoryObj } from '@storybook/angular';
import type { DetailListRow } from '../drawer';
import { contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps, classArgTypes } from '../../storybook/arg-types-from-props';
import { assertTextVisible } from '../../storybook/story-tests';
import { DetailListMetadata } from './detail-list.metadata';

const ROWS: DetailListRow[] = [
  { label: 'Numéro national', value: '85.07.30-033.61' },
  { label: 'Date de naissance', value: '30/07/1985' },
  { label: 'Mutualité', value: 'Solidaris Wallonie — 315' },
  { label: 'Statut', value: 'Assuré ordinaire' },
];

function rows(list: DetailListRow[]): string {
  return list
    .map(
      ({ label, value }) => `
      <div class="o-flex o-flex--align-items-baseline o-layout--gap-2">
        <dt class="c-detail-list__label">${label}</dt>
        <dd class="c-detail-list__value o-layout--margin-0">${value}</dd>
      </div>`,
    )
    .join('');
}

interface DetailListStoryArgs {
  label: string;
  value: string;
}

const meta: Meta<DetailListStoryArgs> = {
  title: 'Custom components/Detail List',
  parameters: { layout: 'padded' },
  argTypes: {
    ...argTypesFromProps([
      { name: 'label', type: 'string', required: false, default: 'Numéro national', description: 'First-row dt text in the demo. Production rows are DetailListRow markup.', category: 'Story knobs' },
      { name: 'value', type: 'string', required: false, default: '85.07.30-033.61', description: 'First-row dd text in the demo.', category: 'Story knobs' },
    ]),
    ...classArgTypes([
      { name: '.c-detail-list', description: 'Block on a semantic dl — rows are flex children.' },
      { name: '.c-detail-list__label', description: 'Fixed-width label column (dt).' },
      { name: '.c-detail-list__value', description: 'Value (dd) — reset margin with o-layout--margin-0.' },
      { name: 'DetailListRow', description: 'Exported type { label: string; value: string } from @solidaris/ui (libs/ui/src/lib/drawer).' },
    ]),
  },
  args: {
    label: 'Numéro national',
    value: '85.07.30-033.61',
  },
};

export default meta;
type Story = StoryObj<DetailListStoryArgs>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from detail-list.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(DetailListMetadata.governance, DetailListMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(DetailListMetadata, 'usage') };
export const Anatomy = { tags: ['!dev'], ...contractStory(DetailListMetadata, 'anatomy') };
export const Composition = { tags: ['!dev'], ...contractStory(DetailListMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(DetailListMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(DetailListMetadata, 'accessibility') };

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <dl class="c-detail-list o-flex o-flex--y o-layout--gap-2 o-layout--margin-0" style="max-width: 28rem;">
        <div class="o-flex o-flex--align-items-baseline o-layout--gap-2">
          <dt class="c-detail-list__label">{{ label }}</dt>
          <dd class="c-detail-list__value o-layout--margin-0">{{ value }}</dd>
        </div>
        ${rows(ROWS.slice(1))}
      </dl>`,
  }),
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Numéro national');
    await assertTextVisible(canvasElement, '85.07.30-033.61');
  },
};

export const InASection: Story = {
  name: 'In a drawer section',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Informations générales');
    await assertTextVisible(canvasElement, 'Numéro national');
  },
  render: () => ({
    template: `
      <section class="c-drawer__section o-flex o-flex--y o-layout--gap-2" style="max-width: 28rem;" aria-labelledby="detail-list-demo-title">
        <h3 id="detail-list-demo-title" class="c-drawer__section-title o-layout--margin-0">Informations générales</h3>
        <dl class="c-detail-list o-flex o-flex--y o-layout--gap-2 o-layout--margin-0">
          ${rows(ROWS)}
        </dl>
      </section>`,
  }),
};
