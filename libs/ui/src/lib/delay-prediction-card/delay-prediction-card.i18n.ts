import type { PdsMessages } from '../i18n';

export const DelayPredictionCardMessages = {
  fr: {
    regionLabel: 'Prédiction du délai',
    empty: "Aucune prédiction de délais n'est disponible pour ce document",
    daysRemaining: 'Jours restants',
    predictedClose: 'Clôture prédite',
    menu: "Plus d'actions — prédiction du délai",
  },
  nl: {
    regionLabel: 'Termijnvoorspelling',
    empty: 'Er is geen termijnvoorspelling beschikbaar voor dit document.',
    daysRemaining: 'Resterende dagen',
    predictedClose: 'Voorspelde sluiting',
    menu: 'Meer acties — termijnvoorspelling',
  },
} as const satisfies PdsMessages<{
  regionLabel: string;
  empty: string;
  daysRemaining: string;
  predictedClose: string;
  menu: string;
}>;
