import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormFieldComponent } from './form-field.component';

const meta: Meta<FormFieldComponent> = {
  title: 'UI/Form Field',
  component: FormFieldComponent,
  parameters: {
    docs: {
      description: {
        component: `
Optional field shell with a custom static label (not PrimeNG FloatLabel), optional required asterisk,
invalid label colour, and a built-in \`p-message\` error slot.

Parent forms should pass \`[invalid]="isFieldInvalid(form, 'controlName')"\` where
\`isFieldInvalid\` checks \`control.invalid && (control.touched || control.dirty || form.submitted)\`
(SelectButton and similar controls set \`dirty\` but not \`touched\` on click).
        `,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    layout: { control: 'radio', options: ['vertical', 'horizontal'] },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    errorMessage: { control: 'text' },
    inputId: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<FormFieldComponent>;

export const Vertical: Story = {
  render: (args) => ({
    props: { ...args, value: '319' },
    moduleMetadata: {
      imports: [FormsModule, InputTextModule, FormFieldComponent],
    },
    template: `
      <(pds|app|lib)-form-field
        [label]="label"
        [layout]="layout"
        [required]="required"
        [invalid]="invalid"
        [errorMessage]="errorMessage"
      >
        <input pInputText [(ngModel)]="value" [required]="required" />
      </pds-form-field>
    `,
  }),
  args: {
    label: 'O.A.',
    layout: 'vertical',
    required: true,
    invalid: false,
    errorMessage: 'Sélectionnez une O.A.',
  },
};

export const VerticalInvalid: Story = {
  ...Vertical,
  args: {
    ...Vertical.args,
    invalid: true,
  },
};

export const Horizontal: Story = {
  render: (args) => ({
    props: { ...args, value: '888' },
    moduleMetadata: {
      imports: [FormsModule, InputTextModule, FormFieldComponent],
    },
    template: `
      <(pds|app|lib)-form-field
        [label]="label"
        [layout]="layout"
        [required]="required"
        [invalid]="invalid"
        [errorMessage]="errorMessage"
        [inputId]="inputId"
      >
        <input pInputText [id]="inputId" [(ngModel)]="value" [required]="required" />
      </pds-form-field>
    `,
  }),
  args: {
    label: 'NISS',
    layout: 'horizontal',
    required: true,
    invalid: false,
    errorMessage: 'Ce champ est obligatoire.',
    inputId: 'story-form-field-reference',
  },
};

export const HorizontalInvalid: Story = {
  ...Horizontal,
  args: {
    ...Horizontal.args,
    invalid: true,
  },
};
