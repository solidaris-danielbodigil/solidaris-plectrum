// Eva Martinez demo document detail data — Figma iSHARE-Audit node 324:5860.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1

import {
  isEvaMartinezAffiliate,
  JACK_MOTA_NISS,
} from '../affiliate-mock.constants';
import type {
  AffiliateDocumentDetail,
  DocumentMoreDetails,
} from './affiliate-document-detail.types';
import { COMMENT_ICONS, MORE_DETAILS_LABEL } from './affiliate-document-detail.types';

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
      id: 'recu-20-01-2026',
      dateLabel: '20/01/2026',
      status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
      markerIcon: 'bi bi-save',
      markerTone: 'info',
      rows: [
        {
          date: '20/01/2026 09:15:00',
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
            moreDetails: placeholderMoreDetails('F.D.R. employeur', '05/12/2025'),
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
            moreDetails: placeholderMoreDetails(
              'F.D.R. affilié - Incapacité de travail',
              '05/12/2025',
            ),
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
            moreDetails: placeholderMoreDetails('Compte financier - Liasse', '05/12/2025'),
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
            status: {
              label: 'En attente',
              severity: 'info',
              icon: 'bi bi-clock',
            },
            workerComment: {
              severity: 'warn',
              text: 'Pas de paiement reçu pour le moment - 28/12/2025 09:00',
              icon: COMMENT_ICONS.warn,
            },
            crossReference: {
              label: 'Calcul primaire bloqué — C4 manquant',
              documentId: 'doc-demande-primaire',
              stepValue: 3,
              panelId: 'calcul',
            },
            actions: [],
            details: [
              {
                label: 'Période concernée',
                value: { from: '25/12/2025', to: '27/12/2025' },
              },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: placeholderMoreDetails('Paiement', '28/12/2025'),
          },
        ],
      },
      {
        value: 2,
        label: 'Certificat',
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
            moreDetails: placeholderMoreDetails('F.D.R. employeur', '06/01/2026'),
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
              text: 'En attente du flux employeur - 08/01/2026 15:56',
              icon: COMMENT_ICONS.info,
            },
            actions: FDR_PANEL_ACTIONS,
            details: FDR_PANEL_DETAILS_RECHUTE,
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: placeholderMoreDetails(
              'F.D.R. affilié - Incapacité de travail',
              '06/01/2026',
            ),
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
            moreDetails: placeholderMoreDetails('Compte financier - Liasse', '06/01/2026'),
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
            status: {
              label: 'En attente',
              severity: 'info',
              icon: 'bi bi-clock',
            },
            actions: [
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '10/01/2026' },
              { label: 'Numéro de certificat', value: '26/1005678' },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: placeholderMoreDetails('Calcul', '10/01/2026'),
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
              { label: 'Date de réception', value: '20/01/2026' },
              { label: 'Numéro de certificat', value: '26/1001234' },
              {
                label: 'Période',
                value: { from: '20/01/2026', to: '12/06/2026' },
              },
            ],
            moreDetailsLabel: MORE_DETAILS_LABEL,
            moreDetails: CERTIFICAT_ITT_CLOTURE_MORE_DETAILS,
          },
        ],
      },
      { value: 2, label: 'Feuilles de renseignement', panels: [] },
      { value: 3, label: 'Calcul', panels: [] },
    ],
  },
  'doc-c4': {
    documentId: 'doc-c4',
    title: 'Attestation C4',
    activeStep: 1,
    layout: 'standalone',
    banner: {
      severity: 'warn',
      text: 'Document reçu mais non rattaché au parcours',
      icon: COMMENT_ICONS.warn,
    },
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
                  status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
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
                  status: { label: 'Reçu', severity: 'info', icon: 'bi bi-save' },
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
};

export const JACK_MOTA_DOCUMENT_DETAILS: Record<string, AffiliateDocumentDetail> =
  {
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
              moreDetails: placeholderMoreDetails('Certificat médical', '01/03/2026'),
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
