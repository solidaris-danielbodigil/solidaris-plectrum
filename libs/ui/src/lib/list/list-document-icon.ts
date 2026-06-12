import type { ListDocumentItem } from './list.types';

const DEFAULT_DOCUMENT_ICON = 'bi bi-file-earmark-medical';

/**
 * Resolves a Bootstrap Icons class for a document list row from an explicit
 * `icon` field or from title / titleLine2 keywords (French iSHARE labels).
 */
export function resolveListDocumentIcon(doc: ListDocumentItem): string {
  if (doc.icon) {
    return doc.icon.startsWith('bi ') ? doc.icon : `bi ${doc.icon}`;
  }

  const text = normalizeDocumentText(doc);

  if (text.includes('incapacite')) {
    return 'bi bi-bandaid';
  }

  if (text.includes('rechute')) {
    return 'bi bi-arrow-repeat';
  }

  if (text.includes('c4') || text.includes('attestation c4')) {
    return 'bi bi-file-earmark-text';
  }

  if (text.includes('pedicure')) {
    return 'bi bi-file-earmark-check';
  }

  if (text.includes('certificat')) {
    return 'bi bi-file-earmark-medical';
  }

  if (text.includes('demande primaire')) {
    return 'bi bi-clipboard2-check';
  }

  if (text.includes('cloture') || text.includes('clotur')) {
    return 'bi bi-archive';
  }

  return DEFAULT_DOCUMENT_ICON;
}

function normalizeDocumentText(doc: ListDocumentItem): string {
  return `${doc.title} ${doc.titleLine2 ?? ''}`
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}
