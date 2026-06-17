// =============================================================================
// libs/ui/src/lib/icon/icon.registry.ts
// Injectable registry for custom SVG icons.
//
// Usage (in app config or a feature module):
//   import { IconRegistry } from '@solidaris/ui';
//   import { inject } from '@angular/core';
//
//   const registry = inject(IconRegistry);
//   registry.register('logo-solidaris', '<svg …>…</svg>');
// =============================================================================

import { Injectable } from '@angular/core';
import { SvgIconEntry } from './icon.types';

@Injectable({ providedIn: 'root' })
export class IconRegistry {
  private readonly icons = new Map<string, SvgIconEntry>();

  /**
   * Register a custom SVG icon under a unique name.
   * @param name   Icon identifier used in <(pds|app|lib)-icon [icon]="name" source="svg">
   * @param svg    Raw SVG markup — should NOT have explicit width/height attributes.
   */
  register(name: string, svg: string): void {
    this.icons.set(name, { svg });
  }

  /**
   * Retrieve a registered SVG icon by name.
   * Returns undefined if the icon has not been registered.
   */
  get(name: string): SvgIconEntry | undefined {
    return this.icons.get(name);
  }

  /** Returns true when the icon has been registered. */
  has(name: string): boolean {
    return this.icons.has(name);
  }
}
