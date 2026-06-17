import { TestBed } from '@angular/core/testing';
import { PlectrumPresetMenuService } from './plectrum-preset-menu.service';
import { PLECTRUM_PRESET_STORAGE_KEY } from './preset-storage';

describe('PlectrumPresetMenuService', () => {
  let service: PlectrumPresetMenuService;
  let storage: Map<string, string>;

  beforeEach(() => {
    storage = new Map();
    const mockStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      key: () => null,
      length: 0,
    } as Storage;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Document,
          useValue: { defaultView: { localStorage: mockStorage, location: { reload: () => undefined } } },
        },
      ],
    });
    service = TestBed.inject(PlectrumPresetMenuService);
  });

  it('should expose a preset toggle menu item', () => {
    storage.set(PLECTRUM_PRESET_STORAGE_KEY, 'v1');
    const item = service.menuItem();
    expect(item.id).toBe('plectrum-preset-toggle');
    expect(item.label).toContain('v1 (active)');
    expect(item.icon).toBe('bi bi-palette');
  });

  it('should place preset item before testing items with a separator', () => {
    storage.set(PLECTRUM_PRESET_STORAGE_KEY, 'v0.6');
    const merged = service.mergeWithItems([{ label: 'Test session', id: 'session-start' }]);

    expect(merged.length).toBe(3);
    expect(merged[0]?.id).toBe('plectrum-preset-toggle');
    expect(merged[1]?.separator).toBeTrue();
    expect(merged[2]?.id).toBe('session-start');
  });

  it('should return only preset item when no extra items', () => {
    const merged = service.mergeWithItems([]);
    expect(merged.length).toBe(1);
    expect(merged[0]?.id).toBe('plectrum-preset-toggle');
  });
});
