import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { Tag } from 'primeng/tag';
import type { ListDocumentItem, ListGroup, ListItem } from './list.types';
import { isListGroup } from './list.types';

@Component({
  selector: 'sds-list',
  standalone: true,
  imports: [NgTemplateOutlet, Tag],
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
  readonly groups = input<ListGroup[] | null>(null);
  readonly items = input<ListItem[]>([]);
  readonly loading = input(false);
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

  onGroupHeaderClick(groupId: string): void {
    if (this.loading()) {
      return;
    }

    const expanded = [...this.expandedGroupIds()];
    const index = expanded.indexOf(groupId);

    if (index >= 0) {
      expanded.splice(index, 1);
    } else {
      expanded.push(groupId);
    }

    this.expandedGroupIdsChange.emit(expanded);
  }

  onGroupHeaderKeydown(event: KeyboardEvent, groupId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onGroupHeaderClick(groupId);
    }
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

  groupHeaderAriaLabel(group: ListGroup): string {
    const state = this.isGroupExpanded(group.id) ? 'développé' : 'réduit';
    return `${group.title}${group.titleAccent ?? ''}, ${state}`;
  }
}
