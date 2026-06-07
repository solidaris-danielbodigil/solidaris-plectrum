// Document detail viewer types — Figma iSHARE-Audit node 324:5860.
// https://www.figma.com/design/9HlAudLC1oesvT8IkrmR6I/iSHARE-Audit?node-id=324-5860&t=qaTBkNgcIoCG2CBx-1

export interface DocumentDetailField {
  label: string;
  value: string | DocumentDetailPeriod;
}

export interface DocumentDetailPeriod {
  from: string;
  to: string;
}

export interface DocumentCertificatAction {
  label: string;
  icon: string;
  href?: string;
}

export interface DocumentCertificatPanel {
  id: string;
  title: string;
  status: {
    label: string;
    severity: 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';
  };
  actions: DocumentCertificatAction[];
  details: DocumentDetailField[];
  moreDetailsLabel: string;
}

export interface DocumentStep {
  value: number;
  label: string;
  panels?: DocumentCertificatPanel[];
}

export interface AffiliateDocumentDetail {
  documentId: string;
  title: string;
  activeStep: number;
  steps: DocumentStep[];
}

export function isDocumentDetailPeriod(
  value: DocumentDetailField['value'],
): value is DocumentDetailPeriod {
  return typeof value === 'object' && value !== null && 'from' in value && 'to' in value;
}
