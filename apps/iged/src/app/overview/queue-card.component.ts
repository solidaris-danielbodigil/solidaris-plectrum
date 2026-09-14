import { Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import type { IgedMessageSet } from '../i18n';
import type { OverviewFileCard } from '../layout/nav.config';

export type QueueCardKpiKey =
  | 'recus'
  | 'attribues'
  | 'enTraitement'
  | 'incomplets'
  | 'rappels'
  | 'clotures';

type QueueCardKpiSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';

interface QueueCardKpiCell {
  key: QueueCardKpiKey;
  label: string;
  severity: QueueCardKpiSeverity;
}

@Component({
  selector: 'app-queue-card',
  standalone: true,
  imports: [ButtonModule, Card, Tag],
  host: {
    class:
      'o-flex__item o-flex__item--12 o-flex__item--6@md o-flex__item--4@lg o-flex__item--3@xl o-layout o-layout--min-w-0',
  },
  template: `
    <p-card class="o-layout o-layout--full-width" [styleClass]="cardClass()">
      <div class="o-flex o-flex--y o-layout o-layout--gap-2">
        <div
          class="o-flex o-flex--align-items-center o-flex--justify-content-space-between o-layout o-layout--gap-1"
        >
          <div
            class="o-flex o-flex--align-items-center o-layout o-layout--gap-1"
          >
            <p-tag severity="secondary">
              <span
                class="o-flex o-flex--align-items-center o-layout o-layout--gap-1"
              >
                <i [class]="card().domainIcon" aria-hidden="true"></i>
                <span>{{ card().domainLabel }}</span>
              </span>
            </p-tag>
            @if (!card().available) {
              <p-tag [value]="copy().comingSoonItem" severity="secondary" />
            }
          </div>
          <button
            pButton
            type="button"
            text
            severity="secondary"
            class="c-queue-card__fav"
            [icon]="card().favorite ? 'bi bi-star-fill' : 'bi bi-star'"
            [attr.aria-label]="
              card().favorite
                ? copy().overview.favoriteRemove
                : copy().overview.favoriteAdd
            "
            [attr.aria-pressed]="card().favorite"
            (click)="favoriteToggle.emit(card().id)"
          ></button>
        </div>

        <h3 class="u-text-heading-sm o-layout o-layout--margin-0">
          {{ card().title }}
        </h3>

        <table class="c-queue-card__kpis o-layout o-layout--full-width">
          <caption class="u-sr-only">
            {{
              copy().overview.kpiCaption
            }}
            —
            {{
              card().title
            }}
          </caption>
          <tbody>
            <tr>
              @for (cell of topRow(); track cell.key) {
                <td class="o-layout o-layout--padding-1">
                  <div class="o-flex o-flex--y o-layout o-layout--gap-0-5">
                    <span class="c-queue-card__kpi-label u-text-label-sm">{{
                      cell.label
                    }}</span>
                    <p-button
                      text
                      [severity]="cell.severity"
                      [label]="'' + card()[cell.key]"
                      [attr.aria-label]="cell.label + ': ' + card()[cell.key]"
                      (onClick)="statusClick.emit(cell.key)"
                    />
                  </div>
                </td>
              }
            </tr>
            <tr>
              @for (cell of bottomRow(); track cell.key) {
                <td class="o-layout o-layout--padding-1">
                  <div class="o-flex o-flex--y o-layout o-layout--gap-0-5">
                    <span class="c-queue-card__kpi-label u-text-label-sm">{{
                      cell.label
                    }}</span>
                    <p-button
                      text
                      [severity]="cell.severity"
                      [label]="'' + card()[cell.key]"
                      [attr.aria-label]="cell.label + ': ' + card()[cell.key]"
                      (onClick)="statusClick.emit(cell.key)"
                    />
                  </div>
                </td>
              }
            </tr>
          </tbody>
        </table>
      </div>
    </p-card>
  `,
})
export class QueueCardComponent {
  readonly card = input.required<OverviewFileCard>();
  readonly copy = input.required<IgedMessageSet>();

  readonly favoriteToggle = output<string>();
  readonly statusClick = output<QueueCardKpiKey>();

  readonly cardClass = computed(
    () => `c-queue-card${this.card().favorite ? ' is-favorite' : ''}`,
  );

  readonly topRow = computed<QueueCardKpiCell[]>(() => {
    const overview = this.copy().overview;
    return [
      { key: 'recus', label: overview.kpiRecus, severity: 'info' },
      { key: 'attribues', label: overview.kpiAttribues, severity: 'secondary' },
      { key: 'rappels', label: overview.kpiRappels, severity: 'contrast' },
    ];
  });

  readonly bottomRow = computed<QueueCardKpiCell[]>(() => {
    const overview = this.copy().overview;
    return [
      {
        key: 'enTraitement',
        label: overview.kpiEnTraitement,
        severity: 'warn',
      },
      { key: 'incomplets', label: overview.kpiIncomplets, severity: 'danger' },
      { key: 'clotures', label: overview.kpiClotures, severity: 'success' },
    ];
  });
}
