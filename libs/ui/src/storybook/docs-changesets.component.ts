// =============================================================================
// libs/ui/src/storybook/docs-changesets.component.ts
// Pending changesets — what the next version PR will publish (Docs/What's new).
// Data: changelog.generated.ts (CHANGELOG_UNRELEASED).
//
// PrimeNG components used:
//   - p-card  — one card per changeset: bump + packages in the title, summary in the body
//   - p-tag   — bump coloured by severity (major → danger, minor → warn, patch → info)
//   - p-badge — changeset count
//   - pds-empty-state — nothing pending (the design system's own empty state)
//
// Styles: c-docs-changesets* in libs/styles/src/06-components/_components.docs-figures.scss
// (text rhythm only — PrimeNG owns the card and tag chrome).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Badge } from 'primeng/badge';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { EmptyStateComponent } from '../lib/empty-state/empty-state.component';
import {
  bumpLabel,
  bumpSeverity,
  type ChangelogBump,
  type ChangelogChangeset,
  type ChangelogPackageBump,
  compareBumps,
  highestBump,
  nextReleaseBumps,
} from './changelog.types';

/** Bumps of one changeset (or of the next release), ready to paint. */
interface BumpSummary {
  /** The bump every package shares; `null` when they differ and `entries` is shown instead. */
  uniform: ChangelogBump | null;
  packageNames: string;
  entries: readonly ChangelogPackageBump[];
}

interface ChangesetRow extends ChangelogChangeset {
  summaryBumps: BumpSummary;
}

function summarize(entries: readonly ChangelogPackageBump[]): BumpSummary {
  const [first, ...rest] = entries;
  const uniform =
    first && rest.every((entry) => entry.bump === first.bump) ? first.bump : null;
  return {
    uniform,
    packageNames: entries.map((entry) => entry.packageName).join(' · '),
    entries,
  };
}

@Component({
  selector: 'pds-docs-changesets',
  imports: [Card, Tag, Badge, EmptyStateComponent],
  templateUrl: './docs-changesets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-changesets' },
})
export class DocsChangesetsComponent {
  readonly changesets = input.required<readonly ChangelogChangeset[]>();

  /** Highest pending bump per package — the version PR applies exactly this. */
  protected readonly next = computed<BumpSummary>(() =>
    summarize(nextReleaseBumps(this.changesets())),
  );

  /** Biggest change first, then by file name. */
  protected readonly rows = computed<readonly ChangesetRow[]>(() =>
    [...this.changesets()]
      .sort((a, b) => {
        const bumpA = highestBump(a.bumps.map((entry) => entry.bump));
        const bumpB = highestBump(b.bumps.map((entry) => entry.bump));
        if (bumpA && bumpB && bumpA !== bumpB) return compareBumps(bumpB, bumpA);
        return a.id.localeCompare(b.id);
      })
      .map((changeset) => ({
        ...changeset,
        summaryBumps: summarize(changeset.bumps),
      })),
  );

  protected severity(bump: ChangelogBump) {
    return bumpSeverity(bump);
  }

  protected label(bump: ChangelogBump): string {
    return bumpLabel(bump);
  }
}
