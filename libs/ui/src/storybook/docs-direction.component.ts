// =============================================================================
// libs/ui/src/storybook/docs-direction.component.ts
// Tiny edge / corner glyph for Borders compose + catalogues.
// Geometry comes from the same mixins as u-border-* / u-radius-*.
// =============================================================================

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type DocsDirectionKind = 'border' | 'radius';

@Component({
  selector: 'pds-docs-direction',
  standalone: true,
  template: `
    @if (kind() === 'radius') {
      <span
        class="c-token-explorer__direction-mark c-token-explorer__direction-mark--top-start"
      ></span>
      <span
        class="c-token-explorer__direction-mark c-token-explorer__direction-mark--top-end"
      ></span>
      <span
        class="c-token-explorer__direction-mark c-token-explorer__direction-mark--bottom-start"
      ></span>
      <span
        class="c-token-explorer__direction-mark c-token-explorer__direction-mark--bottom-end"
      ></span>
    }
  `,
  host: {
    class: 'c-token-explorer__direction',
    '[attr.data-kind]': 'kind()',
    '[attr.data-target]': 'target()',
    'aria-hidden': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsDirectionComponent {
  readonly kind = input.required<DocsDirectionKind>();
  readonly target = input.required<string>();
}
