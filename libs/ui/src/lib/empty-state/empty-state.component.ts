import { Component, input } from '@angular/core';
import { pickRandomEmptyStateIllustration } from './empty-state-illustrations';

@Component({
  selector: 'sds-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly illustrationSrc = pickRandomEmptyStateIllustration();
}