import { InjectionToken, inject, type Provider } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

/** Locales Plectrum ships copy for. */
export type PdsLocale = 'fr' | 'nl';

/**
 * Active Plectrum UI locale. The root factory derives from Angular `LOCALE_ID`
 * (`nl*` → `nl`, otherwise `fr`) so apps that already set `LOCALE_ID` need nothing.
 */
export const PDS_LOCALE = new InjectionToken<PdsLocale>('PDS_LOCALE', {
  providedIn: 'root',
  factory: (): PdsLocale => {
    const localeId = inject(LOCALE_ID).toLowerCase();
    return localeId.startsWith('nl') ? 'nl' : 'fr';
  },
});

export function providePdsLocale(locale: PdsLocale): Provider {
  return { provide: PDS_LOCALE, useValue: locale };
}

/** Dictionary keyed by locale. Values may be strings or functions (plurals, interpolation). */
export type PdsMessages<T extends object> = {
  fr: T;
  nl: T;
};

/** Resolve the active locale's messages from a colocated `{name}.i18n.ts` dictionary. */
export function injectPdsMessages<TFr extends object, TNl extends object>(
  dictionary: { fr: TFr; nl: TNl },
): TFr | TNl {
  const locale = inject(PDS_LOCALE);
  return dictionary[locale];
}
