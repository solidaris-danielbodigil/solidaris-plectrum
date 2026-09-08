import type { PdsMessages } from '../i18n';

export const ProfileCardMessages = {
  fr: {
    statusActionPrefix: 'Actions à réaliser: ',
    statusActionsMultiple: 'Actions à réaliser',
    statusActionCount: (n: number) =>
      n === 1 ? '1 action à réaliser' : `${n} actions à réaliser`,
    showMenu: (label: string) => `Afficher le menu pour ${label}`,
    showMenuFallback: 'Afficher le menu',
    actionFallback: 'Action',
  },
  nl: {
    statusActionPrefix: 'Uit te voeren acties: ',
    statusActionsMultiple: 'Uit te voeren acties',
    statusActionCount: (n: number) =>
      n === 1 ? '1 uit te voeren actie' : `${n} uit te voeren acties`,
    showMenu: (label: string) => `Menu weergeven voor ${label}`,
    showMenuFallback: 'Menu weergeven',
    actionFallback: 'Actie',
  },
} as const satisfies PdsMessages<{
  statusActionPrefix: string;
  statusActionsMultiple: string;
  statusActionCount: (n: number) => string;
  showMenu: (label: string) => string;
  showMenuFallback: string;
  actionFallback: string;
}>;
