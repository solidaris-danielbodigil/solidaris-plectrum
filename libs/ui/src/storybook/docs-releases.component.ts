// =============================================================================
// libs/ui/src/storybook/docs-releases.component.ts
// Published versions, newest first (Docs/What's new).
// Data: changelog.generated.ts (CHANGELOG_RELEASES) — one entry per package
// and version; the fixed version group means the three packages share a
// version, so entries are grouped and identical changes collapse to one.
//
// PrimeNG components used:
//   - p-timeline — one event per version, every version readable at once
//   - p-badge    — dot marker on the connector
//   - p-tag      — version, packages (secondary) and bump per change
//   - pds-empty-state — no CHANGELOG.md yet (the design system's own empty state)
//
// Styles: c-docs-releases* in libs/styles/src/06-components/_components.docs-figures.scss
// (text rhythm, list bullets and the Timeline opposite-column constraint).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Badge } from 'primeng/badge';
import { Tag } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';
import { EmptyStateComponent } from '../lib/empty-state/empty-state.component';
import {
  bumpLabel,
  bumpSeverity,
  type ChangelogBump,
  type ChangelogRelease,
  type ChangelogVersion,
  groupReleasesByVersion,
} from './changelog.types';

@Component({
  selector: 'pds-docs-releases',
  imports: [Timeline, Badge, Tag, EmptyStateComponent],
  templateUrl: './docs-releases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-releases' },
})
export class DocsReleasesComponent {
  readonly releases = input.required<readonly ChangelogRelease[]>();

  protected readonly versions = computed<readonly ChangelogVersion[]>(() =>
    groupReleasesByVersion(this.releases()),
  );

  protected severity(bump: ChangelogBump) {
    return bumpSeverity(bump);
  }

  protected label(bump: ChangelogBump): string {
    return bumpLabel(bump);
  }
}
