// c-timeline--content-only — PrimeNG Timeline restyle. No Angular wrapper:
// stories import p-timeline directly (same pattern as Accordion).
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Tag } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';
import { statusStory } from '../../docs/docs-figure-stories';
import { assertTextVisible } from '../../storybook/story-tests';

interface TimelineEvent {
  date: string;
  title: string;
  status: string;
  severity: 'success' | 'info' | 'warn';
}

const EVENTS: TimelineEvent[] = [
  { date: '24/11/2025', title: 'Document reçu', status: 'Reçu', severity: 'info' },
  { date: '26/11/2025', title: 'Analyse du dossier', status: 'En traitement', severity: 'warn' },
  { date: '01/12/2025', title: 'Décision envoyée', status: 'Accepté', severity: 'success' },
];

const meta: Meta = {
  title: 'Custom components/Timeline',
  decorators: [moduleMetadata({ imports: [Tag, Timeline] })],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

/** Ownership badge for the docs page — CSS-only block, so declared inline. */
export const Status = statusStory({ status: 'core', owner: 'design-system' });

export const ContentOnly: Story = {
  name: 'Content only',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Document reçu');
    await assertTextVisible(canvasElement, '24/11/2025');
  },
  render: () => ({
    props: { events: EVENTS },
    template: `
      <p-timeline class="c-timeline--content-only" [value]="events" align="left" style="max-width: 32rem; display: block;">
        <ng-template #content let-event>
          <div class="o-flex o-flex--col o-layout--gap-0-5 o-layout--padding-block-end-3">
            <small>{{ event.date }}</small>
            <strong>{{ event.title }}</strong>
            <p-tag [value]="event.status" [severity]="event.severity" />
          </div>
        </ng-template>
      </p-timeline>`,
  }),
};

export const Stock: Story = {
  name: 'Stock (for contrast)',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Document reçu');
  },
  render: () => ({
    props: { events: EVENTS },
    template: `
      <p-timeline [value]="events" align="left" style="max-width: 32rem; display: block;">
        <ng-template #opposite let-event><small>{{ event.date }}</small></ng-template>
        <ng-template #content let-event><strong>{{ event.title }}</strong></ng-template>
      </p-timeline>`,
  }),
};
