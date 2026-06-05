import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@fba/button';
import { ToastModule, ToastService } from '@fba/event';
import { AutocompleteModule, ButtonGroupModule, FormModule } from '@fba/form';
import { CardModule } from '@fba/panel';
import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular';
import { ShadowsComponent } from '../shadows.component';

export default {
  title: 'Foundations/Shadows',
  component: ShadowsComponent,

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
} as Meta<ShadowsComponent>;

export const Generate = {
  render: (args: ShadowsComponent) => ({
    props: args,
  }),
  args: {},
  tags: ['!dev', 'Foundations'],
};
