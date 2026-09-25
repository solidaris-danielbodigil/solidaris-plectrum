import type { PdsMessages } from '../i18n';

export type ProfileDrawerLabelSet = {
  details: string;
  documents: string;
  moreActions: string;
  close: string;
  general: string;
  contact: string;
  related: string;
  notes: string;
  call: string;
  email: string;
  quickActions: string;
};

export const ProfileDrawerMessages = {
  fr: {
    details: 'Détails',
    documents: 'Documents',
    moreActions: "Plus d'actions",
    close: 'Fermer',
    general: 'Informations générales',
    contact: 'Coordonnées',
    related: 'Famille',
    notes: 'Notes',
    call: "Appeler l'affilié",
    email: "Envoyer un e-mail à l'affilié",
    quickActions: 'Actions rapides',
  },
  nl: {
    details: 'Details',
    documents: 'Documenten',
    moreActions: 'Meer acties',
    close: 'Sluiten',
    general: 'Algemene informatie',
    contact: 'Contactgegevens',
    related: 'Familie',
    notes: 'Notities',
    call: 'De aangeslotene bellen',
    email: 'E-mail versturen naar de aangeslotene',
    quickActions: 'Snelle acties',
  },
} as const satisfies PdsMessages<ProfileDrawerLabelSet>;
