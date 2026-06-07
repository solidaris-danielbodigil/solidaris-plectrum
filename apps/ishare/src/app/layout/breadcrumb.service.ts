import { Injectable, signal } from '@angular/core';
import type { MenuItem } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  readonly breadcrumbs = signal<MenuItem[]>([]);

  setBreadcrumbs(items: MenuItem[]): void {
    this.breadcrumbs.set(items);
  }
}
