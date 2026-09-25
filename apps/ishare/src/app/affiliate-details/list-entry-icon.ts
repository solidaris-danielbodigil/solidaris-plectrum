import type { ListEntryItem } from '@solidaris/ui';

const DEFAULT_ENTRY_ICON = 'bi bi-file-earmark-medical';

/**
 * iSHARE keyword-to-icon inference for list rows.
 * `pds-list` only renders `item.icon` — this app logic stays out of libs/ui.
 */
export function resolveListEntryIcon(entry: ListEntryItem): string {
  if (entry.icon) {
    return entry.icon.startsWith('bi ') ? entry.icon : `bi ${entry.icon}`;
  }

  const text = normalizeEntryText(entry);

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

  return DEFAULT_ENTRY_ICON;
}

function normalizeEntryText(entry: ListEntryItem): string {
  return `${entry.title} ${entry.titleLine2 ?? ''}`
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}
