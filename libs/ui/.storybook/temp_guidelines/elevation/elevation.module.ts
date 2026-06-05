import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@fba/button';
import { ToastModule } from '@fba/event';
import {
  AutocompleteModule,
  ButtonGroupModule,
  FormModule,
  SwitchModule,
} from '@fba/form';
import { IconModule } from '@fba/icon';
import { CardModule } from '@fba/panel';
import { SearchBarModule } from '@fba/ui-data';
import { ElevationComponent } from './elevation.component';

@NgModule({
  declarations: [ElevationComponent],
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
    SwitchModule,
  ],
  exports: [ElevationComponent],
})
export class ElevationModule {}
