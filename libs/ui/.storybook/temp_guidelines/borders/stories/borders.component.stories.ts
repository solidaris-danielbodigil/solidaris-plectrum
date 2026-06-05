import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@fba/button';
import { ToastModule, ToastService } from '@fba/event';
import { AutocompleteModule, ButtonGroupModule, FormModule } from '@fba/form';
import { CardModule } from '@fba/panel';
import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular';
import { BordersComponent } from '../borders.component';

export default {
  title: 'Foundations/Borders',
  component: BordersComponent,
  decorators: [
    moduleMetadata({
      imports: [
        AutocompleteModule,
        FormsModule,
        FormModule,
        CardModule,
        ToastModule,
        CardModule,
        ButtonModule,
        ButtonGroupModule,
      ],
    }),
    applicationConfig({
      providers: [ToastService],
    }),
  ],
} as Meta<BordersComponent>;

export const Generate = {
  render: (args: BordersComponent) => ({
    props: args,
  }),
  args: {},
  tags: ['!dev', 'Foundations'],
};
