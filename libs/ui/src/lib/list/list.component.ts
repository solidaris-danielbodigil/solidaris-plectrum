import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import type { TreeNode } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { Tree } from 'primeng/tree';
import type { ListDocumentItem, ListGroup, ListItem } from './list.types';
import { isListGroup } from './list.types';

export interface ListGroupNodeData {
  group: ListGroup;
}

export interface ListDocumentNodeData {
  doc: ListDocumentItem;
  showTimeline: boolean;
}

@Component({
  selector: 'sds-list',
  standalone: true,
  imports: [PrimeTemplate, Tag, Tree],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-list o-flex o-flex--y',
    '[class.c-list--journey]': 'isJourneyMode()',
    '[class.c-list--flat]': '!isJourneyMode()',
    '[class.is-loading]': 'loading()',
    role: 'region',
    'aria-label': 'Suivi des documents',
    '[attr.aria-busy]': 'loading()',
  },
})
export class ListComponent {
  readonly timelineSrc = 'assets/timeline.svg';

  readonly groups = input<ListGroup[] | null>(null);
  readonly items = input<ListItem[]>([]);
  readonly loading = input(false);
  readonly showHeader = input(true);
  readonly expandedGroupIds = input<string[]>([]);
  readonly selectedItemId = input<string | null>(null);

  readonly expandedGroupIdsChange = output<string[]>();
  readonly itemClick = output<ListItem>();

  readonly isJourneyMode = computed(() => this.groups() !== null);

  readonly documentCount = computed(() => {
    if (this.isJourneyMode()) {
      return (this.groups() ?? []).reduce(
        (sum, group) => sum + group.documents.length,
        0,
      );
    }

    return this.flatDocuments().length;
  });

  readonly flatDocuments = computed((): ListDocumentItem[] =>
    this.items().filter((item): item is ListDocumentItem => !isListGroup(item)),
  );

  readonly treeNodes = computed((): TreeNode[] => {
    if (this.loading()) {
      return [];
    }

    if (this.isJourneyMode()) {
      return (this.groups() ?? []).map((group) => this.toGroupTreeNode(group));
    }

    return this.flatDocuments().map((doc) => this.toDocumentTreeNode(doc, false));
  });

  isGroupExpanded(groupId: string): boolean {
    return this.expandedGroupIds().includes(groupId);
  }

  isDocumentSelected(doc: ListDocumentItem): boolean {
    const selectedId = this.selectedItemId();
    if (selectedId !== null) {
      return doc.id === selectedId;
    }

    return doc.selected === true;
  }

  groupFromNode(node: TreeNode): ListGroup {
    return (node.data as ListGroupNodeData).group;
  }

  documentFromNode(node: TreeNode): ListDocumentNodeData {
    return node.data as ListDocumentNodeData;
  }

  documentDisplayTitle(doc: ListDocumentItem): string {
    return doc.titleLine2 ? `${doc.title} ${doc.titleLine2}` : doc.title;
  }

  onDocumentClick(doc: ListDocumentItem): void {
    if (this.loading()) {
      return;
    }

    this.itemClick.emit(doc);
  }

  onDocumentKeydown(event: KeyboardEvent, doc: ListDocumentItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onDocumentClick(doc);
    }
  }

  onTreeNodeExpand(event: { node: TreeNode }): void {
    const groupId = event.node.key;
    if (event.node.type !== 'group' || !groupId) {
      return;
    }

    this.syncExpandedGroupId(groupId, true);
  }

  onTreeNodeCollapse(event: { node: TreeNode }): void {
    const groupId = event.node.key;
    if (event.node.type !== 'group' || !groupId) {
      return;
    }

    this.syncExpandedGroupId(groupId, false);
  }

  private toGroupTreeNode(group: ListGroup): TreeNode {
    return {
      key: group.id,
      type: 'group',
      label: `${group.title}${group.titleAccent ?? ''}`,
      data: { group },
      expanded: this.isGroupExpanded(group.id),
      selectable: false,
      children: group.documents.map((doc) => this.toDocumentTreeNode(doc, true)),
    };
  }

  private toDocumentTreeNode(doc: ListDocumentItem, showTimeline: boolean): TreeNode {
    return {
      key: doc.id,
      type: 'document',
      data: { doc, showTimeline },
      leaf: true,
      selectable: false,
    };
  }

  private syncExpandedGroupId(groupId: string, expand: boolean): void {
    if (this.loading()) {
      return;
    }

    const expanded = [...this.expandedGroupIds()];
    const index = expanded.indexOf(groupId);

    if (expand && index < 0) {
      expanded.push(groupId);
      this.expandedGroupIdsChange.emit(expanded);
      return;
    }

    if (!expand && index >= 0) {
      expanded.splice(index, 1);
      this.expandedGroupIdsChange.emit(expanded);
    }
  }
}
