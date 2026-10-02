// =============================================================================
// libs/ui/src/storybook/docs-code.component.ts
// Copyable code block for docs figures: a command, a snippet or a config line.
// MDX code fences get Storybook's own Copy button; Angular figures use this.
//
// PrimeNG components used:
//   - pButton — text icon button that copies the code (toast via copyStorybookText)
//
// Styles: c-docs-code__copy and c-docs-contract__code in
// libs/styles/src/06-components/_components.docs-figures.scss
// =============================================================================

import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { copyStorybookText } from './storybook-toast';

@Component({
  selector: 'pds-docs-code',
  imports: [ButtonModule],
  template: `
    <pre
      class="c-docs-contract__code o-layout o-layout--margin-0 o-layout--padding-block-1 o-layout--padding-inline-1-5 o-layout--padding-inline-end-6 u-radius-sm o-layout--overflow-x-auto"
    ><code>{{ code() }}</code></pre>
    <button
      pButton
      type="button"
      text
      rounded
      severity="secondary"
      size="small"
      icon="bi bi-copy"
      class="c-docs-code__copy o-layout o-layout--absolute"
      [attr.aria-label]="label()"
      (click)="copy()"
    ></button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-code o-layout o-layout--block o-layout--relative' },
})
export class DocsCodeComponent {
  /** The exact text that is shown and copied. */
  readonly code = input.required<string>();

  /** Accessible name of the copy button. */
  readonly label = input('Copy code');

  copy(): void {
    void copyStorybookText(this.code());
  }
}
