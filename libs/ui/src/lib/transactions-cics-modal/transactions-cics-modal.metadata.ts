import type { ComponentMetadata } from '@solidaris/contracts';

export const TransactionsCicsModalMetadata: ComponentMetadata = {
  component: {
    name: 'TransactionsCicsModal',
    category: 'organisms',
    description:
      'Legacy iShare Transactions CICS dialog — searchable table of transaction codes with launch links.',
    type: 'feedback',
    path: 'libs/ui/src/lib/transactions-cics-modal/transactions-cics-modal.component.ts',
    primeNgComponent: 'Dialog',
    bemBlock: 'c-transactions-cics-modal',
    itcssLayer: '06-components',
    scssPath: undefined,
    created: '2026-09-05',
    modified: '2026-09-05',
  },
  governance: {
    status: 'app',
    owner: 'ishare',
    note: 'Stock p-dialog with iSHARE transaction content. The pattern is iSHARE-only; the dialog itself is PrimeNG.',
  },
  usage: {
    useCases: ['Launching legacy CICS transactions from an affiliate dossier'],
    commonPatterns: [
      {
        name: 'Two-way visibility',
        description: 'Dialog visibility is a model(); rows default to the built-in CICS list.',
        composition: '<pds-transactions-cics-modal [(visible)]="cicsOpen" />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Generic data-table dialog',
        reason: 'The modal is bound to CICS transaction semantics (code, description, launch URL).',
        alternative: 'Compose p-dialog + p-table directly.',
      },
    ],
  },
  behavior: {
    states: ['closed', 'open', 'filtered'],
    interactions: ['Search filters code and description', 'Row action opens the launch URL'],
  },
  accessibility: {
    role: 'dialog',
    wcagLevel: 'AA',
    keyboardSupport: ['Escape closes the dialog', 'Tab cycles the search field and table rows'],
  },
  tokens: {
    consumed: [],
  },
  aiHints: {
    priority: 'low',
    context: 'iSHARE-specific legacy bridge. Uses pdsOverlayAppendTo so the dialog escapes clipped layouts.',
    selectionCriteria: {},
    keywords: ['cics', 'transactions', 'legacy', 'dialog'],
  },
  examples: [
    {
      name: 'default',
      description: 'Open the CICS modal with default rows',
      code: '<pds-transactions-cics-modal [(visible)]="cicsOpen" />',
    },
  ],
};
