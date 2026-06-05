import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@fba/button';
import { ToastModule } from '@fba/event';
import { IconModule } from '@fba/icon';
import { CardModule } from '@fba/panel';
import { SearchBarModule, SearchModule } from '@fba/ui-data';
import { ColorsPaletteComponent } from './color-palette.component';

@NgModule({
  declarations: [ColorsPaletteComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    IconModule,
    SearchBarModule,
    ToastModule,
    SearchModule,
  ],
  exports: [ColorsPaletteComponent],
})
export class ColorPaletteModule {}
