// c-detail-list — label / value description rows. CSS-only block on <dl>:
// stories carry the markup directly (same pattern as Accordion).
import type { Meta, StoryObj } from '@storybook/angular';
import type { DetailListRow } from '../drawer';
import { statusStory } from '../../docs/docs-figure-stories';
import { assertTextVisible } from '../../storybook/story-tests';

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

const meta: Meta = {
  title: 'Custom components/Detail List',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

/** Ownership badge for the docs page — CSS-only block, so declared inline. */
export const Status = statusStory({ status: 'core', owner: 'design-system' });

export const Default: Story = {
  render: () => ({
    template: `
      <dl class="c-detail-list o-flex o-flex--y o-layout--gap-2 o-layout--margin-0" style="max-width: 28rem;">
        ${rows(ROWS)}
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
