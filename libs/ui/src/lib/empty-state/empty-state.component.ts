import { Component, computed, input } from '@angular/core';
import {
  pickRandomEmptyStateIllustration,
  resolveEmptyStateIllustration,
  type EmptyStateIllustrationChoice,
} from './empty-state-illustrations';

@Component({
  selector: 'pds-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  /** Decorative hero. Defaults to a random catalog pick, stable for the instance lifetime. */
  readonly illustration = input<EmptyStateIllustrationChoice>('random');

  private readonly randomIllustrationSrc = pickRandomEmptyStateIllustration();

  readonly illustrationSrc = computed(() =>
    resolveEmptyStateIllustration(this.illustration(), this.randomIllustrationSrc),
  );
}
