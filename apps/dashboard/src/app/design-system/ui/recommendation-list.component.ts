import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Recommendation } from '@pds-internal/insights';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { capitalize, drillParams, severityIcon, severityTag } from '../insights.format';
import { SECTIONS } from '../insights.store';

/** Recommendations as a list: severity, title, why, Details (drawer) and Open in section. */
@Component({
  selector: 'app-recommendation-list',
  standalone: true,
  imports: [RouterLink, ButtonModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-layout o-layout--block' },
  template: `
    <ul class="o-flex o-flex--y o-layout o-layout--gap-0">
      @for (rec of shown(); track rec.id) {
        <li class="o-flex o-flex--y o-layout o-layout--gap-1 o-layout--padding-top-2 o-layout--padding-bottom-2 u-border-bottom">
          <div class="o-flex o-flex--wrap o-flex--align-items-center o-layout o-layout--gap-2">
            <p-tag [severity]="tag(rec)" [value]="label(rec)" [icon]="icon(rec)" />
            @if (rec.provenance === 'demo') {
              <p-tag severity="contrast" value="Demo" />
            }
            <p
              role="heading"
              [attr.aria-level]="headingLevel()"
              class="u-text-label-lg o-layout o-layout--margin-0"
            >
              {{ rec.title }}
            </p>
          </div>
          <p class="u-text-body-sm o-layout o-layout--margin-0">{{ rec.why }}</p>
          <div class="o-flex o-flex--wrap o-layout o-layout--gap-1">
            <a
              pButton
              [text]="true"
              size="small"
              [routerLink]="[]"
              [queryParams]="{ rec: rec.id }"
              [attr.aria-label]="'Details: ' + rec.title"
            >
              <i class="bi bi-layout-sidebar-inset-reverse" aria-hidden="true"></i>
              <span>Details</span>
            </a>
            @if (showSectionLink()) {
              <a
                pButton
                [text]="true"
                size="small"
                [routerLink]="['/design-system', rec.target.section]"
                [queryParams]="params(rec)"
                [attr.aria-label]="'Open in ' + sectionLabel(rec) + ': ' + rec.title"
              >
                <i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>
                <span>Open in {{ sectionLabel(rec) }}</span>
              </a>
            }
          </div>
        </li>
      }
    </ul>
    @if (hidden() > 0) {
      <a
        pButton
        [text]="true"
        size="small"
        routerLink="/design-system/recommendations"
        class="o-layout o-layout--margin-top-2"
      >
        <span>{{ hidden() }} more in Recommendations</span>
      </a>
    }
  `,
})
export class RecommendationListComponent {
  readonly recommendations = input.required<Recommendation[]>();
  readonly limit = input<number | null>(null);
  readonly headingLevel = input(3);
  readonly showSectionLink = input(true);

  readonly shown = computed(() => {
    const limit = this.limit();
    return limit === null ? this.recommendations() : this.recommendations().slice(0, limit);
  });
  readonly hidden = computed(() => this.recommendations().length - this.shown().length);

  tag(rec: Recommendation) {
    return severityTag(rec.severity);
  }

  icon(rec: Recommendation) {
    return severityIcon(rec.severity);
  }

  label(rec: Recommendation) {
    return capitalize(rec.severity);
  }

  params(rec: Recommendation) {
    return drillParams(rec.target);
  }

  sectionLabel(rec: Recommendation) {
    return SECTIONS.find((s) => s.id === rec.target.section)?.label ?? rec.target.section;
  }
}
