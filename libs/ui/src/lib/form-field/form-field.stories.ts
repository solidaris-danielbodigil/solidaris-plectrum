import type {
  Meta,
  StoryObj,
  TransformComponentType,
} from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { expect, waitFor, within } from 'storybook/test';
import { contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { FormFieldComponent } from './form-field.component';
import { FormFieldMetadata } from './form-field.metadata';

/** Component inputs (unwrapped signals) plus one story-only knob: the projected control value. */
interface FormFieldStoryArgs
  extends Partial<TransformComponentType<FormFieldComponent>> {
  value?: string;
}

const meta: Meta<FormFieldStoryArgs> = {
  parameters: {
    ...storyDesign(FormFieldMetadata.component.figmaUrl),
  },
  title: 'Custom components/Form Field',
  component: FormFieldComponent,
  argTypes: argTypesFromProps(FormFieldMetadata.props ?? [], {
    layout: { control: 'radio', options: ['vertical', 'horizontal'] },
  }),
  /**
   * One render for every story. The docs page embeds several stories at once,
   * so the control `id` is derived from the story id (`context.id`) unless a
   * story sets `inputId` explicitly — duplicate ids would otherwise make
   * `<label for>` point at the wrong input.
   */
  render: (args, context) => {
    const inputId = args.inputId || `${context.id}-input`;
    return {
      props: { ...args, inputId },
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
          [hint]="hint"
          [requiredLabel]="requiredLabel"
          [inputId]="inputId"
        >
          <input pInputText [id]="inputId" [(ngModel)]="value" [required]="required" />
        </pds-form-field>
      `,
    };
  },
};

export default meta;

type Story = StoryObj<FormFieldStoryArgs>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from form-field.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(FormFieldMetadata.governance, FormFieldMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(FormFieldMetadata, 'usage') };
export const Anatomy = { tags: ['!dev'], ...contractStory(FormFieldMetadata, 'anatomy') };
export const Composition = { tags: ['!dev'], ...contractStory(FormFieldMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(FormFieldMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(FormFieldMetadata, 'accessibility') };

/** Asserts the label is wired to the control and no empty `()` marker is rendered. */
async function expectLabelWiring(
  canvasElement: HTMLElement,
  input: HTMLElement,
): Promise<void> {
  const label = canvasElement.querySelector<HTMLLabelElement>(
    '.c-form-field__label',
  );
  await expect(label).not.toBeNull();
  await expect(input.id).toBeTruthy();
  await expect(label?.getAttribute('for')).toBe(input.id);
  await expect(label?.textContent).not.toMatch(/\(\s*\)/);
}

export const Vertical: Story = {
  args: {
    label: 'O.A.',
    layout: 'vertical',
    required: true,
    requiredLabel: 'obligatoire',
    invalid: false,
    errorMessage: 'Sélectionnez une O.A.',
    value: '319',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /O\.A\./ });
    await expect(input).toHaveAttribute('aria-invalid', 'false');
    await expect(input).toHaveAttribute('aria-required', 'true');
    await expectLabelWiring(canvasElement, input);
  },
};

export const VerticalInvalid: Story = {
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
    await expectLabelWiring(
      canvasElement,
      canvas.getByRole('textbox', { name: /O\.A\./ }),
    );
  },
};

export const Horizontal: Story = {
  args: {
    label: 'NISS',
    layout: 'horizontal',
    required: true,
    requiredLabel: 'obligatoire',
    invalid: false,
    errorMessage: 'Ce champ est obligatoire.',
    value: '888',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/NISS/);
    await expect(input).toBeVisible();
    await expectLabelWiring(canvasElement, input);
  },
};

export const HorizontalInvalid: Story = {
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
    await expectLabelWiring(canvasElement, canvas.getByLabelText(/NISS/));
  },
};
