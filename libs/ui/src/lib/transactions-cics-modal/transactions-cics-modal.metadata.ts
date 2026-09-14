import type { ComponentMetadata } from '@solidaris/contracts';

export const TransactionsCicsModalMetadata: ComponentMetadata = {
  component: {
    name: 'TransactionsCicsModal',
    category: 'organisms',
    description:
      'Legacy iSHARE "Transactions CICS" dialog: a warning banner, a search field and a table of transaction codes, each row with a CICS launch button that opens the transaction in a new tab.',
    type: 'feedback',
    path: 'libs/ui/src/lib/transactions-cics-modal/transactions-cics-modal.component.ts',
    primeNgComponent: 'Dialog, Message, IconField, InputText, Table, Button',
    bemBlock: 'c-transactions-cics-modal',
    itcssLayer: '06-components',
    scssPath: undefined,
    figmaUrl: 'https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-',
    created: '2026-09-05',
    modified: '2026-09-09',
  },
  governance: {
    status: 'app',
    owner: 'ishare',
    note: 'Stock p-dialog and p-table with iSHARE transaction content — the pattern is iSHARE-only, the components are PrimeNG. No dedicated Figma node: the link opens the Plectrum for PrimeNG (Main) kit where the stock Dialog and Table live.',
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
      {
        scenario: 'Screens outside iSHARE',
        reason: 'The row model is CICS code, description and launch URL — an iSHARE legacy bridge, not a design-system contract.',
        alternative: 'Other applications compose p-dialog + p-table with their own row model.',
      },
    ],
  },
  anatomy: [
    { part: 'p-dialog', role: 'Modal host — localised header, close button, Escape and mask dismiss; appended through pdsOverlayAppendTo' },
    { part: 'p-message', role: 'Warning banner above the search' },
    { part: 'c-transactions-cics-modal__search', role: 'p-iconfield with a role="searchbox" input that filters code and description' },
    { part: 'c-transactions-cics-modal__table', role: 'p-table of code / description / actions with scope="col" headers and a localised empty row' },
    { part: 'Row launch button', role: 'Small secondary p-button labelled CICS with an external-link icon; opens the launch URL' },
  ],
  composition: {
    nestedComponents: ['Dialog', 'Message', 'IconField', 'InputText', 'Table', 'Button'],
    slots: [],
  },
  props: [
    { name: 'visible', type: 'model<boolean>', required: false, default: 'false', description: 'Two-way visibility ([(visible)]) controlling open/close.' },
    { name: 'rows', type: 'TransactionsCicsRow[]', required: false, default: 'DEFAULT_TRANSACTIONS_CICS_ROWS', description: 'Transaction rows. Defaults to the built-in CICS list.' },
    { name: 'transactionLaunch', type: 'output<TransactionsCicsRow>', required: false, description: 'Emitted when a row launch action is activated.' },
  ],
  behavior: {
    states: ['closed', 'open', 'filtered', 'empty'],
    interactions: [
      'Search filters code and description as you type (case-insensitive); no match shows the localised empty row',
      'A launch button emits transactionLaunch and opens launchUrl in a new tab (noopener, noreferrer)',
      'The search query resets when the dialog hides',
    ],
  },
  accessibility: {
    role: 'dialog',
    wcagLevel: 'AA',
    ariaAttributes: [
      'Dialog role, name (localised header) and focus trap come from PrimeNG p-dialog; the close button is named through closeAriaLabel',
      'The search input is role="searchbox" with a localised aria-label',
      'Column headers use scope="col"',
      'Each launch button shows the visible label CICS and is named by the localised launch message ("Lancer {code} dans CICS"); its external-link icon is decorative',
    ],
    keyboardSupport: [
      'Escape or the mask closes the dialog (PrimeNG)',
      'Tab cycles the close button, the search field and the launch buttons inside the focus trap',
      'Enter / Space on a launch button opens the transaction in a new tab',
    ],
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
