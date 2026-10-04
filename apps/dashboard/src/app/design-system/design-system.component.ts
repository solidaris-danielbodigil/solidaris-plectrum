import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import type { Provenance, SectionId } from '@pds-internal/insights';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabsModule } from 'primeng/tabs';
import { map } from 'rxjs';
import { formatDate } from './insights.format';
import { InsightsStore, SECTIONS } from './insights.store';
import { AdoptionSectionComponent } from './sections/adoption.section';
import { AgentSectionComponent } from './sections/agent.section';
import { LocalSectionComponent } from './sections/local.section';
import { OverviewSectionComponent } from './sections/overview.section';
import { PipelineSectionComponent } from './sections/pipeline.section';
import { RecommendationsSectionComponent } from './sections/recommendations.section';
import { SearchSectionComponent } from './sections/search.section';
import { TokensReleasesSectionComponent } from './sections/tokens-releases.section';
import { DrillDrawerComponent } from './ui/drill-drawer.component';

/** Plectrum metrics: Core's view of usage, agent effect, pipeline and releases. */
@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    FormsModule,
    MessageModule,
    SelectButtonModule,
    TabsModule,
    AdoptionSectionComponent,
    AgentSectionComponent,
    LocalSectionComponent,
    OverviewSectionComponent,
    PipelineSectionComponent,
    RecommendationsSectionComponent,
    SearchSectionComponent,
    TokensReleasesSectionComponent,
    DrillDrawerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-flex o-flex--y o-layout o-layout--gap-3' },
  template: `
    <header class="o-flex o-flex--wrap o-flex--align-items-center o-flex--justify-content-space-between o-layout o-layout--gap-2">
      <div class="o-flex o-flex--y o-layout o-layout--gap-0-5">
        <h1 class="u-text-heading-lg o-layout o-layout--margin-0">Plectrum metrics</h1>
        <p class="u-text-body-sm o-layout o-layout--margin-0">
          Runtime v{{ store.data.versions.runtime }} · toolkit {{ store.data.versions.toolkit }} ·
          generated {{ generated }} at {{ store.data.revision.slice(0, 7) }}
        </p>
      </div>
      <div class="o-flex o-flex--align-items-center o-layout o-layout--gap-2">
        <span id="ds-source-label" class="u-text-label-md">Usage source</span>
        <p-selectButton
          [options]="sourceOptions"
          optionLabel="label"
          optionValue="value"
          [allowEmpty]="false"
          [ngModel]="store.source()"
          (ngModelChange)="setSource($event)"
          ariaLabelledBy="ds-source-label"
        />
      </div>
    </header>

    @if (store.source() === 'demo') {
      <p-message severity="warn" icon="bi bi-exclamation-triangle">
        {{ store.data.usage.demo.note }}
      </p-message>
    } @else if (!store.hasReported) {
      <p-message severity="info" icon="bi bi-info-circle">
        {{ store.data.usage.reported.note }} Repository facts (catalogue, search quality, pipeline, releases) are real.
      </p-message>
    }

    <p-tabs [value]="section()" (valueChange)="go($event)" [scrollable]="true">
      <p-tablist>
        @for (s of sections; track s.id) {
          <p-tab [value]="s.id">
            <span class="o-flex o-flex--align-items-center o-layout o-layout--gap-1">
              <i [class]="s.icon" aria-hidden="true"></i>
              <span>{{ s.label }}</span>
            </span>
          </p-tab>
        }
      </p-tablist>
      <p-tabpanels>
        <p-tabpanel [value]="section()">
          @switch (section()) {
            @case ('overview') { <app-overview-section /> }
            @case ('adoption') { <app-adoption-section /> }
            @case ('local') { <app-local-section /> }
            @case ('agent') { <app-agent-section /> }
            @case ('search') { <app-search-section /> }
            @case ('pipeline') { <app-pipeline-section /> }
            @case ('tokens-releases') { <app-tokens-releases-section /> }
            @case ('recommendations') { <app-recommendations-section /> }
          }
        </p-tabpanel>
      </p-tabpanels>
    </p-tabs>

    <app-drill-drawer />
  `,
})
export class DesignSystemComponent {
  protected readonly store = inject(InsightsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly sections = SECTIONS;
  readonly sourceOptions: { label: string; value: Provenance }[] = [
    { label: 'Reported', value: 'reported' },
    { label: 'Demo', value: 'demo' },
  ];
  readonly generated = formatDate(this.store.data.generatedAt);

  private readonly param = toSignal(this.route.paramMap.pipe(map((p) => p.get('section'))), {
    initialValue: this.route.snapshot.paramMap.get('section'),
  });

  readonly section = computed<SectionId>(() => {
    const id = this.param();
    return SECTIONS.some((s) => s.id === id) ? (id as SectionId) : 'overview';
  });

  constructor() {
    // Unknown section in the URL → overview.
    effect(() => {
      const id = this.param();
      if (!SECTIONS.some((s) => s.id === id)) {
        void this.router.navigate(['/design-system', 'overview'], { replaceUrl: true });
      }
    });
  }

  go(value: string | number | undefined): void {
    if (typeof value === 'string' && value !== this.section()) {
      void this.router.navigate(['/design-system', value]);
    }
  }

  setSource(source: Provenance): void {
    this.store.setSource(source);
  }
}
