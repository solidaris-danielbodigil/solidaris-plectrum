import {
  PLECTRUM_PRESET_STORAGE_KEY,
  readStoredPresetVersion,
  resolvePresetVersion,
  toggleStoredPresetVersion,
  writeStoredPresetVersion,
} from './preset-storage';

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe('preset-storage', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it('defaults resolvePresetVersion to v1 when storage is empty', () => {
    expect(resolvePresetVersion(undefined, storage)).toBe('v1');
  });

  it('reads and writes solidaris-plectrum-preset', () => {
    writeStoredPresetVersion('v0.6', storage);
    expect(readStoredPresetVersion(storage)).toBe('v0.6');
    expect(storage.getItem(PLECTRUM_PRESET_STORAGE_KEY)).toBe('v0.6');
  });

  it('ignores invalid stored values', () => {
    storage.setItem(PLECTRUM_PRESET_STORAGE_KEY, 'v2');
    expect(readStoredPresetVersion(storage)).toBeNull();
    expect(resolvePresetVersion(undefined, storage)).toBe('v1');
  });

  it('toggleStoredPresetVersion flips between v1 and v0.6', () => {
    expect(toggleStoredPresetVersion(storage)).toBe('v0.6');
    expect(toggleStoredPresetVersion(storage)).toBe('v1');
  });

  it('explicit version wins over storage', () => {
    writeStoredPresetVersion('v0.6', storage);
    expect(resolvePresetVersion('v1', storage)).toBe('v1');
  });
});
