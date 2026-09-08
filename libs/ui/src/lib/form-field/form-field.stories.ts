import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { expect, waitFor, within } from 'storybook/test';
import { statusStory } from '../../docs/docs-figure-stories';
import { storyDesign } from '../../storybook/story-design';
import { FormFieldComponent } from './form-field.component';
import { FormFieldMetadata } from './form-field.metadata';

const meta: Meta<FormFieldComponent> = {
  parameters: {
    ...storyDesign(FormFieldMetadata.component.figmaUrl),
  },
  title: 'Custom components/Form Field',
  component: FormFieldComponent,
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    layout: { control: 'radio', options: ['vertical', 'horizontal'] },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    errorMessage: { control: 'text' },
    inputId: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<FormFieldComponent>;

/** Ownership badge for the docs page — hidden from the sidebar. */
export const Status = statusStory(FormFieldMetadata.governance);

export const Vertical: Story = {
  render: (args) => ({
    props: { ...args, value: '319' },
    moduleMetadata: {
      imports: [FormsModule, InputTextModule, FormFieldComponent],
    },
    template: `
      <pds-form-field
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
    label: 'O.A.',
    layout: 'vertical',
    required: true,
    invalid: false,
    errorMessage: 'Sélectionnez une O.A.',
    inputId: 'story-form-field-oa',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /O\.A\./ });
    await expect(input).toHaveAttribute('aria-invalid', 'false');
  },
};

export const VerticalInvalid: Story = {
  ...Vertical,
  args: {
    ...Vertical.args,
    invalid: true,
  },
  // Interaction test: the invalid state must mark the block and show the error.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvasElement.querySelector('.c-form-field');
    await expect(field).toHaveClass('is-invalid');
    await waitFor(() => {
      const input = canvas.getByRole('textbox', { name: /O\.A\./ });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(
        canvasElement.ownerDocument.getElementById(describedBy ?? ''),
      ).not.toBeNull();
    });
  },
};

export const Horizontal: Story = {
  render: (args) => ({
    props: { ...args, value: '888' },
    moduleMetadata: {
      imports: [FormsModule, InputTextModule, FormFieldComponent],
    },
    template: `
      <pds-form-field
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/NISS/)).toBeVisible();
  },
};

export const HorizontalInvalid: Story = {
  ...Horizontal,
  args: {
    ...Horizontal.args,
    invalid: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvasElement.querySelector('.c-form-field');
    await expect(field).toHaveClass('is-invalid');
    await waitFor(() =>
      expect(canvas.getByText('Ce champ est obligatoire.')).toBeVisible(),
    );
  },
};
