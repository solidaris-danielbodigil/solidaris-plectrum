import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ComponentFact } from '@pds-internal/insights';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { readChartTheme } from '../../shared/chart-theme';
import { capitalize, formatShortDate, listSentence, statusTag } from '../insights.format';
import { COMPONENT_STATUSES, InsightsStore } from '../insights.store';
import { ChartCardComponent } from '../ui/chart-card.component';
import { barChart, lineChart } from '../ui/chart-options';
import { EmptyPanelComponent } from '../ui/empty-panel.component';
import { SectionRecommendationsComponent } from '../ui/section-recommendations.component';

@Component({
  selector: 'app-adoption-section',
  standalone: true,
  imports: [
    RouterLink, ButtonModule, CardModule, TableModule, TagModule,
    ChartCardComponent, EmptyPanelComponent, SectionRecommendationsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <h2 class="u-text-heading-md o-layout o-layout--margin-0">Adoption</h2>
    <app-section-recommendations section="adoption" />

    @if (store.source() === 'reported' && !store.hasReported) {
      <app-empty-panel
        heading="No adoption reports yet"
        description="Application usage is unknown until a reviewed report arrives. Switch to Demo to preview the page."
      />
    } @else if (store.usage().observations.length === 0) {
      <app-empty-panel
        heading="No usage observed in available reports"
        description="This describes the available reports only; applications without a report remain unknown."
      />
    } @else {
      <p-card>
        <ng-template #title>
          <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Component × application</h3>
        </ng-template>
        <ng-template #subtitle>
          Occurrences in the latest report of each application. Select a component or an application for details.
        </ng-template>
        <div class="o-layout o-layout--overflow-x-auto">
          <p-table [value]="matrix()" size="small" dataKey="id">
            <ng-template #header>
              <tr>
                <th scope="col">Component</th>
                @for (app of apps(); track app.id) {
                  <th scope="col">
                    <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ app: app.id }">{{ app.label }}</a>
                  </th>
                }
                <th scope="col">Total</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <th scope="row">
                  <div class="o-flex o-flex--wrap o-flex--align-items-center o-layout o-layout--gap-1">
                    <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ component: row.id }">{{ row.name }}</a>
                    @if (row.status !== 'core') {
                      <p-tag [severity]="tag(row.status)" [value]="row.status" />
                    }
                  </div>
                </th>
                @for (cell of row.cells; track $index) {
                  <td>{{ cell || '—' }}</td>
                }
                <td>{{ row.total }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>

      <div class="o-flex o-flex--y o-flex--row@lg o-layout o-layout--gap-3">
        <app-chart-card
          class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1"
          heading="Components used per application"
          [summary]="perAppSummary()"
          type="bar"
          [chart]="perAppChart()"
          [table]="perAppTable()"
        />
        <app-chart-card
          class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1"
          heading="Adoption over time"
          [summary]="historySummary()"
          type="line"
          [chart]="historyChart()"
          [table]="historyTable()"
        />
      </div>
    }

    <div class="o-flex o-flex--y o-flex--row@lg o-layout o-layout--gap-3">
      @if (store.source() === 'demo' || store.hasReported) {
      <p-card class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1 o-layout o-layout--min-w-0">
        <ng-template #title>
          <h3 class="u-text-heading-xs o-layout o-layout--margin-0">No observed usage ({{ unused().length }})</h3>
        </ng-template>
        <ng-template #subtitle>Not found in this source, the repository scan or component dependencies. Missing reports leave usage unknown.</ng-template>
        @if (unused().length === 0) {
          <p class="u-text-body-md o-layout o-layout--margin-0">No core component meets this filter.</p>
        } @else {
          <ul class="o-flex o-flex--wrap o-layout o-layout--gap-1">
            @for (c of unused(); track c.id) {
              <li><a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ component: c.id }">{{ c.name }}</a></li>
            }
          </ul>
        }
      </p-card>
      }
      <p-card class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1 o-layout o-layout--min-w-0">
        <ng-template #title>
          <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Deprecated ({{ deprecated().length }})</h3>
        </ng-template>
        <ng-template #subtitle>Deprecated components, their replacement and where they are still used.</ng-template>
        @if (deprecated().length === 0) {
          <p class="u-text-body-md o-layout o-layout--margin-0">No deprecated component.</p>
        } @else {
          <div class="o-layout o-layout--overflow-x-auto">
            <p-table [value]="deprecated()" size="small">
              <ng-template #header>
                <tr><th scope="col">Component</th><th scope="col">Replacement</th><th scope="col">In use</th></tr>
              </ng-template>
              <ng-template #body let-row>
                <tr>
                  <th scope="row">
                    <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ component: row.id }">{{ row.name }}</a>
                  </th>
                  <td>
                    @if (row.replacementId) {
                      <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ component: row.replacementId }">{{ row.replacement }}</a>
                    } @else {
                      —
                    }
                  </td>
                  <td>
                    @if (row.inUse.length > 0) {
                      <p-tag severity="warn" icon="bi bi-exclamation-triangle" [value]="row.inUse.join(', ')" />
                    } @else {
                      <p-tag severity="secondary" [value]="store.source() === 'demo' ? 'Not observed in demo' : store.hasReported ? 'Not observed in reports' : 'Unknown'" />
                    }
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        }
      </p-card>
      <p-card class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1 o-layout o-layout--min-w-0">
        <ng-template #title>
          <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Not measurable ({{ notMeasurable().length }})</h3>
        </ng-template>
        <ng-template #subtitle>The scanner cannot detect these components in application code.</ng-template>
        @if (notMeasurable().length === 0) {
          <p class="u-text-body-md o-layout o-layout--margin-0">Every component is measurable.</p>
        } @else {
          <ul class="o-flex o-flex--wrap o-layout o-layout--gap-1">
            @for (c of notMeasurable(); track c.id) {
              <li><a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ component: c.id }">{{ c.name }}</a></li>
            }
          </ul>
        }
      </p-card>
    </div>
  `,
})
export class AdoptionSectionComponent {
  protected readonly store = inject(InsightsStore);
  private readonly theme = readChartTheme();
  private readonly components = this.store.data.repo.components;

  readonly apps = computed(() => this.store.applications());

  readonly matrix = computed(() => {
    const index = this.store.observationIndex();
    return this.components
      .map((c) => {
        const cells = this.apps().map((app) => index.get(`${app.id}|${c.id}`) ?? 0);
        return { id: c.id, name: c.name, status: c.status, cells, total: cells.reduce((a, b) => a + b, 0) };
      })
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  });

  private readonly perApp = computed(() =>
    this.apps().map((app) => {
      const used = new Set(
        this.store.usage().observations
          .filter((o) => o.application === app.id && o.count > 0)
          .map((o) => o.componentId),
      );
      return {
        app,
        byStatus: COMPONENT_STATUSES.map(
          (status) => this.components.filter((c) => c.status === status && used.has(c.id)).length,
        ),
        total: used.size,
      };
    }),
  );

  readonly perAppChart = computed(() =>
    barChart(
      this.theme,
      this.perApp().map((p) => p.app.label),
      COMPONENT_STATUSES.map((status, index) => ({
        label: capitalize(status),
        data: this.perApp().map((p) => p.byStatus[index]),
        color: this.theme.categorical[index],
      })),
      { stacked: true },
    ),
  );

  readonly perAppSummary = computed(
    () => listSentence(this.perApp().map((p) => `${p.app.label} uses ${p.total} components`)) + '.',
  );

  readonly perAppTable = computed(() => ({
    columns: ['Application', ...COMPONENT_STATUSES.map(capitalize), 'Total'],
    rows: this.perApp().map((p) => [p.app.label, ...p.byStatus, p.total]),
  }));

  private readonly history = computed(() => this.store.data.repo.scanHistory);

  private usedCount(usedIn: Record<string, string[]>, app: string): number {
    return Object.values(usedIn).filter((apps) => apps.includes(app)).length;
  }

  readonly historyChart = computed(() =>
    lineChart(
      this.theme,
      this.history().map((h) => formatShortDate(h.at)),
      this.apps().map((app, index) => ({
        label: app.label,
        data: this.history().map((h) => this.usedCount(h.usedIn, app.id)),
        color: this.theme.categorical[index],
      })),
    ),
  );

  readonly historySummary = computed(() => {
    const history = this.history();
    if (history.length === 0) return 'No scan history in this checkout (shallow clone).';
    const last = history[history.length - 1];
    return (
      `Components found by the repository scan, ${history.length} points. Latest: ` +
      listSentence(this.apps().map((app) => `${app.label} ${this.usedCount(last.usedIn, app.id)}`)) +
      '.'
    );
  });

  readonly historyTable = computed(() => ({
    columns: ['Scan', 'Revision', ...this.apps().map((a) => a.label)],
    rows: this.history().map((h) => [
      formatShortDate(h.at),
      h.revision.slice(0, 7),
      ...this.apps().map((app) => this.usedCount(h.usedIn, app.id)),
    ]),
  }));

  readonly unused = computed(() =>
    this.components.filter(
      (c) =>
        c.status === 'core' &&
        c.measurable &&
        (this.store.appsByComponent().get(c.id) ?? []).length === 0 &&
        c.scanUsedIn.length === 0 &&
        c.usedBy.length === 0,
    ),
  );

  readonly notMeasurable = computed(() => this.components.filter((c) => !c.measurable));

  readonly deprecated = computed(() =>
    this.components
      .filter((c) => c.status === 'deprecated')
      .map((c) => ({
        ...c,
        replacement: c.replacementId ? this.store.componentName(c.replacementId) : null,
        inUse: (this.store.appsByComponent().get(c.id) ?? []).map((id) => this.store.appLabel(id)),
      })),
  );

  tag(status: ComponentFact['status']) {
    return statusTag(status);
  }
}
