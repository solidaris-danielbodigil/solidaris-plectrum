import { Component, input, output } from '@angular/core';
import { Tag } from 'primeng/tag';
import type { IgedMessageSet } from '../i18n';
import type { OverviewFileCard } from '../layout/nav.config';
import {
  QueueCardComponent,
  type QueueCardKpiKey,
} from './queue-card.component';

export interface OverviewDomainGroup {
  id: string;
  label: string;
  icon: string;
  cards: OverviewFileCard[];
}

@Component({
  selector: 'app-overview-queues',
  standalone: true,
  imports: [Tag, QueueCardComponent],
  template: `
    @if (searchEmpty()) {
      <p class="u-text-body-md o-layout o-layout--margin-0">
        {{ copy().overview.searchEmpty }}
      </p>
    } @else {
      <div class="o-flex o-flex--y o-layout o-layout--gap-3">
        <section
          class="o-flex o-flex--y o-layout o-layout--gap-2"
          [attr.aria-label]="copy().overview.favorites"
        >
          <div
            class="o-flex o-flex--align-items-center o-layout o-layout--gap-1-5"
          >
            <h2 class="u-text-heading-sm o-layout o-layout--margin-0">
              {{ copy().overview.favorites }}
            </h2>
            <p-tag [value]="'' + favorites().length" severity="secondary" />
          </div>

          @if (favorites().length) {
            <div
              class="o-flex o-flex--row-wrap o-layout o-layout--gap-2 o-layout--full-width"
            >
              @for (card of favorites(); track card.id) {
                <app-queue-card
                  [card]="card"
                  [copy]="copy()"
                  (favoriteToggle)="favoriteToggle.emit($event)"
                  (statusClick)="statusClick.emit({ card, key: $event })"
                />
              }
            </div>
          } @else {
            <p class="u-text-body-sm o-layout o-layout--margin-0">
              {{ copy().overview.noFavorites }}
            </p>
          }
        </section>

        <section
          class="o-flex o-flex--y o-layout o-layout--gap-3"
          [attr.aria-label]="copy().overview.otherFiles"
        >
          <div
            class="o-flex o-flex--align-items-center o-layout o-layout--gap-1-5"
          >
            <h2 class="u-text-heading-sm o-layout o-layout--margin-0">
              {{ copy().overview.otherFiles }}
            </h2>
            <p-tag [value]="'' + otherCount()" severity="secondary" />
          </div>

          @if (others().length) {
            @for (group of others(); track group.id) {
              <div class="o-flex o-flex--y o-layout o-layout--gap-2">
                <h3
                  class="u-text-label-md o-flex o-flex--align-items-center o-layout o-layout--gap-1 o-layout--margin-0"
                >
                  <i [class]="group.icon" aria-hidden="true"></i>
                  <span>{{ group.label }}</span>
                </h3>
                <div
                  class="o-flex o-flex--row-wrap o-layout o-layout--gap-2 o-layout--full-width"
                >
                  @for (card of group.cards; track card.id) {
                    <app-queue-card
                      [card]="card"
                      [copy]="copy()"
                      (favoriteToggle)="favoriteToggle.emit($event)"
                      (statusClick)="statusClick.emit({ card, key: $event })"
                    />
                  }
                </div>
              </div>
            }
          } @else {
            <p class="u-text-body-sm o-layout o-layout--margin-0">
              {{ copy().overview.noOther }}
            </p>
          }
        </section>
      </div>
    }
  `,
})
export class OverviewQueuesComponent {
  readonly copy = input.required<IgedMessageSet>();
  readonly favorites = input.required<OverviewFileCard[]>();
  readonly others = input.required<OverviewDomainGroup[]>();
  readonly searchEmpty = input(false);

  readonly favoriteToggle = output<string>();
  readonly statusClick = output<{
    card: OverviewFileCard;
    key: QueueCardKpiKey;
  }>();

  otherCount(): number {
    return this.others().reduce((sum, group) => sum + group.cards.length, 0);
  }
}
