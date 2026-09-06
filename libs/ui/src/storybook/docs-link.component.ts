// =============================================================================
// libs/ui/src/storybook/docs-link.component.ts
// PrimeNG Button link variant for Storybook docs pages.
//
// PrimeNG 21 exposes `link` only on <p-button>, not on [pButton]. Docs links
// need a real <a href> (copy, middle-click, target="_top" out of the iframe),
// so the host is an <a pButton> wearing p-button-link — the class [link]="true"
// applies on the component.
//
// MDX prose uses the same chrome via libs/ui/.storybook/docs-link.ts.
// =============================================================================

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { docsHref, docsLinkAttrs } from './docs-figures.types';

@Component({
  selector: 'pds-docs-link',
  imports: [ButtonModule],
  template: `
    <a
      pButton
      class="p-button-link"
      [href]="attrs().href"
      [attr.target]="attrs().target"
      [attr.rel]="attrs().rel ?? null"
      [label]="label()"
    ></a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLinkComponent {
  readonly label = input.required<string>();
  /** Manager route, e.g. `/docs/foundations-spacing--docs`. */
  readonly path = input<string>();
  /** Raw href when the destination is not a Storybook `path`. */
  readonly href = input<string>();

  protected readonly attrs = computed(() => {
    const path = this.path();
    const raw = this.href() ?? (path ? docsHref({ path }) : '');
    return docsLinkAttrs(raw);
  });
}
