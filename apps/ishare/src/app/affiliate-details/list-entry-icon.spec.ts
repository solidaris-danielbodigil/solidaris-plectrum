import { resolveListEntryIcon } from './list-entry-icon';
import type { ListEntryItem } from '@solidaris/ui';

describe('resolveListEntryIcon', () => {
  const base = (overrides: Partial<ListEntryItem>): ListEntryItem => ({
    id: 'doc-test',
    title: 'Test',
    ...overrides,
  });

  it('should use an explicit icon when provided', () => {
    expect(resolveListEntryIcon(base({ icon: 'bi bi-heart-pulse' }))).toBe(
      'bi bi-heart-pulse',
    );
  });

  it('should prefix bare icon names with bi', () => {
    expect(resolveListEntryIcon(base({ icon: 'heart-pulse' }))).toBe(
      'bi heart-pulse',
    );
  });

  it('should map incapacité documents to bandaid', () => {
    expect(resolveListEntryIcon(base({ title: 'Incapacité' }))).toBe(
      'bi bi-bandaid',
    );
  });

  it('should map rechute documents to arrow-repeat', () => {
    expect(resolveListEntryIcon(base({ title: 'Rechute' }))).toBe(
      'bi bi-arrow-repeat',
    );
  });

  it('should map C4 documents to file-earmark-text', () => {
    expect(
      resolveListEntryIcon(base({ title: 'C4', titleLine2: 'Attestation C4' })),
    ).toBe('bi bi-file-earmark-text');
  });

  it('should map pedicure attestations to file-earmark-check', () => {
    expect(
      resolveListEntryIcon(base({ title: 'Attestation de soin pédicure' })),
    ).toBe('bi bi-file-earmark-check');
  });

  it('should map certificat documents to file-earmark-medical', () => {
    expect(resolveListEntryIcon(base({ title: 'Certificat médical' }))).toBe(
      'bi bi-file-earmark-medical',
    );
  });

  it('should map demande primaire documents to clipboard2-check', () => {
    expect(
      resolveListEntryIcon(
        base({ title: 'Demande primaire -', titleLine2: 'Régime général' }),
      ),
    ).toBe('bi bi-clipboard2-check');
  });
});
