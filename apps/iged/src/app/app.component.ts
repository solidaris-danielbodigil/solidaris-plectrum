import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  host: {
    class:
      'o-layout o-layout--block o-layout--full-dvh o-layout--contain-paint o-layout--overflow-hidden',
  },
})
export class AppComponent {}
