import {
  DOCUMENT,
  InjectionToken,
  Injectable,
  computed,
  inject,
  signal,
  type Provider,
  type Signal,
} from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { applyPlectrumPrimeNgLocale } from './primeng-locale';

/** Locales Plectrum ships copy for. */
export type PdsLocale = 'fr' | 'nl';

export const PDS_LOCALE_STORAGE_KEY = 'pds-locale';

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

/**
 * When true, {@link PdsLocaleService} seeds from {@link PDS_LOCALE} and ignores
 * localStorage. Set by {@link providePdsLocale} so Storybook and specs win over a
 * leftover `pds-locale` value. Apps that omit `providePdsLocale` still persist.
 */
export const PDS_LOCALE_PREFER_PROVIDED = new InjectionToken<boolean>(
  'PDS_LOCALE_PREFER_PROVIDED',
);

export function providePdsLocale(locale: PdsLocale): Provider[] {
  return [
    { provide: PDS_LOCALE, useValue: locale },
    { provide: PDS_LOCALE_PREFER_PROVIDED, useValue: true },
  ];
}

/** Dictionary keyed by locale. Values may be strings or functions (plurals, interpolation). */
export type PdsMessages<T extends object> = {
  fr: T;
  nl: T;
};

function isPdsLocale(value: string | null | undefined): value is PdsLocale {
  return value === 'fr' || value === 'nl';
}

function readStoredLocale(): PdsLocale | null {
  try {
    const stored = globalThis.localStorage?.getItem(PDS_LOCALE_STORAGE_KEY);
    return isPdsLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

function persistLocale(locale: PdsLocale): void {
  try {
    globalThis.localStorage?.setItem(PDS_LOCALE_STORAGE_KEY, locale);
  } catch {
    // Private mode / blocked storage — runtime locale still updates.
  }
}

/**
 * Runtime FR/NL locale.
 *
 * Seed order:
 * 1. {@link PDS_LOCALE} when {@link providePdsLocale} is used (Storybook / specs)
 * 2. `pds-locale` in localStorage when valid (app persistence)
 * 3. {@link PDS_LOCALE} factory default (`fr` via `LOCALE_ID`)
 */
@Injectable({ providedIn: 'root' })
export class PdsLocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly fallbackLocale = inject(PDS_LOCALE);
  private readonly preferProvided =
    inject(PDS_LOCALE_PREFER_PROVIDED, { optional: true }) === true;
  private readonly primeNG = inject(PrimeNG, { optional: true });

  readonly locale = signal<PdsLocale>(
    this.preferProvided
      ? this.fallbackLocale
      : (readStoredLocale() ?? this.fallbackLocale),
  );

  constructor() {
    this.applyRuntimeLocale(this.locale());
  }

  setLocale(next: PdsLocale): void {
    if (!isPdsLocale(next)) {
      return;
    }

    persistLocale(next);
    this.locale.set(next);
    this.applyRuntimeLocale(next);
  }

  private applyRuntimeLocale(locale: PdsLocale): void {
    this.document.documentElement.lang = locale;
    applyPlectrumPrimeNgLocale(this.primeNG, locale);
  }
}

/** Resolve the active locale's messages from a colocated `{name}.i18n.ts` dictionary. */
export function injectPdsMessages<TFr extends object, TNl extends object>(
  dictionary: { fr: TFr; nl: TNl },
): Signal<TFr | TNl> {
  const locale = inject(PdsLocaleService).locale;
  return computed(() => dictionary[locale()]);
}
