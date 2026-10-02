import type { PdsMessages } from '../i18n';

export const ProfileHeaderMessages = {
  fr: {
    statusActionPrefix: 'Actions à réaliser: ',
    statusActionsMultiple: 'Actions à réaliser',
    // Label in name (WCAG 2.5.3): visible « Actions à réaliser » + count badge.
    statusActionCount: (n: number) => `Actions à réaliser (${n})`,
    showMenu: (label: string) => `Afficher le menu pour ${label}`,
    showMenuFallback: 'Afficher le menu',
    actionFallback: 'Action',
    infoTagsLabel: 'Filtres rapides',
  },
  nl: {
    statusActionPrefix: 'Uit te voeren acties: ',
    statusActionsMultiple: 'Uit te voeren acties',
    statusActionCount: (n: number) => `Uit te voeren acties (${n})`,
    showMenu: (label: string) => `Menu weergeven voor ${label}`,
    showMenuFallback: 'Menu weergeven',
    actionFallback: 'Actie',
    infoTagsLabel: 'Snelfilters',
  },
} as const satisfies PdsMessages<{
  statusActionPrefix: string;
  statusActionsMultiple: string;
  statusActionCount: (n: number) => string;
  showMenu: (label: string) => string;
  showMenuFallback: string;
  actionFallback: string;
  infoTagsLabel: string;
}>;
