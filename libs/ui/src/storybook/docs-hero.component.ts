// =============================================================================
// libs/ui/src/storybook/docs-hero.component.ts
// Landing banner for the Storybook Introduction page.
//
// PrimeNG components used:
//   - pButton — call-to-action anchors (primary / outlined); PrimeNG owns the chrome
//
// Brand chrome from the Figma thumbnail (node 9967:29548): three copies of the
// exported plectrum shape, the Solidaris logo in a white pill, Agenda title.
// Both images ship from libs/assets (served at /assets by the storybook target).
//
// Actions link to other Storybook pages. Rendered inline in the docs iframe,
// so they target `_top` and resolve `./?path=…` against the manager URL —
// this works in dev, in the static build, and under a GitHub Pages sub-path.
//
// Styles: c-docs-hero* in libs/styles/src/06-components/_components.docs-hero.scss
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { docsHeroEyebrow } from './docs-stack';
import { type DocsLink, docsHref } from './docs-figures.types';

export interface DocsHeroAction extends DocsLink {
  /** Visual weight — the first action is usually `primary`. */
  variant?: 'primary' | 'secondary';
}

@Component({
  selector: 'pds-docs-hero',
  imports: [ButtonModule],
  templateUrl: './docs-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-hero' },
})
export class DocsHeroComponent {
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly actions = input<readonly DocsHeroAction[]>([]);

  /** Plectrum version + PrimeNG / Angular majors from package.json. */
  protected readonly versionLine = docsHeroEyebrow();

  protected href(action: DocsHeroAction): string {
    return docsHref(action);
  }
}
