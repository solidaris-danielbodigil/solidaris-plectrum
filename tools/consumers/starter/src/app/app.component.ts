import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Button],
  template: '<main><h1>Plectrum application</h1><p-button label="Ready" /></main>',
})
export class AppComponent {}
