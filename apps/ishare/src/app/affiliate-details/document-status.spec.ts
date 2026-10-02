import {
  DOCUMENT_STATUS_TAGS,
  documentListStatus,
  documentStatusFromLabel,
  documentStatusTag,
  type DocumentStatus,
} from './document-status';

// Figma iSHARE-Audit node 794:18611 — expected tag per document status.
const FIGMA_TAGS: Record<DocumentStatus, [string, string, string]> = {
  accepte: ['Accepté', 'success', 'bi bi-check-lg'],
  'accepte-auto': ['Accepté - Auto', 'success', 'bi bi-check-lg'],
  cloture: ['Clôturé', 'contrast', 'bi bi-check-lg'],
  'en-attente': ['En attente', 'warn', 'bi bi-clock'],
  'en-traitement': ['En traitement', 'warn', 'bi bi-hourglass-split'],
  recu: ['Reçu', 'info', 'bi bi-envelope'],
  'non-recu': ['Non reçu', 'secondary', 'bi bi-envelope'],
  refuse: ['Refusé', 'danger', 'bi bi-x-lg'],
};

describe('document-status', () => {
  it('should define exactly the 8 Figma document statuses', () => {
    expect(Object.keys(DOCUMENT_STATUS_TAGS).sort()).toEqual(
      Object.keys(FIGMA_TAGS).sort(),
    );
  });

  it.each(Object.entries(FIGMA_TAGS))(
    'should map %s to its Figma label, severity and icon',
    (status, [label, severity, icon]) => {
      expect(documentStatusTag(status as DocumentStatus)).toEqual({
        label,
        severity,
        icon,
      });
      expect(documentStatusFromLabel(label)).toBe(status);
    },
  );

  it('should return a fresh object so consumers can override the label', () => {
    const tag = documentStatusTag('recu');
    tag.label = '000 - Reçu';

    expect(documentStatusTag('recu').label).toBe('Reçu');
  });

  it('should not resolve non-document labels', () => {
    expect(documentStatusFromLabel('Non démarré')).toBeUndefined();
    expect(documentStatusFromLabel(undefined)).toBeUndefined();
  });

  it('should keep the contrast severity in pds-list rows', () => {
    expect(documentListStatus('cloture')).toEqual({
      label: 'Clôturé',
      severity: 'contrast',
      icon: 'bi bi-check-lg',
    });
    expect(documentListStatus('recu').severity).toBe('info');
  });
});
