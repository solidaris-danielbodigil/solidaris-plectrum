import type { Translation } from 'primeng/api';
import type { PrimeNG } from 'primeng/config';
import type { PdsLocale } from './locale';

const FR_TRANSLATION: Translation = {
  emptyMessage: 'Aucun résultat',
  emptyFilterMessage: 'Aucun résultat trouvé',
  emptySearchMessage: 'Aucun résultat',
  searchMessage: '{0} résultats disponibles',
  selectionMessage: '{0} éléments sélectionnés',
  emptySelectionMessage: 'Aucun élément sélectionné',
  aria: {
    close: 'Fermer',
    firstPageLabel: 'Première page',
    lastPageLabel: 'Dernière page',
    nextPageLabel: 'Page suivante',
    prevPageLabel: 'Page précédente',
    previousPageLabel: 'Page précédente',
    rowsPerPageLabel: 'Lignes par page',
    jumpToPageDropdownLabel: 'Aller à la page',
    jumpToPageInputLabel: 'Aller à la page',
    pageLabel: 'Page {page}',
  },
};

const NL_TRANSLATION: Translation = {
  emptyMessage: 'Geen resultaten',
  emptyFilterMessage: 'Geen resultaten gevonden',
  emptySearchMessage: 'Geen resultaten',
  searchMessage: '{0} resultaten beschikbaar',
  selectionMessage: '{0} items geselecteerd',
  emptySelectionMessage: 'Geen items geselecteerd',
  aria: {
    close: 'Sluiten',
    firstPageLabel: 'Eerste pagina',
    lastPageLabel: 'Laatste pagina',
    nextPageLabel: 'Volgende pagina',
    prevPageLabel: 'Vorige pagina',
    previousPageLabel: 'Vorige pagina',
    rowsPerPageLabel: 'Rijen per pagina',
    jumpToPageDropdownLabel: 'Ga naar pagina',
    jumpToPageInputLabel: 'Ga naar pagina',
    pageLabel: 'Pagina {page}',
  },
};

/** Live PrimeNG copy (paginator, empty table, …) for the active Plectrum locale. */
export function applyPlectrumPrimeNgLocale(
  primeNG: Pick<PrimeNG, 'setTranslation' | 'translation'> | null | undefined,
  locale: PdsLocale,
): void {
  if (!primeNG) {
    return;
  }

  const pack = locale === 'nl' ? NL_TRANSLATION : FR_TRANSLATION;
  // PrimeNG setTranslation is a shallow merge — replacing `aria` wholesale
  // drops defaults such as aria.close (Toast / Message close buttons).
  primeNG.setTranslation({
    ...pack,
    aria: {
      ...primeNG.translation?.aria,
      ...pack.aria,
    },
  });
}
