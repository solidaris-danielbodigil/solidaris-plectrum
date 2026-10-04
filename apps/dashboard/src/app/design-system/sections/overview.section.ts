import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { readChartTheme } from '../../shared/chart-theme';
import { capitalize, daysBetween, formatAgo, percent, severityIcon, severityTag } from '../insights.format';
import { COMPONENT_STATUSES, InsightsStore, SEVERITIES } from '../insights.store';
import { ChartCardComponent } from '../ui/chart-card.component';
import { barChart } from '../ui/chart-options';
import { KpiTileComponent } from '../ui/kpi-tile.component';
import { RecommendationListComponent } from '../ui/recommendation-list.component';

@Component({
  selector: 'app-overview-section',
  standalone: true,
  imports: [CardModule, TagModule, ChartCardComponent, KpiTileComponent, RecommendationListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <h2 class="u-text-heading-md o-layout o-layout--margin-0">Overview</h2>

    <div class="o-flex o-flex--wrap o-layout o-layout--gap-3" role="list" aria-label="Key figures">
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Components" [value]="components().length" [detail]="statusDetail()" />
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Applications reporting" [value]="reporting()" [detail]="reportingDetail()" />
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Core coverage" [value]="coverageValue()" [detail]="coverageDetail()" />
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Agent search pass rate" [value]="search().rate + '%'"
        [detail]="search().passed + ' of ' + search().total + ' reference requests'" />
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Last release" [value]="lastRelease().value" [detail]="lastRelease().detail" />
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Open recommendations" [value]="store.recommendations().length">
        <div class="o-flex o-flex--wrap o-layout o-layout--gap-1">
          @for (item of bySeverity(); track item.severity) {
            <p-tag [severity]="item.tag" [icon]="item.icon" [value]="item.count + ' ' + item.severity" />
          }
        </div>
      </app-kpi-tile>
    </div>

    <app-chart-card
      heading="Components by status"
      [summary]="statusSummary()"
      type="bar"
      [chart]="statusChart()"
      [table]="statusTable()"
      height="8rem"
    />

    <p-card>
      <ng-template #title>
        <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Top recommendations</h3>
      </ng-template>
      @if (store.recommendations().length > 0) {
        <app-recommendation-list [recommendations]="store.recommendations()" [limit]="5" [headingLevel]="4" />
      } @else {
        <p class="u-text-body-md o-layout o-layout--margin-0">Nothing to act on for this source.</p>
      }
    </p-card>
  `,
})
export class OverviewSectionComponent {
  protected readonly store = inject(InsightsStore);
  private readonly theme = readChartTheme();

  readonly components = computed(() => this.store.data.repo.components);

  readonly statusCounts = computed(() =>
    COMPONENT_STATUSES.map((status) => ({
      status,
      count: this.components().filter((c) => c.status === status).length,
    })),
  );

  readonly statusDetail = computed(() =>
    this.statusCounts().map((s) => `${s.count} ${s.status}`).join(' · '),
  );

  readonly reporting = computed(() => {
    const apps = this.store.applications();
    return `${apps.filter((a) => a.reportedAt).length}/${apps.length}`;
  });

  readonly reportingDetail = computed(() =>
    this.store.source() === 'demo'
      ? 'Demo snapshots, not real reports'
      : this.store.hasReported
        ? 'Usage reports received'
        : 'No application has sent a report yet',
  );

  readonly coverage = computed(() => {
    const core = this.components().filter((c) => c.status === 'core' && c.measurable);
    const used = core.filter((c) => (this.store.appsByComponent().get(c.id) ?? []).length > 0).length;
    return { used, total: core.length, rate: percent(used, core.length) };
  });

  readonly coverageValue = computed(() =>
    this.store.source() === 'reported' && !this.store.hasReported ? '—' : `${this.coverage().rate}%`,
  );

  readonly coverageDetail = computed(() => {
    if (this.store.source() === 'demo') {
      return `${this.coverage().used} of ${this.coverage().total} core components seen in demo applications`;
    }
    const reporting = this.store.applications().filter((app) => app.reportedAt).length;
    if (reporting === 0) return 'Unknown until an external application reports';
    const missing = this.store.applications().length - reporting;
    return `${this.coverage().used} of ${this.coverage().total} core components observed in ${reporting} reporting application${reporting === 1 ? '' : 's'}` +
      (missing > 0 ? `; ${missing} application${missing === 1 ? '' : 's'} unknown` : '');
  });

  readonly search = computed(() => this.store.data.repo.searchEval);

  readonly lastRelease = computed(() => {
    const tags = [...this.store.data.repo.releases.tags].sort((a, b) => b.at.localeCompare(a.at));
    const last = tags[0];
    if (!last) return { value: '—', detail: 'No release tag yet' };
    const age = daysBetween(last.at, this.store.now);
    return {
      value: `v${last.runtime}`,
      detail: `Toolkit ${last.toolkit} · ${formatAgo(age)}`,
    };
  });

  readonly bySeverity = computed(() =>
    SEVERITIES.map((severity) => ({
      severity,
      tag: severityTag(severity),
      icon: severityIcon(severity),
      count: this.store.recommendations().filter((r) => r.severity === severity).length,
    })).filter((s) => s.count > 0),
  );

  readonly statusChart = computed(() =>
    barChart(
      this.theme,
      ['Components'],
      this.statusCounts().map((s, index) => ({
        label: capitalize(s.status),
        data: [s.count],
        color: this.theme.categorical[index],
      })),
      { horizontal: true, stacked: true },
    ),
  );

  readonly statusSummary = computed(() =>
    `${this.components().length} components in the catalogue: ` +
    this.statusCounts().map((s) => `${s.count} ${s.status}`).join(', ') + '.',
  );

  readonly statusTable = computed(() => ({
    columns: ['Status', 'Components'],
    rows: this.statusCounts().map((s) => [capitalize(s.status), s.count]),
  }));
}
