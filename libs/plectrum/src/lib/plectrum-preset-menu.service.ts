import { Injectable, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import type { MenuItem } from 'primeng/api';
import {
  PLECTRUM_PRESET_STORAGE_KEY,
  readStoredPresetVersion,
  resolvePresetVersion,
  toggleStoredPresetVersion,
  type PlectrumPresetVersion,
} from './preset-storage';

/**
 * Avatar-menu item for comparing the current v1 preset with deprecated v0.6.
 * Existing consumers retain the toggle for migration; new applications use v1.
 */
@Injectable({ providedIn: 'root' })
export class PlectrumPresetMenuService {
  private readonly document = inject(DOCUMENT);

  readonly currentVersion = computed<PlectrumPresetVersion>(() =>
    resolvePresetVersion(undefined, this.document.defaultView?.localStorage ?? null),
  );

  readonly menuItem = computed<MenuItem>(() => {
    const current = this.currentVersion();
    const activeLabel = current === 'v1' ? 'v1 (active)' : 'v0.6 (deprecated, active)';

    return {
      label: `Plectrum theme : ${activeLabel}`,
      icon: 'bi bi-palette',
      id: 'plectrum-preset-toggle',
      command: () => this.flipAndReload(),
    };
  });

  flipAndReload(): void {
    toggleStoredPresetVersion(this.document.defaultView?.localStorage ?? null);
    this.document.defaultView?.location.reload();
  }

  /** Preset toggle first; separator before additional items when present. */
  mergeWithItems(items: MenuItem[]): MenuItem[] {
    const presetItem = this.menuItem();

    if (items.length === 0) {
      return [presetItem];
    }

    return [presetItem, { separator: true }, ...items];
  }
}

export { PLECTRUM_PRESET_STORAGE_KEY, readStoredPresetVersion };
