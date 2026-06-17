import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';

/**
 * DocDemoBoxComponent — reusable demo sandbox for Foundation documentation pages.
 *
 * Renders a framed preview area with an optional collapsible "Show code" panel.
 * Used by the Layout and Grid foundation stories.
 *
 * ## Inputs
 * - `code` — HTML string shown in the collapsible code panel (optional)
 * - `minHeight` — minimum height of the preview area in px (default 0 = auto)
 *
 * ## Slots
 * - default `<ng-content>` — the live demo content
 *
 * ## Styles
 * All styles in `libs/styles/src/06-components/_components.doc-demo-box.scss`.
 */
@Component({
  selector: 'pds-doc-demo-box',
  standalone: true,
  templateUrl: './doc-demo-box.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocDemoBoxComponent {
  readonly code = input<string>('');
  readonly minHeight = input<number>(0);

  readonly codeVisible = signal(false);

  toggleCode(): void {
    this.codeVisible.set(!this.codeVisible());
  }
}
