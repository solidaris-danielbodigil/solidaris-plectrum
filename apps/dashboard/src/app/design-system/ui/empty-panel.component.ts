import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EmptyStateComponent } from '@solidaris-danielbodigil/pds-ui';
import { CardModule } from 'primeng/card';

/** pds-empty-state in a card, for a widget whose source has no data. */
@Component({
  selector: 'app-empty-panel',
  standalone: true,
  imports: [CardModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'o-layout o-layout--block' },
  template: `
    <p-card>
      <pds-empty-state [title]="heading()" [description]="description()" illustration="person-box" />
    </p-card>
  `,
})
export class EmptyPanelComponent {
  readonly heading = input.required<string>();
  readonly description = input<string | null>(null);
}
