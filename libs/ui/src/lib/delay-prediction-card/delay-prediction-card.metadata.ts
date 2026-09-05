import type { ComponentMetadata } from '@solidaris/contracts';

export const DelayPredictionCardMetadata: ComponentMetadata = {
  component: {
    name: 'DelayPredictionCard',
    category: 'molecules',
    description:
      'Prédiction du délai — days remaining and predicted closure date for a document (Figma 704:11968).',
    type: 'display',
    path: 'libs/ui/src/lib/delay-prediction-card/delay-prediction-card.component.ts',
    primeNgComponent: 'Divider',
    bemBlock: 'c-delay-prediction-card',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_components.delay-prediction-card.scss',
    created: '2026-09-05',
    modified: '2026-09-05',
  },
  usage: {
    useCases: [
      'Document detail sidebar — predicted processing delay',
      'Dossier follow-up panels',
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
        scenario: 'Generic KPI tile',
        reason: 'The card is specific to delay prediction semantics.',
        alternative: 'Compose a p-card with tokens instead.',
      },
    ],
  },
  props: [
    { name: 'unavailable', type: 'boolean', default: 'false', description: 'Empty state when no prediction is available.', required: false },
    { name: 'daysRemaining', type: 'number | null', default: 'null', description: 'Days remaining before predicted closure.', required: false },
    { name: 'predictedCloseDate', type: 'string | null', default: 'null', description: 'Formatted predicted closure date.', required: false },
  ],
  behavior: {
    states: ['default', 'unavailable'],
  },
  accessibility: {
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [],
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
