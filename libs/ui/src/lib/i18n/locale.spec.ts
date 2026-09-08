import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import {
  PDS_LOCALE,
  injectPdsMessages,
  providePdsLocale,
  type PdsMessages,
} from './locale';

const SampleMessages = {
  fr: { greeting: 'Bonjour' },
  nl: { greeting: 'Hallo' },
} as const satisfies PdsMessages<{ greeting: string }>;

describe('PDS_LOCALE', () => {
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
  it('returns the Dutch dictionary when PDS_LOCALE is nl', () => {
    TestBed.configureTestingModule({
      providers: [providePdsLocale('nl')],
    });

    TestBed.runInInjectionContext(() => {
      expect(injectPdsMessages(SampleMessages).greeting).toBe('Hallo');
    });
  });
});
