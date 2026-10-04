import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  host: {
    class: 'o-layout o-layout--block o-layout--full-height',
  },
})
export class AppComponent {}
