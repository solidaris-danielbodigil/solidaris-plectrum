import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TOKEN_ANNOTATIONS } from './tokens.generated';

export interface PageDecision {
  element: string;
  usage: string;
  figma: string;
}

const DECISIONS: readonly { element: string; usage: string; token: string | null }[] = [
  { element: 'Page title', usage: 'u-text-display-md', token: '--pds-text-display-md-size' },
  { element: 'Section', usage: 'u-text-heading-md', token: '--pds-text-heading-md-size' },
  { element: 'Card title', usage: 'u-text-heading-sm', token: '--pds-text-heading-sm-size' },
  { element: 'Body', usage: 'u-text-body-md on --pds-color-text', token: '--pds-color-text' },
  { element: 'Card surface', usage: '--pds-color-content-bg', token: '--pds-color-content-bg' },
  { element: 'Page surface', usage: '--pds-color-surface', token: '--pds-color-surface' },
  { element: 'Inside the card', usage: 'o-layout--gap-2', token: '--pds-spacing-2' },
  { element: 'Between blocks', usage: 'o-layout--gap-4', token: '--pds-spacing-4' },
  { element: 'Page padding', usage: 'o-layout--padding-3, then padding-4 from md', token: '--pds-spacing-3' },
];

function figmaOf(token: string | null): string {
  if (!token) return '—';
  return TOKEN_ANNOTATIONS.find((row) => row.cssVar === token)?.figmaRef ?? '—';
}

@Component({
  selector: 'pds-docs-page-example',
  imports: [Button, Card, TableModule],
  templateUrl: './docs-page-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-page-example o-layout o-layout--block' },
})
export class DocsPageExampleComponent {
  protected readonly decisions: PageDecision[] = DECISIONS.map((row) => ({
    element: row.element,
    usage: row.usage,
    figma: figmaOf(row.token),
  }));
}
