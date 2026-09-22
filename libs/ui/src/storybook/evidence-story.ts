// Story factory for the accessibility evidence figure. Kept apart from
// docs-figure-stories.ts so PrimeNG control pages (no .metadata.ts) and
// component pages share one entry point.
import type { StoryObj } from '@storybook/angular-vite';
import type { AccessibilityEvidence, ComponentMetadata } from '@solidaris/contracts';
import { DocsEvidenceComponent } from './docs-evidence.component';

const EVIDENCE_PARAMETERS = {
  layout: 'padded',
  chromatic: { disableSnapshot: true },
  a11y: { test: 'off' },
} as const;

/**
 * Evidence figure from explicit values. Use on PrimeNG control pages:
 *
 *   export const Evidence = { tags: ['!dev'], ...evidenceStory('AA', BUTTON_EVIDENCE) };
 */
export function evidenceStory(
  wcagLevel: ComponentMetadata['accessibility']['wcagLevel'],
  evidence?: AccessibilityEvidence,
): StoryObj {
  return {
    tags: ['!dev'],
    parameters: EVIDENCE_PARAMETERS,
    render: () => ({
      moduleMetadata: { imports: [DocsEvidenceComponent] },
      props: { wcagLevel, evidence },
      template: `<pds-docs-evidence [wcagLevel]="wcagLevel" [evidence]="evidence" />`,
    }),
  };
}

/** Evidence figure straight from a component's metadata. */
export function metadataEvidenceStory(metadata: ComponentMetadata): StoryObj {
  return evidenceStory(
    metadata.accessibility.wcagLevel,
    metadata.accessibility.evidence,
  );
}
