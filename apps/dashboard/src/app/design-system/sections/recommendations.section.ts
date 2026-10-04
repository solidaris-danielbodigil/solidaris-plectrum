import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { RuleId, Severity } from '@pds-internal/insights';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { capitalize } from '../insights.format';
import { InsightsStore, SEVERITIES } from '../insights.store';
import { EmptyPanelComponent } from '../ui/empty-panel.component';
import { RecommendationListComponent } from '../ui/recommendation-list.component';

@Component({
  selector: 'app-recommendations-section',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, SelectModule, EmptyPanelComponent, RecommendationListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <h2 class="u-text-heading-md o-layout o-layout--margin-0">Recommendations</h2>

    <div class="o-flex o-flex--wrap o-flex--align-items-flex-end o-layout o-layout--gap-2" role="group" aria-label="Filter recommendations">
      <div class="o-flex o-flex--y o-layout o-layout--gap-1">
        <label class="u-text-label-md" for="rec-severity">Severity</label>
        <p-select inputId="rec-severity" [options]="severityOptions" optionLabel="label" optionValue="value"
          [ngModel]="severity()" (ngModelChange)="severity.set($event)" [showClear]="true" placeholder="All severities" />
      </div>
      <div class="o-flex o-flex--y o-layout o-layout--gap-1">
        <label class="u-text-label-md" for="rec-rule">Rule</label>
        <p-select inputId="rec-rule" [options]="ruleOptions()" optionLabel="label" optionValue="value"
          [ngModel]="rule()" (ngModelChange)="rule.set($event)" [showClear]="true" placeholder="All rules" />
      </div>
      <div class="o-flex o-flex--y o-layout o-layout--gap-1">
        <label class="u-text-label-md" for="rec-app">Application</label>
        <p-select inputId="rec-app" [options]="appOptions()" optionLabel="label" optionValue="value"
          [ngModel]="app()" (ngModelChange)="app.set($event)" [showClear]="true" placeholder="All applications" />
      </div>
      @if (severity() || rule() || app()) {
        <button pButton type="button" [text]="true" (click)="clear()">
          <i class="bi bi-x-circle" aria-hidden="true"></i>
          <span>Clear filters</span>
        </button>
      }
    </div>

    <p class="u-text-body-sm o-layout o-layout--margin-0" aria-live="polite">
      {{ filtered().length }} of {{ store.recommendations().length }} recommendations
    </p>

    @if (store.recommendations().length === 0) {
      <app-empty-panel heading="Nothing to act on" description="No rule fires for this source." />
    } @else if (filtered().length === 0) {
      <app-empty-panel heading="No recommendation matches these filters" />
    } @else {
      <p-card>
        <app-recommendation-list [recommendations]="filtered()" [headingLevel]="3" />
      </p-card>
    }
  `,
})
export class RecommendationsSectionComponent {
  protected readonly store = inject(InsightsStore);

  readonly severity = signal<Severity | null>(null);
  readonly rule = signal<RuleId | null>(null);
  readonly app = signal<string | null>(null);

  readonly severityOptions = SEVERITIES.map((s) => ({ label: capitalize(s), value: s }));

  readonly ruleOptions = computed(() =>
    [...new Set(this.store.recommendations().map((r) => r.rule))].sort().map((rule) => ({ label: rule, value: rule })),
  );

  readonly appOptions = computed(() =>
    [...new Set(this.store.recommendations().map((r) => r.target.app).filter((a): a is string => Boolean(a)))]
      .sort()
      .map((id) => ({ label: this.store.appLabel(id), value: id })),
  );

  readonly filtered = computed(() =>
    this.store.recommendations().filter(
      (r) =>
        (!this.severity() || r.severity === this.severity()) &&
        (!this.rule() || r.rule === this.rule()) &&
        (!this.app() || r.target.app === this.app()),
    ),
  );

  clear(): void {
    this.severity.set(null);
    this.rule.set(null);
    this.app.set(null);
  }
}
