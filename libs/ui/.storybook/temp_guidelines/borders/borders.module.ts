import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@fba/button';
import { ToastModule } from '@fba/event';
import { ButtonGroupModule } from '@fba/form';
import { IconModule } from '@fba/icon';
import { CardModule } from '@fba/panel';
import { SearchBarModule } from '@fba/ui-data';
import { BordersComponent } from './borders.component';

@NgModule({
  declarations: [BordersComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    IconModule,
    ToastModule,
    ButtonGroupModule,
    SearchBarModule,
  ],
  exports: [BordersComponent],
})
export class BordersModule {}
