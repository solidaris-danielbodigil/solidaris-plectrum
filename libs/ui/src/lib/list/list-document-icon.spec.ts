import { resolveListDocumentIcon } from './list-document-icon';
import type { ListDocumentItem } from './list.types';

describe('resolveListDocumentIcon', () => {
  const base = (overrides: Partial<ListDocumentItem>): ListDocumentItem => ({
    id: 'doc-test',
    title: 'Test',
    ...overrides,
  });

  it('should use an explicit icon when provided', () => {
    expect(
      resolveListDocumentIcon(base({ icon: 'bi bi-heart-pulse' })),
    ).toBe('bi bi-heart-pulse');
  });

  it('should prefix bare icon names with bi', () => {
    expect(resolveListDocumentIcon(base({ icon: 'heart-pulse' }))).toBe(
      'bi heart-pulse',
    );
  });

  it('should map incapacité documents to bandaid', () => {
    expect(resolveListDocumentIcon(base({ title: 'Incapacité' }))).toBe(
      'bi bi-bandaid',
    );
  });

  it('should map rechute documents to arrow-repeat', () => {
    expect(resolveListDocumentIcon(base({ title: 'Rechute' }))).toBe(
      'bi bi-arrow-repeat',
    );
  });

  it('should map C4 documents to file-earmark-text', () => {
    expect(
      resolveListDocumentIcon(
        base({ title: 'C4', titleLine2: 'Attestation C4' }),
      ),
    ).toBe('bi bi-file-earmark-text');
  });

  it('should map pedicure attestations to file-earmark-check', () => {
    expect(
      resolveListDocumentIcon(base({ title: 'Attestation de soin pédicure' })),
    ).toBe('bi bi-file-earmark-check');
  });

  it('should map certificat documents to file-earmark-medical', () => {
    expect(
      resolveListDocumentIcon(base({ title: 'Certificat médical' })),
    ).toBe('bi bi-file-earmark-medical');
  });

  it('should map demande primaire documents to clipboard2-check', () => {
    expect(
      resolveListDocumentIcon(
        base({ title: 'Demande primaire -', titleLine2: 'Régime général' }),
      ),
    ).toBe('bi bi-clipboard2-check');
  });
});
