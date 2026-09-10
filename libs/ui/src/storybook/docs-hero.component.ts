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
import { CHANGELOG_RELEASES } from './changelog.generated';
import type { ChangelogRelease } from './changelog.types';
import { docsHeroEyebrow } from './docs-stack';
import { type DocsLink, docsHref } from './docs-figures.types';

export interface DocsHeroAction extends DocsLink {
  /** Visual weight — the first action is usually `primary`. */
  variant?: 'primary' | 'secondary';
}

/**
 * Stack line for the hero eyebrow. The package version comes from
 * package.json; until the first release lands in libs/*\/CHANGELOG.md
 * (CHANGELOG_RELEASES is empty) the line says so, so the banner never
 * advertises a version nobody can install from a registry.
 */
export function docsHeroVersionLine(
  releases: readonly ChangelogRelease[] = CHANGELOG_RELEASES,
): string {
  const stack = docsHeroEyebrow();
  return releases.length ? stack : `${stack} · unreleased`;
}

@Component({
  selector: 'pds-docs-hero',
  imports: [ButtonModule],
  templateUrl: './docs-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class:
      'c-docs-hero o-layout--relative o-layout--block o-layout--overflow-hidden o-layout--margin-block-end-3',
  },
})
export class DocsHeroComponent {
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly actions = input<readonly DocsHeroAction[]>([]);

  /** Plectrum version + PrimeNG / Angular majors from package.json, flagged until the first release. */
  protected readonly versionLine = docsHeroVersionLine();

  protected href(action: DocsHeroAction): string {
    return docsHref(action);
  }
}
