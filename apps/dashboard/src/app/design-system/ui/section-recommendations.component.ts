import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { SectionId } from '@pds-internal/insights';
import { CardModule } from 'primeng/card';
import { InsightsStore } from '../insights.store';
import { RecommendationListComponent } from './recommendation-list.component';

/** Proactive recommendations that target the current section, shown at its top. */
@Component({
  selector: 'app-section-recommendations',
  standalone: true,
  imports: [CardModule, RecommendationListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-layout o-layout--block' },
  template: `
    @if (recommendations().length > 0) {
      <p-card>
        <ng-template #title>
          <h3 class="u-text-heading-xs o-layout o-layout--margin-0">
            Recommendations for this section ({{ recommendations().length }})
          </h3>
        </ng-template>
        <app-recommendation-list
          [recommendations]="recommendations()"
          [limit]="3"
          [headingLevel]="4"
          [showSectionLink]="false"
        />
      </p-card>
    }
  `,
})
export class SectionRecommendationsComponent {
  private readonly store = inject(InsightsStore);
  readonly section = input.required<SectionId>();
  readonly recommendations = computed(() => this.store.recommendationsFor(this.section()));
}
