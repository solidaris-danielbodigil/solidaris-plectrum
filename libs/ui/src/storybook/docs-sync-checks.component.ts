// =============================================================================
// libs/ui/src/storybook/docs-sync-checks.component.ts
// Result and check list of the last promoted token sync
// (Docs/Token pipeline/Sync status). Data: sync-report.generated.ts.
//
// PrimeNG components used:
//   - pds-docs-callout (p-message) — the recorded outcome, phrased for main
//   - p-tag — one status per check (PASS / WARN / FAIL / SKIP)
//
// Styles: c-docs-sync-checks* in libs/styles/src/06-components/_components.docs-figures.scss
// (list rhythm only — PrimeNG owns message and tag chrome).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Tag } from 'primeng/tag';
import { DocsCalloutComponent } from './docs-callout.component';
import {
  checkSeverity,
  type SyncCheckStatus,
  type SyncReport,
  syncOutcome,
} from './sync-report.types';

@Component({
  selector: 'pds-docs-sync-checks',
  imports: [Tag, DocsCalloutComponent],
  templateUrl: './docs-sync-checks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c-docs-sync-checks o-layout--block o-layout--margin-block-3',
  },
})
export class DocsSyncChecksComponent {
  readonly report = input.required<SyncReport>();

  protected readonly outcome = computed(() => syncOutcome(this.report()));

  protected severity(status: SyncCheckStatus) {
    return checkSeverity(status);
  }
}
