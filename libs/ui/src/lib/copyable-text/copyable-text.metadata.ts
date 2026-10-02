import type { ComponentMetadata } from '@solidaris/contracts';

export const CopyableTextMetadata: ComponentMetadata = {
  component: {
    id: 'plectrum:copyable-text',
    name: 'CopyableText',
    category: 'molecules',
    description:
      'Copy-to-clipboard chip for identifiers and similar metadata: a copy icon, a label and a value rendered as one PrimeNG text button. Activating it writes the value to the clipboard and emits copied. iconPosition and labelWeight opt into the Profile header identifier chip (icon after the value, regular label).',
    type: 'interactive',
    path: 'libs/ui/src/lib/copyable-text/copyable-text.component.ts',
    primeNgComponent: 'Button',
    bemBlock: 'c-copyable-text',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.copyable-text.scss',
    // no Figma component yet
    figmaUrl: 'https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components',
    created: '2026-06-08',
    modified: '2026-10-02',
  },
  distribution: { kind: 'angular', entryPoint: '.', exportName: 'CopyableTextComponent' },
  governance: {
    status: 'core',
    owner: 'design-system',
  },
  usage: {
    useCases: [
      'Stable identifiers users copy often — NISS, territory codes, dossier numbers',
      'Metadata rows of several chips separated by bullets',
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
        composition: `<div class="o-flex o-flex--align-items-center o-layout o-layout--gap-1 o-flex--wrap">
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
      {
        name: 'Profile header identifier chip',
        description:
          'Icon after the value (Figma inplace chip layout) and a regular label beside the bold value (product decision) — the Profile header identifier row.',
        composition: `<(pds|app|lib)-copyable-text label="NISS" value="85010112345" iconPosition="end" labelWeight="regular" iconSize="md" />`,
      },
    ],
    antiPatterns: [
      {
        scenario: 'Duplicating clipboard logic in a parent handler',
        reason:
          'The chip already writes to the clipboard, with an execCommand fallback — a second write is redundant and the two can diverge.',
        alternative:
          'Listen to (copied) for toasts or analytics only; it fires after a successful write.',
      },
      {
        scenario: 'A plain text span for a copyable identifier',
        reason:
          'There is no copy affordance and no keyboard-accessible action, so users have to select the text by hand.',
        alternative: 'Render pds-copyable-text with label and value inputs.',
      },
    ],
  },
  anatomy: [
    {
      part: 'c-copyable-text',
      role: 'PrimeNG text button host — copies value on activate',
    },
    {
      part: 'c-copyable-text__icon',
      role: 'Copy glyph (pds-icon, decorative) — before the label, or after the value with iconPosition="end"',
    },
    { part: 'c-copyable-text__label', role: 'Visible field name — semibold, or regular with c-copyable-text--label-regular (labelWeight="regular")' },
    { part: 'c-copyable-text__value', role: 'Value written to the clipboard' },
    {
      part: 'c-copyable-text__separator',
      role: 'Parent-owned bullet between chips — aria-hidden',
    },
  ],
  behavior: {
    states: ['default', 'hover', 'focus-visible', 'active', 'disabled'],
    interactions: [
      'Writes value through the async Clipboard API, with an execCommand fallback in older or non-secure contexts',
      'Emits (copied) after a successful write — see Usage for the parent toast contract',
      'disabled makes the button inert: no clipboard write, no copied event',
      'iconPosition and labelWeight change the visual order and weight only — the accessible name stays "Copier {label}"',
    ],
  },
  composition: {
    nestedComponents: ['Button', 'Icon'],
    companions: ['ProfileHeaderComponent', 'ProfileDrawerComponent', 'ProfileCardComponent'],
  },
  accessibility: {
    ariaAttributes: [
      'The chip is a PrimeNG text button whose aria-label defaults to the locale copy of "Copier {label}" ("{label} kopiëren" in Dutch)',
      'Override the accessible name with ariaLabel when the visible label is not enough on its own',
      'The copy icon is decorative (pds-icon without label → aria-hidden); bullet separators between chips must be aria-hidden="true"',
    ],
    keyboardSupport: [
      'Native button: Tab focuses the chip, Enter or Space copies the value',
      'A disabled chip is skipped in the tab order',
    ],
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
      '--pds-font-weight-bold',
      '--pds-font-weight-regular',
    ],
  },
  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Visible label prefix (e.g. Territoire).',
    },
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'Text copied to the clipboard.',
    },
    {
      name: 'ariaLabel',
      type: 'string | undefined',
      required: false,
      default: 'undefined',
      description:
        'Accessible name; defaults to the locale copy of Copier {label}.',
    },
    {
      name: 'iconSize',
      type: 'IconSize',
      required: false,
      default: 'xs',
      description:
        'Copy icon size — sm on the overview card, xs in the drawer.',
    },
    {
      name: 'iconPosition',
      type: 'CopyableTextIconPosition',
      required: false,
      default: 'start',
      description:
        'Copy icon before the label (start) or after the value (end — Profile header identifier chip).',
    },
    {
      name: 'labelWeight',
      type: 'CopyableTextLabelWeight',
      required: false,
      default: 'semibold',
      description:
        'Label weight — semibold, or regular beside the bold value (Profile header identifier chip).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'When true, the button is inert (e.g. parent loading state).',
    },
    {
      name: 'copied',
      type: 'output<string>',
      required: false,
      description:
        'Emitted with the copied value after a successful clipboard write.',
    },
  ],
  aiHints: {
    priority: 'high',
    context:
      'Reusable copy-to-clipboard chip for affiliate identifiers and similar metadata. Used in pds-profile-header (iconPosition end, labelWeight regular), pds-profile-drawer and the deprecated pds-profile-card. Clipboard API with execCommand fallback lives in copy-to-clipboard.ts.',
    selectionCriteria: {},
    keywords: [
      'copy',
      'clipboard',
      'identifier',
      'metadata chip',
      'Territoire',
      'NISS',
    ],
  },
  examples: [],
};
