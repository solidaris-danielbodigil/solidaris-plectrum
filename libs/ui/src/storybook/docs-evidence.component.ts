// =============================================================================
// libs/ui/src/storybook/docs-evidence.component.ts
// Accessibility evidence on a component or control docs page.
//
// Reads `accessibility.evidence` from the metadata (or the same shape declared
// in a PrimeNG control page) and shows the target next to what was actually
// checked: the automated axe run, a manual keyboard walk, a manual screen
// reader session. A missing session says "Not assessed" — the figure never
// upgrades a target to a result. Wording matches Docs → Accessibility overview.
//
// PrimeNG components used:
//   - p-table — one row per check: result tag, who ran it, method
//   - p-tag — result (success / danger / secondary) and the actor
//   - p-message — known limitations
//
// Styles: c-docs-contract__* in libs/styles/src/06-components/_components.docs-figures.scss
// (text rhythm only — PrimeNG owns the table and tag chrome).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import type {
  AccessibilityEvidence,
  EvidenceActor,
  EvidenceResult,
} from '@solidaris/contracts';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';

export type EvidenceSeverity = 'success' | 'danger' | 'secondary';

export const EVIDENCE_RESULT_LABEL: Readonly<Record<EvidenceResult, string>> = {
  passed: 'Passed',
  failed: 'Failed',
  'not-assessed': 'Not assessed',
};

export const EVIDENCE_RESULT_SEVERITY: Readonly<
  Record<EvidenceResult, EvidenceSeverity>
> = {
  passed: 'success',
  failed: 'danger',
  'not-assessed': 'secondary',
};

export const EVIDENCE_ACTOR_LABEL: Readonly<Record<EvidenceActor, string>> = {
  person: 'A person',
  agent: 'Agent-run',
};

/** A row of the evidence table. */
export interface EvidenceRow {
  check: string;
  result: EvidenceResult;
  resultLabel: string;
  severity: EvidenceSeverity;
  by: string | null;
  method: string | null;
}

/** Evidence for a page with no recorded session at all. */
export const NOT_ASSESSED_EVIDENCE: AccessibilityEvidence = {
  automated: 'not-assessed',
  manualKeyboard: { result: 'not-assessed' },
  manualScreenReader: { result: 'not-assessed' },
  date: '',
  version: '',
  limitations: [],
};

@Component({
  selector: 'pds-docs-evidence',
  imports: [Message, TableModule, Tag],
  templateUrl: './docs-evidence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c-docs-evidence o-flex o-flex--col o-layout o-layout--gap-2',
  },
})
export class DocsEvidenceComponent {
  /** `accessibility.wcagLevel` — the target. */
  readonly wcagLevel = input.required<'A' | 'AA' | 'AAA'>();
  /** `accessibility.evidence`; undefined renders every manual check as Not assessed. */
  readonly evidence = input<AccessibilityEvidence | undefined>(undefined);

  protected readonly resolved = computed(
    () => this.evidence() ?? NOT_ASSESSED_EVIDENCE,
  );

  protected readonly target = computed(() => `WCAG 2.1 ${this.wcagLevel()}`);

  protected readonly rows = computed<EvidenceRow[]>(() => {
    const evidence = this.resolved();
    return [
      row('Automated (axe in Storybook)', evidence.automated, null, null),
      row(
        'Manual keyboard',
        evidence.manualKeyboard.result,
        evidence.manualKeyboard.by ?? null,
        evidence.manualKeyboard.method ?? null,
      ),
      row(
        'Manual screen reader',
        evidence.manualScreenReader.result,
        evidence.manualScreenReader.by ?? null,
        evidence.manualScreenReader.method ?? null,
      ),
    ];
  });

  protected readonly checkedOn = computed(() => {
    const { date, version } = this.resolved();
    if (!date && !version) return null;
    const parts = [
      date ? `Last checked ${date}` : null,
      version ? `version ${version}` : null,
    ].filter(Boolean);
    return parts.join(', ') + '.';
  });

  protected readonly limitations = computed(() => this.resolved().limitations);
}

function row(
  check: string,
  result: EvidenceResult,
  by: EvidenceActor | null,
  method: string | null,
): EvidenceRow {
  return {
    check,
    result,
    resultLabel: EVIDENCE_RESULT_LABEL[result],
    severity: EVIDENCE_RESULT_SEVERITY[result],
    by: by ? EVIDENCE_ACTOR_LABEL[by] : null,
    method,
  };
}
