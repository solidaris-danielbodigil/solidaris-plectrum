import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'demo-button',
  imports: [Button],
  template: `
    <div class="o-flex o-flex--row-wrap o-flex--align-items-center o-layout o-layout--gap-2">
      <p-button label="Enregistrer" type="submit" />
      <p-button label="Annuler" severity="secondary" [outlined]="true" />
      <p-button label="Supprimer le document" severity="danger" (onClick)="confirmDelete()" />
    </div>
  `,
})
export class DemoButton {
  confirmDelete(): void {
    // Open a confirmation dialog before deleting.
  }
}
