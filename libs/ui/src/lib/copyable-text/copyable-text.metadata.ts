import type { ComponentMetadata } from '@solidaris/contracts';

export const CopyableTextMetadata: ComponentMetadata = {
  component: {
    name: 'CopyableText',
    category: 'molecules',
    description:
      'Copyable metadata chip: copy icon, label, and value. Copies value to clipboard on click.',
    type: 'interactive',
    path: 'libs/ui/src/lib/copyable-text/copyable-text.component.ts',
    primeNgComponent: 'Button',
    bemBlock: 'c-copyable-text',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.copyable-text.scss',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  usage: {
    useCases: [
      'Affiliate identifier chips (Territoire, NISS, NSI)',
      'Any label + value pair that users need to copy',
      'Metadata rows with bullet separators',
    ],
    commonPatterns: [
      {
        name: 'Single identifier',
        description: 'One copyable chip for a stable identifier value.',
        composition: `<(pds|app|lib)-copyable-text label="Territoire" value="319" />`,
      },
      {
        name: 'Identifier row with separators',
        description:
          'Wrap multiple chips in a flex row; add c-copyable-text__separator between items.',
        composition: `<div class="o-flex o-flex--align-items-center o-layout--gap-1 o-flex--wrap">
  <(pds|app|lib)-copyable-text label="Territoire" value="319" />
  <span class="c-copyable-text__separator" aria-hidden="true">•</span>
  <(pds|app|lib)-copyable-text label="NISS" value="85010112345" />
</div>`,
      },
      {
        name: 'Toast on copy',
        description:
          'Listen to (copied) for analytics or confirmation toasts; clipboard write is internal.',
        composition: `<(pds|app|lib)-copyable-text
  label="Territoire"
  value="319"
  (copied)="showCopiedToast('Territoire', $event)"
/>`,
      },
    ],
    antiPatterns: [
      {
        scenario: 'Duplicating clipboard logic in parent handlers',
        reason: 'Copy behaviour belongs in pds-copyable-text for consistency and fallback.',
        alternative: 'Use (copied) only for toast/analytics after successful copy.',
      },
      {
        scenario: 'Plain text span for copyable identifiers',
        reason: 'No copy affordance, no keyboard-accessible action, inconsistent with audit UI.',
        alternative: 'Use pds-copyable-text with label and value inputs.',
      },
    ],
  },
  accessibility: {
    ariaAttributes: ['aria-label (default: Copier {label})'],
    keyboardSupport: ['Enter/Space activates copy on focused button'],
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [
      '--pds-color-metadata-chip-text',
      '--pds-color-content-hover-bg',
      '--pds-color-primary-100',
      '--pds-color-primary-interactive-hover',
      '--pds-color-primary-interactive-active',
      '--pds-color-text-muted',
      '--p-button-text-secondary-color',
      '--p-button-padding-x',
      '--p-button-border-radius',
    ],
  },
  aiHints: {
    priority: 'high',
    context:
      'Reusable copy-to-clipboard chip for affiliate identifiers and similar metadata. Used in pds-affiliate-overview-card and pds-affiliate-detail-drawer. Clipboard API with execCommand fallback lives in copy-to-clipboard.ts.',
    selectionCriteria: {},
    keywords: ['copy', 'clipboard', 'identifier', 'metadata chip', 'Territoire', 'NISS'],
  },
  examples: [],
};
