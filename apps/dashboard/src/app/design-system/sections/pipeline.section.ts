import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CandidateFact, Recommendation } from '@pds-internal/insights';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { readChartTheme } from '../../shared/chart-theme';
import { capitalize, daysBetween, formatAge, listSentence, severityIcon, severityTag } from '../insights.format';
import { InsightsStore } from '../insights.store';
import { ChartCardComponent } from '../ui/chart-card.component';
import { barChart } from '../ui/chart-options';
import { EmptyPanelComponent } from '../ui/empty-panel.component';
import { SectionRecommendationsComponent } from '../ui/section-recommendations.component';

const FUNNEL = ['approved', 'submitted', 'accepted', 'promoted', 'figma-returned'] as const;
type FunnelStage = (typeof FUNNEL)[number];

const STAGE_LABEL: Record<FunnelStage, string> = {
  approved: 'Approved',
  submitted: 'Submitted',
  accepted: 'Accepted',
  promoted: 'Promoted',
  'figma-returned': 'Back in Figma',
};

/** Whether a candidate went through a funnel stage (current stage or a later date). */
export function reached(candidate: CandidateFact, stage: FunnelStage): boolean {
  switch (stage) {
    case 'approved':
      return !['use-existing', 'app-specific'].includes(candidate.stage);
    case 'submitted':
      return Boolean(candidate.submittedAt) || ['submitted', 'accepted', 'kept-local', 'promoted', 'figma-returned'].includes(candidate.stage);
    case 'accepted':
      return ['accepted', 'promoted', 'figma-returned'].includes(candidate.stage);
    case 'promoted':
      return Boolean(candidate.promotedAt) || ['promoted', 'figma-returned'].includes(candidate.stage);
    case 'figma-returned':
      return Boolean(candidate.figmaReturnedAt) || candidate.stage === 'figma-returned';
  }
}

/** Latest dated event of a candidate. */
export function lastEvent(candidate: CandidateFact): string {
  return [candidate.decidedAt, candidate.submittedAt, candidate.reviewedAt, candidate.promotedAt, candidate.figmaReturnedAt]
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1) ?? candidate.decidedAt;
}

@Component({
  selector: 'app-pipeline-section',
  standalone: true,
  imports: [
    RouterLink, ButtonModule, CardModule, TableModule, TagModule,
    ChartCardComponent, EmptyPanelComponent, SectionRecommendationsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <h2 class="u-text-heading-md o-layout o-layout--margin-0">Pipeline</h2>
    <app-section-recommendations section="pipeline" />

    @if (candidates().length === 0) {
      <app-empty-panel heading="No candidate in the pipeline" description="Candidate records appear once a team proposes a component." />
    } @else {
      <app-chart-card
        heading="Candidate funnel"
        [summary]="funnelSummary()"
        type="bar"
        [chart]="funnelChart()"
        [table]="funnelTable()"
        height="14rem"
      />

      <p-card>
        <ng-template #title>
          <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Candidates ({{ candidates().length }})</h3>
        </ng-template>
        <ng-template #subtitle>Age is the time since the last recorded step.</ng-template>
        <div class="o-layout o-layout--overflow-x-auto">
          <p-table [value]="rows()" size="small">
            <ng-template #header>
              <tr><th scope="col">Candidate</th><th scope="col">Team</th><th scope="col">Stage</th><th scope="col">Age</th><th scope="col">Attention</th></tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <th scope="row">
                  <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ candidate: row.id }">{{ row.componentId }}</a>
                </th>
                <td>{{ row.team }}</td>
                <td><p-tag [severity]="row.stage === 'withdrawn' ? 'secondary' : 'info'" [value]="row.stageLabel" /></td>
                <td>{{ row.age }}</td>
                <td>
                  @if (row.rec; as rec) {
                    <p-tag [severity]="tag(rec)" [icon]="icon(rec)" [value]="rec.severity + ': ' + rec.rule" />
                  } @else {
                    —
                  }
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>
    }
  `,
})
export class PipelineSectionComponent {
  protected readonly store = inject(InsightsStore);
  private readonly theme = readChartTheme();

  readonly candidates = computed(() => this.store.data.repo.candidates);

  private readonly funnel = computed(() =>
    FUNNEL.map((stage) => ({ stage, count: this.candidates().filter((c) => reached(c, stage)).length })),
  );

  // Ordered stages: the ordinal ramp, one step per stage.
  readonly funnelChart = computed(() =>
    barChart(
      this.theme,
      this.funnel().map((f) => STAGE_LABEL[f.stage]),
      [{ label: 'Candidates', data: this.funnel().map((f) => f.count), color: this.theme.ordinal }],
      { horizontal: true },
    ),
  );

  readonly funnelSummary = computed(
    () =>
      'Candidates that reached each stage: ' +
      listSentence(this.funnel().map((f) => `${STAGE_LABEL[f.stage].toLowerCase()} ${f.count}`)) +
      '.',
  );

  readonly funnelTable = computed(() => ({
    columns: ['Stage', 'Candidates'],
    rows: this.funnel().map((f) => [STAGE_LABEL[f.stage], f.count]),
  }));

  readonly rows = computed(() =>
    this.candidates()
      .map((c) => ({
        ...c,
        stageLabel: capitalize(c.stage.replace('-', ' ')),
        age: formatAge(daysBetween(lastEvent(c), this.store.now)),
        rec: this.store.recommendations().find((r) => r.target.candidate === c.id),
      }))
      .sort((a, b) => Number(Boolean(b.rec)) - Number(Boolean(a.rec)) || a.id.localeCompare(b.id)),
  );

  tag(rec: Recommendation) {
    return severityTag(rec.severity);
  }

  icon(rec: Recommendation) {
    return severityIcon(rec.severity);
  }
}
