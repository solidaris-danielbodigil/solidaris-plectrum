import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';

/**
 * Prédiction du délai — days remaining and predicted closure (Figma 704:11968).
 */
@Component({
  selector: 'pds-delay-prediction-card',
  standalone: true,
  imports: [ButtonModule, Divider],
  templateUrl: './delay-prediction-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'c-delay-prediction-card-host',
  },
})
export class DelayPredictionCardComponent {
  readonly daysRemaining = input.required<number>();
  readonly predictedCloseDate = input.required<string>();

  readonly menuClick = output<void>();

  onMenuClick(): void {
    this.menuClick.emit();
  }
}
