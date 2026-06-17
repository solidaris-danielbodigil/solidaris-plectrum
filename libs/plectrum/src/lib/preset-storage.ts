export const PLECTRUM_PRESET_STORAGE_KEY = 'solidaris-plectrum-preset';

export type PlectrumPresetVersion = 'v0.6' | 'v1';

const VALID_VERSIONS: readonly PlectrumPresetVersion[] = ['v0.6', 'v1'];

export function isPlectrumPresetVersion(value: string | null | undefined): value is PlectrumPresetVersion {
  return value === 'v0.6' || value === 'v1';
}

export function readStoredPresetVersion(storage: Storage | null = getBrowserStorage()): PlectrumPresetVersion | null {
  if (!storage) {
    return null;
  }

  const stored = storage.getItem(PLECTRUM_PRESET_STORAGE_KEY);
  return isPlectrumPresetVersion(stored) ? stored : null;
}

export function writeStoredPresetVersion(
  version: PlectrumPresetVersion,
  storage: Storage | null = getBrowserStorage(),
): void {
  storage?.setItem(PLECTRUM_PRESET_STORAGE_KEY, version);
}

export function resolvePresetVersion(
  explicit: PlectrumPresetVersion | undefined,
  storage: Storage | null = getBrowserStorage(),
): PlectrumPresetVersion {
  if (explicit && VALID_VERSIONS.includes(explicit)) {
    return explicit;
  }

  return readStoredPresetVersion(storage) ?? 'v1';
}

export function toggleStoredPresetVersion(storage: Storage | null = getBrowserStorage()): PlectrumPresetVersion {
  const current = resolvePresetVersion(undefined, storage);
  const next: PlectrumPresetVersion = current === 'v1' ? 'v0.6' : 'v1';
  writeStoredPresetVersion(next, storage);
  return next;
}

function getBrowserStorage(): Storage | null {
  return typeof globalThis !== 'undefined' && 'localStorage' in globalThis
    ? globalThis.localStorage
    : null;
}
