import { ButtonModule } from '@fba/button';
import { ToastModule, ToastService } from '@fba/event';
import { ButtonGroupModule } from '@fba/form';
import { CardModule } from '@fba/panel';
import { SearchBarModule, SearchModule } from '@fba/ui-data';
import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular';
import { ColorsPaletteComponent } from './color-palette.component';

export default {
  title: 'Foundations / Color',
  component: ColorsPaletteComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ToastModule,
        SearchBarModule,
        SearchModule,
        ButtonGroupModule,
        CardModule,
        ButtonModule,
      ],
    }),
    applicationConfig({
      providers: [ToastService],
    }),
  ],
  tags: ['!autodocs'],
} as Meta<ColorsPaletteComponent>;

export const Base = {
  render: (args: ColorsPaletteComponent) => ({
    props: args,
    template:
      '<fba-colors-palette [paletteType]="paletteType"></fba-colors-palette>',
  }),
  args: {
    paletteType: 'palette',
  },
  tags: ['!dev', 'Foundations'],
};

export const Semantic = {
  render: (args: ColorsPaletteComponent) => ({
    props: args,
    template:
      '<fba-colors-palette [paletteType]="paletteType"></fba-colors-palette>',
  }),
  args: {
    paletteType: 'semantic',
  },
  tags: ['!dev', 'Foundations'],
};
