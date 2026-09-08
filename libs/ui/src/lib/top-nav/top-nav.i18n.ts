import type { PdsMessages } from '../i18n';

export const TopNavMessages = {
  fr: {
    userMenu: 'Menu utilisateur',
    breadcrumb: 'Fil d’Ariane',
  },
  nl: {
    userMenu: 'Gebruikersmenu',
    breadcrumb: 'Kruimelpad',
  },
} as const satisfies PdsMessages<{
  userMenu: string;
  breadcrumb: string;
}>;
