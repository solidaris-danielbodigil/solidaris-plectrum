import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { LocalComponent } from '@pds-internal/insights';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { readChartTheme } from '../../shared/chart-theme';
import { capitalize, listSentence, type TagSeverity } from '../insights.format';
import { InsightsStore } from '../insights.store';
import { ChartCardComponent } from '../ui/chart-card.component';
import { barChart } from '../ui/chart-options';
import { EmptyPanelComponent } from '../ui/empty-panel.component';
import { SectionRecommendationsComponent } from '../ui/section-recommendations.component';

/** Ordered: none < possible < likely; unknown sits apart in the de-emphasis gray. */
const POTENTIALS: LocalComponent['reusePotential'][] = ['none', 'possible', 'likely', 'unknown'];

const POTENTIAL_TAG: Record<LocalComponent['reusePotential'], TagSeverity> = {
  none: 'secondary',
  possible: 'info',
  likely: 'success',
  unknown: 'contrast',
};

@Component({
  selector: 'app-local-section',
  standalone: true,
  imports: [
    RouterLink, ButtonModule, CardModule, TableModule, TagModule,
    ChartCardComponent, EmptyPanelComponent, SectionRecommendationsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <h2 class="u-text-heading-md o-layout o-layout--margin-0">Local components</h2>
    <app-section-recommendations section="local" />

    @if (locals().length === 0) {
      <app-empty-panel
        heading="No local components reported"
        description="Applications list the components they keep locally in their adoption report."
      />
    } @else {
      <div class="o-flex o-flex--y o-flex--row@lg o-layout o-layout--gap-3">
        <app-chart-card
          class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1"
          heading="Local components per application"
          [summary]="perAppSummary()"
          type="bar"
          [chart]="perAppChart()"
          [table]="perAppTable()"
        />
        <p-card class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1 o-layout o-layout--min-w-0">
          <ng-template #title>
            <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Similar across teams ({{ clusters().length }})</h3>
          </ng-template>
          <ng-template #subtitle>Local components that look alike in different teams: candidates to share.</ng-template>
          @if (clusters().length === 0) {
            <p class="u-text-body-md o-layout o-layout--margin-0">No similar local components across teams.</p>
          } @else {
            <div class="o-layout o-layout--overflow-x-auto">
              <p-table [value]="clusters()" size="small">
                <ng-template #header>
                  <tr><th scope="col">Cluster</th><th scope="col">Teams</th><th scope="col">Score</th><th scope="col">Near core</th></tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <th scope="row">
                      <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ cluster: row.id }">{{ row.label }}</a>
                    </th>
                    <td>{{ row.teams.join(', ') }}</td>
                    <td>{{ row.score }}</td>
                    <td>{{ row.core || '—' }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          }
        </p-card>
      </div>

      <p-card>
        <ng-template #title>
          <h3 class="u-text-heading-xs o-layout o-layout--margin-0">All local components ({{ locals().length }})</h3>
        </ng-template>
        <div class="o-layout o-layout--overflow-x-auto">
          <p-table [value]="locals()" size="small">
            <ng-template #header>
              <tr><th scope="col">Component</th><th scope="col">Application</th><th scope="col">Reuse potential</th><th scope="col">Description</th></tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <th scope="row">
                  <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ component: row.id }">{{ row.name }}</a>
                </th>
                <td>{{ appLabel(row.application) }}</td>
                <td><p-tag [severity]="potentialTag(row.reusePotential)" [value]="row.reusePotential" /></td>
                <td>{{ row.description }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>
    }
  `,
})
export class LocalSectionComponent {
  protected readonly store = inject(InsightsStore);
  private readonly theme = readChartTheme();

  readonly locals = computed(() => this.store.usage().localComponents);
  private readonly apps = computed(() => this.store.applications());

  private readonly perApp = computed(() =>
    this.apps().map((app) => ({
      app,
      counts: POTENTIALS.map(
        (p) => this.locals().filter((l) => l.application === app.id && l.reusePotential === p).length,
      ),
    })),
  );

  readonly perAppChart = computed(() => {
    // Ordinal ramp for the ordered levels (none → likely), gray for unknown.
    const colors = [this.theme.ordinal[0], this.theme.ordinal[2], this.theme.ordinal[4], this.theme.neutral];
    return barChart(
      this.theme,
      this.perApp().map((p) => p.app.label),
      POTENTIALS.map((potential, index) => ({
        label: `Reuse ${potential}`,
        data: this.perApp().map((p) => p.counts[index]),
        color: colors[index],
      })),
      { stacked: true, horizontal: true },
    );
  });

  readonly perAppSummary = computed(
    () =>
      listSentence(
        this.perApp().map((p) => {
          const total = p.counts.reduce((a, b) => a + b, 0);
          const likely = p.counts[2];
          return `${p.app.label} ${total} (${likely} likely reusable)`;
        }),
      ) + '.',
  );

  readonly perAppTable = computed(() => ({
    columns: ['Application', ...POTENTIALS.map(capitalize), 'Total'],
    rows: this.perApp().map((p) => [p.app.label, ...p.counts, p.counts.reduce((a, b) => a + b, 0)]),
  }));

  readonly clusters = computed(() =>
    this.store.clusters().map((c) => ({
      ...c,
      label: c.members.map((m) => this.store.componentName(m)).join(' + '),
      core: [...new Set(c.coreMatches.map((m) => this.store.componentName(m.core)))].join(', '),
    })),
  );

  appLabel(id: string) {
    return this.store.appLabel(id);
  }

  potentialTag(potential: LocalComponent['reusePotential']) {
    return POTENTIAL_TAG[potential];
  }
}
