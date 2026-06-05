import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@fba/button';
import { ToastModule, ToastService } from '@fba/event';
import {
  AutocompleteModule,
  ButtonGroupModule,
  FormModule,
  SwitchModule,
} from '@fba/form';
import { CardModule } from '@fba/panel';
import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular';
import { ElevationComponent } from './elevation.component';

export default {
  title: 'Foundations/Elevation',
  component: ElevationComponent,
  tags: ['!autodocs'],
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
        SwitchModule,
      ],
    }),
    applicationConfig({
      providers: [ToastService],
    }),
  ],
} as Meta<ElevationComponent>;

export const Playground = {
  render: (args: ElevationComponent) => ({
    props: args,
  }),
  args: {},
  tags: ['!dev', 'Foundations'],
};
