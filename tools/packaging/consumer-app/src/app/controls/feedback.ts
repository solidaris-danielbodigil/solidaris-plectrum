import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'demo-feedback',
  imports: [Button, Message, Toast],
  providers: [MessageService],
  template: `
    <p-toast position="top-right" />

    <div class="o-flex o-flex--col o-layout o-layout--gap-2">
      <p-message severity="error">
        Le paiement n'a pas pu être enregistré. Vérifiez le numéro de compte et réessayez.
      </p-message>
      <p-button label="Enregistrer" (onClick)="save()" />
    </div>
  `,
})
export class DemoFeedback {
  private readonly messages = inject(MessageService);

  save(): void {
    this.messages.add({ severity: 'success', summary: 'Enregistré', detail: 'Vos modifications sont sauvegardées.' });
  }
}
