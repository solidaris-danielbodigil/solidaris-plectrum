// Eva Martinez demo document detail data — Figma iSHARE-Audit node 324:5860.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1

import {
  isEvaMartinezAffiliate,
  JACK_MOTA_NISS,
} from '../affiliate-mock.constants';
import type {
  AffiliateDocumentDetail,
  DocumentCertificatPanel,
  DocumentMoreDetails,
} from './affiliate-document-detail.types';
import {
  COMMENT_ICONS,
  MORE_DETAILS_LABEL,
} from './affiliate-document-detail.types';

function placeholderMoreDetails(
  panelTitle: string,
  dateLabel = '—',
): DocumentMoreDetails {
  return {
    events: [
      {
        id: `placeholder-${panelTitle.toLowerCase().replace(/\s+/g, '-')}`,
        dateLabel,
        status: {
          label: 'Historique',
          severity: 'info',
          icon: 'bi bi-clock-history',
        },
        markerIcon: 'bi bi-clock-history',
        markerTone: 'info',
        rows: [
          {
            date: dateLabel,
            description: `Historique détaillé pour ${panelTitle}.`,
            application: 'iSHARE',
            source: 'IGED',
          },
        ],
      },
    ],
  };
}

// Figma iSHARE-Audit node 382:10723 — drawer plus de details certif ITT.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=382-10723

const CERTIFICAT_ITT_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-24-11-2025',
      dateLabel: '24/11/2025',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '24/11/2025 14:30:00',
          description: {
            kind: 'tag',
            label: 'Reçu',
            severity: 'info',
            icon: 'bi bi-save',
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'en-traitement-25-11-2025',
      dateLabel: '25/11/2025',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '25/11/2025 12:30:00',
          description: 'Dossier verrouillé pour traitement',
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
        {
          date: '25/11/2025 14:30:00',
          description: {
            kind: 'multiline',
            lines: [
              'UCIT encodé Accepté',
              'Numéro de CIT:',
              '25/1256332',
              'Incapacité',
            ],
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'accepte-27-11-2025',
      dateLabel: '27/11/2025',
      status: {
        label: 'Accepté',
        severity: 'success',
        icon: 'bi bi-check-all',
      },
      markerIcon: 'bi bi-check-all',
      markerTone: 'success',
      rows: [
        {
          date: '27/11/2025 14:30:00',
          description: {
            kind: 'tag',
            label: 'Accepté - Auto',
            severity: 'success',
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
  ],
};

const CERTIFICAT_ITT_CLOTURE_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-20-05-2026',
      dateLabel: '20/05/2026',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '20/05/2026 09:15:00',
          description: {
            kind: 'tag',
            label: 'Reçu',
            severity: 'info',
            icon: 'bi bi-save',
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'en-traitement-21-01-2026',
      dateLabel: '21/01/2026',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '21/01/2026 10:00:00',
          description: 'Dossier verrouillé pour traitement',
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'accepte-22-01-2026',
      dateLabel: '22/01/2026',
      status: {
        label: 'Accepté',
        severity: 'success',
        icon: 'bi bi-check-all',
      },
      markerIcon: 'bi bi-check-all',
      markerTone: 'success',
      rows: [
        {
          date: '22/01/2026 11:30:00',
          description: {
            kind: 'tag',
            label: 'Accepté - Auto',
            severity: 'success',
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
  ],
};

const CERTIFICAT_PROLONGATION_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-25-12-2025',
      dateLabel: '25/12/2025',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '25/12/2025 08:45:00',
          description: {
            kind: 'tag',
            label: 'Reçu',
            severity: 'info',
            icon: 'bi bi-save',
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'accepte-27-12-2025',
      dateLabel: '27/12/2025',
      status: {
        label: 'Accepté',
        severity: 'success',
        icon: 'bi bi-check-all',
      },
      markerIcon: 'bi bi-check-all',
      markerTone: 'success',
      rows: [
        {
          date: '27/12/2025 16:00:00',
          description: {
            kind: 'tag',
            label: 'Accepté - Auto',
            severity: 'success',
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
  ],
};

const CERTIFICAT_ITT_RECHUTE_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-02-01-2026',
      dateLabel: '02/01/2026',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '02/01/2026 10:00:00',
          description: {
            kind: 'tag',
            label: 'Reçu',
            severity: 'info',
            icon: 'bi bi-save',
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'en-traitement-03-01-2026',
      dateLabel: '03/01/2026',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '03/01/2026 11:30:00',
          description: 'Dossier verrouillé pour traitement',
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'accepte-04-01-2026',
      dateLabel: '04/01/2026',
      status: {
        label: 'Accepté',
        severity: 'success',
        icon: 'bi bi-check-all',
      },
      markerIcon: 'bi bi-check-all',
      markerTone: 'success',
      rows: [
        {
          date: '04/01/2026 14:00:00',
          description: {
            kind: 'tag',
            label: 'Accepté - Auto',
            severity: 'success',
          },
          application: 'Gestion des certificats ITT',
          source: 'IGED',
        },
      ],
    },
  ],
};

// Figma iSHARE-Audit — FDR panels drawer (Reçu → En traitement → Clôturé).
const FDR_EMPLOYEUR_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-05-12-2025',
      dateLabel: '05/12/2025',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '05/12/2025 00:00',
          description: 'Reçu flux',
          application: 'Gestion de feuilles de renseignement',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'en-traitement-06-12-2025',
      dateLabel: '06/12/2025',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '06/12/2025 09:30:00',
          description: 'En traitement',
          application: 'Gestion de feuilles de renseignement',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'cloture-09-12-2025',
      dateLabel: '09/12/2025',
      status: {
        label: 'Clôturé',
        severity: 'secondary',
        icon: 'bi bi-clock-history',
      },
      markerIcon: 'bi bi-clock-history',
      markerTone: 'secondary',
      rows: [
        {
          date: '09/12/2025 14:15:00',
          description: {
            kind: 'tag',
            label: 'Clôturé',
            severity: 'secondary',
            icon: 'bi bi-clock-history',
          },
          application: 'Gestion de feuilles de renseignement',
          source: 'IGED',
        },
      ],
    },
  ],
};

const FDR_AFFILIE_INCAPACITE_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-05-12-2025',
      dateLabel: '05/12/2025',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '05/12/2025 00:00',
          description: 'Reçu flux',
          application: 'Gestion de feuilles de renseignement',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'en-traitement-08-12-2025',
      dateLabel: '08/12/2025',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '08/12/2025 10:00:00',
          description: 'En traitement',
          application: 'Gestion de feuilles de renseignement',
          source: 'IGED',
        },
      ],
    },
    {
      id: 'cloture-11-12-2025',
      dateLabel: '11/12/2025',
      status: {
        label: 'Clôturé',
        severity: 'secondary',
        icon: 'bi bi-clock-history',
      },
      markerIcon: 'bi bi-clock-history',
      markerTone: 'secondary',
      rows: [
        {
          date: '11/12/2025 11:45:00',
          description: {
            kind: 'tag',
            label: 'Clôturé',
            severity: 'secondary',
            icon: 'bi bi-clock-history',
          },
          application: 'Gestion de feuilles de renseignement',
          source: 'IGED',
        },
      ],
    },
  ],
};

const COMPTE_FINANCIER_LIASSE_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-05-12-2025',
      dateLabel: '05/12/2025',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '05/12/2025 00:00',
          description: 'Reçu flux',
          application: 'Gestion du compte financier',
          source: 'UOPV01RPA',
        },
        {
          date: '10/12/2025 15:56',
          description: 'UOPV encodé en 9M à la réception',
          application: 'Gestion du compte financier',
          source: 'UOPV01RPA',
        },
      ],
    },
    {
      id: 'en-traitement-10-12-2025',
      dateLabel: '10/12/2025',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '10/12/2025 16:00:00',
          description: 'Liasse compte financier en cours de traitement',
          application: 'Gestion du compte financier',
          source: 'UOPV01RPA',
        },
      ],
    },
    {
      id: 'cloture-12-12-2025',
      dateLabel: '12/12/2025',
      status: {
        label: 'Clôturé',
        severity: 'secondary',
        icon: 'bi bi-clock-history',
      },
      markerIcon: 'bi bi-clock-history',
      markerTone: 'secondary',
      rows: [
        {
          date: '12/12/2025 10:30:00',
          description: {
            kind: 'tag',
            label: 'Clôturé',
            severity: 'secondary',
            icon: 'bi bi-clock-history',
          },
          application: 'Gestion du compte financier',
          source: 'UOPV01RPA',
        },
      ],
    },
  ],
};

// doc-rechute step 2 FDR panels — Reçu → En traitement (no Clôturé).
const FDR_EMPLOYEUR_RECHUTE_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-06-01-2026',
      dateLabel: '06/01/2026',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '06/01/2026 00:00',
          description: 'Reçu flux',
          application: 'Gestion du flux urp01',
          source: 'URP01RPA',
        },
      ],
    },
    {
      id: 'en-traitement-07-01-2026',
      dateLabel: '07/01/2026',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '07/01/2026 09:30:00',
          description: 'Flux employeur en cours de traitement',
          application: 'Gestion du flux urp01',
          source: 'URP01RPA',
        },
      ],
    },
  ],
};

const FDR_AFFILIE_RECHUTE_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-06-01-2026',
      dateLabel: '06/01/2026',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '06/01/2026 00:00',
          description: 'Reçu flux',
          application: 'Gestion du flux urp02',
          source: 'URP02RPA',
        },
      ],
    },
    {
      id: 'en-traitement-08-01-2026',
      dateLabel: '08/01/2026',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '08/01/2026 10:00:00',
          description: 'En attente du flux employeur',
          application: 'Gestion du flux urp02',
          source: 'URP02RPA',
        },
      ],
    },
  ],
};

const COMPTE_FINANCIER_RECHUTE_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-06-01-2026',
      dateLabel: '06/01/2026',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '06/01/2026 00:00',
          description: 'Reçu flux',
          application: 'Gestion du compte financier',
          source: 'UOPV01RPA',
        },
        {
          date: '08/01/2026 15:56',
          description: 'UOPV encodé en 9M à la réception',
          application: 'Gestion du compte financier',
          source: 'UOPV01RPA',
        },
      ],
    },
    {
      id: 'en-traitement-08-01-2026',
      dateLabel: '08/01/2026',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '08/01/2026 16:00:00',
          description: 'Liasse compte financier en cours de traitement',
          application: 'Gestion du compte financier',
          source: 'UOPV01RPA',
        },
      ],
    },
  ],
};

const FDR_PANEL_DETAILS = [
  { label: 'Date de réception', value: '05/12/2025' },
  { label: 'Date du risque', value: '24/11/2025' },
];

const FDR_PANEL_DETAILS_RECHUTE = [
  { label: 'Date de réception', value: '06/01/2026' },
  { label: 'Date du risque', value: '01/01/2026' },
];

const FDR_PANEL_ACTIONS = [
  { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
  { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
];

const CHANGEMENT_ADRESSE_MORE_DETAILS: DocumentMoreDetails = {
  events: [
    {
      id: 'recu-15-06-2024',
      dateLabel: '15/06/2024',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '15/06/2024 09:00:00',
          description: {
            kind: 'tag',
            label: 'Reçu',
            severity: 'info',
            icon: 'bi bi-save',
          },
          application: "Population - Changement d'adresse",
          source: 'IGED',
        },
      ],
    },
    {
      id: 'en-traitement-16-06-2024',
      dateLabel: '16/06/2024',
      status: {
        label: 'En traitement',
        severity: 'warn',
        icon: 'bi bi-hourglass-split',
      },
      markerIcon: 'bi bi-hourglass-split',
      markerTone: 'warn',
      rows: [
        {
          date: '16/06/2024 10:30:00',
          description: 'En traitement',
          application: "Population - Changement d'adresse",
          source: 'IGED',
        },
      ],
    },
    {
      id: 'cloture-20-06-2024',
      dateLabel: '20/06/2024',
      status: {
        label: 'Clôturé',
        severity: 'secondary',
        icon: 'bi bi-clock-history',
      },
      markerIcon: 'bi bi-clock-history',
      markerTone: 'secondary',
      rows: [
        {
          date: '20/06/2024 14:00:00',
          description: {
            kind: 'tag',
            label: 'Clôturé',
            severity: 'secondary',
            icon: 'bi bi-clock-history',
          },
          application: "Population - Changement d'adresse",
          source: 'IGED',
        },
      ],
    },
  ],
};

/** 2e demande primaire — required FDR panels not yet received (legacy iSHARE: grayed accordion). */
const CLOTURE_PRIMAIRE_FDR_PANELS_NOT_RECEIVED: DocumentCertificatPanel[] = [
  {
    id: 'fdr-employeur-cloture',
    title: 'F.D.R. employeur',
    disabled: true,
    status: {
      label: 'Non reçu',
      severity: 'secondary',
    },
    actions: [],
    details: [],
    moreDetailsLabel: MORE_DETAILS_LABEL,
  },
  {
    id: 'fdr-affilie-incapacite-cloture',
    title: 'F.D.R. affilié - Incapacité de travail',
    disabled: true,
    status: {
      label: 'Non reçu',
      severity: 'secondary',
    },
    actions: [],
    details: [],
    moreDetailsLabel: MORE_DETAILS_LABEL,
  },
  {
    id: 'compte-financier-liasse-cloture',
    title: 'Compte financier - Liasse',
    disabled: true,
    status: {
      label: 'Non reçu',
      severity: 'secondary',
    },
    actions: [],
    details: [],
    moreDetailsLabel: MORE_DETAILS_LABEL,
  },
];

export const EVA_MARTINEZ_DOCUMENT_DETAILS: Record<
  string,
  AffiliateDocumentDetail
> = {
  'doc-demande-primaire': {
    documentId: 'doc-demande-primaire',
    title: 'Demande Primaire - Régime général',
    activeStep: 1,
    steps: [
      {
        value: 1,
        label: 'Certificat médical',
        panels: [
          {
            id: 'certificat-itt',
            title: 'Certificat ITT',
            status: {
              label: 'Accepté',
              severity: 'success',
              icon: 'bi bi-check-lg',
            },
            actions: [
              { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '24/11/2025' },
              { label: 'Numéro de certificat', value: '25/1256332' },
              {
                label: 'Période',
                value: { from: '24/11/2025', to: '27/12/2025' },
              },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: CERTIFICAT_ITT_MORE_DETAILS,
          },
        ],
      },
      {
        value: 2,
        label: 'Feuilles de renseignement',
        panels: [
          {
            id: 'fdr-employeur',
            title: 'F.D.R. employeur',
            status: {
              label: 'Clôturé',
              severity: 'secondary',
              icon: 'bi bi-clock-history',
            },
            actions: FDR_PANEL_ACTIONS,
            details: FDR_PANEL_DETAILS,
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: FDR_EMPLOYEUR_MORE_DETAILS,
          },
          {
            id: 'fdr-affilie-incapacite',
            title: 'F.D.R. affilié - Incapacité de travail',
            status: {
              label: 'Clôturé',
              severity: 'secondary',
              icon: 'bi bi-clock-history',
            },
            workerComment: {
              severity: 'info',
              text: 'En attente du flux employeur - 10/12/2025 15:56',
              icon: COMMENT_ICONS.info,
            },
            actions: FDR_PANEL_ACTIONS,
            details: FDR_PANEL_DETAILS,
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: FDR_AFFILIE_INCAPACITE_MORE_DETAILS,
          },
          {
            id: 'compte-financier-liasse',
            title: 'Compte financier - Liasse',
            status: {
              label: 'Clôturé',
              severity: 'secondary',
              icon: 'bi bi-clock-history',
            },
            workerComment: {
              severity: 'info',
              text: 'UOPV encodé en 9M à la réception - 10/12/2025 15:56',
              icon: COMMENT_ICONS.info,
            },
            actions: FDR_PANEL_ACTIONS,
            details: FDR_PANEL_DETAILS,
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: COMPTE_FINANCIER_LIASSE_MORE_DETAILS,
          },
        ],
      },
      {
        value: 3,
        label: 'Calcul',
        panels: [
          {
            id: 'calcul',
            title: 'Calcul',
            status: {
              label: 'En attente',
              severity: 'warn',
              icon: 'bi bi-clock',
            },
            workerComment: {
              severity: 'warn',
              text: "Veuillez nous faire parvenir une copie de votre C4 dans les plus brefs délais. Le cas échéant, nous ne serons pas en mesure de poursuivre le traitement de votre demande d'indemnité. - 15/12/2025 15:56",
              icon: COMMENT_ICONS.warn,
            },
            actions: [
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '10/12/2025' },
              { label: 'Numéro de certificat', value: '25/1256332' },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: placeholderMoreDetails('Calcul', '10/12/2025'),
          },
        ],
      },
    ],
  },
  'doc-incapacite': {
    documentId: 'doc-incapacite',
    title: 'Incapacité',
    activeStep: 1,
    steps: [
      {
        value: 1,
        label: 'Paiement',
        panels: [
          {
            id: 'paiement-incapacite',
            title: 'Paiement',
            disabled: true,
            status: {
              label: 'Non démarré',
              severity: 'secondary',
            },
            workerComment: {
              severity: 'info',
              text: 'Aucun paiement reçu pour le moment.',
              icon: COMMENT_ICONS.info,
            },
            actions: [],
            details: [],
            moreDetailsLabel: MORE_DETAILS_LABEL,
          },
        ],
      },
      {
        value: 2,
        label: 'Certificat de prolongation',
        panels: [
          {
            id: 'certificat-prolongation',
            title: 'Certificat ITT - Prolongation',
            status: {
              label: 'Accepté',
              severity: 'success',
              icon: 'bi bi-check-lg',
            },
            actions: [
              { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '25/12/2025' },
              { label: 'Numéro de certificat', value: '25/1256332' },
              {
                label: 'Période',
                value: { from: '25/12/2025', to: '27/12/2025' },
              },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: CERTIFICAT_PROLONGATION_MORE_DETAILS,
          },
        ],
      },
    ],
  },
  'doc-rechute': {
    documentId: 'doc-rechute',
    title: 'Rechute',
    activeStep: 1,
    steps: [
      {
        value: 1,
        label: 'Certificat médical',
        panels: [
          {
            id: 'certificat-rechute',
            title: 'Certificat ITT',
            status: {
              label: 'Accepté',
              severity: 'success',
              icon: 'bi bi-check-lg',
            },
            actions: [
              { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '02/01/2026' },
              { label: 'Numéro de certificat', value: '26/1005678' },
              {
                label: 'Période',
                value: { from: '01/01/2026', to: '15/01/2026' },
              },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: CERTIFICAT_ITT_RECHUTE_MORE_DETAILS,
          },
        ],
      },
      {
        value: 2,
        label: 'Feuilles de renseignement',
        panels: [
          {
            id: 'fdr-employeur-rechute',
            title: 'F.D.R. employeur',
            status: {
              label: 'En traitement',
              severity: 'warn',
              icon: 'bi bi-hourglass-split',
            },
            actions: FDR_PANEL_ACTIONS,
            details: FDR_PANEL_DETAILS_RECHUTE,
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: FDR_EMPLOYEUR_RECHUTE_MORE_DETAILS,
          },
          {
            id: 'fdr-affilie-rechute',
            title: 'F.D.R. affilié - Incapacité de travail',
            status: {
              label: 'En traitement',
              severity: 'warn',
              icon: 'bi bi-hourglass-split',
            },
            workerComment: {
              severity: 'info',
              text: 'Accident de travail',
              icon: COMMENT_ICONS.info,
            },
            actions: FDR_PANEL_ACTIONS,
            details: FDR_PANEL_DETAILS_RECHUTE,
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: FDR_AFFILIE_RECHUTE_MORE_DETAILS,
          },
          {
            id: 'compte-financier-rechute',
            title: 'Compte financier - Liasse',
            status: {
              label: 'En traitement',
              severity: 'warn',
              icon: 'bi bi-hourglass-split',
            },
            actions: FDR_PANEL_ACTIONS,
            details: FDR_PANEL_DETAILS_RECHUTE,
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: COMPTE_FINANCIER_RECHUTE_MORE_DETAILS,
          },
        ],
      },
      {
        value: 3,
        label: 'Calcul',
        panels: [
          {
            id: 'calcul-rechute',
            title: 'Calcul',
            disabled: true,
            status: {
              label: 'Non démarré',
              severity: 'secondary',
            },
            workerComment: {
              severity: 'info',
              text: "Le calcul des indemnités n'a pas encore commencé car les F.D.R. ne sont pas traitées.",
              icon: COMMENT_ICONS.info,
            },
            actions: [],
            details: [],
            moreDetailsLabel: MORE_DETAILS_LABEL,
          },
        ],
      },
    ],
  },
  'doc-cloture-primaire': {
    documentId: 'doc-cloture-primaire',
    title: 'Demande Primaire - Régime général',
    activeStep: 1,
    steps: [
      {
        value: 1,
        label: 'Certificat médical',
        panels: [
          {
            id: 'certificat-cloture',
            title: 'Certificat ITT',
            status: {
              label: 'Accepté',
              severity: 'success',
              icon: 'bi bi-check-lg',
            },
            actions: [
              { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '20/05/2026' },
              { label: 'Numéro de certificat', value: '26/1001234' },
              {
                label: 'Période',
                value: { from: '20/05/2026', to: '12/06/2026' },
              },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: CERTIFICAT_ITT_CLOTURE_MORE_DETAILS,
          },
        ],
      },
      {
        value: 2,
        label: 'Feuilles de renseignement',
        panels: CLOTURE_PRIMAIRE_FDR_PANELS_NOT_RECEIVED,
      },
      {
        value: 3,
        label: 'Calcul',
        panels: [
          {
            id: 'calcul-cloture-primaire',
            title: 'Calcul',
            disabled: true,
            status: {
              label: 'Non démarré',
              severity: 'secondary',
            },
            workerComment: {
              severity: 'info',
              text: "Le calcul des indemnités n'a pas encore commencé car les F.D.R. n'ont pas été reçues",
              icon: COMMENT_ICONS.info,
            },
            actions: [],
            details: [],
            moreDetailsLabel: MORE_DETAILS_LABEL,
          },
        ],
      },
    ],
  },
  'doc-c4': {
    documentId: 'doc-c4',
    title: 'Attestation C4',
    activeStep: 1,
    layout: 'standalone',
    steps: [
      {
        value: 1,
        label: 'C4',
        panels: [
          {
            id: 'c4-isolated',
            title: 'C4',
            status: {
              label: 'Reçu',
              severity: 'info',
              icon: 'bi bi-save',
            },
            actions: [
              { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '16/12/2025' },
              { label: 'Application', value: 'Gestion des indemnités' },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: {
              events: [
                {
                  id: 'recu-16-12-2025',
                  dateLabel: '16/12/2025',
                  status: {
                    label: 'Reçu',
                    severity: 'info',
                    icon: 'bi bi-save',
                  },
                  markerIcon: 'bi bi-save',
                  markerTone: 'info',
                  rows: [
                    {
                      date: '16/12/2025 10:15:00',
                      description: {
                        kind: 'tag',
                        label: 'Reçu',
                        severity: 'info',
                        icon: 'bi bi-save',
                      },
                      application: 'Gestion des indemnités',
                      source: 'IGED',
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  'doc-attestation-pedicure': {
    documentId: 'doc-attestation-pedicure',
    title: 'Attestation de soin pédicure',
    activeStep: 1,
    layout: 'standalone',
    steps: [
      {
        value: 1,
        label: 'Attestation de soin pédicure',
        panels: [
          {
            id: 'attestation-pedicure',
            title: 'Attestation de soin pédicure',
            status: {
              label: 'En traitement',
              severity: 'warn',
              icon: 'bi bi-hourglass-split',
            },
            actions: [
              { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '09/06/2026' },
              { label: 'Application', value: 'Remboursements AO/AC' },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: {
              events: [
                {
                  id: 'recu-09-06-2026',
                  dateLabel: '09/06/2026',
                  status: {
                    label: 'Reçu',
                    severity: 'info',
                    icon: 'bi bi-save',
                  },
                  markerIcon: 'bi bi-save',
                  markerTone: 'info',
                  rows: [
                    {
                      date: '09/06/2026 13:28:00',
                      description: {
                        kind: 'tag',
                        label: 'Reçu',
                        severity: 'info',
                        icon: 'bi bi-save',
                      },
                      application: 'Remboursements AO/AC',
                      source: 'IGED',
                    },
                  ],
                },
                {
                  id: 'en-traitement-10-06-2026',
                  dateLabel: '10/06/2026',
                  status: {
                    label: 'En traitement',
                    severity: 'warn',
                    icon: 'bi bi-hourglass-split',
                  },
                  markerIcon: 'bi bi-hourglass-split',
                  markerTone: 'warn',
                  rows: [
                    {
                      date: '10/06/2026 09:00:00',
                      description: 'Dossier verrouillé pour traitement',
                      application: 'Remboursements AO/AC',
                      source: 'IGED',
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  'doc-archive-changement-adresse': {
    documentId: 'doc-archive-changement-adresse',
    title: "Changement d'adresse",
    activeStep: 1,
    layout: 'standalone',
    steps: [
      {
        value: 1,
        label: "Changement d'adresse",
        panels: [
          {
            id: 'changement-adresse',
            title: "Changement d'adresse",
            status: {
              label: 'Clôturé',
              severity: 'secondary',
              icon: 'bi bi-clock-history',
            },
            actions: [{ label: 'Iris', icon: 'bi bi-box-arrow-up-right' }],
            details: [
              { label: 'Date de réception', value: '15/06/2024' },
              {
                label: 'Application',
                value: 'Population - Changement d\'adresse',
              },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: CHANGEMENT_ADRESSE_MORE_DETAILS,
          },
        ],
      },
    ],
  },
};

export const JACK_MOTA_DOCUMENT_DETAILS: Record<
  string,
  AffiliateDocumentDetail
> = {
  'doc-jack-certificat': {
    documentId: 'doc-jack-certificat',
    title: 'Certificat médical',
    activeStep: 1,
    steps: [
      {
        value: 1,
        label: 'Certificat',
        panels: [
          {
            id: 'certificat-jack',
            title: 'Certificat médical',
            status: {
              label: 'En traitement',
              severity: 'warn',
              icon: 'bi bi-hourglass-split',
            },
            actions: [],
            details: [{ label: 'Date de réception', value: '01/03/2026' }],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: placeholderMoreDetails(
              'Certificat médical',
              '01/03/2026',
            ),
          },
        ],
      },
    ],
  },
};

export function getDocumentDetailsForAffiliate(
  affiliateRouteId: string,
): Record<string, AffiliateDocumentDetail> {
  if (isEvaMartinezAffiliate(affiliateRouteId)) {
    return EVA_MARTINEZ_DOCUMENT_DETAILS;
  }

  if (affiliateRouteId === JACK_MOTA_NISS) {
    return JACK_MOTA_DOCUMENT_DETAILS;
  }

  return {};
}
