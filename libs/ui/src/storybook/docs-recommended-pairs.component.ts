import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import {
  contrastFromResolved,
  contrastRatioLabel,
  measureTokenColor,
} from './contrast-checker.component';

interface PairSpec {
  use: string;
  text: string;
  background: string;
}

const PAIRS: readonly PairSpec[] = [
  { use: 'Body text on the page', text: '--pds-color-text', background: '--pds-color-surface' },
  { use: 'Body text on a card', text: '--pds-color-text', background: '--pds-color-content-bg' },
  { use: 'Field text on a field', text: '--pds-color-form-text', background: '--pds-color-form-bg' },
  { use: 'Inverse text on primary', text: '--pds-color-text-inverse', background: '--pds-color-primary-500' },
  { use: 'Success text on its subtle surface', text: '--pds-color-success', background: '--pds-color-success-subtle' },
  { use: 'Danger text on its subtle surface', text: '--pds-color-danger', background: '--pds-color-danger-subtle' },
];

export interface MeasuredPair extends PairSpec {
  ratio: string;
  passes: boolean;
}

@Component({
  selector: 'pds-docs-recommended-pairs',
  imports: [TableModule, Tag],
  template: `
    <p class="c-docs-contract__text o-layout o-layout--margin-0">
      Provisional. These pairs are measured on this page. A pair stays in the list only when it passes WCAG 2.1 AA for normal text. Design still has to sign them off.
    </p>
    <p-table [value]="rows()" dataKey="use" size="small">
      <ng-template #header>
        <tr>
          <th scope="col">Use</th>
          <th scope="col">Text</th>
          <th scope="col">Background</th>
          <th scope="col">Contrast</th>
        </tr>
      </ng-template>
      <ng-template #body let-row>
        <tr>
          <td>{{ row.use }}</td>
          <td><code>{{ row.text }}</code></td>
          <td><code>{{ row.background }}</code></td>
          <td>
            <p-tag [value]="row.ratio" [severity]="row.passes ? 'success' : 'danger'" [rounded]="true" />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'o-flex o-flex--col o-layout o-layout--gap-2' },
})
export class DocsRecommendedPairsComponent implements OnInit {
  protected readonly rows = signal<MeasuredPair[]>([]);

  ngOnInit(): void {
    const host = document.documentElement;
    this.rows.set(
      PAIRS.map((pair) => {
        const result = contrastFromResolved(
          measureTokenColor(pair.background, host),
          measureTokenColor(pair.text, host),
        );
        return {
          ...pair,
          ratio: contrastRatioLabel(result.ratio),
          passes: result.aa,
        };
      }).filter((pair) => pair.passes),
    );
  }
}
