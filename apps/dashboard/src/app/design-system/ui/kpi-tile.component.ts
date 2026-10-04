import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

/** Stat tile: label, value and an optional one-line detail; extra content projects below. */
@Component({
  selector: 'app-kpi-tile',
  standalone: true,
  imports: [CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-layout o-layout--block' },
  template: `
    <p-card styleClass="o-layout o-layout--full-height">
      <div class="o-flex o-flex--y o-layout o-layout--gap-1">
        <p class="u-text-label-md o-layout o-layout--margin-0">{{ label() }}</p>
        <p class="u-text-heading-lg o-layout o-layout--margin-0">{{ value() }}</p>
        @if (detail()) {
          <p class="u-text-body-sm o-layout o-layout--margin-0">{{ detail() }}</p>
        }
        <ng-content />
      </div>
    </p-card>
  `,
})
export class KpiTileComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly detail = input<string | null>(null);
}
