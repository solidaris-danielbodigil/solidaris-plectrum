import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShellSearchService {
  readonly query = signal('');

  setQuery(value: string): void {
    this.query.set(value);
  }
}
