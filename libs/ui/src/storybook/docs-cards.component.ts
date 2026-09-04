// =============================================================================
// libs/ui/src/storybook/docs-cards.component.ts
// Role / rule / scope cards for Docs MDX pages (Docs/Token pipeline).
//
// PrimeNG components used:
//   - p-card — one card per entry, stretched to the row height
//   - p-tag  — eyebrow (Designer / Generated / Not permitted) coloured by tone
//
// Styles: c-docs-cards* in libs/styles/src/06-components/_components.docs-figures.scss
// (grid layout only — PrimeNG owns the card chrome).
// =============================================================================

import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { type DocsCard, type FigureTone, toneSeverity } from './docs-figures.types';

@Component({
  selector: 'pds-docs-cards',
  imports: [Card, Tag],
  templateUrl: './docs-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c-docs-cards',
    '[class.c-docs-cards--2-up]': 'columns() === 2',
  },
})
export class DocsCardsComponent {
  readonly cards = input.required<readonly DocsCard[]>();
  readonly columns = input<2 | 3>(3);

  protected severity(tone: FigureTone | undefined) {
    return toneSeverity(tone);
  }
}
