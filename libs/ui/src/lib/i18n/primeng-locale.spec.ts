import { applyPlectrumPrimeNgLocale } from './primeng-locale';

describe('applyPlectrumPrimeNgLocale', () => {
  function createPrimeNgMock(aria: Record<string, string>) {
    return {
      translation: { aria: { ...aria } as Record<string, string> },
      setTranslation(value: { aria?: Record<string, string> }): void {
        this.translation = {
          ...this.translation,
          ...value,
          aria: value.aria ?? this.translation.aria,
        };
      },
    };
  }

  it('names toast close via aria.close and keeps other PrimeNG aria keys', () => {
    const primeNG = createPrimeNgMock({
      close: 'Close',
      trueLabel: 'True',
    });

    applyPlectrumPrimeNgLocale(primeNG, 'fr');

    expect(primeNG.translation.aria['close']).toBe('Fermer');
    expect(primeNG.translation.aria['trueLabel']).toBe('True');
    expect(primeNG.translation.aria['firstPageLabel']).toBe('Première page');
  });

  it('applies Dutch close copy', () => {
    const primeNG = createPrimeNgMock({ close: 'Close' });

    applyPlectrumPrimeNgLocale(primeNG, 'nl');

    expect(primeNG.translation.aria['close']).toBe('Sluiten');
  });

  it('is a no-op without PrimeNG', () => {
    expect(() => applyPlectrumPrimeNgLocale(null, 'fr')).not.toThrow();
  });
});
