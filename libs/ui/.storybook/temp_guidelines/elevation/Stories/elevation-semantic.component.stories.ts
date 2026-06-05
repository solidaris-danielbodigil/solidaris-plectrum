import { importProvidersFrom } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular';
import { ElevationSemanticComponent } from '../elevation-semantic.component';

export default {
  title: 'Foundations/Elevation',
  component: ElevationSemanticComponent,
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
      providers: [importProvidersFrom(TranslateModule.forRoot()), ToastService],
    }),
  ],
} as Meta<ElevationSemanticComponent>;

export const Semantic = {
  render: (args: ElevationSemanticComponent) => ({
    props: args,
    template:
      '<fba-elevation-semantic [elevationType]="type" ></fba-elevation-semantic>',
  }),
  args: {
    elevationType: 'semantic',
  },
  tags: ['!dev', 'Foundations'],
};
