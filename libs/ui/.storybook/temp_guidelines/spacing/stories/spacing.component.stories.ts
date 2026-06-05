import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@fba/button';
import { ToastModule, ToastService } from '@fba/event';
import { AutocompleteModule, ButtonGroupModule, FormModule } from '@fba/form';
import { AlertModule, TagModule } from '@fba/info';
import { CardModule } from '@fba/panel';
import { SearchBarModule, SearchModule } from '@fba/ui-data';
import {
  Meta,
  applicationConfig,
  argsToTemplate,
  moduleMetadata,
} from '@storybook/angular';
import { SpacingComponent } from '../spacing.component';

export default {
  title: 'Foundations/Spacing',
  component: SpacingComponent,
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
        SearchBarModule,
        SearchModule,
        AlertModule,
        TagModule,
      ],
    }),
    applicationConfig({
      providers: [ToastService],
    }),
  ],
  tags: ['!autodocs', 'Foundations'],
} as Meta<SpacingComponent>;

export const Playground = {
  render: (args: SpacingComponent) => ({
    props: args,
    template: '<fba-spacing></fba-spacing>',
  }),
  args: {},
  tags: ['!dev'],
};

export const SpacingUsageDevNote = {
  render: (args: SpacingComponent) => ({
    props: args,
    template: `<fba-alert ${argsToTemplate(args)}>
                  To use css GAP property, don't forget to use Flex or Grid display first.
              </fba-alert>`,
  }),
  args: {
    title: 'Dev Note',
    type: 'info',
  },
  tags: ['!dev'],
};

export const UsingClassesInTemplateDevNote = {
  render: (args: SpacingComponent) => ({
    props: args,
    template: `<fba-alert ${argsToTemplate(args)}>
                  Using spacing classes in your template prevents the need to create a page-specific CSS file, reducing CSS maintenance.<br/>
                  The self-explanatory nature of the classes enhances readability, making it simpler to understand the layout in the template at a quick glance.
               </fba-alert>`,
  }),
  args: {
    title: 'Dev Note',
    type: 'info',
  },
  tags: ['!dev'],
};
