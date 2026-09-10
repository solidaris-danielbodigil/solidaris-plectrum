import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { injectPdsMessages } from '../i18n';
import { DelayPredictionCardMessages } from './delay-prediction-card.i18n';

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
    class: 'c-delay-prediction-card-host o-layout--block',
  },
})
export class DelayPredictionCardComponent {
  protected readonly messages = injectPdsMessages(DelayPredictionCardMessages);
  /** Empty state when no delay prediction is available for the document. */
  readonly unavailable = input(false);
  readonly daysRemaining = input<number | null>(null);
  readonly predictedCloseDate = input<string | null>(null);

  readonly menuClick = output<void>();

  onMenuClick(): void {
    this.menuClick.emit();
  }
}
