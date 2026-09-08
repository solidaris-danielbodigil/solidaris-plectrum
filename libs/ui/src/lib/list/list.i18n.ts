import type { PdsMessages } from '../i18n';

export const ListMessages = {
  fr: {
    regionLabel: 'Suivi des documents',
    toggleGroup: 'Développer ou réduire le groupe',
    startDate: 'Date de début',
    endDate: 'Date de fin',
  },
  nl: {
    regionLabel: 'Opvolging van documenten',
    toggleGroup: 'Groep uit- of invouwen',
    startDate: 'Begindatum',
    endDate: 'Einddatum',
  },
} as const satisfies PdsMessages<{
  regionLabel: string;
  toggleGroup: string;
  startDate: string;
  endDate: string;
}>;
