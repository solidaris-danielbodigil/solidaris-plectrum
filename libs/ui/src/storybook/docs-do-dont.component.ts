// =============================================================================
// libs/ui/src/storybook/docs-do-dont.component.ts
// Do / Don't cards for docs pages.
//
// Two p-cards side by side: what the block is for, and what to avoid — each
// entry with an icon, an optional reason and an optional "Instead" line.
// Component pages get the entries from their .metadata.ts through
// pds-docs-contract (usage.useCases → Do, usage.antiPatterns → Don't);
// foundations pages can pass their own lists via doDontStory().
//
// PrimeNG components used:
//   - p-card — one card per column, stretched to the row height
//   - p-tag  — column label (Do = success, Don't = danger)
//   - pds-icon — check / cross per entry (Bootstrap Icons)
//
// Styles: c-docs-do-dont* in libs/styles/src/06-components/_components.docs-figures.scss
// (grid + list rhythm only — PrimeNG owns the card and tag chrome).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { IconComponent } from '../lib/icon/icon.component';
import type { DocsDoDontItem } from './docs-figures.types';

@Component({
  selector: 'pds-docs-do-dont',
  imports: [Card, Tag, IconComponent],
  templateUrl: './docs-do-dont.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-do-dont o-layout--block o-layout--margin-block-3' },
})
export class DocsDoDontComponent {
  readonly dos = input<readonly DocsDoDontItem[]>([]);
  readonly donts = input<readonly DocsDoDontItem[]>([]);
  /** Column labels — override for a page that is not about a component. */
  readonly doLabel = input('Do');
  readonly dontLabel = input("Don't");
  /** "Instead" prefix of an alternative line. */
  readonly insteadLabel = input('Instead');
}
