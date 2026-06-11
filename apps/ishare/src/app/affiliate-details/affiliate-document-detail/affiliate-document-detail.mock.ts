// Eva Martinez demo document detail data — Figma iSHARE-Audit node 324:5860.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1

import type {
  AffiliateDocumentDetail,
  DocumentMoreDetails,
} from './affiliate-document-detail.types';
import { COMMENT_ICONS } from './affiliate-document-detail.types';

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
      status: { label: 'Accepté', severity: 'success', icon: 'bi bi-check-all' },
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

const FDR_PANEL_DETAILS = [
  { label: 'Date de réception', value: '05/12/2025' },
  { label: 'Date du risque', value: '24/11/2025' },
];

const FDR_PANEL_ACTIONS = [
  { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
  { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
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
            moreDetailsLabel: 'Voir plus de details',
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
            moreDetailsLabel: 'Voir plus de details',
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
            moreDetailsLabel: 'Voir plus de details',
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
            moreDetailsLabel: 'Voir plus de details',
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
              severity: 'info',
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
            moreDetailsLabel: 'Voir plus de details',
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
      { value: 1, label: 'Certificat médical', panels: [] },
      { value: 2, label: 'Feuilles de renseignement', panels: [] },
      { value: 3, label: 'Calcul', panels: [] },
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
              label: 'En traitement',
              severity: 'warn',
              icon: 'bi bi-hourglass-split',
            },
            actions: [],
            details: [
              { label: 'Date de réception', value: '02/01/2026' },
              {
                label: 'Période',
                value: { from: '01/01/2026', to: '15/01/2026' },
              },
            ],
            moreDetailsLabel: 'Voir plus de details',
          },
        ],
      },
      { value: 2, label: 'Feuilles de renseignement', panels: [] },
      { value: 3, label: 'Calcul', panels: [] },
    ],
  },
  'doc-cloture-primaire': {
    documentId: 'doc-cloture-primaire',
    title: 'Demande Primaire - Régime général',
    activeStep: 3,
    steps: [
      {
        value: 1,
        label: 'Certificat médical',
        panels: [
          {
            id: 'certificat-cloture',
            title: 'Certificat ITT',
            status: {
              label: 'Clôturé',
              severity: 'secondary',
              icon: 'bi bi-clock-history',
            },
            actions: [],
            details: [
              { label: 'Date de réception', value: '20/01/2026' },
              {
                label: 'Période',
                value: { from: '20/01/2026', to: '12/06/2026' },
              },
            ],
            moreDetailsLabel: 'Voir plus de details',
          },
        ],
      },
      {
        value: 2,
        label: 'Feuilles de renseignement',
        panels: [
          {
            id: 'fdr-cloture',
            title: 'F.D.R. employeur',
            status: {
              label: 'Clôturé',
              severity: 'secondary',
              icon: 'bi bi-clock-history',
            },
            actions: FDR_PANEL_ACTIONS,
            details: [
              { label: 'Date de réception', value: '28/01/2026' },
              { label: 'Date du risque', value: '20/01/2026' },
            ],
            moreDetailsLabel: 'Voir plus de details',
          },
        ],
      },
      {
        value: 3,
        label: 'Calcul',
        panels: [
          {
            id: 'calcul-cloture',
            title: 'Calcul',
            status: {
              label: 'Clôturé',
              severity: 'secondary',
              icon: 'bi bi-clock-history',
            },
            actions: [],
            details: [{ label: 'Date de clôture', value: '12/06/2026' }],
            moreDetailsLabel: 'Voir plus de details',
          },
        ],
      },
    ],
  },
};
