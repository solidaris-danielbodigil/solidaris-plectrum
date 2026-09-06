import { Component, input, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { statusStory } from '../../docs/docs-figure-stories';
import { assertTextVisible } from '../../storybook/story-tests';
import { EmptyStateComponent } from './empty-state.component';
import { EmptyStateMetadata } from './empty-state.metadata';
import {
  EMPTY_STATE_ILLUSTRATION_CHOICES,
  EMPTY_STATE_ILLUSTRATION_IDS,
  type EmptyStateIllustrationChoice,
} from './empty-state-illustrations';

@Component({
  selector: 'pds-empty-state-random-demo',
  standalone: true,
  imports: [EmptyStateComponent, ButtonModule],
  template: `
    <div class="o-flex o-flex--y o-flex--align-items-center o-layout--gap-4">
      @for (generation of [generation()]; track generation) {
        <pds-empty-state
          [title]="title()"
          [description]="description()"
          [illustration]="illustration()"
        />
      }
      <button
        pButton
        type="button"
        label="Autre illustration"
        icon="bi bi-arrow-clockwise"
        severity="secondary"
        [outlined]="true"
        [disabled]="illustration() !== 'random'"
        (click)="reroll()"
      ></button>
    </div>
  `,
})
class EmptyStateRandomDemoComponent {
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly illustration = input<EmptyStateIllustrationChoice>('random');

  readonly generation = signal(0);

  reroll(): void {
    this.generation.update((n) => n + 1);
  }
}

const meta: Meta<EmptyStateComponent> = {
  title: 'Custom components/Empty State',
  component: EmptyStateComponent,
  decorators: [
    moduleMetadata({
      imports: [EmptyStateRandomDemoComponent],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    illustration: {
      control: 'select',
      options: [...EMPTY_STATE_ILLUSTRATION_CHOICES],
      description:
        'Decorative hero. `random` (default) picks one catalog SVG per instance. Pass an id to pin a specific illustration.',
    },
  },
  args: {
    illustration: 'random',
  },
};

export default meta;

type Story = StoryObj<EmptyStateComponent>;

/** Ownership badge for the docs page — hidden from the sidebar. */
export const Status = statusStory(EmptyStateMetadata.governance);

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <pds-empty-state-random-demo
        [title]="title"
        [description]="description"
        [illustration]="illustration"
      />
    `,
  }),
  args: {
    title: 'Aucune recherche pour le moment',
    description:
      'Lancez une recherche pour afficher les informations du document sélectionné.',
    illustration: 'random',
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Aucune recherche pour le moment');
  },
};

export const AllIllustrations: Story = {
  render: () => ({
    props: { ids: EMPTY_STATE_ILLUSTRATION_IDS },
    moduleMetadata: { imports: [EmptyStateComponent] },
    template: `
      <div class="o-flex o-flex--wrap o-layout--gap-6">
        @for (id of ids; track id) {
          <div class="o-flex__item o-flex__item--4">
            <pds-empty-state
              [title]="id"
              description="Pinned via the illustration input"
              [illustration]="id"
            />
          </div>
        }
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, EMPTY_STATE_ILLUSTRATION_IDS[0]);
  },
};
