// Eva Martinez demo document detail data — Figma iSHARE-Audit node 324:5860.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1

import type { AffiliateDocumentDetail } from './affiliate-document-detail.types';

const FDR_PANEL_DETAILS = [
  { label: 'Date de réception', value: '26/01/2026' },
  { label: 'Date du risque', value: '06/01/2026' },
];

const FDR_PANEL_ACTIONS = [
  { label: 'Iris', icon: 'bi bi-box-arrow-up-right' },
  { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
];

export const EVA_MARTINEZ_DOCUMENT_DETAILS: Record<string, AffiliateDocumentDetail> = {
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
                value: { from: '24/11/2025', to: '24/12/2025' },
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
            countTag: {
              label: '1',
              severity: 'info',
              icon: 'bi bi-chat',
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
            countTag: {
              label: '1',
              severity: 'warn',
              icon: 'bi bi-exclamation-triangle',
            },
            message: {
              severity: 'warn',
              text: "Veuillez nous faire parvenir une copie de votre C4 dans les plus brefs délais. Le cas échéant, nous ne serons pas en mesure de poursuivre le traitement de votre demande d'indemnité.",
            },
            actions: [
              { label: 'Transactions CICS', icon: 'bi bi-box-arrow-up-right' },
            ],
            details: [
              { label: 'Date de réception', value: '24/11/2025' },
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
      { value: 1, label: 'Certificat médical', panels: [] },
      { value: 2, label: 'Feuilles de renseignement', panels: [] },
      { value: 3, label: 'Calcul', panels: [] },
    ],
  },
};
