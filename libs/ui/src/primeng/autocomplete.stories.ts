import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
} from 'primeng/autocomplete';
import { statusStory } from '../docs/docs-figure-stories';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { evidenceStory } from '../storybook/evidence-story';
import {
  assertTextVisible,
  expect,
  userEvent,
  waitForText,
  within,
} from '../storybook/story-tests';
import { primeNgEvidence } from './primeng.evidence';
import { primeNgExample } from './primeng.examples';

const CITIES = ['Bruxelles', 'Charleroi', 'Liège', 'Mons', 'Namur'];

interface AutoCompleteArgs {
  label: string;
  placeholder: string;
  forceSelection: boolean;
  dropdown: boolean;
  minLength: number;
  disabled: boolean;
  fluid: boolean;
}

const meta: Meta<AutoCompleteArgs> = {
  title: 'PrimeNG/AutoComplete',
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text', table: { category: 'Plectrum' } },
    placeholder: { control: 'text', table: { category: 'PrimeNG' } },
    forceSelection: { control: 'boolean', table: { category: 'PrimeNG' } },
    dropdown: { control: 'boolean', table: { category: 'PrimeNG' } },
    minLength: { control: 'number', table: { category: 'PrimeNG' } },
    disabled: { control: 'boolean', table: { category: 'PrimeNG' } },
    fluid: { control: 'boolean', table: { category: 'PrimeNG' } },
  },
  args: {
    label: 'Commune',
    placeholder: 'Recherchez une commune',
    forceSelection: true,
    dropdown: false,
    minLength: 1,
    disabled: false,
    fluid: true,
  },
};

export default meta;

type Story = StoryObj<AutoCompleteArgs>;

export const Status = {
  tags: ['!dev'],
  ...statusStory(
    { status: 'core', owner: 'design-system' },
    {
      description:
        'A value the person types toward, from a long list. Stock PrimeNG AutoComplete inside Form Field.',
      figmaUrl:
        'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=6047-9515',
    },
  ),
};

/** Primary canvas. The Controls panel edits these args. */
export const Default: Story = {
  parameters: {
    docs: {
      source: { code: primeNgExample('auto-complete').code, language: 'ts' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Commune' });
    await userEvent.type(input, 'Na');
    await waitForText(canvasElement, 'Namur', { inDocument: true });
  },
  render: (args) => ({
    props: {
      ...args,
      city: null,
      suggestions: [] as string[],
      search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this['suggestions'] = CITIES.filter((name) =>
          name.toLowerCase().startsWith(query),
        );
      },
    },
    moduleMetadata: {
      imports: [FormsModule, AutoComplete, FormFieldComponent],
    },
    template: `
      <pds-form-field [label]="label" inputId="city" hint="Tapez les premières lettres">
        <p-autocomplete
          inputId="city"
          [(ngModel)]="city"
          [suggestions]="suggestions"
          (completeMethod)="search($event)"
          [forceSelection]="forceSelection"
          [dropdown]="dropdown"
          dropdownAriaLabel="Afficher les suggestions"
          [minLength]="minLength"
          [disabled]="disabled"
          [fluid]="fluid"
          [placeholder]="placeholder"
          emptyMessage="Aucun résultat"
          appendTo="body"
        />
      </pds-form-field>
    `,
  }),
};

export const Dropdown: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Afficher les suggestions' }),
    );
    await waitForText(canvasElement, 'Bruxelles', { inDocument: true });
  },
  render: () => ({
    props: {
      city: null,
      suggestions: CITIES,
      search() {
        this['suggestions'] = CITIES;
      },
    },
    moduleMetadata: {
      imports: [FormsModule, AutoComplete, FormFieldComponent],
    },
    template: `
      <pds-form-field label="Commune" inputId="city-dropdown" hint="Tapez ou parcourez la liste">
        <p-autocomplete
          inputId="city-dropdown"
          [(ngModel)]="city"
          [suggestions]="suggestions"
          (completeMethod)="search()"
          [forceSelection]="true"
          [dropdown]="true"
          dropdownAriaLabel="Afficher les suggestions"
          emptyMessage="Aucun résultat"
          appendTo="body"
          fluid
        />
      </pds-form-field>
    `,
  }),
};

export const MinimumLength: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Prestataire' });
    await userEvent.type(input, 'So');
    await expect(input).toHaveValue('So');
  },
  render: () => ({
    props: { value: null, suggestions: [] as string[] },
    moduleMetadata: {
      imports: [FormsModule, AutoComplete, FormFieldComponent],
    },
    template: `
      <pds-form-field label="Prestataire" inputId="provider" hint="Tapez au moins deux caractères">
        <p-autocomplete
          inputId="provider"
          [(ngModel)]="value"
          [suggestions]="suggestions"
          [minLength]="2"
          emptyMessage="Aucun résultat"
          appendTo="body"
          fluid
        />
      </pds-form-field>
    `,
  }),
};

export const Invalid: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Commune',
    });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await assertTextVisible(canvasElement, 'Choisissez une commune dans la liste.');
  },
  render: () => ({
    props: { value: 'Inconnue', suggestions: [] as string[] },
    moduleMetadata: {
      imports: [FormsModule, AutoComplete, FormFieldComponent],
    },
    template: `
      <pds-form-field
        label="Commune"
        inputId="city-invalid"
        [invalid]="true"
        errorMessage="Choisissez une commune dans la liste."
      >
        <p-autocomplete
          inputId="city-invalid"
          [(ngModel)]="value"
          [suggestions]="suggestions"
          [invalid]="true"
          [forceSelection]="true"
          appendTo="body"
          fluid
        />
      </pds-form-field>
    `,
  }),
};

export const Disabled: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Commune',
    });
    await expect(input).toBeDisabled();
  },
  render: () => ({
    props: { value: 'Namur', suggestions: CITIES },
    moduleMetadata: {
      imports: [FormsModule, AutoComplete, FormFieldComponent],
    },
    template: `
      <pds-form-field label="Commune" inputId="city-disabled">
        <p-autocomplete
          inputId="city-disabled"
          [(ngModel)]="value"
          [suggestions]="suggestions"
          [disabled]="true"
          appendTo="body"
          fluid
        />
      </pds-form-field>
    `,
  }),
};

export const Fluid: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Code prestation');
  },
  render: () => ({
    props: { value: null, suggestions: [] as string[] },
    moduleMetadata: {
      imports: [FormsModule, AutoComplete, FormFieldComponent],
    },
    template: `
      <pds-form-field label="Code prestation" inputId="benefit-code">
        <p-autocomplete
          inputId="benefit-code"
          [(ngModel)]="value"
          [suggestions]="suggestions"
          placeholder="Recherchez un code"
          appendTo="body"
          fluid
        />
      </pds-form-field>
    `,
  }),
};

export const Evidence = {
  tags: ['!dev'],
  ...evidenceStory('AA', primeNgEvidence('auto-complete')),
};
