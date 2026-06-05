import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@fba/button';
import { ToastModule, ToastService } from '@fba/event';
import { AutocompleteModule, ButtonGroupModule, FormModule } from '@fba/form';
import { AlertModule } from '@fba/info';
import { CardModule } from '@fba/panel';
import { SearchBarModule, SearchModule } from '@fba/ui-data';
import {
  Meta,
  applicationConfig,
  argsToTemplate,
  moduleMetadata,
} from '@storybook/angular';
import { TypographyComponent } from '../typography.component';

export default {
  title: 'Foundations/Typography',
  component: TypographyComponent,

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
      ],
    }),
    applicationConfig({
      providers: [ToastService],
    }),
  ],
  tags: ['!autodocs', 'Foundations'],
} as Meta<TypographyComponent>;

export const Semantic = {
  render: (args: TypographyComponent) => ({
    props: args,
    template: '<fba-typography [typoType]="typoType"></fba-typography>',
  }),
  args: {
    typoType: 'semantic',
  },
  tags: ['!dev'],
};

export const Generic = {
  render: (args: TypographyComponent) => ({
    props: args,
    template: '<fba-typography [typoType]="typoType"></fba-typography>',
  }),
  args: {
    typoType: 'generic',
  },
  tags: ['!dev'],
};

export const ExtendGenericClassesDevNote = {
  render: (args: TypographyComponent) => ({
    props: args,
    template: `<fba-alert ${argsToTemplate(args)}></fba-alert>`,
  }),
  args: {
    title: 'Dev Note',
    type: 'info',
    description:
      ' Generic classes are intended to be extended in `SCSS`, building a semantic layer around it that would be reusable.' +
      ' Dont use generic classes without `@extend .typo__<font-weight>--<font-scale>--<line-height>` inside a semantic class. ',
  },
  tags: ['!dev'],
};

export const GenericClassesDevNote = {
  render: (args: TypographyComponent) => ({
    props: args,
    template: `<fba-alert ${argsToTemplate(args)}></fba-alert>`,
  }),
  args: {
    title: 'Dev Note',
    type: 'info',
    description:
      ' Storybook Typography component retrieves all ".typo__" classes automatically, which reduces maintenance to its css page only. ' +
      ' Classes with this combination: ".typo__font-weight--font-scale--line-height" will be tagged as "Generic" type and displayed in its respective story. ' +
      ' Other classes that only have one category like ".typo__h1", will be tagged and displayed as Semantic type in their respective page. ',
  },
  tags: ['!dev'],
};
