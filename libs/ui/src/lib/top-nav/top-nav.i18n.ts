import type { PdsMessages } from '../i18n';

export const TopNavMessages = {
  fr: {
    userMenu: 'Menu utilisateur',
    breadcrumb: 'Fil d’Ariane',
    localeSwitcher: 'Langue',
    localeFr: 'Français',
    localeNl: 'Néerlandais',
  },
  nl: {
    userMenu: 'Gebruikersmenu',
    breadcrumb: 'Kruimelpad',
    localeSwitcher: 'Taal',
    localeFr: 'Frans',
    localeNl: 'Nederlands',
  },
} as const satisfies PdsMessages<{
  userMenu: string;
  breadcrumb: string;
  localeSwitcher: string;
  localeFr: string;
  localeNl: string;
}>;
