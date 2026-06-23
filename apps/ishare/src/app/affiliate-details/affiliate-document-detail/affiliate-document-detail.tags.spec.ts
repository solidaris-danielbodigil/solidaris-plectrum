import { EVA_MARTINEZ_DOCUMENT_DETAILS } from './affiliate-document-detail.mock';
import {
  aggregateStepStatus,
  deriveDocumentTags,
  deriveStepCommentTags,
  panelStatusSortPriority,
  summarizeDocumentStep,
} from './affiliate-document-detail.tags';

describe('affiliate-document-detail.tags', () => {
  const primaire = EVA_MARTINEZ_DOCUMENT_DETAILS['doc-demande-primaire'];

  it('should rank En attente above Clôturé when aggregating step status', () => {
    expect(panelStatusSortPriority('En attente')).toBeLessThan(
      panelStatusSortPriority('Clôturé'),
    );

    const status = aggregateStepStatus([
      {
        id: 'a',
        title: 'A',
        status: { label: 'Clôturé', severity: 'secondary' },
        actions: [],
        details: [],
        moreDetailsLabel: 'Voir plus de détails',
      },
      {
        id: 'b',
        title: 'B',
        status: { label: 'En attente', severity: 'warn' },
        actions: [],
        details: [],
        moreDetailsLabel: 'Voir plus de détails',
      },
    ]);

    expect(status?.label).toBe('En attente');
  });

  it('should summarize doc-demande-primaire steps with expected status labels', () => {
    const [certificat, fdr, calcul] = primaire.steps;

    expect(summarizeDocumentStep(certificat).status?.label).toBe('Accepté');
    expect(summarizeDocumentStep(fdr).status?.label).toBe('Clôturé');
    expect(summarizeDocumentStep(calcul).status?.label).toBe('En attente');
  });

  it('should derive two secondary comment tags on FDR step and one warn on Calcul', () => {
    const fdrTags = deriveStepCommentTags(primaire.steps[1]);
    const calculTags = deriveStepCommentTags(primaire.steps[2]);

    expect(fdrTags).toEqual([
      jasmine.objectContaining({
        label: '2',
        severity: 'secondary',
        ariaLabel: '2 commentaires',
      }),
    ]);
    expect(calculTags).toEqual([
      jasmine.objectContaining({
        label: '1',
        severity: 'warn',
        ariaLabel: '1 avertissement',
      }),
    ]);
  });

  it('should keep deriveDocumentTags aligned with per-step tag aggregation', () => {
    const documentTags = deriveDocumentTags(
      'doc-demande-primaire',
      EVA_MARTINEZ_DOCUMENT_DETAILS,
    );

    expect(documentTags).toEqual([
      jasmine.objectContaining({
        label: '2',
        severity: 'secondary',
        ariaLabel: '2 commentaires',
      }),
      jasmine.objectContaining({
        label: '1',
        severity: 'warn',
        ariaLabel: '1 avertissement',
      }),
    ]);
  });
});
