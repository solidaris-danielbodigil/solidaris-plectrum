// =============================================================================
// libs/ui/src/storybook/docs-callout.component.ts
// Guardrail / scope note for Docs MDX pages (Docs/Token pipeline).
//
// PrimeNG components used:
//   - p-message — severity from the callout tone; PrimeNG owns the chrome
//
// Styles: c-docs-callout* in libs/styles/src/06-components/_components.docs-figures.scss
// (inner text rhythm only).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Message } from 'primeng/message';
import { calloutIcon, calloutSeverity, type DocsCalloutTone } from './docs-figures.types';

@Component({
  selector: 'pds-docs-callout',
  imports: [Message],
  templateUrl: './docs-callout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-callout' },
})
export class DocsCalloutComponent {
  readonly tone = input<DocsCalloutTone>('info');
  readonly title = input.required<string>();
  readonly text = input<string>();
  readonly items = input<readonly string[]>();

  protected readonly severity = computed(() => calloutSeverity(this.tone()));
  protected readonly icon = computed(() => calloutIcon(this.tone()));
}
