// c-skeleton-slot — sized wrappers for p-skeleton loading placeholders.
// CSS-only block: stories import p-skeleton directly (same pattern as Accordion).
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Skeleton } from 'primeng/skeleton';

const meta: Meta = {
  title: 'Custom components/Skeleton Slot',
  decorators: [moduleMetadata({ imports: [Skeleton] })],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Slots: Story = {
  render: () => ({
    template: `
      <div class="o-flex o-flex--col o-layout--gap-3" style="max-width: 28rem;">
        <div class="c-skeleton-slot"><p-skeleton width="60%" height="1.25rem" /></div>
        <div class="c-skeleton-slot"><p-skeleton width="100%" height="1rem" /></div>
        <div class="c-skeleton-slot"><p-skeleton width="80%" height="1rem" /></div>
        <div class="o-flex o-flex--align-items-center o-layout--gap-2">
          <span class="c-skeleton-count-badge"><p-skeleton shape="circle" size="1.5rem" /></span>
          <div class="c-skeleton-slot o-flex__item--grow-1"><p-skeleton width="40%" height="1rem" /></div>
        </div>
      </div>`,
  }),
};

export const CardLoading: Story = {
  name: 'Card loading state',
  render: () => ({
    template: `
      <div class="u-border-all u-radius-xl o-flex o-flex--col o-layout--gap-2 o-layout--padding-3" style="max-width: 28rem; background: var(--pds-color-surface-0); --pds-border-color: var(--pds-color-card-border);">
        <div class="c-skeleton-slot"><p-skeleton width="50%" height="1.25rem" /></div>
        <div class="c-skeleton-slot"><p-skeleton width="100%" height="1rem" /></div>
        <div class="c-skeleton-slot"><p-skeleton width="90%" height="1rem" /></div>
        <div class="c-skeleton-slot"><p-skeleton width="30%" height="2rem" borderRadius="var(--pds-radius-md)" /></div>
      </div>`,
  }),
};
