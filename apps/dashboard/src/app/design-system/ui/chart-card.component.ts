import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

export interface ChartTable {
  columns: string[];
  rows: (string | number)[][];
}

/**
 * A chart in a card: title, a one-sentence text alternative (also the canvas
 * aria-label) and a collapsible data table carrying every plotted value.
 */
@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CardModule, ChartModule, TableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-layout o-layout--block o-layout--min-w-0' },
  template: `
    <p-card styleClass="o-layout o-layout--full-height">
      <ng-template #title>
        <h3 class="u-text-heading-xs o-layout o-layout--margin-0">{{ heading() }}</h3>
      </ng-template>
      <ng-template #subtitle>{{ summary() }}</ng-template>
      <div class="o-flex o-flex--y o-layout o-layout--gap-3">
        <p-chart
          [type]="type()"
          [data]="chart().data"
          [options]="chart().options"
          [height]="height()"
          [ariaLabel]="ariaLabel()"
        />
        @if (table(); as data) {
          <details>
            <summary class="u-text-label-md">Data table</summary>
            <div class="o-layout o-layout--overflow-x-auto o-layout--padding-top-2">
              <p-table [value]="data.rows" size="small">
                <ng-template #header>
                  <tr>
                    @for (column of data.columns; track $index) {
                      <th scope="col">{{ column }}</th>
                    }
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    @for (cell of row; track $index) {
                      <td>{{ cell }}</td>
                    }
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </details>
        }
      </div>
    </p-card>
  `,
})
export class ChartCardComponent {
  // Not `title`: the card's #title template ref would shadow it, and a static
  // title attribute would also become a native tooltip on the host.
  readonly heading = input.required<string>();
  /** Text alternative: what the chart shows, in one or two sentences. */
  readonly summary = input.required<string>();
  readonly type = input.required<'bar' | 'line'>();
  readonly chart = input.required<{ data: unknown; options: unknown }>();
  readonly table = input<ChartTable | null>(null);
  readonly height = input('16rem');

  readonly ariaLabel = computed(() => `${this.heading()}. ${this.summary()}`);
}
