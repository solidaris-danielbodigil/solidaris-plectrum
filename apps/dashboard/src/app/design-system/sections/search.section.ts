import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { EvalCase } from '@pds-internal/insights';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { readChartTheme } from '../../shared/chart-theme';
import { formatShortDate } from '../insights.format';
import { InsightsStore } from '../insights.store';
import { ChartCardComponent } from '../ui/chart-card.component';
import { lineChart } from '../ui/chart-options';
import { KpiTileComponent } from '../ui/kpi-tile.component';
import { SectionRecommendationsComponent } from '../ui/section-recommendations.component';

/** Expected ids of a case, as one readable line. */
export function expectedText(c: EvalCase): string {
  if (c.none) return 'No match';
  const parts: string[] = [];
  if (c.anyOf.length > 0) parts.push(`any of ${c.anyOf.join(', ')}`);
  if (c.allOf.length > 0) parts.push(`all of ${c.allOf.join(', ')}`);
  return parts.join('; ');
}

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [
    RouterLink, ButtonModule, CardModule, TableModule, TagModule,
    ChartCardComponent, KpiTileComponent, SectionRecommendationsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <h2 class="u-text-heading-md o-layout o-layout--margin-0">Search quality</h2>
    <app-section-recommendations section="search" />

    <div class="o-flex o-flex--wrap o-layout o-layout--gap-3" role="list" aria-label="Search key figures">
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Pass rate" [value]="eval().rate + '%'" [detail]="eval().passed + ' of ' + eval().total + ' reference requests · toolkit ' + eval().toolkitVersion" />
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Regressions" [value]="eval().regressions.length" [detail]="eval().regressions.join(', ') || 'None since the last run'" />
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Known misses" [value]="eval().knownMisses.length" [detail]="knownMissDetail()" />
    </div>

    <app-chart-card
      heading="Pass rate over time"
      [summary]="historySummary()"
      type="line"
      [chart]="historyChart()"
      [table]="historyTable()"
      height="14rem"
    />

    <p-card>
      <ng-template #title>
        <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Reference requests ({{ eval().results.length }})</h3>
      </ng-template>
      <ng-template #subtitle>Expand a request to compare what was expected with what the agent search returned.</ng-template>
      <div class="o-layout o-layout--overflow-x-auto">
        <p-table [value]="cases()" dataKey="id" size="small">
          <ng-template #header>
            <tr>
              <th scope="col"><span class="u-sr-only">Expand</span></th>
              <th scope="col">Request</th>
              <th scope="col">Result</th>
            </tr>
          </ng-template>
          <ng-template #body let-row let-expanded="expanded">
            <tr>
              <td>
                <button
                  type="button"
                  pButton
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  [pRowToggler]="row"
                  [attr.aria-expanded]="expanded"
                  [attr.aria-label]="(expanded ? 'Collapse ' : 'Expand ') + row.id"
                >
                  <i [class]="expanded ? 'bi bi-chevron-down' : 'bi bi-chevron-right'" aria-hidden="true"></i>
                </button>
              </td>
              <th scope="row">
                <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ evalCase: row.id }">{{ row.query }}</a>
              </th>
              <td>
                <div class="o-flex o-flex--wrap o-layout o-layout--gap-1">
                  @if (row.pass) {
                    <p-tag severity="success" icon="bi bi-check2" value="Pass" />
                  } @else {
                    <p-tag severity="danger" icon="bi bi-x-lg" value="Fail" />
                  }
                  @if (row.knownMiss) {
                    <p-tag severity="secondary" value="Known miss" />
                  }
                  @if (row.regression) {
                    <p-tag severity="danger" icon="bi bi-arrow-down" value="Regression" />
                  }
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template #expandedrow let-row>
            <tr>
              <td colspan="3">
                <dl class="o-flex o-flex--y o-layout o-layout--gap-1 o-layout--padding-2">
                  <dt class="u-text-label-md">Case id</dt>
                  <dd class="u-text-body-sm">{{ row.id }}</dd>
                  <dt class="u-text-label-md">Expected</dt>
                  <dd class="u-text-body-sm">{{ row.expected }}</dd>
                  <dt class="u-text-label-md">Returned</dt>
                  <dd class="u-text-body-sm">{{ row.results.join(', ') || 'Nothing' }}</dd>
                </dl>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-card>
  `,
})
export class SearchSectionComponent {
  protected readonly store = inject(InsightsStore);
  private readonly theme = readChartTheme();

  readonly eval = computed(() => this.store.data.repo.searchEval);

  readonly knownMissDetail = computed(() =>
    this.eval().knownMisses.map((k) => k.id).join(', ') || 'None',
  );

  readonly cases = computed(() =>
    [...this.eval().results]
      .map((c) => ({ ...c, expected: expectedText(c), regression: this.eval().regressions.includes(c.id) }))
      .sort((a, b) => Number(a.pass) - Number(b.pass) || a.id.localeCompare(b.id)),
  );

  readonly historyChart = computed(() =>
    lineChart(
      this.theme,
      this.eval().history.map((h) => formatShortDate(h.at)),
      [{ label: 'Pass rate', data: this.eval().history.map((h) => h.rate), color: this.theme.categorical[0] }],
      { percent: true, max: 100 },
    ),
  );

  readonly historySummary = computed(() => {
    const history = this.eval().history;
    if (history.length === 0) return 'No evaluation history in this checkout.';
    const first = history[0];
    const last = history[history.length - 1];
    return `${history.length} evaluation runs, from ${first.rate}% (${first.passed}/${first.total}) to ${last.rate}% (${last.passed}/${last.total}).`;
  });

  readonly historyTable = computed(() => ({
    columns: ['Run', 'Revision', 'Passed', 'Total', 'Rate'],
    rows: this.eval().history.map((h) => [formatShortDate(h.at), h.revision.slice(0, 7), h.passed, h.total, `${h.rate}%`]),
  }));
}
