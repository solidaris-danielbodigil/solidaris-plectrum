import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@fba/button';
import { ToastModule } from '@fba/event';
import { AutocompleteModule, ButtonGroupModule, FormModule } from '@fba/form';
import { IconModule } from '@fba/icon';
import { CardModule } from '@fba/panel';
import { SearchBarModule } from '@fba/ui-data';
import { ShadowsComponent } from './shadows.component';

@NgModule({
  declarations: [ShadowsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    IconModule,
    ToastModule,
    ButtonGroupModule,
    SearchBarModule,
    FormModule,
    AutocompleteModule,
  ],
  exports: [ShadowsComponent],
})
export class ShadowsModule {}
