import { componentWrapperDecorator, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { Tag } from 'primeng/tag';
import { ListComponent } from './list.component';
import type { ListDocumentItem, ListGroup } from './list.types';
import { SIMULATED_LOADING_MS } from '../../storybook/simulated-loading';

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
        status: { label: 'En traitement', severity: 'warn', icon: 'bi bi-hourglass-split' },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          { label: '1', severity: 'warn', icon: 'bi bi-exclamation-triangle-fill' },
        ],
      },
      {
        id: 'doc-incapacite',
        title: 'Incapacité',
        status: { label: 'En traitement', severity: 'warn', icon: 'bi bi-hourglass-split' },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          { label: '1', severity: 'warn', icon: 'bi bi-exclamation-triangle-fill' },
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
        status: { label: 'En traitement', severity: 'warn', icon: 'bi bi-hourglass-split' },
        tags: [
          { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
          { label: '1', severity: 'warn', icon: 'bi bi-exclamation-triangle-fill' },
        ],
      },
    ],
  },
];

const FLAT_DOCUMENTS: ListDocumentItem[] = EVA_MARTINEZ_GROUPS.flatMap(
  (group) => group.documents,
);

const SAMPLE_DOCUMENT: ListDocumentItem = EVA_MARTINEZ_GROUPS[0].documents[0];

const ALL_GROUP_IDS = EVA_MARTINEZ_GROUPS.map((group) => group.id);

interface ListStoryArgs {
  groups: ListGroup[] | null;
  items: ListDocumentItem[];
  expandedGroupIds: string[];
  selectedItemId: string | null;
  loading: boolean;
}

const meta: Meta<ListStoryArgs> = {
  title: 'UI/List',
  component: ListComponent,
  tags: ['autodocs'],
  decorators: [
    componentWrapperDecorator(
      (story) => `<div class="sb-demo-wrapper" style="max-width: 56rem">${story}</div>`,
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
iSHARE affiliate document list with **journey** (grouped timeline) and **flat** modes.

- **Figma (iSHARE-Audit)**: [324:5827](https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5827) (journey ON), [518:48833](https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=518-48833) (journey OFF)
- **Figma (Custom-components)**: [pds-list / c-list](https://www.figma.com/design/wmG7Dx9R7I6oJBUV3NYlTi/Custom-components?node-id=107-3675) → [list/content](https://www.figma.com/design/wmG7Dx9R7I6oJBUV3NYlTi/Custom-components?node-id=98-2220) → [_states](https://www.figma.com/design/wmG7Dx9R7I6oJBUV3NYlTi/Custom-components?node-id=2-125) → [_master](https://www.figma.com/design/wmG7Dx9R7I6oJBUV3NYlTi/Custom-components?node-id=2-108)
- **BEM block**: \`c-list\`
- **Journey ON**: chevron on group headers, 64px timeline gutter on child document rows
- **Journey OFF**: full-width document cards — no chevron, no timeline
- **Selected document**: 1px primary border + shadow-md (Figma node 2:125)
- **Hover document**: 1px primary border, no shadow (Figma node 2:125)
- **Row chrome**: \`c-list__item--document\` card with default/hover/selected states (Figma 2:125)
- **Layout**: flex/gap via \`o-flex\` / \`o-layout\` — chrome in \`06-components/_components.list.scss\`
- **PrimeNG**: \`p-tag\` for status/footer tags
        `,
      },
    },
  },
  argTypes: {
    groups: {
      control: 'object',
      description: 'Journey groups — pass a non-null array to enable grouped timeline mode.',
    },
    items: {
      control: 'object',
      description: 'Flat document rows — used when groups is null.',
    },
    expandedGroupIds: {
      control: 'object',
      description: 'IDs of journey groups that are expanded.',
    },
    loading: { control: 'boolean', description: 'Shows skeleton placeholder rows.' },
    selectedItemId: {
      control: 'text',
      description: 'ID of the selected document row — takes precedence over doc.selected.',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <(pds|app|lib)-list
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

const journeyDefaults: ListStoryArgs = {
  groups: EVA_MARTINEZ_GROUPS,
  items: [],
  expandedGroupIds: ALL_GROUP_IDS,
  selectedItemId: 'doc-demande-primaire',
  loading: false,
};

export const Default: Story = {
  args: journeyDefaults,
  parameters: {
    docs: {
      description: {
        story:
          'Default journey (grouped) list for Eva Martinez — Parcours Indemnités groups with timeline gutter and selected document row. Figma node 324:5827.',
      },
    },
  },
};

export const Grouped: Story = {
  args: journeyDefaults,
  parameters: {
    docs: {
      description: {
        story: 'Alias of Default — journey ON with expandable groups, chevrons, and timeline gutters.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          'Flat mode (journey OFF) — full-width document cards without chevron or timeline. Figma node 518:48833.',
      },
    },
  },
};

export const GroupExpanded: Story = {
  args: {
    ...journeyDefaults,
    expandedGroupIds: ALL_GROUP_IDS,
  },
  parameters: {
    docs: {
      description: {
        story: 'All journey groups expanded — child document rows visible beneath each group header.',
      },
    },
  },
};

export const GroupCollapsed: Story = {
  args: {
    ...journeyDefaults,
    expandedGroupIds: ['parcours-rechute'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'First Parcours Indemnités group collapsed — chevron rotated, child document rows hidden.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          'Selected document row — 1px primary border and shadow-md elevation. Figma nodes 435:7387, 2:125.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Default document row via pds-list — no selection. Figma node 2:125.',
      },
    },
  },
};

export const RowHover: Story = {
  args: rowStateDefaults,
  decorators: [
    componentWrapperDecorator(
      (story) => `
        <style>
          .sb-list-row-hover-demo .c-list__item--document.sb-list-row--hover:not(.c-list__item--selected) {
            border-color: var(--pds-color-list-row-hover-border);
          }
        </style>
        <div class="sb-list-row-hover-demo sb-demo-wrapper" style="max-width: 56rem">${story}</div>
      `,
    ),
  ],
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('.c-list__item--document')?.classList.add('sb-list-row--hover');
  },
  parameters: {
    docs: {
      description: {
        story:
          'Hover document row via pds-list — static capture uses `.sb-list-row--hover`. Figma node 2:125.',
      },
    },
  },
};

export const RowSelected: Story = {
  args: {
    ...rowStateDefaults,
    selectedItemId: 'doc-demande-primaire',
  },
  parameters: {
    docs: {
      description: {
        story: 'Selected document row via pds-list and `selectedItemId`. Figma node 2:125.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    ...journeyDefaults,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Static loading state — PrimeNG `p-skeleton` placeholder rows.',
      },
    },
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
  readonly items: ListDocumentItem[] = [];
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
  parameters: {
    docs: {
      description: {
        story: `Flashes skeleton for ${SIMULATED_LOADING_MS}ms then reveals content — use to preview the shimmer transition.`,
      },
    },
  },
};

const ROW_STATE_DOCUMENT: ListDocumentItem = {
  id: 'doc-row-state-demo',
  title: 'Demande primaire -',
  titleLine2: 'Régime général',
  status: { label: 'En traitement', severity: 'warn', icon: 'bi bi-hourglass-split' },
  tags: [
    { label: '1', severity: 'info', icon: 'bi bi-chat-right-text-fill' },
    { label: '1', severity: 'warn', icon: 'bi bi-exclamation-triangle-fill' },
  ],
};

const documentRowMarkup = (modifiers: string, selected = false) => `
  <article
    class="c-list__item c-list__item--document ${modifiers}"
    role="button"
    tabindex="0"
    ${selected ? 'aria-selected="true"' : ''}
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

export const RowStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Flat document row chrome — default (neutral border), hover (primary border, no shadow), and selected (primary border + shadow-md). Hover column uses `.sb-force-hover` for static docs capture. Figma Custom-components node 2:125. Group headers do not receive hover/selected chrome.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [Tag] }),
    componentWrapperDecorator(
      (story) => `
        <style>
          .sb-list-row-states .c-list__item--document.sb-force-hover:not(.c-list__item--selected) {
            border-color: var(--pds-color-list-row-hover-border);
          }
        </style>
        <div class="sb-list-row-states sb-demo-wrapper" style="max-width: 56rem">${story}</div>
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
            ${documentRowMarkup('c-list__item--selected', true)}
          </div>
        </div>
      </div>
    `,
  }),
};
