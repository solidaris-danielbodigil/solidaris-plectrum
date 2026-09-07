// =============================================================================
// libs/ui/src/storybook/sync-report.types.ts
// Shapes of the sync record written by `tools/tokens/report.mjs --ts`
// (sync-report.generated.ts) and the mappers the Sync status figures use.
//
// The record is provenance, not a token reference: it says what one Figma →
// repository sync changed and which checks it passed. Current values are read
// from the CSSOM (.ai/rules/10-css-ssot.md).
// =============================================================================

import type { DocsCalloutTone } from './docs-figures.types';

export type SyncCheckStatus =
  | 'PASS'
  | 'OK'
  | 'WARN'
  | 'FAIL'
  | 'SKIP'
  | 'NOT RUN'
  | 'CANCELLED';

export type SyncResult = 'promote' | 'blocked' | 'preview';

export interface SyncCheck {
  id: string;
  name: string;
  status: SyncCheckStatus;
  detail: string;
  items: readonly string[];
}

export interface SyncValueChange {
  path: string;
  before?: string | null;
  after?: string | null;
  alias?: string | null;
}

export interface SyncDiffBase {
  available: boolean;
  label: string;
  error?: string;
}

export interface SyncDiff {
  base: SyncDiffBase;
  changed: readonly SyncValueChange[];
  reordered: readonly SyncValueChange[];
  added: readonly SyncValueChange[];
  removed: readonly SyncValueChange[];
}

export interface SyncReport {
  generatedAt: string;
  source: string | null;
  branch: string | null;
  sha: string | null;
  actor: string | null;
  runNumber: string | null;
  runUrl: string | null;
  sets: readonly string[];
  leafCount: number;
  resolvedCount: number;
  unresolved: number;
  outcomes: Readonly<Record<string, string>>;
  diff: SyncDiff;
  checks: readonly SyncCheck[];
  result: SyncResult;
  resultText: string;
}

export type CheckSeverity = 'success' | 'warn' | 'danger' | 'secondary';

/** PrimeNG Tag severity for a check status. */
export function checkSeverity(status: SyncCheckStatus): CheckSeverity {
  switch (status) {
    case 'PASS':
    case 'OK':
      return 'success';
    case 'WARN':
      return 'warn';
    case 'FAIL':
    case 'CANCELLED':
      return 'danger';
    default:
      return 'secondary';
  }
}

export type SyncChangeKind = 'changed' | 'added' | 'removed' | 'reordered';

export interface SyncChangeRow extends SyncValueChange {
  kind: SyncChangeKind;
}

const KIND_SEVERITY: Readonly<Record<SyncChangeKind, CheckSeverity>> = {
  changed: 'warn',
  added: 'success',
  removed: 'danger',
  reordered: 'secondary',
};

/** PrimeNG Tag severity for a change kind. */
export function changeKindSeverity(kind: SyncChangeKind): CheckSeverity {
  return KIND_SEVERITY[kind];
}

/** One flat list of rows, in the order a reviewer reads them. */
export function flattenChanges(diff: SyncDiff): SyncChangeRow[] {
  return [
    ...diff.changed.map((row) => ({ ...row, kind: 'changed' as const })),
    ...diff.added.map((row) => ({ ...row, kind: 'added' as const })),
    ...diff.removed.map((row) => ({ ...row, kind: 'removed' as const })),
    ...diff.reordered.map((row) => ({ ...row, kind: 'reordered' as const })),
  ];
}

/** A flat colour we can paint as a swatch (hex or rgb/rgba, not a shadow). */
export function isColorValue(value: string | null | undefined): boolean {
  return !!value && /^(#[0-9a-f]{3,8}|rgba?\([^)]*\))$/i.test(value.trim());
}

export interface SyncOutcome {
  tone: DocsCalloutTone;
  title: string;
  text: string;
}

/** Message the page shows for the recorded result, phrased for `main`. */
export function syncOutcome(
  report: Pick<SyncReport, 'result' | 'generatedAt'>,
): SyncOutcome {
  switch (report.result) {
    case 'promote':
      return {
        tone: 'success',
        title: 'Promoted',
        text: `Synced ${formatSyncDate(report.generatedAt)}. This sync is in libs/plectrum/src/tokens.json; the generated --pds-* CSS was rebuilt from it.`,
      };
    case 'blocked':
      return {
        tone: 'error',
        title: 'Blocked',
        text: 'A check failed, so this sync was not promoted. The change list shows what it would have applied.',
      };
    default:
      return {
        tone: 'info',
        title: 'No promoted sync recorded yet',
        text: 'This page fills in when the first promotion pull request from design-tokens/sync is merged.',
      };
  }
}

/** `2026-09-07T01:36:50.000Z` → `2026-09-07 01:36 UTC`. */
export function formatSyncDate(iso: string): string {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}
