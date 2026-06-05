import { ClipboardModule } from '@angular/cdk/clipboard';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@fba/button';
import { ToastModule } from '@fba/event';
import { AutocompleteModule, FormModule } from '@fba/form';
import { IconModule } from '@fba/icon';
import { AlertModule } from '@fba/info';
import { CardModule } from '@fba/panel';
import { AnimationComponent } from './animation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    FormModule,
    IconModule,
    AutocompleteModule,
    ToastModule,
    ClipboardModule,
    AlertModule,
    AnimationComponent,
    AsyncPipe,
  ],
  exports: [AnimationComponent],
})
export class AnimationModule {}
