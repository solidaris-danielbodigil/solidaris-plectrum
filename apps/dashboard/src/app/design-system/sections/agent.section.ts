import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DEFAULT_THRESHOLDS, type AgentPoint } from '@pds-internal/insights';
import { readChartTheme } from '../../shared/chart-theme';
import { formatShortDate, listSentence, percent } from '../insights.format';
import { InsightsStore } from '../insights.store';
import { ChartCardComponent } from '../ui/chart-card.component';
import { barChart, barWithThreshold, lineChart } from '../ui/chart-options';
import { EmptyPanelComponent } from '../ui/empty-panel.component';
import { KpiTileComponent } from '../ui/kpi-tile.component';
import { SectionRecommendationsComponent } from '../ui/section-recommendations.component';

const COMMIT_KINDS = ['reuse', 'scaffold', 'advice'] as const;

function totalCalls(point: AgentPoint): number {
  return Object.values(point.tools).reduce((a, b) => a + b, 0);
}

@Component({
  selector: 'app-agent-section',
  standalone: true,
  imports: [ChartCardComponent, EmptyPanelComponent, KpiTileComponent, SectionRecommendationsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <h2 class="u-text-heading-md o-layout o-layout--margin-0">Agent &amp; MCP</h2>
    <app-section-recommendations section="agent" />

    @if (latest().length === 0) {
      <app-empty-panel
        heading="No agent activity in this source"
        description="Applications send agent totals (tool calls, lookups, commits helped) with their adoption report. Nothing identifies a person."
      />
    } @else {
      <div class="o-flex o-flex--wrap o-layout o-layout--gap-3" role="list" aria-label="Agent key figures">
        <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
          label="Tool calls (latest 30-day windows)" [value]="kpis().calls" [detail]="kpis().callsDetail" />
        <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
          label="Searches with no match" [value]="kpis().emptyRate + '%'" [detail]="kpis().emptyDetail" />
        <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
          label="Commits helped" [value]="kpis().commits" [detail]="kpis().commitsDetail" />
      </div>

      <div class="o-flex o-flex--y o-flex--row@lg o-layout o-layout--gap-3">
        <app-chart-card
          class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1"
          heading="Tool calls per 30-day window"
          [summary]="callsSummary()"
          type="line"
          [chart]="callsChart()"
          [table]="callsTable()"
        />
        <app-chart-card
          class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1"
          heading="Tool mix per application"
          [summary]="mixSummary()"
          type="bar"
          [chart]="mixChart()"
          [table]="mixTable()"
        />
      </div>

      <div class="o-flex o-flex--y o-flex--row@lg o-layout o-layout--gap-3">
        <app-chart-card
          class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1"
          heading="Searches with no match"
          [summary]="emptySummary()"
          type="bar"
          [chart]="emptyChart()"
          [table]="emptyTable()"
        />
        <app-chart-card
          class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1"
          heading="Commits the agent helped"
          [summary]="commitsSummary()"
          type="bar"
          [chart]="commitsChart()"
          [table]="commitsTable()"
        />
      </div>

      <app-chart-card
        heading="Most looked-up components"
        [summary]="lookupsSummary()"
        type="bar"
        [chart]="lookupsChart()"
        [table]="lookupsTable()"
        [height]="lookupsHeight()"
      />
    }
  `,
})
export class AgentSectionComponent {
  protected readonly store = inject(InsightsStore);
  private readonly theme = readChartTheme();
  private readonly tools = this.store.data.repo.mcpTools;

  private readonly apps = computed(() => this.store.applications());

  /** Latest window per application, in application order. */
  readonly latest = computed(() =>
    this.apps()
      .map((app) => ({ app, point: this.store.latestAgentByApp().get(app.id) }))
      .filter((entry): entry is { app: (typeof entry)['app']; point: AgentPoint } => entry.point !== undefined),
  );

  readonly kpis = computed(() => {
    const points = this.latest().map((l) => l.point);
    const calls = points.reduce((sum, p) => sum + totalCalls(p), 0);
    const searches = points.reduce((sum, p) => sum + (p.tools['search_components'] ?? 0), 0);
    const empty = points.reduce((sum, p) => sum + p.emptySearches, 0);
    const commits = points.reduce((sum, p) => sum + p.commits.total, 0);
    const reuse = points.reduce((sum, p) => sum + p.commits.reuse, 0);
    return {
      calls,
      callsDetail: `${points.reduce((sum, p) => sum + p.activeDays, 0)} active days across ${points.length} applications`,
      emptyRate: percent(empty, searches),
      emptyDetail: `${empty} of ${searches} component searches`,
      commits,
      commitsDetail: `${reuse} reused an existing component`,
    };
  });

  private readonly dates = computed(() =>
    [...new Set(this.store.usage().agentHistory.map((p) => p.observedAt))].sort(),
  );

  readonly callsChart = computed(() =>
    lineChart(
      this.theme,
      this.dates().map(formatShortDate),
      this.apps().map((app, index) => ({
        label: app.label,
        data: this.dates().map((date) => {
          const point = this.store.usage().agentHistory.find((p) => p.application === app.id && p.observedAt === date);
          return point ? totalCalls(point) : null;
        }),
        color: this.theme.categorical[index],
      })),
    ),
  );

  readonly callsSummary = computed(
    () =>
      'Total MCP tool calls in each 30-day window. Latest: ' +
      listSentence(this.latest().map((l) => `${l.app.label} ${totalCalls(l.point)}`)) +
      '.',
  );

  readonly callsTable = computed(() => ({
    columns: ['Window end', ...this.apps().map((a) => a.label)],
    rows: this.dates().map((date) => [
      formatShortDate(date),
      ...this.apps().map((app) => {
        const point = this.store.usage().agentHistory.find((p) => p.application === app.id && p.observedAt === date);
        return point ? totalCalls(point) : '—';
      }),
    ]),
  }));

  readonly mixChart = computed(() =>
    barChart(
      this.theme,
      this.latest().map((l) => l.app.label),
      this.tools.map((tool, index) => ({
        label: tool,
        data: this.latest().map((l) => l.point.tools[tool] ?? 0),
        color: this.theme.categorical[index],
      })),
      { stacked: true, horizontal: true },
    ),
  );

  readonly mixSummary = computed(() => {
    const unused = this.tools.filter((tool) => this.latest().every((l) => (l.point.tools[tool] ?? 0) === 0));
    return (
      'Calls per MCP tool in the latest window.' +
      (unused.length > 0 ? ` Never called: ${listSentence(unused)}.` : ' Every tool is used.')
    );
  });

  readonly mixTable = computed(() => ({
    columns: ['Application', ...this.tools],
    rows: this.latest().map((l) => [l.app.label, ...this.tools.map((tool) => l.point.tools[tool] ?? 0)]),
  }));

  private readonly emptyRates = computed(() =>
    this.latest().map((l) => ({
      app: l.app,
      empty: l.point.emptySearches,
      searches: l.point.tools['search_components'] ?? 0,
      rate: percent(l.point.emptySearches, l.point.tools['search_components'] ?? 0),
    })),
  );

  private readonly thresholdPercent = Math.round(DEFAULT_THRESHOLDS.catalogueGapRatio * 100);

  readonly emptyChart = computed(() =>
    barWithThreshold(
      this.theme,
      this.emptyRates().map((r) => r.app.label),
      { label: 'No-match rate', data: this.emptyRates().map((r) => r.rate), color: this.theme.categorical[0] },
      { label: `Catalogue gap threshold (${this.thresholdPercent}%)`, value: this.thresholdPercent, color: this.theme.muted },
      { percent: true },
    ),
  );

  readonly emptySummary = computed(() => {
    const over = this.emptyRates().filter((r) => r.rate >= this.thresholdPercent && r.empty >= DEFAULT_THRESHOLDS.catalogueGapMinEmpty);
    return (
      'Share of component searches that returned nothing; a high share points to a catalogue gap (queries are never recorded). ' +
      (over.length > 0
        ? `Above the ${this.thresholdPercent}% threshold: ${listSentence(over.map((r) => `${r.app.label} ${r.rate}%`))}.`
        : `No application is above the ${this.thresholdPercent}% threshold.`)
    );
  });

  readonly emptyTable = computed(() => ({
    columns: ['Application', 'No match', 'Searches', 'Rate'],
    rows: this.emptyRates().map((r) => [r.app.label, r.empty, r.searches, `${r.rate}%`]),
  }));

  readonly commitsChart = computed(() =>
    barChart(
      this.theme,
      this.latest().map((l) => l.app.label),
      COMMIT_KINDS.map((kind, index) => ({
        label: kind[0].toUpperCase() + kind.slice(1),
        data: this.latest().map((l) => l.point.commits[kind]),
        color: this.theme.categorical[index],
      })),
      { stacked: true },
    ),
  );

  readonly commitsSummary = computed(
    () =>
      'Commits in the latest window where the agent helped, by kind. ' +
      listSentence(this.latest().map((l) => `${l.app.label} ${l.point.commits.total} (${l.point.commits.reuse} reuse)`)) +
      '.',
  );

  readonly commitsTable = computed(() => ({
    columns: ['Application', 'Reuse', 'Scaffold', 'Advice', 'Total'],
    rows: this.latest().map((l) => [
      l.app.label,
      l.point.commits.reuse,
      l.point.commits.scaffold,
      l.point.commits.advice,
      l.point.commits.total,
    ]),
  }));

  private readonly lookups = computed(() => {
    const totals = new Map<string, { count: number; apps: Set<string> }>();
    for (const { point } of this.latest()) {
      for (const [id, count] of Object.entries(point.lookups)) {
        const entry = totals.get(id) ?? { count: 0, apps: new Set<string>() };
        entry.count += count;
        entry.apps.add(point.application);
        totals.set(id, entry);
      }
    }
    return [...totals.entries()]
      .map(([id, entry]) => {
        const notAdopted = [...entry.apps]
          .filter((app) => !(this.store.observationIndex().get(`${app}|${id}`) ?? 0))
          .map((app) => this.store.appLabel(app));
        const deprecated = this.store.componentById.get(id)?.status === 'deprecated';
        return { id, name: this.store.componentName(id), count: entry.count, notAdopted, deprecated };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  });

  readonly lookupsHeight = computed(() => `${Math.max(8, this.lookups().length * 2.5 + 3)}rem`);

  readonly lookupsChart = computed(() =>
    barChart(
      this.theme,
      this.lookups().map((l) => l.name),
      [{ label: 'Lookups', data: this.lookups().map((l) => l.count), color: this.theme.categorical[0] }],
      { horizontal: true },
    ),
  );

  readonly lookupsSummary = computed(() => {
    const flagged = this.lookups().filter((l) => l.deprecated || l.notAdopted.length > 0);
    return (
      'get_component lookups in the latest windows, all applications. ' +
      (flagged.length > 0
        ? `Looked up but not adopted or deprecated: ${listSentence(flagged.map((l) => l.name))} (see the data table).`
        : 'Every looked-up component is adopted where it was looked up.')
    );
  });

  readonly lookupsTable = computed(() => ({
    columns: ['Component', 'Lookups', 'Deprecated', 'Not adopted in'],
    rows: this.lookups().map((l) => [l.name, l.count, l.deprecated ? 'Yes' : 'No', l.notAdopted.join(', ') || '—']),
  }));
}
