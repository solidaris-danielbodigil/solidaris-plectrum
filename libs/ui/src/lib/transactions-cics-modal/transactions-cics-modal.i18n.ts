import type { PdsMessages } from '../i18n';

export const TransactionsCicsModalMessages = {
  fr: {
    header: 'Transactions CICS',
    warning:
      "Les transactions CICS s'ouvrent dans une application externe. Vérifiez que vous êtes connecté à CICS avant de lancer une transaction.",
    searchPlaceholder: 'Rechercher une transaction...',
    searchAriaLabel: 'Rechercher une transaction CICS',
    columnTransaction: 'Transaction',
    columnDescription: 'Description',
    columnActions: 'Actions',
    launch: (code: string) => `Lancer ${code} dans CICS`,
    empty: 'Aucune transaction ne correspond à votre recherche.',
    close: 'Fermer',
  },
  nl: {
    header: 'CICS-transacties',
    warning:
      'CICS-transacties worden geopend in een externe toepassing. Controleer of u met CICS verbonden bent voordat u een transactie start.',
    searchPlaceholder: 'Zoek een transactie...',
    searchAriaLabel: 'Een CICS-transactie zoeken',
    columnTransaction: 'Transactie',
    columnDescription: 'Beschrijving',
    columnActions: 'Acties',
    launch: (code: string) => `${code} openen in CICS`,
    empty: 'Geen transactie komt overeen met uw zoekopdracht.',
    close: 'Sluiten',
  },
} as const satisfies PdsMessages<{
  header: string;
  warning: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  columnTransaction: string;
  columnDescription: string;
  columnActions: string;
  launch: (code: string) => string;
  empty: string;
  close: string;
}>;
