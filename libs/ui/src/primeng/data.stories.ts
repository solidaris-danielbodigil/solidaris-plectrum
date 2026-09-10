import {
  afterRenderEffect,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import type { TreeNode } from 'primeng/api';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Timeline } from 'primeng/timeline';
import { Tree } from 'primeng/tree';
import { statusStory } from '../docs/docs-figure-stories';
import { DATA_API } from './gallery-arg-types';
import { ListComponent } from '../lib/list/list.component';
import type { ListEntryItem } from '../lib/list/list.types';
import { assertTextVisible, expect } from '../storybook/story-tests';

const ROWS = [
  { code: 'ITT-24', name: 'Certificat ITT', status: 'Accepté' },
  { code: 'DP-11', name: 'Demande primaire', status: 'En traitement' },
  { code: 'CL-02', name: 'Clôture', status: 'Clôturé' },
];

const TREE: TreeNode[] = [
  {
    key: 'dossier',
    label: 'Dossier',
    expanded: true,
    children: [
      { key: 'itt', label: 'Certificat ITT' },
      { key: 'dp', label: 'Demande primaire' },
    ],
  },
];

@Component({
  selector: 'pds-gallery-tree-demo',
  standalone: true,
  imports: [Tree],
  template: `
    <p-tree
      [value]="nodes()"
      togglerAriaLabel="Développer ou réduire"
      [pt]="treePt"
    />
  `,
})
class GalleryTreeDemo {
  readonly nodes = input<TreeNode[]>([]);
  readonly treePt = {
    nodeToggleButton: { 'aria-label': 'Développer ou réduire' },
  };
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly labelTogglers = afterRenderEffect(() => {
    this.nodes();
    const root = this.host.nativeElement as HTMLElement;
    root.querySelectorAll('.p-tree-node-toggle-button').forEach((button) => {
      button.setAttribute('aria-label', 'Développer ou réduire');
    });
  });
}

const LIST_ITEMS: ListEntryItem[] = [
  {
    id: 'doc-itt',
    title: 'Certificat ITT',
    icon: 'bi bi-file-earmark-text',
    status: { label: 'Accepté', severity: 'success', icon: 'bi bi-check-lg' },
  },
  {
    id: 'doc-dp',
    title: 'Demande primaire',
    icon: 'bi bi-file-earmark-text',
    status: {
      label: 'En traitement',
      severity: 'warn',
      icon: 'bi bi-hourglass-split',
    },
  },
];

const EVENTS = [
  { date: '24/11/2025', title: 'Document reçu' },
  { date: '01/12/2025', title: 'Décision envoyée' },
];

const meta: Meta = {
  title: 'PrimeNG/Data',
  parameters: { layout: 'padded' },
  argTypes: DATA_API as Meta['argTypes'],
};

export default meta;

type Story = StoryObj;

/** Ownership badge for the docs page — CSS-only theme proof. */
export const Status = { tags: ['!dev'], ...statusStory({ status: 'core', owner: 'design-system' }) };

export const SortableTable: Story = {
  name: 'Table',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Certificat ITT');
    await assertTextVisible(canvasElement, 'Code');
  },
  render: () => ({
    props: { rows: ROWS },
    moduleMetadata: { imports: [TableModule] },
    template: `
      <p-table [value]="rows">
        <ng-template #header>
          <tr>
            <th pSortableColumn="code">Code <p-sortIcon field="code" /></th>
            <th pSortableColumn="name">Libellé <p-sortIcon field="name" /></th>
            <th pSortableColumn="status">Statut <p-sortIcon field="status" /></th>
          </tr>
        </ng-template>
        <ng-template #body let-row>
          <tr>
            <td>{{ row.code }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.status }}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
  }),
};

export const StockTree: Story = {
  name: 'Tree',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Dossier');
    await assertTextVisible(canvasElement, 'Certificat ITT');
  },
  render: () => ({
    props: { nodes: TREE },
    moduleMetadata: { imports: [GalleryTreeDemo] },
    template: `<pds-gallery-tree-demo [nodes]="nodes" />`,
  }),
};

export const EndorsedList: Story = {
  name: 'List',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Certificat ITT');
    await assertTextVisible(canvasElement, 'Demande primaire');
  },
  render: () => ({
    props: { items: LIST_ITEMS },
    moduleMetadata: { imports: [ListComponent] },
    template: `
      <pds-list
        [showHeader]="false"
        [groups]="null"
        [items]="items"
      />
    `,
  }),
};

export const StockSkeleton: Story = {
  name: 'Skeleton',
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('p-skeleton');
    await expectPresent(skeleton);
  },
  render: () => ({
    moduleMetadata: { imports: [Skeleton] },
    template: `
      <div class="o-flex o-flex--y o-layout--gap-2">
        <p-skeleton width="12rem" height="1rem" />
        <p-skeleton width="20rem" height="1rem" />
        <p-skeleton width="16rem" height="1rem" />
      </div>
    `,
  }),
};

export const StockTimeline: Story = {
  name: 'Timeline',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Document reçu');
  },
  render: () => ({
    props: { events: EVENTS },
    moduleMetadata: { imports: [Timeline] },
    template: `
      <p-timeline [value]="events" align="left">
        <ng-template #opposite let-event><small>{{ event.date }}</small></ng-template>
        <ng-template #content let-event><strong>{{ event.title }}</strong></ng-template>
      </p-timeline>
    `,
  }),
};

async function expectPresent(node: Element | null): Promise<void> {
  await expect(node).toBeTruthy();
}
