// Eva Martinez demo document detail data — Figma iSHARE-Audit node 324:5860.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1

import type { AffiliateDocumentDetail } from './affiliate-document-detail.types';

export const EVA_MARTINEZ_DOCUMENT_DETAILS: Record<string, AffiliateDocumentDetail> = {
  'doc-demande-primaire': {
    documentId: 'doc-demande-primaire',
    title: 'Demande Primaire - Régime général',
    activeStep: 1,
    steps: [
      {
        value: 1,
        label: 'Certificat médical',
        addActionLabel: 'Ajouter un certificat',
        panels: [
          {
            id: 'certificat-itt',
            title: 'Certificat ITT',
            status: { label: 'Accepté', severity: 'success' },
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
      { value: 2, label: 'Feuilles de renseignement', panels: [] },
      { value: 3, label: 'Calcul', panels: [] },
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
