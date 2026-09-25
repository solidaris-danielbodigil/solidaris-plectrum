import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { injectIgedMessages } from '../i18n';
import { BreadcrumbService } from '../layout/breadcrumb.service';
import {
  buildOverviewCards,
  type IgedDomainId,
  type OverviewFileCard,
} from '../layout/nav.config';
import { ShellSearchService } from '../layout/shell-search.service';
import {
  OverviewQueuesComponent,
  type OverviewDomainGroup,
} from './overview-queues.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TabsModule, OverviewQueuesComponent],
  templateUrl: './overview.component.html',
  host: {
    class: 'o-flex o-flex--y o-layout o-layout--gap-3',
  },
})
export class OverviewComponent {
  private readonly breadcrumbs = inject(BreadcrumbService);
  private readonly search = inject(ShellSearchService);
  private readonly router = inject(Router);
  readonly copy = injectIgedMessages();

  readonly activeTab = signal('journee');

  onTabChange(value: string | number | undefined): void {
    this.activeTab.set(typeof value === 'string' ? value : 'journee');
  }

  private readonly favoriteOverrides = signal<Record<string, boolean>>({});

  private readonly cards = computed(() => {
    const overrides = this.favoriteOverrides();
    return buildOverviewCards(this.copy()).map((card) =>
      card.id in overrides ? { ...card, favorite: overrides[card.id] } : card,
    );
  });

  readonly favoriteCards = computed(() =>
    this.cards().filter(
      (card) => card.favorite && this.matchesSearch(card, this.search.query()),
    ),
  );

  readonly otherSections = computed<OverviewDomainGroup[]>(() => {
    const query = this.search.query();
    const grouped = new Map<IgedDomainId, OverviewDomainGroup>();
    for (const card of this.cards()) {
      if (card.favorite || !this.matchesSearch(card, query)) {
        continue;
      }
      const group = grouped.get(card.domainId) ?? {
        id: card.domainId,
        label: card.domainLabel,
        icon: card.domainIcon,
        cards: [],
      };
      group.cards.push(card);
      grouped.set(card.domainId, group);
    }
    return [...grouped.values()];
  });

  readonly searchEmpty = computed(
    () =>
      this.search.query().trim().length > 0 &&
      this.favoriteCards().length === 0 &&
      this.otherSections().length === 0,
  );

  constructor() {
    effect(() => {
      const messages = this.copy();
      this.breadcrumbs.setBreadcrumbs([
        { label: messages.domains.dashboard },
        { label: messages.overview.title },
      ]);
    });
  }

  toggleFavorite(cardId: string): void {
    this.favoriteOverrides.update((current) => {
      const cards = this.cards();
      const card = cards.find((entry) => entry.id === cardId);
      if (!card) {
        return current;
      }
      return { ...current, [cardId]: !card.favorite };
    });
  }

  onStatusClick(card: OverviewFileCard): void {
    if (!card.available || !card.routerLink) {
      return;
    }

    void this.router.navigateByUrl(card.routerLink);
  }

  private matchesSearch(card: OverviewFileCard, query: string): boolean {
    const normalized = query
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (!normalized) {
      return true;
    }
    const haystack = `${card.title} ${card.domainLabel} ${card.id}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return haystack.includes(normalized);
  }
}
