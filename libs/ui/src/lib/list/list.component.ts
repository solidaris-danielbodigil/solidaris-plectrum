import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import type { TreeNode } from 'primeng/api';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { Tree } from 'primeng/tree';
import { injectPdsMessages } from '../i18n';
import { PdsTelemetryLabelDirective } from '../testing-telemetry/telemetry-label.directive';
import type {
  ListEntryItem,
  ListEntryTag,
  ListEntryTagTarget,
  ListGroup,
  ListItem,
} from './list.types';
import { isListGroup } from './list.types';
import { ListMessages } from './list.i18n';

export interface ListGroupNodeData {
  group: ListGroup;
}

export interface ListEntryNodeData {
  doc: ListEntryItem;
  showTimeline: boolean;
}

@Component({
  selector: 'pds-list',
  standalone: true,
  imports: [
    ButtonDirective,
    Popover,
    PrimeTemplate,
    Ripple,
    PdsTelemetryLabelDirective,
    Skeleton,
    Tag,
    Tree,
  ],
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'c-list u-border-all u-radius-xl o-flex o-flex--y o-layout--overflow-hidden',
    style:
      '--pds-border-color: var(--pds-color-panel-border); --pds-border-width: var(--pds-border-width-list)',
    '[class.c-list--journey]': 'isJourneyMode()',
    '[class.c-list--flat]': '!isJourneyMode()',
    '[class.is-loading]': 'loading()',
    role: 'region',
    '[attr.aria-label]': 'messages.regionLabel',
    '[attr.aria-busy]': 'loading()',
  },
})
export class ListComponent {
  protected readonly messages = injectPdsMessages(ListMessages);
  protected readonly treePassThrough = {
    nodeToggleButton: { 'aria-label': this.messages.toggleGroup },
  };
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly labelTreeTogglers = afterRenderEffect(() => {
    this.treeNodes();
    this.expandedGroupIds();
    const label = this.messages.toggleGroup;
    const root = this.host.nativeElement as HTMLElement;
    root.querySelectorAll('.p-tree-node-toggle-button').forEach((button) => {
      button.setAttribute('aria-label', label);
    });
  });
  protected readonly skeletonRowIndexes = [0, 1, 2] as const;

  readonly groups = input<ListGroup[] | null>(null);
  readonly items = input<ListItem[]>([]);
  readonly loading = input(false);
  readonly showHeader = input(true);
  readonly expandedGroupIds = input<string[]>([]);
  readonly selectedItemId = input<string | null>(null);
  /** Optional footnote rendered below the tree (e.g. hors-parcours hint). */
  readonly footnote = input<string | null>(null);

  readonly expandedGroupIdsChange = output<string[]>();
  readonly footnoteClick = output<void>();
  readonly itemClick = output<ListItem>();
  readonly tagTargetClick = output<{
    doc: ListEntryItem;
    tag: ListEntryTag;
    target: ListEntryTagTarget;
  }>();

  private readonly tagPopover = viewChild<Popover>('tagPopover');
  private readonly tagAnchorRect = signal<DOMRectReadOnly | null>(null);
  readonly tagPopoverStyle = signal<Record<string, string> | undefined>(
    undefined,
  );
  readonly activeTagContext = signal<{
    doc: ListEntryItem;
    tag: ListEntryTag;
  } | null>(null);

  readonly isJourneyMode = computed(() => this.groups() !== null);

  /** Last selection that triggered auto-expand — avoids re-opening after user collapse. */
  private selectionAutoExpandId: string | null = null;

  /** Keeps the parent group expanded when selection moves programmatically. */
  private readonly expandGroupForSelectedItem = effect(() => {
    const selectedId = this.selectedItemId();
    if (selectedId === null || !this.isJourneyMode()) {
      this.selectionAutoExpandId = null;
      return;
    }

    if (selectedId === this.selectionAutoExpandId) {
      return;
    }

    const group = (this.groups() ?? []).find((item) =>
      item.documents.some((document) => document.id === selectedId),
    );
    if (!group) {
      return;
    }

    if (!this.isGroupExpanded(group.id)) {
      this.syncExpandedGroupId(group.id, true);
    }

    this.selectionAutoExpandId = selectedId;
  });

  readonly documentCount = computed(() => {
    if (this.isJourneyMode()) {
      return (this.groups() ?? []).reduce(
        (sum, group) => sum + group.documents.length,
        0,
      );
    }

    return this.flatDocuments().length;
  });

  readonly flatDocuments = computed((): ListEntryItem[] =>
    this.items().filter((item): item is ListEntryItem => !isListGroup(item)),
  );

  /** Stable tree node references — rebuilt only when groups/items change, not on expand toggle. */
  private readonly treeNodesInternal = signal<TreeNode[]>([]);

  readonly treeNodes = this.treeNodesInternal.asReadonly();

  /** PrimeNG Tree selection — drives aria-selected on treeitems, not nested buttons. */
  readonly selectedTreeNode = computed((): TreeNode | null => {
    const selectedId = this.resolvedSelectedDocumentId();
    if (!selectedId) {
      return null;
    }

    return this.findEntryNode(this.treeNodes(), selectedId);
  });

  private readonly rebuildTreeNodes = effect(() => {
    if (this.loading()) {
      this.treeNodesInternal.set([]);
      return;
    }

    if (this.isJourneyMode()) {
      const groups = this.groups() ?? [];
      const expandedIds = untracked(() => this.expandedGroupIds());
      const nodes = groups.map((group) => this.buildGroupTreeNode(group));
      this.applyExpandedToNodes(nodes, expandedIds);
      this.treeNodesInternal.set(nodes);
      return;
    }

    this.treeNodesInternal.set(
      this.flatDocuments().map((doc) => this.toDocumentTreeNode(doc, false)),
    );
  });

  private readonly patchTreeExpandedState = effect(() => {
    if (!this.isJourneyMode() || this.loading()) {
      return;
    }

    const expandedIds = this.expandedGroupIds();
    const nodes = untracked(() => this.treeNodesInternal());
    if (!nodes.length) {
      return;
    }

    let changed = false;
    for (const node of nodes) {
      if (node.type !== 'group' || !node.key) {
        continue;
      }

      const shouldExpand = expandedIds.includes(node.key);
      if (node.expanded !== shouldExpand) {
        node.expanded = shouldExpand;
        changed = true;
      }
    }

    if (changed) {
      untracked(() => this.treeNodesInternal.set([...nodes]));
    }
  });

  private applyExpandedToNodes(nodes: TreeNode[], expandedIds: string[]): void {
    for (const node of nodes) {
      if (node.type === 'group' && node.key) {
        node.expanded = expandedIds.includes(node.key);
      }
    }
  }

  isGroupExpanded(groupId: string): boolean {
    return this.expandedGroupIds().includes(groupId);
  }

  isDocumentSelected(doc: ListEntryItem): boolean {
    const selectedId = this.resolvedSelectedDocumentId();
    return selectedId !== null && doc.id === selectedId;
  }

  private resolvedSelectedDocumentId(): string | null {
    const selectedId = this.selectedItemId();
    if (selectedId !== null) {
      return selectedId;
    }

    const selected = this.collectDocuments().find((doc) => doc.selected === true);
    return selected?.id ?? null;
  }

  private collectDocuments(): ListEntryItem[] {
    if (this.isJourneyMode()) {
      return (this.groups() ?? []).flatMap((group) => group.documents);
    }

    return this.flatDocuments();
  }

  private findEntryNode(nodes: TreeNode[], id: string): TreeNode | null {
    for (const node of nodes) {
      if (node.type === 'entry' && node.key === id) {
        return node;
      }

      const child = node.children
        ? this.findEntryNode(node.children, id)
        : null;
      if (child) {
        return child;
      }
    }

    return null;
  }

  groupFromNode(node: TreeNode): ListGroup {
    return (node.data as ListGroupNodeData).group;
  }

  documentFromNode(node: TreeNode): ListEntryNodeData {
    return node.data as ListEntryNodeData;
  }

  documentDisplayTitle(doc: ListEntryItem): string {
    return doc.titleLine2 ? `${doc.title} ${doc.titleLine2}` : doc.title;
  }

  groupTelemetryLabel(group: ListGroup): string {
    return group.titleAccent
      ? `${group.title} ${group.titleAccent}`
      : group.title;
  }

  documentIcon(doc: ListEntryItem): string {
    if (!doc.icon) {
      return 'bi bi-file-earmark-text';
    }

    return doc.icon.startsWith('bi ') ? doc.icon : `bi ${doc.icon}`;
  }

  /** True when a document row has footer content (tags, dates, …) below the header. */
  documentHasFooterContent(doc: ListEntryItem): boolean {
    return Boolean(doc.tags?.length);
  }

  /** True when a journey group row has dates below the header. */
  groupHasFooterContent(group: ListGroup): boolean {
    return Boolean(group.startDate || group.endDate);
  }

  onDocumentRowClick(event: MouseEvent, doc: ListEntryItem): void {
    const target = event.target;
    if (target instanceof Element && target.closest('.c-list__tags button')) {
      return;
    }

    event.stopPropagation();
    this.onDocumentClick(doc);
  }

  onDocumentClick(doc: ListEntryItem): void {
    if (this.loading()) {
      return;
    }

    this.itemClick.emit(doc);
  }

  onTreeNodeSelect(event: { node: TreeNode }): void {
    if (event.node.type !== 'entry') {
      return;
    }

    this.onDocumentClick(this.documentFromNode(event.node).doc);
  }

  onDocumentKeydown(event: KeyboardEvent, doc: ListEntryItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.onDocumentClick(doc);
    }
  }

  onTagClick(
    event: MouseEvent | KeyboardEvent,
    doc: ListEntryItem,
    tag: ListEntryTag,
  ): void {
    const targets = tag.targets ?? [];
    event.stopPropagation();

    if (targets.length === 0) {
      return;
    }

    if (targets.length === 1) {
      this.tagTargetClick.emit({ doc, tag, target: targets[0] });
      return;
    }

    const anchor = this.resolveTagAnchor(event);
    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    this.tagAnchorRect.set(rect);
    this.tagPopoverStyle.set(this.popoverStyleFromRect(rect));
    this.activeTagContext.set({ doc, tag });
    this.tagPopover()?.show(event, anchor);
    this.scheduleTagPopoverReposition();
  }

  onTagPopoverShow(): void {
    this.scheduleTagPopoverReposition();
  }

  onTagPopoverHide(): void {
    this.tagAnchorRect.set(null);
    this.tagPopoverStyle.set(undefined);
  }

  private resolveTagAnchor(
    event: MouseEvent | KeyboardEvent,
  ): HTMLElement | undefined {
    if (event.currentTarget instanceof HTMLElement) {
      return event.currentTarget;
    }

    const target = event.target;
    if (target instanceof Element) {
      return (
        target.closest<HTMLButtonElement>('.c-list__tags button.p-button') ??
        undefined
      );
    }

    return undefined;
  }

  private scheduleTagPopoverReposition(): void {
    const apply = () => this.repositionTagPopover();

    requestAnimationFrame(() => {
      apply();
      requestAnimationFrame(() => {
        apply();
        setTimeout(apply, 0);
        setTimeout(apply, 50);
      });
    });
  }

  private popoverStyleFromRect(rect: DOMRectReadOnly): Record<string, string> {
    const gutter = 4;

    return {
      position: 'fixed',
      top: `${rect.bottom + gutter}px`,
      left: `${rect.left}px`,
      insetInlineStart: `${rect.left}px`,
      marginTop: '0',
      transform: 'none',
    };
  }

  private repositionTagPopover(): void {
    const rect = this.tagAnchorRect();
    if (!rect) {
      return;
    }

    const style = this.popoverStyleFromRect(rect);
    this.tagPopoverStyle.set(style);

    const panel = document.body.querySelector(
      '.p-popover',
    ) as HTMLElement | null;
    if (!panel) {
      return;
    }

    Object.assign(panel.style, style);
  }

  onTagTargetSelect(event: Event, target: ListEntryTagTarget): void {
    event.stopPropagation();
    const active = this.activeTagContext();
    if (!active) {
      return;
    }

    this.tagTargetClick.emit({ doc: active.doc, tag: active.tag, target });
    this.tagPopover()?.hide();
  }

  onTagTargetKeydown(
    event: KeyboardEvent,
    target: ListEntryTagTarget,
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onTagTargetSelect(event, target);
    }
  }

  onTagKeydown(
    event: KeyboardEvent,
    doc: ListEntryItem,
    tag: ListEntryTag,
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onTagClick(event, doc, tag);
    }
  }

  onGroupClick(event: MouseEvent, group: ListGroup): void {
    if (this.loading()) {
      return;
    }

    event.stopPropagation();
    this.toggleGroupExpanded(group.id);
  }

  onGroupKeydown(event: KeyboardEvent, group: ListGroup): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.loading()) {
        return;
      }

      this.toggleGroupExpanded(group.id);
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

  private buildGroupTreeNode(group: ListGroup): TreeNode {
    return {
      key: group.id,
      type: 'group',
      label: `${group.title}${group.titleAccent ?? ''}`,
      data: { group },
      expanded: false,
      selectable: false,
      children: group.documents.map((doc) =>
        this.toDocumentTreeNode(doc, true),
      ),
    };
  }

  private toDocumentTreeNode(
    doc: ListEntryItem,
    showTimeline: boolean,
  ): TreeNode {
    return {
      key: doc.id,
      type: 'entry',
      data: { doc, showTimeline },
      leaf: true,
      selectable: true,
    };
  }

  private toggleGroupExpanded(groupId: string): void {
    this.syncExpandedGroupId(groupId, !this.isGroupExpanded(groupId));
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
