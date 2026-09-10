// =============================================================================
// libs/ui/src/storybook/docs-status.component.ts
// Ownership badge at the top of every component docs page.
//
// Reads the `governance` block of the component's .metadata.ts and renders it
// the same way everywhere, so an application developer sees "App-specific ·
// iSHARE team" before reading the API. With `description` and `figmaUrl`
// (component block of the same metadata) it is also the page lead, so the
// MDX never restates what the component is or where its Figma node lives.
// Status meanings: Get started / Contribute → Status and owner.
//
// PrimeNG components used:
//   - p-tag — status (coloured by severity) and owner (secondary)
//   - pds-docs-link — PrimeNG Button link to the status definitions / Figma
//
// Styles: c-docs-status* in libs/styles/src/06-components/_components.docs-figures.scss
// (text rhythm only — PrimeNG owns the tag chrome).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import type {
  ComponentGovernance,
  ComponentOwner,
  ComponentStatus,
} from '@solidaris/contracts';
import { Tag } from 'primeng/tag';
import { DocsLinkComponent } from './docs-link.component';

export type StatusSeverity = 'info' | 'warn' | 'success' | 'danger';

export interface StatusPresentation {
  label: string;
  severity: StatusSeverity;
  /** One sentence for the reader; `{owner}` is replaced by the owning team, in-sentence form. */
  hint: string;
}

/** Shared with the Component status index so both paint a status the same way. */
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

/** Badge text. */
export const OWNER_LABEL: Readonly<Record<ComponentOwner, string>> = {
  'design-system': 'Design-system team',
  ishare: 'iSHARE team',
  icrm: 'iCRM team',
};

/** Same team, as it reads inside the hint sentence. */
const OWNER_IN_SENTENCE: Readonly<Record<ComponentOwner, string>> = {
  'design-system': 'the design-system team',
  ishare: 'the iSHARE team',
  icrm: 'the iCRM team',
};

/** Manager route of the definitions the badge links to. */
export const DOCS_STATUS_DEFINITIONS_PATH =
  '/docs/get-started-contribute--docs#status-and-owner';

@Component({
  selector: 'pds-docs-status',
  imports: [Tag, DocsLinkComponent],
  templateUrl: './docs-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class:
      'c-docs-status o-flex o-flex--col o-layout--gap-0-5 o-layout--margin-block-end-3',
  },
})
export class DocsStatusComponent {
  readonly status = input.required<ComponentStatus>();
  readonly owner = input.required<ComponentOwner>();
  readonly note = input<ComponentGovernance['note']>();
  /** `component.description` from the metadata — the page's lead paragraph. */
  readonly description = input<string>();
  /** `component.figmaUrl` from the metadata — rendered as an external link. */
  readonly figmaUrl = input<string>();

  protected readonly definitionsPath = DOCS_STATUS_DEFINITIONS_PATH;

  protected readonly statusLabel = computed(
    () => STATUS_PRESENTATION[this.status()].label,
  );
  protected readonly severity = computed(
    () => STATUS_PRESENTATION[this.status()].severity,
  );
  protected readonly ownerLabel = computed(() => OWNER_LABEL[this.owner()]);
  protected readonly hint = computed(() =>
    STATUS_PRESENTATION[this.status()].hint.replace(
      '{owner}',
      OWNER_IN_SENTENCE[this.owner()],
    ),
  );
}
