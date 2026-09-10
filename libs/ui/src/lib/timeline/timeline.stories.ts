// c-timeline--content-only — PrimeNG Timeline restyle. No Angular wrapper:
// stories import p-timeline directly (same pattern as Accordion).
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { Tag } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';
import { contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps, classArgTypes } from '../../storybook/arg-types-from-props';
import { assertTextVisible } from '../../storybook/story-tests';
import { TimelineMetadata } from './timeline.metadata';

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

interface TimelineStoryArgs {
  align: 'left' | 'right';
}

const meta: Meta<TimelineStoryArgs> = {
  title: 'Custom components/Timeline',
  decorators: [moduleMetadata({ imports: [Tag, Timeline] })],
  parameters: { layout: 'padded' },
  argTypes: {
    ...argTypesFromProps([
      { name: 'align', type: "'left' | 'right'", required: false, default: 'left', description: 'PrimeNG p-timeline align — content-only restyle assumes left.', category: 'Story knobs' },
    ], { align: { control: 'radio', options: ['left', 'right'] } }),
    ...classArgTypes([
      {
        name: '.c-timeline--content-only',
        description: 'Modifier on p-timeline — drops the empty opposite column so content starts at the marker.',
      },
    ]),
  },
  args: { align: 'left' },
};

export default meta;
type Story = StoryObj<TimelineStoryArgs>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from timeline.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(TimelineMetadata.governance, TimelineMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(TimelineMetadata, 'usage') };
export const Anatomy = { tags: ['!dev'], ...contractStory(TimelineMetadata, 'anatomy') };
export const Composition = { tags: ['!dev'], ...contractStory(TimelineMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(TimelineMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(TimelineMetadata, 'accessibility') };

export const ContentOnly: Story = {
  name: 'Content only',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Document reçu');
    await assertTextVisible(canvasElement, '24/11/2025');
  },
  render: (args) => ({
    props: { ...args, events: EVENTS },
    template: `
      <p-timeline class="c-timeline--content-only" [value]="events" [align]="align" style="max-width: 32rem; display: block;">
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
