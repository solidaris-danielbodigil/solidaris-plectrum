import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="o-container">
      <h1>iCRM</h1>
      <p>Home — placeholder screen.</p>
    </section>
  `,
})
export class HomeComponent {}
