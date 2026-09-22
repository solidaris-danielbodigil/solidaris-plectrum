import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButton } from 'primeng/togglebutton';

@Component({
  selector: 'demo-toggle-button',
  imports: [FormsModule, ToggleButton],
  template: `
    <p-togglebutton
      [(ngModel)]="notifications"
      onLabel="Notifications activées"
      offLabel="Notifications désactivées"
      onIcon="bi bi-bell"
      offIcon="bi bi-bell-slash"
    />
  `,
})
export class DemoToggleButton {
  notifications = true;
}
