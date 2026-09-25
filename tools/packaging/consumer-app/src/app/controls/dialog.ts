import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'demo-dialog',
  imports: [Button, Dialog],
  template: `
    <p-button label="Supprimer le document" severity="danger" (onClick)="visible = true" />

    <p-dialog
      header="Supprimer ce document ?"
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      appendTo="body"
    >
      <p>Le document sera retiré du dossier. Cette action ne peut pas être annulée.</p>
      <ng-template #footer>
        <p-button label="Annuler" severity="secondary" [text]="true" (onClick)="visible = false" />
        <p-button label="Supprimer" severity="danger" (onClick)="remove()" />
      </ng-template>
    </p-dialog>
  `,
})
export class DemoDialog {
  visible = false;

  remove(): void {
    this.visible = false;
  }
}
