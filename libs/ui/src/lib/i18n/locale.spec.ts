import { TestBed } from '@angular/core/testing';
import { DOCUMENT, LOCALE_ID } from '@angular/core';
import {
  PDS_LOCALE,
  PDS_LOCALE_STORAGE_KEY,
  PdsLocaleService,
  injectPdsMessages,
  providePdsLocale,
  type PdsMessages,
} from './locale';

const SampleMessages = {
  fr: { greeting: 'Bonjour' },
  nl: { greeting: 'Hallo' },
} as const satisfies PdsMessages<{ greeting: string }>;

describe('PDS_LOCALE', () => {
  beforeEach(() => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
  });

  it('derives nl from a Dutch LOCALE_ID', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'nl-BE' }],
    });

    expect(TestBed.inject(PDS_LOCALE)).toBe('nl');
  });

  it('defaults to fr for other LOCALE_ID values', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'fr-BE' }],
    });

    expect(TestBed.inject(PDS_LOCALE)).toBe('fr');
  });

  it('honours providePdsLocale over LOCALE_ID', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: 'fr-BE' },
        providePdsLocale('nl'),
      ],
    });

    expect(TestBed.inject(PDS_LOCALE)).toBe('nl');
  });
});

describe('injectPdsMessages', () => {
  beforeEach(() => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
  });

  it('returns a Signal of the Dutch dictionary when PDS_LOCALE is nl', () => {
    TestBed.configureTestingModule({
      providers: [providePdsLocale('nl')],
    });

    TestBed.runInInjectionContext(() => {
      expect(injectPdsMessages(SampleMessages)().greeting).toBe('Hallo');
    });
  });

  it('updates when PdsLocaleService.setLocale changes the locale', () => {
    TestBed.configureTestingModule({
      providers: [providePdsLocale('fr')],
    });

    TestBed.runInInjectionContext(() => {
      const messages = injectPdsMessages(SampleMessages);
      const service = TestBed.inject(PdsLocaleService);

      expect(messages().greeting).toBe('Bonjour');
      service.setLocale('nl');
      expect(messages().greeting).toBe('Hallo');
    });
  });
});

describe('PdsLocaleService', () => {
  beforeEach(() => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(PDS_LOCALE_STORAGE_KEY);
  });

  it('seeds from PDS_LOCALE when storage is empty', () => {
    TestBed.configureTestingModule({
      providers: [providePdsLocale('nl')],
    });

    const service = TestBed.inject(PdsLocaleService);

    expect(service.locale()).toBe('nl');
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('nl');
  });

  it('seeds from localStorage when PDS_LOCALE is only the factory default', () => {
    localStorage.setItem(PDS_LOCALE_STORAGE_KEY, 'nl');

    TestBed.configureTestingModule({});

    expect(TestBed.inject(PdsLocaleService).locale()).toBe('nl');
  });

  it('honours providePdsLocale over leftover localStorage', () => {
    localStorage.setItem(PDS_LOCALE_STORAGE_KEY, 'nl');

    TestBed.configureTestingModule({
      providers: [providePdsLocale('fr')],
    });

    expect(TestBed.inject(PdsLocaleService).locale()).toBe('fr');
  });

  it('persists setLocale and updates document lang', () => {
    TestBed.configureTestingModule({
      providers: [providePdsLocale('fr')],
    });

    const service = TestBed.inject(PdsLocaleService);
    service.setLocale('nl');

    expect(service.locale()).toBe('nl');
    expect(localStorage.getItem(PDS_LOCALE_STORAGE_KEY)).toBe('nl');
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('nl');
  });
});
