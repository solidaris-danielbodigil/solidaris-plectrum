import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

/** The sample page the foundation Anatomy figures call out. */
@Component({
  selector: 'pds-docs-page-example',
  imports: [Button, Card],
  templateUrl: './docs-page-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-page-example o-layout o-layout--block' },
})
export class DocsPageExampleComponent {}
