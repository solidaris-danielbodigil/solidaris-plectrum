import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { readChartTheme } from '../../shared/chart-theme';
import { capitalize, daysBetween, formatAge, formatDate, formatShortDate, type TagSeverity } from '../insights.format';
import { COMPONENT_STATUSES, InsightsStore } from '../insights.store';
import { ChartCardComponent } from '../ui/chart-card.component';
import { lineChart } from '../ui/chart-options';
import { KpiTileComponent } from '../ui/kpi-tile.component';
import { SectionRecommendationsComponent } from '../ui/section-recommendations.component';

@Component({
  selector: 'app-tokens-releases-section',
  standalone: true,
  imports: [
    ButtonModule, CardModule, TableModule, TagModule, TimelineModule,
    ChartCardComponent, KpiTileComponent, SectionRecommendationsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <h2 class="u-text-heading-md o-layout o-layout--margin-0">Tokens &amp; releases</h2>
    <app-section-recommendations section="tokens-releases" />

    <div class="o-flex o-flex--wrap o-layout o-layout--gap-3" role="list" aria-label="Token and release key figures">
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Token names" [value]="tokens().names" detail="Variables published by the token pipeline" />
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Figma sync" [value]="sync()?.stage ? capitalize(sync()!.stage) : 'No sync yet'"
        [detail]="sync() ? 'Last run ' + formatDate(sync()!.generatedAt) : null">
        @if (sync(); as s) {
          <div class="o-flex o-flex--wrap o-layout o-layout--gap-1">
            @for (check of s.checks; track check.id) {
              <p-tag [severity]="checkTag(check.status)" [icon]="checkIcon(check.status)" [value]="check.name" />
            }
          </div>
          @if (s.runUrl) {
            <a pButton [text]="true" size="small" [href]="s.runUrl" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-github" aria-hidden="true"></i>
              <span>Workflow run</span>
            </a>
          }
        }
      </app-kpi-tile>
      <app-kpi-tile role="listitem" class="o-flex__item o-flex__item--grow-1"
        label="Code-owned token proposals" [value]="tokens().proposals.count"
        [detail]="tokens().proposals.since ? 'Pending since ' + formatDate(tokens().proposals.since) + ' (' + formatAge(proposalAge()) + ')' : 'None pending'" />
    </div>

    <div class="o-flex o-flex--y o-flex--row@lg o-layout o-layout--gap-3">
      <p-card class="o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1 o-layout o-layout--min-w-0">
        <ng-template #title>
          <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Releases ({{ tags().length }})</h3>
        </ng-template>
        <ng-template #subtitle>Runtime and toolkit versions, newest first.</ng-template>
        @if (tags().length === 0) {
          <p class="u-text-body-md o-layout o-layout--margin-0">No release tag yet.</p>
        } @else {
          <p-timeline [value]="tags()">
            <ng-template #content let-tag>
              <p class="u-text-label-md o-layout o-layout--margin-0">v{{ tag.runtime }} · toolkit {{ tag.toolkit }}</p>
              <p class="u-text-body-sm o-layout o-layout--margin-0">{{ formatDate(tag.at) }}</p>
            </ng-template>
          </p-timeline>
        }
      </p-card>

      <div class="o-flex o-flex--y o-flex__item o-flex__item--grow-1 o-flex__item--shrink-1 o-layout o-layout--gap-3 o-layout--min-w-0">
        <p-card>
          <ng-template #title>
            <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Pending changesets ({{ pending().length }})</h3>
          </ng-template>
          @if (pending().length === 0) {
            <p class="u-text-body-md o-layout o-layout--margin-0">Nothing waiting for the next release.</p>
          } @else {
            <div class="o-layout o-layout--overflow-x-auto">
              <p-table [value]="pending()" size="small">
                <ng-template #header>
                  <tr><th scope="col">Changeset</th><th scope="col">Bumps</th><th scope="col">Waiting</th></tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <th scope="row">{{ row.id }}</th>
                    <td>{{ row.bumpText }}</td>
                    <td>{{ row.age }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          }
        </p-card>
        <app-chart-card
          heading="Catalogue by status over time"
          [summary]="catalogueSummary()"
          type="line"
          [chart]="catalogueChart()"
          [table]="catalogueTable()"
        />
      </div>
    </div>
  `,
})
export class TokensReleasesSectionComponent {
  protected readonly store = inject(InsightsStore);
  private readonly theme = readChartTheme();

  protected readonly capitalize = capitalize;
  protected readonly formatDate = formatDate;
  protected readonly formatAge = formatAge;

  readonly tokens = computed(() => this.store.data.repo.tokens);
  readonly sync = computed(() => this.tokens().sync);
  readonly proposalAge = computed(() => daysBetween(this.tokens().proposals.since, this.store.now));

  readonly tags = computed(() => [...this.store.data.repo.releases.tags].sort((a, b) => b.at.localeCompare(a.at)));

  readonly pending = computed(() =>
    this.store.data.repo.releases.pending.map((p) => ({
      ...p,
      bumpText: p.bumps.map((b) => `${b.packageName} ${b.bump}`).join(', '),
      age: formatAge(daysBetween(p.since, this.store.now)),
    })),
  );

  private readonly history = computed(() => this.store.data.repo.catalogueHistory);

  readonly catalogueChart = computed(() =>
    lineChart(
      this.theme,
      this.history().map((h) => formatShortDate(h.at)),
      COMPONENT_STATUSES.map((status, index) => ({
        label: capitalize(status),
        data: this.history().map((h) => h.byStatus[status] ?? 0),
        color: this.theme.categorical[index],
      })),
    ),
  );

  readonly catalogueSummary = computed(() => {
    const history = this.history();
    const last = history.at(-1);
    if (!last) return 'No catalogue history in this checkout.';
    return (
      `${history.length} catalogue versions. Latest: ` +
      COMPONENT_STATUSES.map((s) => `${last.byStatus[s] ?? 0} ${s}`).join(', ') +
      '.'
    );
  });

  readonly catalogueTable = computed(() => ({
    columns: ['Date', 'Revision', ...COMPONENT_STATUSES.map(capitalize)],
    rows: this.history().map((h) => [
      formatShortDate(h.at),
      h.revision.slice(0, 7),
      ...COMPONENT_STATUSES.map((s) => h.byStatus[s] ?? 0),
    ]),
  }));

  /** Sync check statuses come as PASS / FAIL / SKIP (or success / failure). */
  checkTag(status: string): TagSeverity {
    const value = status.toLowerCase();
    if (['pass', 'passed', 'success', 'ok'].includes(value)) return 'success';
    if (['fail', 'failed', 'failure', 'error'].includes(value)) return 'danger';
    return 'secondary';
  }

  checkIcon(status: string): string {
    const tag = this.checkTag(status);
    return tag === 'success' ? 'bi bi-check2' : tag === 'danger' ? 'bi bi-x-lg' : 'bi bi-dash';
  }
}
