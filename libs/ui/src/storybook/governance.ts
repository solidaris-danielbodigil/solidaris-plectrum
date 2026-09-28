import type { ComponentStatus } from '@solidaris/contracts';
export type StatusSeverity = 'info' | 'warn' | 'success' | 'danger';

export interface StatusPresentation {
  label: string;
  severity: StatusSeverity;
  /** One sentence for the reader; `{owner}` is replaced by the owning team, in-sentence form. */
  hint: string;
  /** Who may import a component with this status. */
  importers: string;
  /** What moves a component out of this status. */
  changedBy: string;
}

/** Shared status labels for the badge on each component page, the catalogue and Contribute. */
export const STATUS_PRESENTATION: Readonly<
  Record<ComponentStatus, StatusPresentation>
> = {
  core: {
    label: 'Core',
    severity: 'info',
    hint: 'Generic and owned by the core team — safe in every application.',
    importers: 'Every application',
    changedBy: 'Deprecation, by the core team',
  },
  candidate: {
    label: 'Candidate',
    severity: 'warn',
    hint: 'Built for {owner} and flagged for promotion. Ask the core team before reusing it in another application.',
    importers: 'The owning application; others ask the core team first',
    changedBy: 'Promotion to Core only if the core team chooses it, or withdrawal by the owning team',
  },
  app: {
    label: 'App-specific',
    severity: 'success',
    hint: 'Owned by {owner} for its own screens. Not part of the design-system contract — other applications propose, they do not import.',
    importers: 'The owning application only',
    changedBy: 'A second application needing it — which starts a new proposal',
  },
  deprecated: {
    label: 'Deprecated',
    severity: 'danger',
    hint: 'Scheduled for removal. Do not add new usages.',
    importers: 'Nobody new',
    changedBy: 'Removal in a later release, after usages migrated',
  },
};
