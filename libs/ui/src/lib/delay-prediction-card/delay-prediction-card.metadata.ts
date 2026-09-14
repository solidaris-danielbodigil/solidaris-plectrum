import type { ComponentMetadata } from '@solidaris/contracts';

export const DelayPredictionCardMetadata: ComponentMetadata = {
  component: {
    name: 'DelayPredictionCard',
    category: 'molecules',
    description:
      'Prédiction du délai — the days remaining and the predicted closure date of a document, side by side with an overflow-menu trigger. The section title ("Prédiction du délai", same style as "Détails") is rendered by the page outside the card.',
    type: 'display',
    path: 'libs/ui/src/lib/delay-prediction-card/delay-prediction-card.component.ts',
    primeNgComponent: 'Divider, Button',
    bemBlock: 'c-delay-prediction-card',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.delay-prediction-card.scss',
    figmaUrl: 'https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=704-11968',
    created: '2026-09-05',
    modified: '2026-09-09',
  },
  governance: {
    status: 'app',
    owner: 'ishare',
    note: 'iSHARE-only by design (delay prediction for dossier follow-up). Other applications propose to the core team instead of importing it.',
  },
  usage: {
    useCases: [
      'Document detail sidebar — predicted processing delay',
      'Dossier follow-up panels that show days remaining and a close date',
    ],
    commonPatterns: [
      {
        name: 'Prediction available',
        description: 'Days remaining plus the predicted closure date.',
        composition:
          '<pds-delay-prediction-card [daysRemaining]="12" predictedCloseDate="24/12/2025" />',
      },
      {
        name: 'Unavailable',
        description: 'Empty state when no prediction exists for the document.',
        composition: '<pds-delay-prediction-card [unavailable]="true" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'A generic KPI tile',
        reason: 'The card is hard-wired to delay-prediction semantics: two fixed metrics, fixed captions and an overflow menu.',
        alternative: 'Compose a p-card with tokens instead.',
      },
      {
        scenario: 'Screens outside iSHARE',
        reason: 'The card is app-owned — its labels, metric pair and menu are iSHARE delay-prediction semantics, not a design-system contract.',
        alternative: 'Propose the need to the core team; compose a generic p-card meanwhile.',
      },
    ],
  },
  anatomy: [
    { part: 'c-delay-prediction-card', role: 'Article named by aria-label (i18n)' },
    { part: 'c-delay-prediction-card__metric', role: 'Days remaining or predicted close date — value above its caption' },
    { part: 'c-delay-prediction-card__divider', role: 'PrimeNG vertical p-divider between metrics' },
    { part: 'c-delay-prediction-card__menu', role: 'Overflow menu trigger — PrimeNG outlined secondary button' },
    { part: 'c-delay-prediction-card__unavailable', role: 'Empty state with decorative warning icon' },
  ],
  props: [
    { name: 'unavailable', type: 'boolean', default: 'false', description: 'Empty state when no prediction is available.', required: false },
    { name: 'daysRemaining', type: 'number | null', default: 'null', description: 'Days remaining before predicted closure.', required: false },
    { name: 'predictedCloseDate', type: 'string | null', default: 'null', description: 'Formatted predicted closure date.', required: false },
    { name: 'menuClick', type: 'output<void>', required: false, description: 'Emitted when the card overflow menu is activated.' },
  ],
  behavior: {
    states: ['default', 'unavailable'],
    interactions: [
      'unavailable=true swaps the metric row for the empty message with a decorative warning icon',
      'The overflow button emits menuClick — the card does not own the menu itself',
      'daysRemaining and predictedCloseDate are rendered as given; the parent formats the date',
    ],
  },
  composition: {
    nestedComponents: ['Divider', 'Button'],
  },
  accessibility: {
    wcagLevel: 'AA',
    ariaAttributes: [
      'The card is an <article> named by aria-label — "Prédiction du délai" / "Termijnvoorspelling" from the locale messages',
      'The overflow control has an aria-label ("Plus d\'actions — prédiction du délai"); the warning icon is aria-hidden',
    ],
    keyboardSupport: [
      'The overflow trigger is a native button — Tab reaches it, Enter or Space emits menuClick',
      'The metrics are static text; nothing else takes focus',
    ],
    contrastRequirements: [
      'Days and date captions are visible text next to their values — meaning is never carried by colour alone',
    ],
  },
  tokens: {
    consumed: [
      '--pds-color-delay-prediction-bg',
      '--pds-color-delay-prediction-border',
      '--pds-radius-delay-prediction-card',
      '--pds-shadow-delay-prediction-card',
      '--pds-space-delay-prediction-card-padding-block',
      '--pds-space-delay-prediction-card-padding-inline',
      '--pds-space-delay-prediction-card-gap',
      '--pds-font-family-display',
      '--pds-text-delay-prediction-metric-size',
      '--pds-font-weight-bold',
      '--pds-text-delay-prediction-metric-line-height',
      '--pds-color-delay-prediction-metric',
      '--pds-color-delay-prediction-subtitle',
      '--pds-size-delay-prediction-menu-button',
      '--pds-base-unit',
      '--pds-color-delay-prediction-unavailable-icon',
      '--pds-color-delay-prediction-unavailable-text',
    ],
  },
  aiHints: {
    priority: 'low',
    context: 'iSHARE document-detail feature card. menuClick output opens the card menu.',
    selectionCriteria: {},
    keywords: ['delay', 'prediction', 'délai', 'document'],
  },
  examples: [
    {
      name: 'default',
      description: 'Prediction available',
      code: '<pds-delay-prediction-card [daysRemaining]="12" predictedCloseDate="24/12/2025" (menuClick)="onMenu()" />',
    },
  ],
};
