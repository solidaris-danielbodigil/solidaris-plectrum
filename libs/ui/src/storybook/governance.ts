import type { ComponentStatus } from '@solidaris/contracts';
export type StatusSeverity = 'info' | 'warn' | 'success' | 'danger';

export interface StatusPresentation {
  label: string;
  severity: StatusSeverity;
  /** One sentence for the reader; `{owner}` is replaced by the owning team, in-sentence form. */
  hint: string;
}

/** Shared status labels for the badge on each component page. */
export const STATUS_PRESENTATION: Readonly<
  Record<ComponentStatus, StatusPresentation>
> = {
  core: {
    label: 'Core',
    severity: 'info',
    hint: 'Generic and owned by the core team — safe in every application.',
  },
  candidate: {
    label: 'Candidate',
    severity: 'warn',
    hint: 'Built for {owner} and flagged for promotion. Ask the core team before reusing it in another application.',
  },
  app: {
    label: 'App-specific',
    severity: 'success',
    hint: 'Owned by {owner} for its own screens. Not part of the design-system contract — other applications propose, they do not import.',
  },
  deprecated: {
    label: 'Deprecated',
    severity: 'danger',
    hint: 'Scheduled for removal. Do not add new usages.',
  },
};
