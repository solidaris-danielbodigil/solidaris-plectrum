import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { Component, input, signal } from '@angular/core';
import { Tag } from 'primeng/tag';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ListComponent } from './list.component';
import { ListMetadata } from './list.metadata';
import type { ListEntryItem, ListGroup } from './list.types';
import { SIMULATED_LOADING_MS } from '../../storybook/simulated-loading';
import { contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';

// =============================================================================
// List (pds-list)
// Design ref: Figma iSHARE-Audit nodes 324:5827, 518:48833, 324:5840, 435:7384, 435:7387
//             Custom-components hierarchy: _master (2:108) → _states (2:125) → list/content (98:2220) → pds-list (107:3675)
// =============================================================================

const EVA_MARTINEZ_GROUPS: ListGroup[] = [
  {
    id: 'parcours-demande-primaire',
    title: 'Parcours Indemnités -',
    titleAccent: 'Demande primaire',
    startDate: '24/11/2025',
    endDate: '24/12/2025',
    expanded: true,
    documents: [
      {
        id: 'doc-demande-primaire',
        title: 'Demande primaire -',
        titleLine2: 'Régime général',
        status: {
          label: 'En traitement',
          severity: 'warn',
          icon: 'bi bi-hourglass-split',
        },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          {
            label: '1',
            severity: 'warn',
            icon: 'bi bi-exclamation-triangle-fill',
          },
        ],
      },
      {
        id: 'doc-incapacite',
        title: 'Incapacité',
        status: {
          label: 'En traitement',
          severity: 'warn',
          icon: 'bi bi-hourglass-split',
        },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          {
            label: '1',
            severity: 'warn',
            icon: 'bi bi-exclamation-triangle-fill',
          },
        ],
      },
    ],
  },
  {
    id: 'parcours-rechute',
    title: 'Parcours Indemnités -',
    titleAccent: 'Rechute',
    startDate: '01/01/2026',
    endDate: '15/01/2026',
    expanded: true,
    documents: [
      {
        id: 'doc-rechute',
        title: 'Rechute',
        status: {
          label: 'En traitement',
          severity: 'warn',
          icon: 'bi bi-hourglass-split',
        },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          {
            label: '1',
            severity: 'warn',
            icon: 'bi bi-exclamation-triangle-fill',
          },
        ],
      },
    ],
  },
];

const FLAT_DOCUMENTS: ListEntryItem[] = EVA_MARTINEZ_GROUPS.flatMap(
  (group) => group.documents,
);

const SAMPLE_DOCUMENT: ListEntryItem = EVA_MARTINEZ_GROUPS[0].documents[0];

const ALL_GROUP_IDS = EVA_MARTINEZ_GROUPS.map((group) => group.id);

interface ListStoryArgs {
  groups: ListGroup[] | null;
  items: ListEntryItem[];
  expandedGroupIds: string[];
  selectedItemId: string | null;
  loading: boolean;
}

const meta: Meta<ListStoryArgs> = {
  title: 'Custom components/List',
  component: ListComponent,
  decorators: [
    moduleMetadata({ imports: [ListComponent] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 56rem">${story}</div>`,
    ),
  ],
  parameters: {
    layout: 'padded',
    ...storyDesign(ListMetadata.component.figmaUrl),
  },
  argTypes: argTypesFromProps(ListMetadata.props ?? []),
  render: (args) => ({
    props: args,
    template: `
      <pds-list
        [groups]="groups"
        [items]="items"
        [expandedGroupIds]="expandedGroupIds"
        [selectedItemId]="selectedItemId"
        [loading]="loading"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<ListStoryArgs>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from list.metadata.ts, the documentation SSOT.
export const Status = {
  tags: ['!dev'],
  ...statusStory(ListMetadata.governance, ListMetadata.component),
};
export const Usage = {
  tags: ['!dev'],
  ...contractStory(ListMetadata, 'usage'),
};
export const Anatomy = {
  tags: ['!dev'],
  ...contractStory(ListMetadata, 'anatomy'),
};
export const Composition = {
  tags: ['!dev'],
  ...contractStory(ListMetadata, 'composition'),
};
export const Behavior = {
  tags: ['!dev'],
  ...contractStory(ListMetadata, 'behavior'),
};
export const Accessibility = {
  tags: ['!dev'],
  ...contractStory(ListMetadata, 'accessibility'),
};

const journeyDefaults: ListStoryArgs = {
  groups: EVA_MARTINEZ_GROUPS,
  items: [],
  expandedGroupIds: ALL_GROUP_IDS,
  selectedItemId: 'doc-demande-primaire',
  loading: false,
};

export const Default: Story = {
  args: journeyDefaults,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('region', { name: 'Suivi des documents' }),
    ).toBeVisible();
  },
};

@Component({
  selector: 'pds-list-expand-demo',
  standalone: true,
  imports: [ListComponent],
  template: `
    <pds-list
      [groups]="groups()"
      [items]="items()"
      [expandedGroupIds]="expandedGroupIds()"
      [selectedItemId]="selectedItemId()"
      [loading]="loading()"
      (expandedGroupIdsChange)="onExpanded($event)"
    />
    <p class="u-sr-only" data-testid="list-expanded-ids">{{ lastEmitted() }}</p>
  `,
})
class ListExpandDemoComponent {
  readonly groups = input<ListGroup[] | null>(null);
  readonly items = input<ListEntryItem[]>([]);
  readonly expandedGroupIds = input<string[]>([]);
  readonly selectedItemId = input<string | null>(null);
  readonly loading = input(false);
  readonly lastEmitted = signal('');

  onExpanded(ids: string[]): void {
    this.lastEmitted.set(ids.join(','));
  }
}

export const Grouped: Story = {
  args: journeyDefaults,
  decorators: [moduleMetadata({ imports: [ListExpandDemoComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <pds-list-expand-demo
        [groups]="groups"
        [items]="items"
        [expandedGroupIds]="expandedGroupIds"
        [selectedItemId]="selectedItemId"
        [loading]="loading"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [firstGroup] = canvas.getAllByRole('treeitem');
    await expect(firstGroup).toHaveAttribute('aria-expanded', 'true');
    const [toggler] = within(firstGroup).getAllByRole('button');
    await userEvent.click(toggler);
    await waitFor(() => {
      const emitted = canvas.getByTestId('list-expanded-ids').textContent;
      expect(emitted).not.toContain('parcours-demande-primaire');
    });
  },
};

export const Flat: Story = {
  args: {
    groups: null,
    items: FLAT_DOCUMENTS,
    expandedGroupIds: [],
    selectedItemId: 'doc-demande-primaire',
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('region', { name: 'Suivi des documents' }),
    ).toBeVisible();
    await expect(canvas.getByText(/Régime général/)).toBeVisible();
  },
};

export const GroupExpanded: Story = {
  args: {
    ...journeyDefaults,
    expandedGroupIds: ALL_GROUP_IDS,
  },
};

export const GroupCollapsed: Story = {
  args: {
    ...journeyDefaults,
    expandedGroupIds: ['parcours-rechute'],
  },
};

export const SelectedDocument: Story = {
  args: {
    ...journeyDefaults,
    groups: [
      {
        ...EVA_MARTINEZ_GROUPS[0],
        documents: [EVA_MARTINEZ_GROUPS[0].documents[0]],
      },
    ],
    expandedGroupIds: ['parcours-demande-primaire'],
    selectedItemId: 'doc-demande-primaire',
  },
};

const rowStateDefaults: ListStoryArgs = {
  groups: null,
  items: [SAMPLE_DOCUMENT],
  expandedGroupIds: [],
  selectedItemId: null,
  loading: false,
};

export const RowDefault: Story = {
  args: rowStateDefaults,
};

export const RowHover: Story = {
  args: rowStateDefaults,
  decorators: [
    componentWrapperDecorator(
      (story) => `
        <style>
          .sb-list-row-hover-demo .c-list__item--entry.sb-list-row--hover:not(.c-list__item--selected) {
            border-color: var(--pds-color-list-row-hover-border);
          }
        </style>
        <div class="sb-list-row-hover-demo" style="max-width: 56rem">${story}</div>
      `,
    ),
  ],
  play: async ({ canvasElement }) => {
    canvasElement
      .querySelector('.c-list__item--entry')
      ?.classList.add('sb-list-row--hover');
  },
};

export const RowSelected: Story = {
  args: {
    ...rowStateDefaults,
    selectedItemId: 'doc-demande-primaire',
  },
};

export const Loading: Story = {
  args: {
    ...journeyDefaults,
    loading: true,
  },
};

@Component({
  selector: 'pds-list-simulated-loading-demo',
  standalone: true,
  imports: [ListComponent],
  template: `
    <pds-list
      [loading]="loading()"
      [groups]="groups"
      [items]="items"
      [expandedGroupIds]="expandedGroupIds"
      [selectedItemId]="selectedItemId"
    />
  `,
})
class ListSimulatedLoadingDemoComponent {
  readonly loading = signal(true);
  readonly groups = EVA_MARTINEZ_GROUPS;
  readonly items: ListEntryItem[] = [];
  readonly expandedGroupIds = ALL_GROUP_IDS;
  readonly selectedItemId = 'doc-demande-primaire';

  constructor() {
    setTimeout(() => this.loading.set(false), SIMULATED_LOADING_MS);
  }
}

export const SimulatedLoading: Story = {
  decorators: [
    moduleMetadata({
      imports: [ListSimulatedLoadingDemoComponent],
    }),
  ],
  render: () => ({
    template: '<pds-list-simulated-loading-demo />',
  }),
};

const ROW_STATE_DOCUMENT: ListEntryItem = {
  id: 'doc-row-state-demo',
  title: 'Demande primaire -',
  titleLine2: 'Régime général',
  status: {
    label: 'En traitement',
    severity: 'warn',
    icon: 'bi bi-hourglass-split',
  },
  tags: [
    { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
    { label: '1', severity: 'warn', icon: 'bi bi-exclamation-triangle-fill' },
  ],
};

const documentRowMarkup = (modifiers: string) => `
  <article
    class="c-list__item c-list__item--entry o-layout--overflow-hidden o-layout--min-w-0 o-layout--full-width ${modifiers}"
  >
    <div class="c-list__container o-flex o-flex--col o-layout--gap-1">
      <div
        class="c-list__header-row o-flex o-flex--align-items-start o-flex--justify-content-space-between o-layout--gap-4"
      >
        <div class="o-flex o-layout--gap-3 o-layout--min-w-0">
          <i class="c-list__icon bi bi-clipboard2-pulse" aria-hidden="true"></i>
          <p class="c-list__title">
            ${ROW_STATE_DOCUMENT.title} ${ROW_STATE_DOCUMENT.titleLine2}
          </p>
        </div>
        <div class="c-list__status">
          <p-tag severity="warn" value="En traitement">
            <i class="bi bi-hourglass-split" aria-hidden="true"></i>
          </p-tag>
        </div>
      </div>
      <hr />
      <div class="c-list__tags o-flex o-flex--wrap o-layout--gap-1">
        <p-tag severity="info" value="1">
          <i class="bi bi-chat-right-text-fill" aria-hidden="true"></i>
        </p-tag>
        <p-tag severity="warn" value="1">
          <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
        </p-tag>
      </div>
    </div>
  </article>
`;

export const Dutch: Story = {
  globals: { locale: 'nl' },
  args: journeyDefaults,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('region', { name: 'Opvolging van documenten' }),
    ).toBeVisible();
  },
};

export const RowStates: Story = {
  decorators: [
    moduleMetadata({ imports: [Tag] }),
    componentWrapperDecorator(
      (story) => `
        <style>
          .sb-list-row-states .c-list__item--entry.sb-force-hover:not(.c-list__item--selected) {
            border-color: var(--pds-color-list-row-hover-border);
          }
        </style>
        <div class="sb-list-row-states" style="max-width: 56rem">${story}</div>
      `,
    ),
  ],
  render: () => ({
    template: `
      <div class="c-list c-list--flat">
        <div class="c-list__body o-flex o-layout--gap-2">
          <div class="o-flex o-flex--col o-layout--gap-1 o-flex__item--grow-1">
            <p class="u-text-label-xs">Default</p>
            ${documentRowMarkup('')}
          </div>
          <div class="o-flex o-flex--col o-layout--gap-1 o-flex__item--grow-1">
            <p class="u-text-label-xs">Hover</p>
            ${documentRowMarkup('sb-force-hover')}
          </div>
          <div class="o-flex o-flex--col o-layout--gap-1 o-flex__item--grow-1">
            <p class="u-text-label-xs">Selected</p>
            ${documentRowMarkup('c-list__item--selected')}
          </div>
        </div>
      </div>
    `,
  }),
};
