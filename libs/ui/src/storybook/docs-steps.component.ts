// =============================================================================
// libs/ui/src/storybook/docs-steps.component.ts
// Numbered process for Docs MDX pages (Docs/Token pipeline).
//
// PrimeNG components used:
//   - p-timeline — vertical list with marker + connector, every step visible
//   - p-badge    — step number as the timeline marker
//   - p-tag      — actor (Designer / Developer / CI) coloured by tone
//   - pds-docs-link — PrimeNG Button link variant (pButton + p-button-link)
//
// A vertical p-stepper shows one panel at a time; documentation needs the
// whole process readable at once, so Timeline is the matching primitive.
//
// Styles: c-docs-steps* in libs/styles/src/06-components/_components.docs-figures.scss
// (structural only — PrimeNG owns the chrome).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Badge } from 'primeng/badge';
import { Tag } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';
import { type DocsStep, toneSeverity, type ToneSeverity } from './docs-figures.types';
import { DocsLinkComponent } from './docs-link.component';

interface StepEvent extends DocsStep {
  index: number;
  severity: ToneSeverity;
}

@Component({
  selector: 'pds-docs-steps',
  imports: [Timeline, Badge, Tag, DocsLinkComponent],
  templateUrl: './docs-steps.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-steps' },
})
export class DocsStepsComponent {
  readonly steps = input.required<readonly DocsStep[]>();

  protected readonly events = computed<readonly StepEvent[]>(() =>
    this.steps().map((step, index) => ({
      ...step,
      index: index + 1,
      severity: toneSeverity(step.tone),
    })),
  );
}
