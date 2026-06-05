import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="o-container">
      <h1>About iCRM</h1>
      <p>About — placeholder screen.</p>
    </section>
  `,
})
export class AboutComponent {}
